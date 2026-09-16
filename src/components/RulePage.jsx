import React from "react";
import { Tag } from "./design-system/core/Tag.jsx";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";

export function RulePage({ rule }) {
	return (
		<article>
			<p className="rule-kicker">{rule.ruleId}</p>
			<h1>{rule.title}</h1>
			<div className="tag-row">
				<Tag>{rule.type}</Tag>
				{rule.wcagSc.length ? (
					<Tag tone="accent2">
						WCAG {rule.wcagSc.join(", ")}
						{rule.level ? ` (${rule.level})` : ""}
					</Tag>
				) : null}
				<Tag>confidence: {rule.confidence}</Tag>
				<Tag>severity: {rule.severity}</Tag>
				{rule.category ? <Tag>{rule.category}</Tag> : null}
			</div>

			{rule.description ? <p className="rule-description">{rule.description}</p> : null}

			{rule.applicability ? (
				<p>
					<strong>Applies to.</strong> {rule.applicability}
				</p>
			) : null}
			{rule.expectation ? (
				<p>
					<strong>Expectation.</strong> {rule.expectation}
				</p>
			) : null}

			<h2>Examples</h2>
			{rule.examples.map((example) => (
				<div className="example" key={example.outcome}>
					<ResultBadge state={example.state} />
					<CodeBlock lines={example.html.split("\n")} />
					<p>{example.explanation}</p>
				</div>
			))}

			{rule.relatedRuleIds.length ? (
				<>
					<h2>Related rules</h2>
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
					View source
				</a>
			</p>
		</article>
	);
}
