export interface HeadingEntry {
	id: string;
	text: string;
	depth: 2 | 3;
}

export interface NestedHeading extends HeadingEntry {
	children: HeadingEntry[];
}

const HEADING_RE = /<h([23])((?:\s+[a-zA-Z-:]+(?:="[^"]*")?)*)\s*>([\s\S]*?)<\/h\1>/g;
const ID_ATTR_RE = /\sid="([^"]+)"/;

function slugify(innerHtml: string): string {
	const text = innerHtml.replace(/<[^>]+>/g, "");
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/**
 * Discovers a page's H2/H3s in its rendered HTML, injecting a slugified id
 * onto any heading that doesn't already carry one. Existing ids (used as
 * cross-page anchor targets elsewhere on the site) are left untouched.
 */
export function processHeadings(html: string): { html: string; headings: HeadingEntry[] } {
	const headings: HeadingEntry[] = [];
	const seen = new Map<string, number>();

	const outHtml = html.replace(HEADING_RE, (match, level, attrs, inner) => {
		const depth = Number(level) as 2 | 3;
		const existing = attrs.match(ID_ATTR_RE);
		let id = existing ? existing[1] : slugify(inner);
		if (!existing) {
			const count = seen.get(id) ?? 0;
			seen.set(id, count + 1);
			if (count > 0) id = `${id}-${count + 1}`;
		}
		headings.push({ id, text: inner.replace(/<[^>]+>/g, "").trim(), depth });
		return existing ? match : `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
	});

	return { html: outHtml, headings };
}

/** Groups H3s under their preceding H2 for two-level TOC rendering. */
export function nestHeadings(flat: HeadingEntry[]): NestedHeading[] {
	const result: NestedHeading[] = [];
	for (const h of flat) {
		if (h.depth === 2) {
			result.push({ ...h, children: [] });
		} else if (result.length > 0) {
			result[result.length - 1].children.push(h);
		}
	}
	return result;
}
