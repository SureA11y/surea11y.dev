import type { LocalizedOverride } from "./localize";

export interface ConfigurationSection {
	href: string;
	label: string;
	i18n?: { es?: LocalizedOverride };
}

export const configurationSections: ConfigurationSection[] = [
	{
		href: "/configuration/engine-options/",
		label: "Engine options",
		i18n: { es: { label: "Opciones del motor" } },
	},
	{
		href: "/configuration/ci-integration/",
		label: "CI integration",
		i18n: { es: { label: "Integración con CI" } },
	},
	{ href: "/configuration/locales/", label: "Locales" },
];
