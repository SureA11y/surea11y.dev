/**
 * Every prose page on the site that is just "title + <h1> + one content
 * component". src/pages/[...page].astro builds each of these once per
 * locale, so adding a page is one entry here plus its content component —
 * no per-locale route file.
 *
 * `content` names a module in src/components/ (e.g. "FaqContent" ->
 * FaqContent.jsx, with FaqContent.es.jsx etc. as translations — see
 * src/i18n/content.ts). Binding pages instead name a key of
 * src/data/bindingUsage.jsx, rendered through UsageBindingSection.
 *
 * `title` is the English title; translations live in each locale's
 * dictionary under "page:<href>:title". The meta description defaults to the
 * page's nav entry's description (src/data/sections.ts) when it has one;
 * `description` overrides that, translated under "page:<href>:description".
 *
 * The homepage and the rules catalog/rule pages have their own route files.
 */
export interface ContentPage {
	href: string;
	title: string;
	description?: string;
	content?: string;
	binding?: "cypress" | "playwright" | "puppeteer" | "selenium" | "webdriverio";
}

export const contentPages: ContentPage[] = [
	{ href: "/getting-started/", title: "Getting Started", content: "GettingStartedContent" },
	{ href: "/getting-started/cypress/", title: "Usage with Cypress", binding: "cypress" },
	{ href: "/getting-started/playwright/", title: "Usage with Playwright", binding: "playwright" },
	{ href: "/getting-started/puppeteer/", title: "Usage with Puppeteer", binding: "puppeteer" },
	{ href: "/getting-started/selenium/", title: "Usage with Selenium", binding: "selenium" },
	{ href: "/getting-started/webdriverio/", title: "Usage with WebdriverIO", binding: "webdriverio" },
	{
		href: "/getting-started/test-matchers/",
		title: "Usage with test-matchers",
		content: "TestMatchersUsageContent",
	},
	{ href: "/getting-started/cli/", title: "Usage via CLI", content: "CliUsageContent" },
	{ href: "/getting-started/standalone/", title: "Standalone", content: "StandaloneUsageContent" },

	{ href: "/rules/organization/", title: "How rules are organized", content: "RuleOrganizationContent" },

	{ href: "/configuration/", title: "Configuration", content: "ConfigurationContent" },
	{ href: "/configuration/engine-options/", title: "Engine options", content: "EngineOptionsContent" },
	{ href: "/configuration/packs/", title: "Packs", content: "PacksContent" },
	{ href: "/configuration/ci-integration/", title: "CI integration", content: "CiIntegrationContent" },
	{ href: "/configuration/locales/", title: "Locales", content: "LocalesContent" },

	{ href: "/results-reports/", title: "Results & Reports", content: "ResultsReportsContent" },
	{ href: "/results-reports/output-schema/", title: "Output schema", content: "OutputSchemaContent" },
	{ href: "/results-reports/html-report/", title: "HTML report", content: "HtmlReportContent" },
	{ href: "/results-reports/sarif-report/", title: "SARIF report", content: "SarifReportContent" },
	{ href: "/results-reports/junit-report/", title: "JUnit report", content: "JunitReportContent" },
	{ href: "/results-reports/earl-report/", title: "EARL report", content: "EarlReportContent" },

	{ href: "/conformance/", title: "Conformance", content: "ConformanceContent" },
	{ href: "/conformance/wcag-mapping/", title: "WCAG conformance mapping", content: "WcagMappingContent" },
	{ href: "/conformance/baseline/", title: "Baseline / allowlist", content: "BaselineContent" },

	{ href: "/help/", title: "Help", content: "HelpContent" },
	{ href: "/help/faq/", title: "FAQ", content: "FaqContent" },
	{ href: "/help/known-limitations/", title: "Known limitations", content: "KnownLimitationsContent" },

	{
		href: "/accessibility-statement/",
		title: "Accessibility statement",
		description:
			"How surea11y.dev itself is tested for WCAG 2.2 AA conformance — automated scanning with @surea11y/core plus manual keyboard and screen-reader testing.",
		content: "AccessibilityStatementContent",
	},
];
