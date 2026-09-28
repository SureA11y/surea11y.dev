import { DEFAULT_LOCALE, isLocale, localeCodes, type Locale } from "./locales";

/**
 * URL scheme: the default locale lives at the root ("/rules/"), every other
 * locale under its own prefix ("/es/rules/"). These helpers are the only
 * place that scheme is spelled out.
 */

/** "/rules/" + "es" -> "/es/rules/"; the default locale is returned unchanged. */
export function localizePath(path: string, locale: Locale): string {
	if (locale === DEFAULT_LOCALE) return path;
	return `/${locale}${path}`;
}

/** "/es/rules/" -> { locale: "es", path: "/rules/" }; unprefixed paths are the default locale. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
	const match = pathname.match(/^\/([^/]+)(\/.*)?$/);
	const first = match?.[1];
	if (first && first !== DEFAULT_LOCALE && isLocale(first)) {
		return { locale: first, path: match?.[2] || "/" };
	}
	return { locale: DEFAULT_LOCALE, path: pathname };
}

/**
 * The value for a `[...lang]` rest param: undefined for the default locale
 * (so its pages build at the root), the locale code otherwise.
 */
export function localeParam(locale: Locale): string | undefined {
	return locale === DEFAULT_LOCALE ? undefined : locale;
}

/** getStaticPaths() entries for a route that exists once per locale. */
export function localeStaticPaths() {
	return localeCodes.map((locale) => ({ params: { lang: localeParam(locale) }, props: { locale } }));
}
