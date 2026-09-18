import en from "./en.json";
import es from "./es.json";

export type Locale = "en" | "es";
export const DEFAULT_LOCALE: Locale = "en";

const dictionaries: Record<Locale, Record<string, string>> = { en, es };

/** Falls back to English on a missing key, mirroring ../core's per-string locale fallback. */
export function t(key: string, locale: Locale, vars?: Record<string, string | number>): string {
	const table = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
	let value = table[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
	if (vars) {
		for (const [name, val] of Object.entries(vars)) {
			value = value.replaceAll(`{${name}}`, String(val));
		}
	}
	return value;
}

/** .jsx components have no Astro global, so callers resolve this once and pass it down as a prop. */
export function resolveLocale(currentLocale: string | undefined): Locale {
	return currentLocale === "es" ? "es" : DEFAULT_LOCALE;
}
