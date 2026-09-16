import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

export function UsageBindingSection({ intro, install, installNote, usage, note, exampleHref }) {
	return (
		<>
			{intro}
			<CodeBlock lines={install.map((text) => ({ text, command: true }))} />
			{installNote}
			<CodeBlock lang="js" lines={usage} />
			{note}
			{exampleHref ? (
				<p>
					Also see <a href={exampleHref}>a runnable example</a> in the package's own repo.
				</p>
			) : null}
		</>
	);
}
