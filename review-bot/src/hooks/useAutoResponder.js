import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { autoResponderController } from '@/controllers/AutoResponderController';

export const useAutoResponder = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  // Получение статуса бота
  const { data: status } = useQuery({
    queryKey: ['botStatus'],
    queryFn: () => autoResponderController.getStatus(),
    refetchInterval: 5000, // Обновляем каждые 5 секунд
  });

  // Мутации для управления ботом
  const startMutation = useMutation({
    mutationFn: () => autoResponderController.start(),
    onSuccess: () => {
      queryClient.invalidateQueries(['botStatus']);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const stopMutation = useMutation({
    mutationFn: () => autoResponderController.stop(),
    onSuccess: () => {
      queryClient.invalidateQueries(['botStatus']);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const checkMutation = useMutation({
    mutationFn: () => autoResponderController.checkNewReviews(),
    onSuccess: () => {
      queryClient.invalidateQueries(['botStatus', 'reviews']);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Инициализация при монтировании
  useEffect(() => {
    autoResponderController.initialize().catch(error => {
      setError(error.message);
    });
  }, []);

  return {
    isRunning: status?.status?.isRunning || false,
    status: status?.status,
    startBot: () => startMutation.mutate(),
    stopBot: () => stopMutation.mutate(),
    checkNewReviews: () => checkMutation.mutate(),
    isLoading: startMutation.isLoading || stopMutation.isLoading || checkMutation.isLoading,
    error,
  };
};