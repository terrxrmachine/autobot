import puppeteer from 'puppeteer';

export class BaseParser {
  constructor(credentials) {
    this.credentials = credentials;
    this.browser = null;
    this.page = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Установка User-Agent для избежания блокировки
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async login() {
    throw new Error('Method login() must be implemented');
  }

  async getReviews() {
    throw new Error('Method getReviews() must be implemented');
  }

  async postResponse(reviewId, response) {
    throw new Error('Method postResponse() must be implemented');
  }

  // Утилиты для работы с браузером
  async waitAndClick(selector) {
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  async waitAndType(selector, text) {
    await this.page.waitForSelector(selector);
    await this.page.type(selector, text);
  }

  async extractText(selector) {
    await this.page.waitForSelector(selector);
    return this.page.$eval(selector, el => el.textContent.trim());
  }

  // Обработка ошибок и повторные попытки
  async retry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}