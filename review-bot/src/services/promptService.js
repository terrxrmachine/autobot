import { api } from './api';

export const promptService = {
  // Получение списка промптов
  getPrompts: async (platformId) => {
    return api.get(`/prompts/${platformId}`);
  },

  // Добавление нового промпта
  addPrompt: async (promptData) => {
    return api.post('/prompts', promptData);
  },

  // Обновление промпта
  updatePrompt: async (promptId, promptData) => {
    return api.put(`/prompts/${promptId}`, promptData);
  },

  // Удаление промпта
  deletePrompt: async (promptId) => {
    return api.delete(`/prompts/${promptId}`);
  },

  // Тестирование промпта
  testPrompt: async (promptData) => {
    return api.post('/prompts/test', promptData);
  },

  // Получение рекомендованного промпта для отзыва
  getRecommendedPrompt: async (reviewId) => {
    return api.get(`/prompts/recommend/${reviewId}`);
  },
};