const db = require('genshin-db');

const x = db.characters('Dehya', { queryLanguages: ["Spanish"], resultLanguage: "Spanish", matchNames: true, matchCategories: true, verbooseCategories: true });
console.log(x);