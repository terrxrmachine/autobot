export const oauthConfig = {
  yandex: {
    authUrl: 'https://oauth.yandex.ru/authorize',
    clientId: import.meta.env.VITE_YANDEX_CLIENT_ID,
    redirectUri: `${window.location.origin}/auth/callback/yandex`,
    scope: 'business-info',
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