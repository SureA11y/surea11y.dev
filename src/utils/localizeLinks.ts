import type { Locale } from "../i18n/t";

const HREF_RE = /href="\/(?!\/|es(?:\/|"))([^"]*)"/g;

/**
 * Content components (and RulePage's related-rule/deprecation links) were
 * written with plain, unprefixed internal hrefs before Spanish content
 * existed to link to. Rather than hand-editing every href across ~150
 * files, this rewrites them once, here, on the single rendered-HTML string
 * every page's content already funnels through before BaseLayout injects
 * it — external links, same-page "#anchor" links, and already-prefixed
 * "/es/..." links are left untouched.
 */
export function localizeLinks(html: string, locale: Locale): string {
	if (locale !== "es") return html;
	return html.replace(HREF_RE, 'href="/es/$1"');
}
