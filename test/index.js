const db = require('genshin-db');

const names = db.achievements('names', { queryLanguages: ["Spanish"], resultLanguage: "Spanish", matchNames: true, matchCategories: true, verbooseCategories: true });
for (const achievement of names) {
  const filtered = db.achievements(achievement, { queryLanguages: ["Spanish"], resultLanguage: "Spanish", matchNames: true, matchCategories: true, verbooseCategories: true })
  console.log(filtered);
}