export const promptUtils = {
  // Форматирование промпта с подстановкой переменных
  formatPrompt: (template, variables) => {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
  },

  // Подбор подходящего промпта на основе рейтинга и ключевых слов
  findMatchingPrompt: (prompts, review) => {
    return prompts.find(prompt => {
      // Проверяем совпадение по рейтингу
      const ratingMatch = prompt.stars === review.rating;
      
      // Проверяем наличие ключевых слов
      const keywords = prompt.keywords.toLowerCase().split(',').map(k => k.trim());
      const textContainsKeywords = keywords.some(keyword => 
        review.text.toLowerCase().includes(keyword)
      );
      
      return ratingMatch && textContainsKeywords;
    });
  },

  // Генерация системного промпта для OpenAI
  generateSystemPrompt: (platform, tone = 'professional') => {
    const toneInstructions = {
      professional: 'Используйте профессиональный и вежливый тон',
      friendly: 'Используйте дружелюбный и неформальный тон',
      apologetic: 'Выражайте искреннее сожаление и готовность исправить ситуацию',
    };

    return `
      Вы - менеджер по работе с клиентами.
      ${toneInstructions[tone]}
      Отвечайте на отзывы клиентов с платформы ${platform}.
      
      Правила:
      1. Всегда благодарите за отзыв
      2. Обращайтесь к клиенту по имени, если оно указано
      3. Признавайте проблему, если она есть
      4. Предлагайте конкретное решение
      5. Приглашайте посетить снова
      6. Ответ должен быть кратким и по существу
    `;
  }
};