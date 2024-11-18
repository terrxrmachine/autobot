import { oauthConfig } from '../config/oauth';
import { logService } from './LogService';

class OAuthService {
  constructor() {
    this.state = crypto.randomUUID();
    this.popupWindow = null;
  }

  async initiateAuth(platform) {
    try {
      if (platform === 'yandex') {
        // Для Яндекса используем OAuth
        const config = oauthConfig[platform];
        localStorage.setItem('oauth_state', this.state);
        
        const params = new URLSearchParams({
          client_id: config.clientId,
          redirect_uri: config.redirectUri,
          scope: config.scope,
          response_type: 'code',
          state: this.state
        });

        window.location.href = `${config.authUrl}?${params.toString()}`;
      } else {
        // Для 2GIS и Flamp открываем окно авторизации
        const config = oauthConfig[platform];
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        this.popupWindow = window.open(
          config.loginUrl,
          `${platform}_auth`,
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // Слушаем сообщения от окна
        window.addEventListener('message', this.handlePopupMessage.bind(this), false);

        await logService.info('manual_auth_initiated', {
          platform,
          loginUrl: config.loginUrl
        });
      }
    } catch (error) {
      await logService.error('auth_initiate_error', {
        platform,
        error: error.message
      });
      throw error;
    }
  }

  handlePopupMessage(event) {
    // В реальном приложении нужно проверять origin
    if (this.popupWindow && event.data.type === 'AUTH_SUCCESS') {
      this.popupWindow.close();
      this.popupWindow = null;
      window.removeEventListener('message', this.handlePopupMessage);
      
      // Здесь можно обработать успешную авторизацию
      window.location.reload();
    }
  }

  goToBusinessPanel(platform) {
    const config = oauthConfig[platform];
    window.open(config.businessUrl, '_blank');
  }

  async handleCallback(platform, code, state) {
    try {
      if (platform === 'yandex') {
        const savedState = localStorage.getItem('oauth_state');
        if (state !== savedState) {
          throw new Error('Недействительный state token');
        }
        localStorage.removeItem('oauth_state');
      }

      await logService.info('auth_callback_received', {
        platform,
        hasCode: Boolean(code)
      });

      return true;
    } catch (error) {
      await logService.error('auth_callback_error', {
        platform,
        error: error.message
      });
      throw error;
    }
  }
}

export const oauthService = new OAuthService();