import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';

export const useReviewBot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState('yandex');

  const platforms = [
    { id: 'yandex', name: 'Яндекс Карты' },
    { id: 'twogis', name: '2ГИС' },
    { id: 'flamp', name: 'Flamp' },
  ];

  const { data: stats = {
    totalReviews: 0,
    todayResponses: 0,
    averageResponseTime: '0 мин',
  }} = useQuery({
    queryKey: ['stats'],
    queryFn: reviewService.getStats,
  });

  const toggleBot = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (isRunning) {
      // Запускаем интервал проверки новых отзывов
      const interval = setInterval(() => {
        reviewService.checkNewReviews();
      }, 1000 * 60 * 60); // каждый час

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return {
    isRunning,
    toggleBot,
    platforms,
    currentPlatform,
    setCurrentPlatform,
    stats,
  };
};