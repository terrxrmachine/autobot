import { autoResponder } from '../services/AutoResponder';
import { accountService } from '../services/accountService';

export class AutoResponderController {
  async initialize() {
    try {
      const accounts = await accountService.getAccounts();
      await autoResponder.initialize(accounts);
      return { success: true };
    } catch (error) {
      console.error('Ошибка инициализации автоответчика:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  async start() {
    try {
      await autoResponder.start();
      return { 
        success: true,
        status: autoResponder.getStatus() 
      };
    } catch (error) {
      console.error('Ошибка запуска автоответчика:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  async stop() {
    try {
      await autoResponder.stop();
      return { 
        success: true,
        status: autoResponder.getStatus() 
      };
    } catch (error) {
      console.error('Ошибка остановки автоответчика:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  async checkNewReviews() {
    try {
      const results = await autoResponder.checkNewReviews();
      return { 
        success: true, 
        results 
      };
    } catch (error) {
      console.error('Ошибка проверки новых отзывов:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  async updateSettings(settings) {
    try {
      if (settings.checkInterval) {
        autoResponder.setCheckInterval(settings.checkInterval);
      }
      
      if (settings.accounts) {
        await autoResponder.updateAccounts(settings.accounts);
      }

      return { 
        success: true,
        status: autoResponder.getStatus() 
      };
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  getStatus() {
    return {
      success: true,
      status: autoResponder.getStatus()
    };
  }
}

export const autoResponderController = new AutoResponderController();