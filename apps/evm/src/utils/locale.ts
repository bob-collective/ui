import { enUS, zhCN } from 'date-fns/locale';

import linguiConfig from '../../lingui.config';

const localeMapping = {
  en: enUS,
  zh: zhCN
};

export const getLocale = (lang: (typeof linguiConfig)['locales'][number] = 'en') => {
  return localeMapping[lang];
};
