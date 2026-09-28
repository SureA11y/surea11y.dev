import React from "react";

/*
 * Rule prose (rules.generated.json and the rules.i18n.*.json overlays) is
 * plain text with three bits of inline markup:
 *
 *   `code`            -> <code>, left untranslated
 *   *word*            -> <em>
 *   [[en:Read more]]  -> <span lang="en">, for English kept inside a
 *                        translation (sample page text, engine output, spec
 *                        quotes), so screen readers switch voice for it
 *
 * Backtick spans are split out first, so markup-like characters inside code
 * are never interpreted.
 */
const CODE = /(`[^`]+`)/;
const INLINE = /(\[\[en:[^\]]+\]\]|\*[^*\s][^*]*\*)/;

function renderInline(text, keyPrefix) {
	return text.split(INLINE).map((part, i) => {
		const key = `${keyPrefix}-${i}`;
		if (part.startsWith("[[en:") && part.endsWith("]]")) {
			return (
				<span key={key} lang="en">
					{part.slice(5, -2)}
				</span>
			);
		}
		if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
			return <em key={key}>{part.slice(1, -1)}</em>;
		}
		return part ? <React.Fragment key={key}>{part}</React.Fragment> : null;
	});
}

export function RuleText({ text }) {
	return text.split(CODE).map((part, i) =>
		part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
			<code key={i}>{part.slice(1, -1)}</code>
		) : (
			renderInline(part, i)
		)
	);
}

/** The same text with the markup removed, for <title> and meta tags. */
export function plainRuleText(text) {
	return text
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\[\[en:([^\]]+)\]\]/g, "$1")
		.replace(/\*([^*\s][^*]*)\*/g, "$1");
}
