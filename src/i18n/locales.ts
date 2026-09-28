/**
 * The one list of languages the site is built in. Adding a language starts
 * here — every route, the language switcher, hreflang tags, the sitemap and
 * Astro's own i18n config all read from this list. See "Adding a language"
 * in CLAUDE.md for the rest of the checklist.
 *
 * `name` is the language's own name for itself (shown in the switcher, so a
 * reader who can't read the current page's language can still find theirs).
 * `spaced: false` marks a language written without spaces between words
 * (Japanese), so code that joins a label to its value doesn't insert one.
 */
// Ordered alphabetically by `name`, which is the order the switcher lists them in.
export const locales = [
	{ code: "de", name: "Deutsch" },
	{ code: "en", name: "English" },
	{ code: "es", name: "Español" },
	{ code: "fr", name: "Français" },
	{ code: "ja", name: "日本語", spaced: false },
] as const;

export type Locale = (typeof locales)[number]["code"];

export const DEFAULT_LOCALE: Locale = "en";

export const localeCodes: Locale[] = locales.map((l) => l.code);

export function isLocale(value: string | undefined): value is Locale {
	return value !== undefined && (localeCodes as string[]).includes(value);
}

/** The space between a label and the text that follows it: " ", or "" in Japanese. */
export function wordSeparator(locale: Locale): string {
	const entry = locales.find((l) => l.code === locale);
	return entry && "spaced" in entry && entry.spaced === false ? "" : " ";
}

export function localeName(locale: Locale): string {
	return locales.find((l) => l.code === locale)?.name ?? locale;
}
