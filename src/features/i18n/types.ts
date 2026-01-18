export type Lang = 'en' | 'hy' | 'es';

export type TranslationParams = Record<string, string | number>;

export type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: TranslationParams) => string;
};
