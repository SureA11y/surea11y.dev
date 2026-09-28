import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { t } from "../i18n/t";

const nextSteps = [
	{ href: "/configuration/engine-options/", key: "usageBinding.engineOptions" },
	{ href: "/configuration/ci-integration/", key: "usageBinding.ciIntegration" },
	{ href: "/results-reports/output-schema/", key: "usageBinding.resultsSchema" },
];

/**
 * Joins links the way the locale joins a list ("a, b, and c" / "a, b y c" /
 * "a、b、c"), via Intl.ListFormat — list punctuation varies too much by
 * language to hand-assemble from a translated "and".
 */
function formatLinkList(items, locale) {
	const placeholders = items.map((_, i) => String(i));
	const parts = new Intl.ListFormat(locale, { type: "conjunction" }).formatToParts(placeholders);
	return parts.map((part, i) => {
		if (part.type === "literal") return part.value;
		const item = items[Number(part.value)];
		return (
			<a key={i} href={item.href}>
				{t(item.key, locale)}
			</a>
		);
	});
}

export function UsageBindingSection({ intro, install, installNote, usage, note, exampleHref, locale = "en" }) {
	return (
		<>
			{intro}
			<CodeBlock lines={install.map((text) => ({ text, command: true }))} />
			{installNote}
			<CodeBlock lang="js" lines={usage} />
			{note}
			{exampleHref ? (
				<p>
					{t("usageBinding.seeExample", locale)}{" "}
					<a href={exampleHref}>{t("usageBinding.runnableExample", locale)}</a>{" "}
					{t("usageBinding.inRepo", locale)}
				</p>
			) : null}
			<p>
				{t("usageBinding.nextSteps", locale)} {formatLinkList(nextSteps, locale)}.
			</p>
		</>
	);
}
