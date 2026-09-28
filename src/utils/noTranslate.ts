const CODE_TAG = /<(code|pre)(?=[\s>])(?![^>]*\stranslate=)/g;

/**
 * Marks every <code> and <pre> in a page's rendered content translate="no",
 * so browser page translation leaves identifiers, option names and code
 * samples alone (it otherwise turns `cantTell` or `runOnly` into words).
 * Applied once here rather than on every <code> in every content file.
 */
export function markCodeNoTranslate(html: string): string {
	return html.replace(CODE_TAG, '<$1 translate="no"');
}
