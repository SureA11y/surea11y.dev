export interface HeadingEntry {
	id: string;
	text: string;
	depth: 2 | 3;
}

const HEADING_RE = /<h([23])((?:\s+[a-zA-Z-:]+(?:="[^"]*")?)*)\s*>([\s\S]*?)<\/h\1>/g;
const ID_ATTR_RE = /\sid="([^"]+)"/;

const NAMED_ENTITIES: Record<string, string> = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	nbsp: " ",
};

/** Decodes the small set of entities Astro/React's SSR text-escaping can produce (e.g. "won't" -> "won&#x27;t"). */
function decodeEntities(text: string): string {
	return text.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (match, code) => {
		if (code[0] === "#") {
			const codePoint = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
			return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
		}
		return NAMED_ENTITIES[code] ?? match;
	});
}

function stripTags(html: string): string {
	return decodeEntities(html.replace(/<[^>]+>/g, ""));
}

/**
 * Accents are folded ("configuración" -> "configuracion") and any other
 * letter or digit is kept as-is, so headings in scripts without a Latin
 * transliteration (Japanese, for one) still get a non-empty, unique id.
 */
function slugify(innerHtml: string): string {
	const text = stripTags(innerHtml);
	return text
		.normalize("NFKD")
		// Only Latin combining diacritics — stripping every mark would also
		// strip Japanese dakuten (ガ -> カ).
		.replace(/[\u0300-\u036f]/g, "")
		.normalize("NFC")
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, "-")
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
		headings.push({ id, text: stripTags(inner).trim(), depth });
		return existing ? match : `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
	});

	return { html: outHtml, headings };
}
