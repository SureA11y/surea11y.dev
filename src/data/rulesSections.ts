export interface RulesSection {
	href: string;
	label: string;
}

// One hand-picked child rather than all generated rule pages.
export const rulesSections: RulesSection[] = [
	{ href: "/rules/organization/", label: "How rules are organized" },
];
