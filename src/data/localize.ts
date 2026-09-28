import { tOr, type Locale } from "../i18n/t";

interface Localizable {
	href: string;
	label: string;
	description?: string;
}

/**
 * Resolves a nav/section entry's label+description for a locale. English
 * lives on the entry itself; translations live in each locale's dictionary
 * under "nav:<href>" and "nav:<href>:description", falling back to English.
 */
export function localize(entry: Localizable, locale: Locale): { label: string; description?: string } {
	return {
		label: tOr(`nav:${entry.href}`, locale, entry.label),
		description:
			entry.description === undefined
				? undefined
				: tOr(`nav:${entry.href}:description`, locale, entry.description),
	};
}
