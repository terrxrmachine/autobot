export const useSettings = () => {
  const platforms = [
    { id: 'yandex', name: 'Яндекс Карты' },
    { id: 'twogis', name: '2ГИС' },
    { id: 'flamp', name: 'Flamp' }
  ];

  return { platforms };
};