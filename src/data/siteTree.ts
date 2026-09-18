import { sections } from "./sections";
import { gettingStartedSections } from "./gettingStartedSections";
import { configurationSections } from "./configurationSections";
import { resultsReportsSections } from "./resultsReportsSections";
import { conformanceSections } from "./conformanceSections";
import { helpSections } from "./helpSections";
import type { LocalizedOverride } from "./localize";

export interface TreeLeaf {
	href: string;
	label: string;
	i18n?: { es?: LocalizedOverride };
}

export interface TreeSection {
	href: string;
	label: string;
	description: string;
	i18n?: { es?: LocalizedOverride };
	children: TreeLeaf[];
}

const childrenByHref: Record<string, TreeLeaf[]> = {
	"/getting-started/": gettingStartedSections,
	"/rules/": [
		{
			href: "/rules/organization/",
			label: "How rules are organized",
			i18n: { es: { label: "Cómo se organizan las reglas" } },
		},
	],
	"/configuration/": configurationSections,
	"/results-reports/": resultsReportsSections,
	"/conformance/": conformanceSections,
	"/help/": helpSections,
};

export const siteTree: TreeSection[] = sections.map((s) => ({
	...s,
	children: childrenByHref[s.href] ?? [],
}));
