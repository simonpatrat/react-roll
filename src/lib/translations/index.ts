import { get } from "../utils";

const DEFAULT_LOCALE = "en";

type Translations = Record<string, unknown>;

const loadedTranslationsbyLocale: Translations = {};

export const importDefaultTranslations = async () => {
  const { en: englishBaseTranslationsModule } = await import(
    `./${DEFAULT_LOCALE}.ts`
  );
  return englishBaseTranslationsModule;
};

export const importTranslations = async (locale: string) => {
  if (locale in loadedTranslationsbyLocale) {
    return loadedTranslationsbyLocale[locale];
  }
  try {
    const transModule = await import(`./${locale}.ts`);
    if (locale in transModule) {
      loadedTranslationsbyLocale[locale] = transModule[locale];
      return transModule[locale];
    } else {
      throw new Error("No translation module found for " + locale);
    }
  } catch (error) {
    console.warn(
      `${error}
        Loading default translation file instead.
        => Loaded translation locale is now "${DEFAULT_LOCALE}"
        `
    );
    const defaultTranslations = await importDefaultTranslations();

    loadedTranslationsbyLocale[locale] = defaultTranslations;
    return defaultTranslations;
  }
};

export const getTranslation = (
  locale: string,
  key: string,
  translations?: Translations
): string => {
  const defaultMessage = key;
  const usedTranslations =
    translations && translations?.[locale]
      ? translations
      : loadedTranslationsbyLocale;

  if (usedTranslations[locale]) {
    return get(usedTranslations[locale], key, defaultMessage);
  }
  return defaultMessage;
};
