import OpenAI from 'openai';
import { openaiConfig } from '../../config/openai';
import { logService } from '../LogService';

export class OpenAIService {
  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('VITE_OPENAI_API_KEY не установлен в переменных окружения');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    this.notifications = null;
  }

  setNotifications(notifications) {
    this.notifications = notifications;
  }

  async generateResponse(review, promptConfig) {
    try {
      await logService.info('openai_generate_response_start', { reviewId: review.id });
      
      const { systemPrompt, userPrompt } = this._buildPrompt(review, promptConfig);

      const completion = await this.openai.chat.completions.create({
        model: openaiConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: openaiConfig.maxTokens,
        temperature: openaiConfig.temperature,
      });

      const response = completion.choices[0].message.content;

      this.notifications?.addNotification('RESPONSE_GENERATED', 
        'Ответ успешно сгенерирован', 
        { title: `Отзыв ${review.id}` }
      );

      await logService.info('openai_generate_response_success', { 
        reviewId: review.id,
        response 
      });

      return response;
    } catch (error) {
      console.error('Ошибка при генерации ответа через OpenAI:', error);
      
      this.notifications?.addNotification('RESPONSE_ERROR',
        error.message,
        { title: `Ошибка генерации для отзыва ${review.id}` }
      );

      await logService.error('openai_generate_response_error', {
        reviewId: review.id,
        error: error.message,
        stack: error.stack
      });
      
      throw new Error('Не удалось сгенерировать ответ');
    }
  }

  async analyzeSentiment(text) {
    try {
      await logService.info('openai_analyze_sentiment_start', { text });

      const completion = await this.openai.chat.completions.create({
        model: openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'Проанализируйте тональность отзыва и верните только одно слово: positive, negative или neutral'
          },
          { role: 'user', content: text }
        ],
        max_tokens: 10,
        temperature: 0.3,
      });

      const sentiment = completion.choices[0].message.content.toLowerCase().trim();

      this.notifications?.addNotification('ANALYSIS_COMPLETE', 
        `Тональность определена: ${sentiment}`, 
        { title: 'Анализ отзыва' }
      );

      await logService.info('openai_analyze_sentiment_success', { 
        text,
        sentiment 
      });

      return sentiment;
    } catch (error) {
      console.error('Ошибка при анализе тональности:', error);
      
      this.notifications?.addNotification('ANALYSIS_ERROR',
        'Не удалось проанализировать тональность отзыва',
        { title: 'Ошибка анализа' }
      );

      await logService.error('openai_analyze_sentiment_error', {
        text,
        error: error.message,
        stack: error.stack
      });
      
      throw new Error('Не удалось проанализировать тональность отзыва');
    }
  }

  async validateResponse(review, response) {
    try {
      await logService.info('openai_validate_response_start', { 
        reviewId: review.id,
        response 
      });

      const completion = await this.openai.chat.completions.create({
        model: openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: `Проверьте качество ответа на отзыв по следующим критериям:
              1. Соответствие тону отзыва
              2. Профессионализм
              3. Решение проблемы (если есть)
              4. Грамматика и пунктуация
              Верните только true или false`
          },
          {
            role: 'user',
            content: `Отзыв: ${review.text}\n\nОтвет: ${response}`
          }
        ],
        max_tokens: 10,
        temperature: 0.1,
      });

      const isValid = completion.choices[0].message.content.toLowerCase().includes('true');

      if (isValid) {
        this.notifications?.addNotification('VALIDATION_SUCCESS',
          'Ответ прошел проверку качества',
          { title: `Отзыв ${review.id}` }
        );
      } else {
        this.notifications?.addNotification('VALIDATION_WARNING',
          'Ответ не соответствует критериям качества',
          { title: `Отзыв ${review.id}` }
        );
      }

      await logService.info('openai_validate_response_success', {
        reviewId: review.id,
        response,
        isValid
      });

      return isValid;
    } catch (error) {
      console.error('Ошибка при валидации ответа:', error);
      
      this.notifications?.addNotification('VALIDATION_ERROR',
        'Не удалось проверить качество ответа',
        { title: `Отзыв ${review.id}` }
      );

      await logService.error('openai_validate_response_error', {
        reviewId: review.id,
        response,
        error: error.message,
        stack: error.stack
      });
      
      throw new Error('Не удалось проверить качество ответа');
    }
  }

  async improveResponse(review, response) {
    try {
      await logService.info('openai_improve_response_start', {
        reviewId: review.id,
        originalResponse: response
      });

      const completion = await this.openai.chat.completions.create({
        model: openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'Улучшите ответ на отзыв, сохраняя основной смысл, но делая его более профессиональным и клиентоориентированным'
          },
          {
            role: 'user',
            content: `Отзыв: ${review.text}\n\nТекущий ответ: ${response}`
          }
        ],
        max_tokens: openaiConfig.maxTokens,
        temperature: 0.7,
      });

      const improvedResponse = completion.choices[0].message.content;

      this.notifications?.addNotification('IMPROVEMENT_SUCCESS',
        'Ответ был успешно улучшен',
        { title: `Отзыв ${review.id}` }
      );

      await logService.info('openai_improve_response_success', {
        reviewId: review.id,
        originalResponse: response,
        improvedResponse
      });

      return improvedResponse;
    } catch (error) {
      console.error('Ошибка при улучшении ответа:', error);
      
      this.notifications?.addNotification('IMPROVEMENT_ERROR',
        'Не удалось улучшить ответ',
        { title: `Отзыв ${review.id}` }
      );

      await logService.error('openai_improve_response_error', {
        reviewId: review.id,
        originalResponse: response,
        error: error.message,
        stack: error.stack
      });
      
      throw new Error('Не удалось улучшить ответ');
    }
  }

  _buildPrompt(review, config) {
    const { platform, rating, text } = review;
    const sentiment = rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral';
    
    const basePrompt = openaiConfig.basePrompts[sentiment];
    const platformInstructions = openaiConfig.platformInstructions[platform];

    const systemPrompt = `${basePrompt}\n${platformInstructions}`;
    
    const userPrompt = `
      Отзыв клиента (${rating} звезд):
      ${text}

      Дополнительные инструкции:
      ${config.customInstructions || ''}
    `;

    return {
      systemPrompt,
      userPrompt: userPrompt.trim()
    };
  }

  async testPrompt(promptTemplate, testReview) {
    try {
      await logService.info('openai_test_prompt_start', {
        promptTemplate,
        testReview
      });

      const completion = await this.openai.chat.completions.create({
        model: openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'Вы тестируете шаблон ответа на отзыв. Сгенерируйте ответ на основе шаблона и верните его'
          },
          {
            role: 'user',
            content: `
              Шаблон: ${promptTemplate}
              Тестовый отзыв: ${testReview}
            `
          }
        ],
        max_tokens: openaiConfig.maxTokens,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;

      this.notifications?.addNotification('TEST_SUCCESS',
        'Шаблон успешно протестирован',
        { title: 'Тест промпта' }
      );

      await logService.info('openai_test_prompt_success', {
        promptTemplate,
        testReview,
        response
      });

      return response;
    } catch (error) {
      console.error('Ошибка при тестировании промпта:', error);
      
      this.notifications?.addNotification('TEST_ERROR',
        'Не удалось протестировать шаблон',
        { title: 'Ошибка теста' }
      );

      await logService.error('openai_test_prompt_error', {
        promptTemplate,
        testReview,
        error: error.message,
        stack: error.stack
      });
      
      throw new Error('Не удалось протестировать промпт');
    }
  }

  async suggestPromptImprovements(promptTemplate) {
    try {
      await logService.info('openai_suggest_improvements_start', {
        promptTemplate
      });

      const completion = await this.openai.chat.completions.create({
        model: openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'Проанализируйте шаблон ответа и предложите улучшения для более эффективной коммуникации с клиентами'
          },
          {
            role: 'user',
            content: `Текущий шаблон: ${promptTemplate}`
          }
        ],
        max_tokens: openaiConfig.maxTokens,
        temperature: 0.7,
      });

      const suggestions = completion.choices[0].message.content;

      this.notifications?.addNotification('SUGGESTIONS_READY',
        'Получены предложения по улучшению шаблона',
        { title: 'Анализ промпта' }
      );

      await logService.info('openai_suggest_improvements_success', {
        promptTemplate,
        suggestions
      });

      return suggestions;
    } catch (error) {
      console.error('Ошибка при анализе промпта:', error);
      
      this.notifications?.addNotification('SUGGESTIONS_ERROR',
        'Не удалось проанализировать шаблон',
        { title: 'Ошибка анализа' }
      );

      await logService.error('openai_suggest_improvements_error', {
        promptTemplate,
        error: error.message,
        stack: error.stack
      });
      
      throw new Error('Не удалось получить предложения по улучшению');
    }
  }

  async categorizeReview(text) {
    try {
      await logService.info('openai_categorize_review_start', { text });

      const completion = await this.openai.chat.completions.create({
        model: openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'Определите основные категории проблем/пожеланий в отзыве. Верните список категорий через запятую'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 50,
        temperature: 0.3,
      });

      const categories = completion.choices[0].message.content;

      this.notifications?.addNotification('CATEGORIZATION_COMPLETE',
        'Отзыв успешно категоризирован',
        { title: 'Анализ отзыва' }
      );

      await logService.info('openai_categorize_review_success', {
        text,
        categories
      });

      return categories.split(',').map(c => c.trim());
    } catch (error) {
      console.error('Ошибка при категоризации отзыва:', error);
      
      this.notifications?.addNotification('CATEGORIZATION_ERROR',
        'Не удалось определить категории отзыва',
        { title: 'Ошибка анализа' }
      );

      await logService.error('openai_categorize_review_error', {
        text,
        error: error.message,
        stack: error.stack
      });
      
      throw new Error('Не удалось категоризировать отзыв');
    }
  }
}

export const openaiService = new OpenAIService();