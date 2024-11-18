import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { openaiService } from '@/services/openai/OpenAIService';

export const useServiceInitialization = () => {
  const notifications = useNotifications();

  useEffect(() => {
    // Инициализируем сервисы с системой уведомлений
    openaiService.setNotifications(notifications);
  }, [notifications]);
};