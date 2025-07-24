// I18n.js

import { createI18n } from 'vue-i18n'
import kg from './locales/kg.json'
import ru from './locales/ru.json'
import kr from './locales/kr.json'

const savedLang = localStorage.getItem('languageType') || 'lng_type_1';
let i18Lang = "kg";
if(savedLang == 'lng_type_1') {
  i18Lang = "kg";
} else if(savedLang == 'lng_type_2') {
  i18Lang = "ru";
} else {
  i18Lang = "kr";
}

const i18n = createI18n({
  legacy: false, // FALSE when using composition API
  locale: i18Lang, // Basic language
  fallbackLocale: 'ru', // Backup language

  messages: {
    kg,
    ru,
    kr
  }
})

export default i18n;
