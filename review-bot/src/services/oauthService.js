import { oauthConfig } from '../config/oauth';
import { logService } from './LogService';

class OAuthService {
  constructor() {
    this.stateKey = 'oauth_state';
  }

  generateState() {
    const state = crypto.randomUUID();
    sessionStorage.setItem(this.stateKey, state);
    return state;
  }

  async initiateAuth(platform) {
    try {
      if (platform === 'yandex') {
        const config = oauthConfig[platform];
        const state = this.generateState();

        // Формируем URL с правильными параметрами
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: config.clientId,
          redirect_uri: config.redirectUri,
          scope: config.scope,
          state: state,
          force_confirm: 'yes',
          display: 'popup'
        });

        await logService.info('oauth_initiate', {
          platform,
          redirectUri: config.redirectUri,
          scope: config.scope
        });

        // Логируем URL для отладки
        const authUrl = `${config.authUrl}?${params}`;
        console.log('Auth URL:', authUrl);

        window.location.href = authUrl;
      } else {
        // Логика для других платформ...
        const config = oauthConfig[platform];
        window.location.href = config.loginUrl;
      }
    } catch (error) {
      await logService.error('oauth_initiate_error', {
        platform,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async handleCallback(platform, code, state) {
    try {
      if (platform === 'yandex') {
        const savedState = sessionStorage.getItem(this.stateKey);
        
        // Подробная проверка state
        if (!state || !savedState) {
          throw new Error('Отсутствует state token');
        }
        
        if (state !== savedState) {
          throw new Error('Некорректный state token');
        }

        sessionStorage.removeItem(this.stateKey);

        if (!code) {
          throw new Error('Отсутствует код авторизации');
        }

        // Логируем успешный callback
        await logService.info('oauth_callback_success', {
          platform,
          hasCode: true
        });

        // В реальном приложении здесь будет обмен кода на токен
        return {
          success: true,
          platform,
          code
        };
      }
    } catch (error) {
      await logService.error('oauth_callback_error', {
        platform,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Вспомогательные методы для работы с токенами
  saveToken(platform, token) {
    localStorage.setItem(`${platform}_token`, token);
  }

  getToken(platform) {
    return localStorage.getItem(`${platform}_token`);
  }

  removeToken(platform) {
    localStorage.removeItem(`${platform}_token`);
  }

  isAuthenticated(platform) {
    return Boolean(this.getToken(platform));
  }

  clearAuth(platform) {
    this.removeToken(platform);
    sessionStorage.removeItem(this.stateKey);
  }
}

export const oauthService = new OAuthService();