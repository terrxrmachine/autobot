import { BaseParser } from './baseparser';

export class TwoGisParser extends BaseParser {
  constructor(credentials) {
    super(credentials);
    this.baseUrl = 'https://2gis.ru/auth';
    this.reviewsUrl = `https://2gis.ru/firm/${credentials.firmId}/tab/reviews`;
  }

  async login() {
    try {
      await this.page.goto(this.baseUrl);
      
      // Ждем загрузки формы входа
      await this.page.waitForSelector('input[name="login"]');
      
      // Вводим логин
      await this.waitAndType('input[name="login"]', this.credentials.login);
      await this.waitAndType('input[name="password"]', this.credentials.password);
      
      // Отправляем форму
      await this.waitAndClick('button[type="submit"]');
      
      // Проверяем успешность входа
      await this.page.waitForNavigation();
      
      return true;
    } catch (error) {
      console.error('Ошибка при авторизации в 2GIS:', error);
      throw new Error('Не удалось авторизоваться в 2GIS');
    }
  }

  async getReviews() {
    try {
      await this.page.goto(this.reviewsUrl);
      
      // Ждем загрузки отзывов
      await this.page.waitForSelector('.reviews__item');
      
      // Собираем отзывы
      const reviews = await this.page.evaluate(() => {
        const reviewElements = document.querySelectorAll('.reviews__item');
        
        return Array.from(reviewElements).map(review => {
          const ratingElement = review.querySelector('.rating__value');
          const textElement = review.querySelector('.reviews__text');
          const dateElement = review.querySelector('.reviews__date');
          const authorElement = review.querySelector('.reviews__author');
          const reviewId = review.getAttribute('data-review-id');
          
          return {
            id: reviewId,
            platform: '2gis',
            rating: ratingElement ? parseInt(ratingElement.textContent) : null,
            text: textElement ? textElement.textContent.trim() : '',
            date: dateElement ? dateElement.textContent.trim() : '',
            author: authorElement ? authorElement.textContent.trim() : '',
            hasResponse: !!review.querySelector('.reviews__response'),
          };
        });
      });
      
      return reviews;
    } catch (error) {
      console.error('Ошибка при получении отзывов с 2GIS:', error);
      throw new Error('Не удалось получить отзывы с 2GIS');
    }
  }

  async postResponse(reviewId, response) {
    try {
      await this.page.goto(`${this.reviewsUrl}/${reviewId}`);
      
      // Нажимаем кнопку ответа
      await this.waitAndClick('.reviews__reply-button');
      
      // Вводим текст ответа
      await this.waitAndType('.reviews__reply-textarea', response);
      
      // Отправляем ответ
      await this.waitAndClick('.reviews__reply-submit');
      
      // Ждем подтверждения
      await this.page.waitForSelector('.reviews__reply-success');
      
      return true;
    } catch (error) {
      console.error('Ошибка при отправке ответа в 2GIS:', error);
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