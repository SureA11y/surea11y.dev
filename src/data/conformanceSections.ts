import type { LocalizedOverride } from "./localize";

export interface ConformanceSection {
	href: string;
	label: string;
	i18n?: { es?: LocalizedOverride };
}

export const conformanceSections: ConformanceSection[] = [
	{
		href: "/conformance/wcag-mapping/",
		label: "WCAG conformance mapping",
		i18n: { es: { label: "Mapeo de conformidad con WCAG" } },
	},
	{ href: "/conformance/baseline/", label: "Baseline / allowlist" },
];
