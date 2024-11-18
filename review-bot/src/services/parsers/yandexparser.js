import { BaseParser } from './baseparser';

export class YandexParser extends BaseParser {
  constructor(credentials) {
    super(credentials);
    this.baseUrl = 'https://passport.yandex.ru';
    this.reviewsUrl = `https://yandex.ru/maps/org/${credentials.orgId}/reviews`;
  }

  async login() {
    try {
      await this.page.goto(this.baseUrl);
      
      // Ввод логина
      await this.waitAndType('#passp-field-login', this.credentials.login);
      await this.waitAndClick('.Button2[type="submit"]');
      
      // Ввод пароля
      await this.waitAndType('#passp-field-passwd', this.credentials.password);
      await this.waitAndClick('.Button2[type="submit"]');
      
      // Проверка успешной авторизации
      await this.page.waitForNavigation();
      
      return true;
    } catch (error) {
      console.error('Ошибка при авторизации в Яндекс:', error);
      throw new Error('Не удалось авторизоваться в Яндекс');
    }
  }

  async getReviews() {
    try {
      await this.page.goto(this.reviewsUrl);
      
      // Ждем загрузки отзывов
      await this.page.waitForSelector('.business-reviews-card-view');
      
      // Собираем отзывы
      const reviews = await this.page.evaluate(() => {
        const reviewElements = document.querySelectorAll('.business-reviews-card-view');
        
        return Array.from(reviewElements).map(review => {
          const ratingElement = review.querySelector('.business-rating-badge-view__rating');
          const textElement = review.querySelector('.business-review-view__body-text');
          const dateElement = review.querySelector('.business-review-view__date');
          const authorElement = review.querySelector('.business-review-view__author');
          const reviewId = review.getAttribute('data-review-id');
          
          return {
            id: reviewId,
            platform: 'yandex',
            rating: ratingElement ? parseInt(ratingElement.textContent) : null,
            text: textElement ? textElement.textContent.trim() : '',
            date: dateElement ? dateElement.textContent.trim() : '',
            author: authorElement ? authorElement.textContent.trim() : '',
            hasResponse: !!review.querySelector('.business-review-view__response'),
          };
        });
      });
      
      return reviews;
    } catch (error) {
      console.error('Ошибка при получении отзывов с Яндекс.Карт:', error);
      throw new Error('Не удалось получить отзывы с Яндекс.Карт');
    }
  }

  async postResponse(reviewId, response) {
    try {
      // Переходим к конкретному отзыву
      await this.page.goto(`${this.reviewsUrl}#${reviewId}`);
      
      // Ждем загрузки кнопки ответа
      await this.waitAndClick('.business-review-view__response-button');
      
      // Вводим текст ответа
      await this.waitAndType('.business-review-view__response-textarea', response);
      
      // Отправляем ответ
      await this.waitAndClick('.business-review-view__response-submit');
      
      // Ждем подтверждения отправки
      await this.page.waitForSelector('.business-review-view__response-success');
      
      return true;
    } catch (error) {
      console.error('Ошибка при отправке ответа на Яндекс.Картах:', error);
      throw new Error('Не удалось отправить ответ на отзыв');
    }
  }

  async checkNewReviews(lastReviewId) {
    const reviews = await this.getReviews();
    return reviews.filter(review => 
      !review.hasResponse && (!lastReviewId || review.id > lastReviewId)
    );
  }
}