export interface ConformanceSection {
	href: string;
	label: string;
}

export const conformanceSections: ConformanceSection[] = [
	{ href: "/conformance/wcag-mapping/", label: "WCAG conformance mapping" },
	{ href: "/conformance/baseline/", label: "Baseline / allowlist" },
];
