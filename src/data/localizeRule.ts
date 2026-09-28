import { DEFAULT_LOCALE, type Locale } from "../i18n/locales";

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
type RuleOverlay = {
	title: string;
	description: string;
	applicability: string;
	expectation: string;
	examples: { state: string; explanation: string }[];
};

// One overlay per locale, rules.i18n.<locale>.json, picked up automatically.
// Each maps a ruleId to that rule's translated prose; the generated catalog
// (rules.generated.json) stays English-only and the source of every other field.
const files = import.meta.glob<Record<string, RuleOverlay>>("./rules.i18n.*.json", {
	eager: true,
	import: "default",
});
const overlays: Partial<Record<string, Record<string, RuleOverlay>>> = Object.fromEntries(
	Object.entries(files).map(([file, data]) => [file.match(/rules\.i18n\.([^.]+)\.json$/)![1], data])
);

/** Whether a rule has translated prose in a locale (always true for English). */
export function isRuleTranslated(ruleId: string, locale: Locale): boolean {
	return locale === DEFAULT_LOCALE || overlays[locale]?.[ruleId] !== undefined;
}

/** Merges a locale's rule-content overlay into a rule object; a no-op when there isn't one. */
export function localizeRule<T extends Rule>(rule: T, locale: Locale): T {
	const t = overlays[locale]?.[rule.ruleId];
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
