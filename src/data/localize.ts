import type { Locale } from "../i18n/t";

export interface LocalizedOverride {
	label?: string;
	description?: string;
}

interface Localizable {
	label: string;
	description?: string;
	i18n?: { es?: LocalizedOverride };
}

/** Resolves a nav/section entry's label+description for a locale, falling back to its English text. */
export function localize<T extends Localizable>(
	entry: T,
	locale: Locale
): { label: string; description?: string } {
	const override = locale === "es" ? entry.i18n?.es : undefined;
	return {
		label: override?.label ?? entry.label,
		description: override?.description ?? entry.description,
	};
}
