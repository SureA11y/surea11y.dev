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
		</>
	);
}
