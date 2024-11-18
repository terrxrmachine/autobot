import { api } from './api';

export const reviewService = {
  // Получение списка отзывов
  getReviews: async (platformId, params = {}) => {
    return api.get(`/reviews/${platformId}`, { params });
  },

  // Получение статистики
  getStats: async () => {
    return api.get('/reviews/stats');
  },

  // Проверка новых отзывов
  checkNewReviews: async () => {
    return api.post('/reviews/check');
  },

  // Ответ на отзыв
  respondToReview: async (reviewId, response) => {
    return api.post(`/reviews/${reviewId}/respond`, { response });
  },

  // Получение истории ответов
  getResponseHistory: async (reviewId) => {
    return api.get(`/reviews/${reviewId}/responses`);
  },

  // Автоматическая генерация ответа
  generateResponse: async (reviewId) => {
    return api.post(`/reviews/${reviewId}/generate-response`);
  },

  // Обновление статуса отзыва
  updateReviewStatus: async (reviewId, status) => {
    return api.patch(`/reviews/${reviewId}/status`, { status });
  },
};