import type { LocalizedOverride } from "./localize";

export interface HelpSection {
	href: string;
	label: string;
	i18n?: { es?: LocalizedOverride };
}

export const helpSections: HelpSection[] = [
	{ href: "/help/faq/", label: "FAQ" },
	{ href: "/help/known-limitations/", label: "Known limitations" },
];
