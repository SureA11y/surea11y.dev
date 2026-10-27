import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { t } from "../i18n/t";
import { Trans } from "../i18n/Trans.jsx";

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

export function UsageBindingSection({
	intro,
	install,
	installNote,
	usage,
	note,
	packs,
	internals,
	hooks,
	more,
	exampleHref,
	locale = "en",
}) {
	return (
		<>
			{intro}
			<CodeBlock lines={install.map((text) => ({ text, command: true }))} />
			{installNote}
			<CodeBlock lang="js" lines={usage} />
			<p>
				<Trans
					k="usageBinding.targets"
					locale={locale}
					values={{
						withWcag: <code>.withWcag(version, level)</code>,
						withBestPractices: <code>.withBestPractices()</code>,
						region: <code>region</code>,
					}}
				/>
			</p>
			{packs ?? (
				<p>
					<Trans
						k="usageBinding.packs"
						locale={locale}
						values={{
							withPacks: <code>.withPacks()</code>,
							packLink: <a href="/configuration/packs/">{t("usageBinding.packLink", locale)}</a>,
							options: <code>{".options({ profile })"}</code>,
							gap: <code>'pack-skipped'</code>,
							getScanGaps: <code>getScanGaps(results)</code>,
						}}
					/>
				</p>
			)}
			{note}
			{internals ? (
				<>
					{internals.intro}
					<CodeBlock lang="js" lines={internals.code} />
					{internals.note}
					{internals.caveat}
				</>
			) : null}
			{hooks ? (
				<>
					{hooks.intro}
					<CodeBlock lang="js" lines={hooks.code} />
					{hooks.note}
					{hooks.caveat}
				</>
			) : null}
			{more}
			{exampleHref ? (
				<p>
					<Trans
						k="usageBinding.seeExample"
						locale={locale}
						values={{ link: <a href={exampleHref}>{t("usageBinding.runnableExample", locale)}</a> }}
					/>
				</p>
			) : null}
			<p>
				<Trans k="usageBinding.nextSteps" locale={locale} values={{ list: formatLinkList(nextSteps, locale) }} />
			</p>
		</>
	);
}
