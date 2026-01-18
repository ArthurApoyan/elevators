import React, {createContext, useCallback, useMemo, useState} from 'react';
import en from '../../locales/en.json';
import es from '../../locales/es.json';
import hy from '../../locales/hy.json';
import {I18nContextValue, Lang, TranslationParams} from './types';

interface TranslationDict {
    [key: string]: string | TranslationDict;
}

const normalizeMessages = (messages: unknown): TranslationDict => {
    if (messages && typeof messages === 'object' && 'default' in (messages as object)) {
        return (messages as { default: TranslationDict }).default;
    }
    return messages as TranslationDict;
};

const translations: Record<Lang, TranslationDict> = {
    en: normalizeMessages(en),
    es: normalizeMessages(es),
    hy: normalizeMessages(hy)
};

export const I18nContext = createContext<I18nContextValue | null>(null);

const getNestedValue = (dict: TranslationDict, key: string): string | undefined => {
    return key.split('.').reduce<TranslationDict | string | undefined>((acc, part) => {
        if (!acc || typeof acc !== 'object') {
            return undefined;
        }
        return acc[part];
    }, dict) as string | undefined;
};

const interpolate = (template: string, params: TranslationParams = {}) => {
    return template.replace(/\{(\w+)}/g, (_, token) => {
        const value = params[token];
        return value === undefined ? `{${token}}` : String(value);
    });
};

type I18nProviderProps = {
    children: React.ReactNode;
};

export const I18nProvider = ({children}: I18nProviderProps) => {
    const [lang, setLang] = useState<Lang>('en');

    const t = useCallback(
        (key: string, params?: TranslationParams) => {
            const message = getNestedValue(translations[lang], key);
            if (!message) {
                return key;
            }
            return interpolate(message, params);
        },
        [lang]
    );

    const value = useMemo<I18nContextValue>(
        () => ({
            lang,
            setLang,
            t
        }),
        [lang, t]
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
