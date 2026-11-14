export const site = {
  name: 'Amira Abdelfadil',
  url: 'https://supergreatwin.github.io/amira-portfolio/',
  description: 'Films, visual work, and writing by Amira Abdelfadil, an Egyptian filmmaker, photographer, and multidisciplinary artist based in Cairo.',
  socials: [
    { id: 'instagram', name: 'Instagram', profile: '@amiraabdelfadil', label: 'Visual Diary', url: 'https://www.instagram.com/amiraabdelfadil/' },
    { id: 'tiktok', name: 'TikTok', profile: '@byamiramero', label: 'Behind the Frames', url: 'https://www.tiktok.com/@byamiramero?lang=en-GB' },
    { id: 'linkedin', name: 'LinkedIn', profile: 'Amira Abdelfadil', label: 'Professional Connections', url: 'https://www.linkedin.com/in/amira-a-4a9b73113/' },
  ],
};

export const locales = {
  en: {
    lang: 'en', dir: 'ltr', ogLocale: 'en_US',
    navigation: [
      ['Home', '#top'], ['Films', '#work'], ['Art & Photography', 'art.html'],
      ['About', 'about.html'], ['Writing', 'writing.html'], ['Contact', 'contact.html'],
    ],
  },
};

export const films = [
  {
    id: 'sweet-and-salty', title: 'Sweet & Salty', posterWidth: 636,
    excerpt: 'Two strangers in Cairo pursue dreams rooted in their love of food.',
    synopsis: 'From the heart of Cairo, Nabil and Somaya are strangers pursuing dreams rooted in their love of food. Though their paths are different, their stories echo one another. Each navigates the delicate space between ambition and circumstance, shaped by memory, sacrifice, and the people who surround them.',
    credits: [['A film by', 'Amira Abdel-Fadil & Sarah El Halawany']],
    galleryTitle: 'Details from the original poster',
    stills: [
      ['sweet-and-salty-detail-01.webp', 174, 249, 'Somaya smiling at a table'],
      ['sweet-and-salty-detail-02.webp', 174, 249, 'A pink candle standing in a dessert'],
      ['sweet-and-salty-detail-03.webp', 174, 249, 'Nabil laughing in a market'],
    ],
  },
  {
    id: 'street-x-food', title: 'Street X Food', posterWidth: 707,
    credits: [['A film by', 'Amira Abdel-Fadil']],
    stills: [
      ['street-x-food-01.jpg', 1120, 573, 'A pan of food at a street food stand'],
      ['street-x-food-02.jpg', 1120, 571, 'Two men seated in a market street'],
      ['street-x-food-03.jpg', 1120, 573, 'Birds perched along a steel structure against a blue sky'],
      ['street-x-food-04.jpg', 1120, 574, 'The Nile and a palm-lined bank in daylight'],
    ],
  },
  {
    id: 'biophilia', title: 'Biophilia', posterWidth: 607, genre: 'Collaborative documentary', year: 2023, seconds: 1793,
    excerpt: 'A closer look at the nature that persists amid the noise of urban life.',
    synopsis: 'In this increasingly fast-paced world, especially in big urban cities, everything is becoming man-made, and we indulge and indulge. Every once in a while, if we’re lucky enough, we get to turn the volume down and be humbled by the greatest artist: nature. It has the ability to remind us of what is real and natural amidst the noise. This is an open invitation to embrace the beauty of nature in urban spaces, notice what it can be despite endless urbanization, and become one with it. While everything manufactured can seem like a feat of genius, nature, too, deserves to be celebrated and embraced.',
    credits: [['Co-directors', 'Kateřina Sivoková, Rama Abdi & Amira Abdel-Fadil'], ['Production', 'Duemila30 Productions']],
    stills: [
      ['biophilia-01.jpg', 1120, 563, 'A tree and a green cart along an urban road'],
      ['biophilia-03.jpg', 1120, 630, 'A goat with a city in the distance'],
    ],
  },
  {
    id: 'mamina', title: 'Mamina', arabic: 'مامينا', posterWidth: 637, genre: 'Short documentary', year: 2025,
    excerpt: 'After losing her grandmother, Amira returns to the memories they made together in her kitchen.',
    synopsis: 'Amira, a young woman deeply attached to her grandmother, is struggling to cope with her loss. Their bond was nurtured in her grandmother’s kitchen through cooking and sharing meals together. Now, without her grandmother’s abundant love, Amira feels lost and misses her terribly. As she grieves and searches for love in those around her, including her mother, and within herself, she begins to uncover what might be the key to moving forward despite the pain.',
    credits: [['Director & writer', 'Amira Mahmoud Abdel-Fadil'], ['Producer', 'IMS Nazra'], ['Cinematography', 'Menna Ahmed'], ['Editing', 'Hisham Abdelrazek'], ['Sound design & mixing', 'Mohab Ezz']],
    watch: ['View the Sundance Collab preview', 'https://collab.sundance.org/catalog/Mamina-2026-01-28-044318'],
    stills: [
      ['mamina-01.jpg', 1120, 578, 'A pot and pan on a kitchen stove'],
      ['mamina-02.jpg', 1344, 709, 'Two women talk on a balcony overlooking Cairo'],
      ['mamina-03.jpg', 1120, 624, 'Two people in bright clothes lying in grass'],
    ],
  },
  {
    id: 'double-edged-sword', title: 'A Double-Edged Sword', arabic: 'سيف ذو حدين', posterWidth: 636, genre: 'Short documentary', year: 2023, seconds: 795,
    excerpt: 'How food waste in the supply chain connects to hunger and climate change.',
    synopsis: 'A short documentary about food waste in the food chain and its link to climate change and hunger.',
    credits: [['Director, producer, cinematographer & editor', 'Amira Abdel-Fadil'], ['Co-writers', 'Amira Abdel-Fadil & Magda Baraka'], ['Sound design & mixing', 'Amira Abdel-Fadil & Khaled Saleh'], ['Cast', 'Magda Baraka']],
    stills: [
      ['double-edged-sword-01.jpg', 1120, 653, 'A person in a red shirt lying in grass'],
      ['double-edged-sword-02.jpg', 1120, 648, 'A person working among rows of crops'],
      ['double-edged-sword-03.jpg', 1120, 662, 'Cattle in a dry field'],
    ],
  },
];

export const visualWork = [
  ['street-x-food-02.jpg', 'The market', 'street-x-food'],
  ['biophilia-03.jpg', 'At the edge of the city', 'biophilia'],
  ['mamina-01.jpg', 'The kitchen', 'mamina'],
];

export const writing = [
  { title: 'The Beauty of Capturing Memories', summary: 'Revisiting family albums brings forgotten moments and earlier versions of ourselves into focus.', url: 'https://thought.is/the-beauty-of-capturing-memories/' },
  { title: 'Maybe One Day I’ll Write a Masterpiece', summary: 'An essay on the urge to write, the distance between ambition and practice, and the value of continuing.', url: 'https://thought.is/maybe-one-day-ill-write-a-masterpiece/' },
  { title: 'No Matter What, I Will Always Choose Effort', summary: 'A reflection on taking chances and showing up when it would be easier to choose comfort.', url: 'https://thought.is/no-matter-what-i-will-always-choose-effort/' },
];
