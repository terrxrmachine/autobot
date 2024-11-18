import { api } from './api';

class LogService {
  constructor() {
    this.logs = [];
    this.maxLogsInMemory = 1000;
  }

  async log(action, data, level = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      data,
      level,
    };

    // Добавляем лог в локальный массив
    this.logs.unshift(logEntry);
    
    // Ограничиваем количество логов в памяти
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs.pop();
    }

    // Отправляем лог на сервер
    try {
      await api.post('/logs', logEntry);
    } catch (error) {
      console.error('Ошибка при сохранении лога:', error);
    }

    return logEntry;
  }

  async getLogs(filters = {}) {
    try {
      const { data } = await api.get('/logs', { params: filters });
      return data;
    } catch (error) {
      console.error('Ошибка при получении логов:', error);
      throw error;
    }
  }

  // Методы для разных уровней логирования
  async info(action, data) {
    return this.log(action, data, 'info');
  }

  async warn(action, data) {
    return this.log(action, data, 'warning');
  }

  async error(action, data) {
    return this.log(action, data, 'error');
  }

  async debug(action, data) {
    if (process.env.NODE_ENV === 'development') {
      return this.log(action, data, 'debug');
    }
  }

  // Методы для специфических действий
  async logReviewAction(reviewId, action, details) {
    return this.info('review_action', {
      reviewId,
      action,
      details
    });
  }

  async logPromptAction(promptId, action, details) {
    return this.info('prompt_action', {
      promptId,
      action,
      details
    });
  }

  async logAccountAction(accountId, action, details) {
    return this.info('account_action', {
      accountId,
      action,
      details
    });
  }

  async logError(error, context) {
    return this.error('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  // Методы для анализа логов
  async getErrorStats(timeframe = '24h') {
    try {
      const { data } = await api.get('/logs/stats/errors', {
        params: { timeframe }
      });
      return data;
    } catch (error) {
      console.error('Ошибка при получении статистики ошибок:', error);
      throw error;
    }
  }

  async getActionStats(timeframe = '24h') {
    try {
      const { data } = await api.get('/logs/stats/actions', {
        params: { timeframe }
      });
      return data;
    } catch (error) {
      console.error('Ошибка при получении статистики действий:', error);
      throw error;
    }
  }
}

export const logService = new LogService();