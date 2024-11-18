import { openaiService } from './openaiService';
import { promptUtils } from '../utils/promptUtils';
import { ParseManager } from './parsers/parserfactory';
import { reviewService } from './reviewservice';
import { promptService } from './promptservice';

export class AutoResponder {
  constructor() {
    this.parseManager = new ParseManager();
    this.isRunning = false;
    this.checkInterval = 3600000; // 1 час
    this.intervalId = null;
  }

  async initialize(accounts) {
    try {
      // Инициализируем парсеры для каждого аккаунта
      for (const account of accounts) {
        await this.parseManager.initParser(account.platform, {
          login: account.login,
          password: account.password,
          orgId: account.orgId,
          firmId: account.firmId
        });
      }
      return true;
    } catch (error) {
      console.error('Ошибка инициализации автоответчика:', error);
      throw new Error('Не удалось инициализировать автоответчик');
    }
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    await this.checkNewReviews();
    
    // Запускаем периодическую проверку
    this.intervalId = setInterval(async () => {
      await this.checkNewReviews();
    }, this.checkInterval);
  }

  async stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    await this.parseManager.closeAll();
  }

  async checkNewReviews() {
    try {
      const results = await this.parseManager.checkAllPlatforms();
      
      for (const result of results) {
        if (!result.success) continue;
        
        for (const review of result.reviews) {
          await this.processReview(review, result.platform);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Ошибка при проверке новых отзывов:', error);
      throw error;
    }
  }

  async processReview(review, platform) {
    try {
      // Сохраняем отзыв в базу
      const savedReview = await reviewService.saveReview({
        ...review,
        platform,
        status: 'new'
      });

      // Получаем подходящий промпт
      const prompts = await promptService.getPrompts(platform);
      const matchingPrompt = promptUtils.findMatchingPrompt(prompts, review);

      if (!matchingPrompt) {
        console.log(`Не найден подходящий промпт для отзыва ${review.id}`);
        return;
      }

      // Анализируем тональность отзыва
      const sentiment = await openaiService.analyzeSentiment(review.text);

      // Генерируем системный промпт
      const systemPrompt = promptUtils.generateSystemPrompt(
        platform,
        sentiment === 'negative' ? 'apologetic' : 'friendly'
      );

      // Генерируем ответ
      const response = await this.generateResponse(review, matchingPrompt, systemPrompt);

      // Проверяем качество ответа
      const isValid = await openaiService.validateResponse(review, response);

      if (!isValid) {
        console.log(`Сгенерированный ответ не прошел валидацию для отзыва ${review.id}`);
        return;
      }

      // Публикуем ответ
      const parser = this.parseManager.parsers.get(platform);
      await parser.postResponse(review.id, response);

      // Обновляем статус отзыва
      await reviewService.updateReviewStatus(savedReview.id, 'answered');

      return {
        success: true,
        reviewId: review.id,
        response
      };
    } catch (error) {
      console.error(`Ошибка при обработке отзыва ${review.id}:`, error);
      // Обновляем статус на ошибку
      await reviewService.updateReviewStatus(review.id, 'error', error.message);
      throw error;
    }
  }

  async generateResponse(review, prompt, systemPrompt) {
    try {
      // Подготавливаем переменные для шаблона
      const variables = {
        name: review.author || 'Уважаемый клиент',
        rating: review.rating,
        date: new Date(review.date).toLocaleDateString(),
        text: review.text
      };

      // Форматируем промпт
      const formattedPrompt = promptUtils.formatPrompt(prompt.template, variables);

      // Генерируем ответ через OpenAI
      const response = await openaiService.generateResponse(review, {
        systemPrompt,
        userPrompt: formattedPrompt
      });

      return response;
    } catch (error) {
      console.error('Ошибка при генерации ответа:', error);
      throw error;
    }
  }

  // Методы для управления настройками
  setCheckInterval(interval) {
    this.checkInterval = interval;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  async updateAccounts(accounts) {
    await this.stop();
    await this.initialize(accounts);
    if (this.isRunning) {
      await this.start();
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
      activePlatforms: Array.from(this.parseManager.parsers.keys())
    };
  }
}

// Создаем синглтон для использования во всем приложении
export const autoResponder = new AutoResponder();