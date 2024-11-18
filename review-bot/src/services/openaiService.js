import { api } from './api';

export const openaiService = {
  // Генерация ответа на отзыв
  generateResponse: async (review, prompt) => {
    return api.post('/openai/generate', {
      review,
      prompt,
    });
  },

  // Анализ тональности отзыва
  analyzeSentiment: async (text) => {
    return api.post('/openai/analyze-sentiment', {
      text,
    });
  },

  // Проверка качества ответа
  validateResponse: async (review, response) => {
    return api.post('/openai/validate-response', {
      review,
      response,
    });
  },
};