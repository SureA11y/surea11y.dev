export interface Section {
	href: string;
	label: string;
	description: string;
}

export const sections: Section[] = [
	{
		href: "/",
		label: "Overview",
		description:
			"What surea11y is and how it differs from other accessibility tools.",
	},
	{
		href: "/getting-started/",
		label: "Getting Started",
		description:
			"Install a binding, run a scan, and see what a result looks like.",
	},
	{
		href: "/rules/",
		label: "Rules",
		description:
			"Browse all rules — what each one checks, and a pass/fail example.",
	},
	{
		href: "/configuration/",
		label: "Configuration",
		description: "Select which rules run, wire up CI, and add a locale.",
	},
	{
		href: "/results-reports/",
		label: "Results & Reports",
		description: "The result shape, plus HTML, SARIF, and EARL reports.",
	},
	{
		href: "/conformance/",
		label: "Conformance",
		description: "How atomic rules roll up into a WCAG conformance verdict.",
	},
	{
		href: "/troubleshooting/",
		label: "Troubleshooting",
		description: "Common questions and known limitations.",
	},
];
