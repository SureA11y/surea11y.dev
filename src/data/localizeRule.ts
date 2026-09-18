import esOverrides from "./rules.i18n.es.json";
import type { Locale } from "../i18n/t";

type Example = { outcome: string; state: string; html: string; explanation: string };
type Rule = {
	ruleId: string;
	title: string;
	description: string;
	applicability: string;
	expectation: string;
	examples: Example[];
	[key: string]: unknown;
};

const overrides: Record<
	string,
	{ title: string; description: string; applicability: string; expectation: string; examples: { state: string; explanation: string }[] }
> = esOverrides;

/** Merges the Spanish rule-content overlay into a rule object; a no-op for locales without one yet. */
export function localizeRule<T extends Rule>(rule: T, locale: Locale): T {
	if (locale !== "es") return rule;
	const t = overrides[rule.ruleId];
	if (!t) return rule;
	return {
		...rule,
		title: t.title,
		description: t.description,
		applicability: t.applicability,
		expectation: t.expectation,
		examples: rule.examples.map((example, i) => ({
			...example,
			explanation: t.examples[i]?.explanation ?? example.explanation,
		})),
	};
}
