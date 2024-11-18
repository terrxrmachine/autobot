import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promptService } from '../services/promptService';
import { openaiService } from '../services/openai/openaiService';

export const usePrompts = (platformId) => {
  const queryClient = useQueryClient();
  const [newPrompt, setNewPrompt] = useState({
    stars: '',
    keywords: '',
    template: ''
  });
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  const { data: prompts = [] } = useQuery({
    queryKey: ['prompts', platformId],
    queryFn: () => promptService.getPrompts(platformId),
  });

  const addPromptMutation = useMutation({
    mutationFn: async (promptData) => {
      // Сначала тестируем промпт
      const testReview = {
        rating: parseInt(promptData.stars),
        text: 'Это тестовый отзыв для проверки промпта.'
      };
      
      const response = await openaiService.testPrompt(
        promptData.template,
        JSON.stringify(testReview)
      );
      
      const isValid = await openaiService.validateResponse(testReview, response);
      
      if (!isValid) {
        throw new Error('Промпт не прошел валидацию');
      }
      
      // Если тест прошел успешно, сохраняем промпт
      return promptService.addPrompt({
        ...promptData,
        platformId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prompts', platformId]);
      setNewPrompt({ stars: '', keywords: '', template: '' });
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const updatePromptMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const testReview = {
        rating: parseInt(data.stars),
        text: 'Это тестовый отзыв для проверки обновленного промпта.'
      };
      
      const response = await openaiService.testPrompt(
        data.template,
        JSON.stringify(testReview)
      );
      
      const isValid = await openaiService.validateResponse(testReview, response);
      
      if (!isValid) {
        throw new Error('Обновленный промпт не прошел валидацию');
      }
      
      return promptService.updatePrompt(id, {
        ...data,
        platformId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prompts', platformId]);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const deletePromptMutation = useMutation({
    mutationFn: promptService.deletePrompt,
    onSuccess: () => {
      queryClient.invalidateQueries(['prompts', platformId]);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const testPromptMutation = useMutation({
    mutationFn: async (promptData) => {
      const testReview = {
        rating: parseInt(promptData.stars || 5),
        text: promptData.testText || 'Это тестовый отзыв для проверки промпта.'
      };
      
      // Генерируем ответ
      const response = await openaiService.testPrompt(
        promptData.template,
        JSON.stringify(testReview)
      );
      
      // Проверяем качество
      const isValid = await openaiService.validateResponse(testReview, response);
      
      // Если ответ не прошел валидацию, пытаемся улучшить его
      if (!isValid) {
        const improvedResponse = await openaiService.improveResponse(
          testReview,
          response
        );
        return {
          original: response,
          improved: improvedResponse,
          isValid: false
        };
      }
      
      return {
        original: response,
        improved: null,
        isValid: true
      };
    },
    onSuccess: (result) => {
      setTestResult(result);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      setTestResult(null);
    }
  });

  const handleAddPrompt = () => {
    if (!newPrompt.stars || !newPrompt.template) {
      setError('Заполните все обязательные поля');
      return;
    }
    addPromptMutation.mutate(newPrompt);
  };

  const handleUpdatePrompt = (id, data) => {
    if (!data.stars || !data.template) {
      setError('Заполните все обязательные поля');
      return;
    }
    updatePromptMutation.mutate({ id, data });
  };

  const handleTestPrompt = (promptData) => {
    if (!promptData.template) {
      setError('Добавьте шаблон ответа для тестирования');
      return;
    }
    testPromptMutation.mutate(promptData);
  };

  return {
    prompts,
    newPrompt,
    setNewPrompt,
    testResult,
    error,
    isLoading: 
      addPromptMutation.isLoading || 
      updatePromptMutation.isLoading || 
      deletePromptMutation.isLoading || 
      testPromptMutation.isLoading,
    addPrompt: handleAddPrompt,
    updatePrompt: handleUpdatePrompt,
    deletePrompt: (id) => deletePromptMutation.mutate(id),
    testPrompt: handleTestPrompt,
  };
};