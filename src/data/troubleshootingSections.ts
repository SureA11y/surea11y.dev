export interface TroubleshootingSection {
	href: string;
	label: string;
}

export const troubleshootingSections: TroubleshootingSection[] = [
	{ href: "/troubleshooting/faq/", label: "FAQ" },
	{ href: "/troubleshooting/known-limitations/", label: "Known limitations" },
];
