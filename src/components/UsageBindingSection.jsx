import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { t } from "../i18n/t";

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
				{t("usageBinding.nextSteps", locale)}{" "}
				<a href="/configuration/engine-options/">{t("usageBinding.engineOptions", locale)}</a>,{" "}
				<a href="/configuration/ci-integration/">{t("usageBinding.ciIntegration", locale)}</a>
				{locale === "es" ? " " : ", "}
				{t("usageBinding.and", locale)}{" "}
				<a href="/results-reports/output-schema/">{t("usageBinding.resultsSchema", locale)}</a>.
			</p>
		</>
	);
}
