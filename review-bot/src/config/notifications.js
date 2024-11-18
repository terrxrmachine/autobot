export const notificationConfig = {
  types: {
    NEW_REVIEW: {
      title: 'Новый отзыв',
      icon: 'MessageSquare',
      color: 'blue'
    },
    RESPONSE_GENERATED: {
      title: 'Ответ сгенерирован',
      icon: 'Check',
      color: 'green'
    },
    RESPONSE_ERROR: {
      title: 'Ошибка ответа',
      icon: 'AlertTriangle',
      color: 'red'
    },
    ACCOUNT_ERROR: {
      title: 'Ошибка аккаунта',
      icon: 'UserX',
      color: 'orange'
    },
    PROMPT_ERROR: {
      title: 'Ошибка промпта',
      icon: 'AlertCircle',
      color: 'yellow'
    }
  },
  defaultDuration: 5000,
  maxNotifications: 5,
  position: 'top-right'
};