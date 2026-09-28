/**
 * The one list of languages the site is built in. Adding a language starts
 * here — every route, the language switcher, hreflang tags, the sitemap and
 * Astro's own i18n config all read from this list. See "Adding a language"
 * in CLAUDE.md for the rest of the checklist.
 *
 * `name` is the language's own name for itself (shown in the switcher, so a
 * reader who can't read the current page's language can still find theirs).
 */
export const locales = [
	{ code: "en", name: "English" },
	{ code: "es", name: "Español" },
] as const;

export type Locale = (typeof locales)[number]["code"];

export const DEFAULT_LOCALE: Locale = "en";

export const localeCodes: Locale[] = locales.map((l) => l.code);

export function isLocale(value: string | undefined): value is Locale {
	return value !== undefined && (localeCodes as string[]).includes(value);
}

export function localeName(locale: Locale): string {
	return locales.find((l) => l.code === locale)?.name ?? locale;
}
