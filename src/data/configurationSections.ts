import type { LocalizedOverride } from "./localize";

export interface ConfigurationSection {
	href: string;
	label: string;
	i18n?: { es?: LocalizedOverride };
}

export const configurationSections: ConfigurationSection[] = [
	{ href: "/configuration/engine-options/", label: "Engine options" },
	{ href: "/configuration/ci-integration/", label: "CI integration" },
	{ href: "/configuration/locales/", label: "Locales" },
];
