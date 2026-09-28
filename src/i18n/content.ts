import { DEFAULT_LOCALE, localeCodes, type Locale } from "./locales";

/**
 * Translated prose lives next to its English original, one file per locale:
 * FaqContent.jsx (English), FaqContent.es.jsx, FaqContent.fr.jsx, … Every
 * translation exports the same names as the English file. A locale without
 * its own file gets the English one — the page still builds, and the layout
 * marks that content as English (see BaseLayout's `contentLocale`).
 */
const modules: Record<string, Record<string, unknown>> = {
	...import.meta.glob<Record<string, unknown>>("../components/*.jsx", { eager: true }),
	...import.meta.glob<Record<string, unknown>>("../data/*.jsx", { eager: true }),
};

const DIRS = { component: "../components", data: "../data" } as const;
type Kind = keyof typeof DIRS;

function fileFor(kind: Kind, name: string, locale: Locale): string {
	const suffix = locale === DEFAULT_LOCALE ? "" : `.${locale}`;
	return `${DIRS[kind]}/${name}${suffix}.jsx`;
}

export interface LocalizedModule<T> {
	module: T;
	/** The locale the module is actually written in — the requested one, or English as a fallback. */
	locale: Locale;
}

export function localizedModule<T = Record<string, any>>(
	kind: Kind,
	name: string,
	locale: Locale
): LocalizedModule<T> {
	const own = modules[fileFor(kind, name, locale)];
	if (own) return { module: own as T, locale };
	const english = modules[fileFor(kind, name, DEFAULT_LOCALE)];
	if (!english) throw new Error(`No content module ${DIRS[kind]}/${name}.jsx`);
	return { module: english as T, locale: DEFAULT_LOCALE };
}

/** Every locale that has its own file for this module (always includes English). */
export function translatedLocales(kind: Kind, name: string): Locale[] {
	return localeCodes.filter((locale) => modules[fileFor(kind, name, locale)] !== undefined);
}
