export const oauthConfig = {
  yandex: {
    authUrl: 'https://oauth.yandex.ru/authorize',
    tokenUrl: 'https://oauth.yandex.ru/token',
    clientId: import.meta.env.VITE_YANDEX_CLIENT_ID,
    // Обновляем redirect URI в соответствии с настройками приложения
    redirectUri: 'http://localhost:5173/auth/callback/yandex',
    // Добавляем корректные scope из настроек приложения
    scope: 'login:info login:avatar login:birthday login:email login:phone'
  },
  twogis: {
    loginUrl: 'https://auth.2gis.com/login',
    businessUrl: 'https://manager.2gis.com/'
  },
  flamp: {
    loginUrl: 'https://flamp.ru/login',
    businessUrl: 'https://flamp.ru/business'
  }
};

// Вспомогательная функция для проверки настроек
export const validateOAuthConfig = () => {
  if (!oauthConfig.yandex.clientId) {
    console.error('VITE_YANDEX_CLIENT_ID не установлен в .env.local');
    return false;
  }
  
  // Сверяем redirect URI с тем, что указан в настройках приложения
  if (oauthConfig.yandex.redirectUri !== 'http://localhost:5173/auth/callback/yandex') {
    console.error('Некорректный redirect URI для Яндекса');
    return false;
  }

  return true;
};