import React from "react";
import { Tag } from "./design-system/core/Tag.jsx";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";
import { RuleText } from "./RuleText.jsx";
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
						<li key={j}>
							<RuleText text={line.slice(2)} />
						</li>
					))}
				</ul>
			);
		}
		return (
			<p key={i}>
				{i === 0 ? <strong>{label}</strong> : null}
				{i === 0 ? wordSeparator(locale) : ""}
				<RuleText text={block} />
			</p>
		);
	});
}

export function RulePage({ rule, locale = "en" }) {
	return (
		<article>
			<p className="rule-kicker" translate="no">
				{rule.ruleId}
			</p>
			<h1>
				<RuleText text={rule.title} />
			</h1>
			<div className="tag-row">
				{/* Engine vocabulary (type, confidence, severity, WCAG principle) stays
				    English in every language, marked so screen readers read it as English. */}
				<Tag>
					<span lang="en">{rule.type}</span>
				</Tag>
				{rule.deprecated ? <Tag tone="accent">{t("common.deprecated", locale)}</Tag> : null}
				{rule.wcagSc.length ? (
					<Tag tone="accent2">
						WCAG {rule.wcagSc.join(", ")}
						{rule.level ? ` (${rule.level})` : ""}
					</Tag>
				) : null}
				<Tag>
					<Trans k="rulePage.confidence" locale={locale} values={{ value: <span lang="en">{rule.confidence}</span> }} />
				</Tag>
				<Tag>
					<Trans k="rulePage.severity" locale={locale} values={{ value: <span lang="en">{rule.severity}</span> }} />
				</Tag>
				{rule.category ? (
					<Tag>
						<span lang="en">{rule.category}</span>
					</Tag>
				) : null}
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

			{rule.description ? (
				<p className="rule-description">
					<RuleText text={rule.description} />
				</p>
			) : null}

			{rule.applicability ? (
				<LabeledRichText label={t("rulePage.appliesTo", locale)} text={rule.applicability} locale={locale} />
			) : null}
			{rule.expectation ? (
				<LabeledRichText label={t("rulePage.expectation", locale)} text={rule.expectation} locale={locale} />
			) : null}

			<h2>{t("rulePage.examples", locale)}</h2>
			{rule.examples.map((example, i) => (
				<div className="example" key={i}>
					<div className="example-heading">
						<ResultBadge lang="en" state={example.state} />
						{example.context ? (
							<span className="example-context">{t(`rulePage.exampleContext.${example.context}`, locale)}</span>
						) : null}
					</div>
					<CodeBlock
						lang="html"
						lines={example.html.split("\n")}
						aria-label={t("rulePage.exampleCodeLabel", locale, { ruleId: rule.ruleId })}
					/>
					<p>
						<RuleText text={example.explanation} />
					</p>
				</div>
			))}

			{rule.relatedRuleIds.length ? (
				<>
					<h2>{t("rulePage.relatedRules", locale)}</h2>
					<ul className="related-rules">
						{rule.relatedRuleIds.map((id) => (
							<li key={id}>
								<a href={`/rules/${id}/`} translate="no">
									{id}
								</a>
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
