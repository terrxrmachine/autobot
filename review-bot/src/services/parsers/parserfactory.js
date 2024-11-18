import { YandexParser } from './yandexparser';
import { TwoGisParser } from './twogisparser';
import { FlampParser } from './flampparser';

export class ParserFactory {
  static createParser(platform, credentials) {
    switch (platform) {
      case 'yandex':
        return new YandexParser(credentials);
      case '2gis':
        return new TwoGisParser(credentials);
      case 'flamp':
        return new FlampParser(credentials);
      default:
        throw new Error(`Неподдерживаемая платформа: ${platform}`);
    }
  }
}

// Менеджер парсеров для управления всеми платформами
export class ParseManager {
  constructor() {
    this.parsers = new Map();
  }

  async initParser(platform, credentials) {
    const parser = ParserFactory.createParser(platform, credentials);
    await parser.init();
    await parser.login();
    this.parsers.set(platform, parser);
    return parser;
  }

  async checkAllPlatforms() {
    const results = [];
    for (const [platform, parser] of this.parsers.entries()) {
      try {
        const reviews = await parser.checkNewReviews();
        results.push({
          platform,
          reviews,
          success: true
        });
      } catch (error) {
        results.push({
          platform,
          error: error.message,
          success: false
        });
      }
    }
    return results;
  }

  async closeAll() {
    for (const parser of this.parsers.values()) {
      await parser.close();
    }
    this.parsers.clear();
  }
}