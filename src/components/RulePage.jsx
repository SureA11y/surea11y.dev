import React from "react";
import { Tag } from "./design-system/core/Tag.jsx";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";
import { t } from "../i18n/t";

function LabeledRichText({ label, text }) {
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
				{i === 0 ? " " : ""}
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
				<Tag>{t("rulePage.confidenceLabel", locale)} {rule.confidence}</Tag>
				<Tag>{t("rulePage.severityLabel", locale)} {rule.severity}</Tag>
				{rule.category ? <Tag>{rule.category}</Tag> : null}
			</div>

			{rule.deprecated ? (
				<Callout tone="note" title={t("rulePage.deprecatedTitle", locale)}>
					<p>
						{rule.deprecation?.replacedBy ? (
							<>
								{t("rulePage.replacedBy", locale)}{" "}
								<a href={`/rules/${rule.deprecation.replacedBy}/`}>
									<code>{rule.deprecation.replacedBy}</code>
								</a>
								{rule.deprecation?.sinceVersion
									? ` ${t("rulePage.since", locale)} ${rule.deprecation.sinceVersion}`
									: ""}
								.
							</>
						) : (
							t("rulePage.deprecatedFallback", locale)
						)}
						{rule.deprecation?.reason ? ` ${rule.deprecation.reason}` : ""}
					</p>
					<p>
						The id stays in the catalog and keeps running, but its result is
						fixed rather than decided per page — see{" "}
						<a href="https://github.com/SureA11y/core/blob/main/docs/API_STABILITY.md">
							the rule-ID deprecation policy
						</a>{" "}
						for what that means for a stored baseline or a <code>runOnly</code> list
						that still names it.
					</p>
				</Callout>
			) : null}

			{rule.description ? <p className="rule-description">{rule.description}</p> : null}

			{rule.applicability ? (
				<LabeledRichText label={t("rulePage.appliesTo", locale)} text={rule.applicability} />
			) : null}
			{rule.expectation ? (
				<LabeledRichText label={t("rulePage.expectation", locale)} text={rule.expectation} />
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
