import { DEFAULT_LOCALE, localeCodes, type Locale } from "../i18n/locales";

const prefixed = localeCodes.filter((code) => code !== DEFAULT_LOCALE).join("|");
// Root-relative hrefs that aren't protocol-relative ("//…") and don't already
// start with a locale prefix ("/es/…").
const HREF_RE = new RegExp(`href="/(?!/|(?:${prefixed})(?:/|"))([^"]*)"`, "g");

/**
 * Content components (and RulePage's related-rule/deprecation links) are
 * written with plain, unprefixed internal hrefs in every language. Rather
 * than prefixing every href by hand in every translation, this rewrites them
 * once, here, on the single rendered-HTML string every page's content
 * already funnels through before BaseLayout injects it — external links,
 * same-page "#anchor" links, and already-prefixed links are left untouched.
 */
export function localizeLinks(html: string, locale: Locale): string {
	if (locale === DEFAULT_LOCALE) return html;
	return html.replace(HREF_RE, `href="/${locale}/$1"`);
}
