export interface ConfigurationSection {
	href: string;
	label: string;
}

export const configurationSections: ConfigurationSection[] = [
	{ href: "/configuration/engine-options/", label: "Engine options" },
	{ href: "/configuration/packs/", label: "Packs" },
	{ href: "/configuration/ci-integration/", label: "CI integration" },
	{ href: "/configuration/locales/", label: "Locales" },
];
