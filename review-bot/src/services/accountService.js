import { api } from './api';
import { logService } from './LogService';

class AccountService {
  constructor() {
    this.endpoints = {
      yandex: 'https://api.partner.market.yandex.ru/v2',
      twogis: 'https://api.2gis.ru/v3.0',
      flamp: 'https://api.flamp.ru/v1'
    };
  }

  async connectAccount(platform, credentials) {
    try {
      await logService.info('account_connect_start', { platform });

      // В реальном приложении здесь будет проверка API ключей
      const response = await api.post('/accounts', {
        platform,
        ...credentials,
        status: 'active'
      });

      await logService.info('account_connect_success', { 
        platform,
        accountId: response.id 
      });

      return response;
    } catch (error) {
      await logService.error('account_connect_error', {
        platform,
        error: error.message
      });
      throw error;
    }
  }

  async disconnectAccount(accountId) {
    try {
      await logService.info('account_disconnect_start', { accountId });

      await api.delete(`/accounts/${accountId}`);

      await logService.info('account_disconnect_success', { accountId });
    } catch (error) {
      await logService.error('account_disconnect_error', {
        accountId,
        error: error.message
      });
      throw error;
    }
  }

  async getAccounts() {
    try {
      const response = await api.get('/accounts');
      return response.data;
    } catch (error) {
      await logService.error('get_accounts_error', {
        error: error.message
      });
      throw error;
    }
  }

  async updateAccount(accountId, data) {
    try {
      await logService.info('account_update_start', { accountId });

      const response = await api.put(`/accounts/${accountId}`, data);

      await logService.info('account_update_success', { 
        accountId,
        data 
      });

      return response.data;
    } catch (error) {
      await logService.error('account_update_error', {
        accountId,
        error: error.message
      });
      throw error;
    }
  }

  async checkAccountStatus(accountId) {
    try {
      const response = await api.get(`/accounts/${accountId}/status`);
      return response.data.status;
    } catch (error) {
      await logService.error('check_account_status_error', {
        accountId,
        error: error.message
      });
      throw error;
    }
  }
}

export const accountService = new AccountService();