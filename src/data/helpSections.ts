import type { LocalizedOverride } from "./localize";

export interface HelpSection {
	href: string;
	label: string;
	i18n?: { es?: LocalizedOverride };
}

export const helpSections: HelpSection[] = [
	{ href: "/help/faq/", label: "FAQ", i18n: { es: { label: "Preguntas frecuentes" } } },
	{
		href: "/help/known-limitations/",
		label: "Known limitations",
		i18n: { es: { label: "Limitaciones conocidas" } },
	},
];
