import { DEFAULT_LOCALE, localeCodes, type Locale } from "./locales";

export { DEFAULT_LOCALE, type Locale } from "./locales";

// One JSON file per locale in this directory (en.json, es.json, …), picked
// up automatically — a new locale's file needs no import added here.
const files = import.meta.glob<Record<string, string>>("./*.json", { eager: true, import: "default" });

const dictionaries = Object.fromEntries(
	localeCodes.map((code) => [code, files[`./${code}.json`] ?? {}])
) as Record<Locale, Record<string, string>>;

function interpolate(value: string, vars?: Record<string, string | number>): string {
	if (!vars) return value;
	for (const [name, val] of Object.entries(vars)) {
		value = value.replaceAll(`{${name}}`, String(val));
	}
	return value;
}

/** Falls back to English on a missing key, mirroring ../core's per-string locale fallback. */
export function t(key: string, locale: Locale, vars?: Record<string, string | number>): string {
	const value = dictionaries[locale]?.[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
	return interpolate(value, vars);
}

/**
 * For strings whose English source lives in site data rather than en.json
 * (nav labels, page titles): the locale's dictionary entry if it has one,
 * otherwise the English text passed in.
 */
export function tOr(key: string, locale: Locale, english: string): string {
	if (locale === DEFAULT_LOCALE) return english;
	return dictionaries[locale]?.[key] ?? english;
}

/** Whether a locale's own dictionary carries a key (no English fallback). */
export function hasTranslation(key: string, locale: Locale): boolean {
	return locale === DEFAULT_LOCALE || dictionaries[locale]?.[key] !== undefined;
}
