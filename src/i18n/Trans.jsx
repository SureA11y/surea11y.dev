import React from "react";
import { t } from "./t";

/**
 * Renders a translated sentence that contains elements (links, code) as
 * whole-sentence templates: "See {policy} for details." with `policy` passed
 * in `values`. Each language places the pieces where its own word order and
 * spacing need them, instead of the code gluing English-ordered fragments
 * together with spaces.
 */
export function Trans({ k, locale, values = {} }) {
	const template = t(k, locale);
	const parts = template.split(/\{(\w+)\}/);
	return parts.map((part, i) => {
		if (i % 2 === 0) return part ? <React.Fragment key={i}>{part}</React.Fragment> : null;
		const value = values[part];
		return <React.Fragment key={i}>{value === undefined ? `{${part}}` : value}</React.Fragment>;
	});
}
