import React from "react";
import { Tag } from "./design-system/core/Tag.jsx";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";
import { t } from "../i18n/t";
import { Trans } from "../i18n/Trans.jsx";
import { wordSeparator } from "../i18n/locales";

function LabeledRichText({ label, text, locale }) {
	const blocks = text
		.split("\n\n")
		.map((block) => block.trim())
		.filter(Boolean);
	return blocks.map((block, i) => {
		const lines = block
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean);
		const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "));
		if (isList) {
			return (
				<ul key={i}>
					{lines.map((line, j) => (
						<li key={j}>{line.slice(2)}</li>
					))}
				</ul>
			);
		}
		return (
			<p key={i}>
				{i === 0 ? <strong>{label}</strong> : null}
				{i === 0 ? wordSeparator(locale) : ""}
				{block}
			</p>
		);
	});
}

export function RulePage({ rule, locale = "en" }) {
	return (
		<article>
			<p className="rule-kicker">{rule.ruleId}</p>
			<h1>{rule.title}</h1>
			<div className="tag-row">
				<Tag>{rule.type}</Tag>
				{rule.deprecated ? <Tag tone="accent">{t("common.deprecated", locale)}</Tag> : null}
				{rule.wcagSc.length ? (
					<Tag tone="accent2">
						WCAG {rule.wcagSc.join(", ")}
						{rule.level ? ` (${rule.level})` : ""}
					</Tag>
				) : null}
				<Tag>{t("rulePage.confidence", locale, { value: rule.confidence })}</Tag>
				<Tag>{t("rulePage.severity", locale, { value: rule.severity })}</Tag>
				{rule.category ? <Tag>{rule.category}</Tag> : null}
			</div>

			{rule.deprecated ? (
				<Callout tone="note" title={t("rulePage.deprecatedTitle", locale)}>
					<p>
						{rule.deprecation?.replacedBy ? (
							<Trans
								k={rule.deprecation?.sinceVersion ? "rulePage.replacedBySince" : "rulePage.replacedBy"}
								locale={locale}
								values={{
									rule: (
										<a href={`/rules/${rule.deprecation.replacedBy}/`}>
											<code>{rule.deprecation.replacedBy}</code>
										</a>
									),
									version: rule.deprecation?.sinceVersion,
								}}
							/>
						) : (
							t("rulePage.deprecatedFallback", locale)
						)}
						{rule.deprecation?.reason ? `${wordSeparator(locale)}${rule.deprecation.reason}` : ""}
					</p>
					<p>
						<Trans
							k="rulePage.deprecatedBody"
							locale={locale}
							values={{
								policy: (
									<a href="https://github.com/SureA11y/core/blob/main/docs/API_STABILITY.md">
										{t("rulePage.deprecatedPolicyLink", locale)}
									</a>
								),
								runOnly: <code>runOnly</code>,
							}}
						/>
					</p>
				</Callout>
			) : null}

			{rule.description ? <p className="rule-description">{rule.description}</p> : null}

			{rule.applicability ? (
				<LabeledRichText label={t("rulePage.appliesTo", locale)} text={rule.applicability} locale={locale} />
			) : null}
			{rule.expectation ? (
				<LabeledRichText label={t("rulePage.expectation", locale)} text={rule.expectation} locale={locale} />
			) : null}

			<h2>{t("rulePage.examples", locale)}</h2>
			{rule.examples.map((example) => (
				<div className="example" key={example.outcome}>
					<ResultBadge state={example.state} />
					<CodeBlock
						lang="html"
						lines={example.html.split("\n")}
						aria-label={t("rulePage.exampleCodeLabel", locale, { ruleId: rule.ruleId })}
					/>
					<p>{example.explanation}</p>
				</div>
			))}

			{rule.relatedRuleIds.length ? (
				<>
					<h2>{t("rulePage.relatedRules", locale)}</h2>
					<ul className="related-rules">
						{rule.relatedRuleIds.map((id) => (
							<li key={id}>
								<a href={`/rules/${id}/`}>{id}</a>
							</li>
						))}
					</ul>
				</>
			) : null}

			<p className="view-source">
				<a href={`https://github.com/SureA11y/core/blob/main/${rule.sourcePath}`}>
					{t("rulePage.viewSource", locale)}
				</a>
			</p>
		</article>
	);
}
