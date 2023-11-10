import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


import usEnglish from './translations/en-US.json';
import belgianDutch from './translations/nl-BE.json';
import russian from './translations/ru-RU.json';

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'en-US',
        resources: {
            'en-US': {
                translation: usEnglish
            },
            'nl-BE': {
                translation: belgianDutch
            },
            'ru-RU': {
                translation: russian,
            }
        },

        // have a common namespace used around the full app
        ns: ['translation'],
        defaultNS: 'translation',

        debug: true,
        
        interpolation: {
            escapeValue: false, // not needed for react as it does escape per default to prevent xss!
        }
    });


export default i18n;