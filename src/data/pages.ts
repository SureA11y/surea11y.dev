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
	{
		href: "/getting-started/cypress/",
		title: "Usage with Cypress",
		description:
			"Check accessibility in Cypress tests with @surea11y/cypress: install it, scan the page under test and choose which WCAG rules run.",
		binding: "cypress",
	},
	{
		href: "/getting-started/playwright/",
		title: "Usage with Playwright",
		description:
			"Check accessibility in Playwright tests with @surea11y/playwright: scan pages in Chromium, Firefox and WebKit and choose which WCAG rules run.",
		binding: "playwright",
	},
	{
		href: "/getting-started/puppeteer/",
		title: "Usage with Puppeteer",
		description:
			"Check accessibility in Puppeteer scripts and tests with @surea11y/puppeteer: scan a page in Chrome and choose which WCAG rules run.",
		binding: "puppeteer",
	},
	{
		href: "/getting-started/selenium/",
		title: "Usage with Selenium",
		description:
			"Check accessibility in Selenium WebDriver tests with @surea11y/selenium: scan a page in a real browser and choose which WCAG rules run.",
		binding: "selenium",
	},
	{
		href: "/getting-started/webdriverio/",
		title: "Usage with WebdriverIO",
		description:
			"Check accessibility in WebdriverIO tests with @surea11y/webdriverio: scan a page in a real browser and choose which WCAG rules run.",
		binding: "webdriverio",
	},
	{
		href: "/getting-started/test-matchers/",
		title: "Usage with test-matchers",
		description:
			"Fail a Jest or Vitest test on accessibility violations with toHaveNoA11yViolations(), for components and DOM rendered in jsdom.",
		content: "TestMatchersUsageContent",
	},
	{
		href: "/getting-started/cli/",
		title: "Usage via CLI",
		description:
			"Scan HTML for accessibility issues from the command line with @surea11y/cli: choose the rules, add packs and read its exit codes in CI.",
		content: "CliUsageContent",
	},
	{
		href: "/getting-started/standalone/",
		title: "Standalone",
		description:
			"Run @surea11y/core in a browser with no test framework or build step: load surea11y.browser.js and scan the page that is open.",
		content: "StandaloneUsageContent",
	},

	{
		href: "/rules/organization/",
		title: "How rules are organized",
		description:
			"How the rule catalog is structured: automatic and manual rules, how rule ids are built, and the WCAG facets rules decide.",
		content: "RuleOrganizationContent",
	},

	{ href: "/configuration/", title: "Configuration", content: "ConfigurationContent" },
	{
		href: "/configuration/engine-options/",
		title: "Engine options",
		description:
			"Every engineOptions and runOnly field: select rules by WCAG target, tags or ids, add custom rules and packs, and limit a scan to part of the page.",
		content: "EngineOptionsContent",
	},
	{
		href: "/configuration/packs/",
		title: "Packs",
		description:
			"Add rules, standards and profiles to @surea11y/core from a package of their own, such as a national standard or your organisation's accessibility policy.",
		content: "PacksContent",
	},
	{
		href: "/configuration/ci-integration/",
		title: "CI integration",
		description:
			"Ready-to-paste templates that run the surea11y CLI in GitHub Actions, Bitbucket Pipelines, GitLab CI and Azure DevOps, with JUnit test reports.",
		content: "CiIntegrationContent",
	},
	{
		href: "/configuration/locales/",
		title: "Locales",
		description:
			"Which languages rule and finding messages come in, how a scan chooses its locale, and how to tell which one a result used.",
		content: "LocalesContent",
	},

	{ href: "/results-reports/", title: "Results & Reports", content: "ResultsReportsContent" },
	{
		href: "/results-reports/output-schema/",
		title: "Output schema",
		description:
			"The exact shape of a scan result: top-level fields, check results, occurrences, composite results, outcome values, severity and confidence.",
		content: "OutputSchemaContent",
	},
	{
		href: "/results-reports/html-report/",
		title: "HTML report",
		description:
			"A self-contained HTML report of a scan to open in a browser, with no server or network requests, for testers who want to browse the results.",
		content: "HtmlReportContent",
	},
	{
		href: "/results-reports/sarif-report/",
		title: "SARIF report",
		description:
			"Write a SARIF 2.1.0 log from the CLI with --sarif, for GitHub Code Scanning and other dashboards that read SARIF.",
		content: "SarifReportContent",
	},
	{
		href: "/results-reports/junit-report/",
		title: "JUnit report",
		description:
			"Render a scan result as JUnit XML with @surea11y/core/junit, for the test views in GitLab, Azure DevOps, Jenkins and CircleCI.",
		content: "JunitReportContent",
	},
	{
		href: "/results-reports/earl-report/",
		title: "EARL report",
		description:
			"Render scan results as EARL 1.0 in JSON-LD with @surea11y/core/earl, the W3C format the ACT Rules community accepts as an implementation report.",
		content: "EarlReportContent",
	},

	{ href: "/conformance/", title: "Conformance", content: "ConformanceContent" },
	{
		href: "/conformance/wcag-mapping/",
		title: "WCAG conformance mapping",
		description:
			"How rule results roll up to WCAG success criteria, how to target level A, AA or AAA, and what the engine can't tell you about conformance.",
		content: "WcagMappingContent",
	},
	{
		href: "/conformance/procedures/",
		title: "Test procedures",
		description:
			"How to assess by hand what a scan can't decide: core's test procedures for each WCAG criterion, as a reference, a worksheet or data, in five languages.",
		content: "ProceduresContent",
	},
	{
		href: "/conformance/baseline/",
		title: "Baseline / allowlist",
		description:
			"Gate CI on new accessibility failures only: record the known ones in a baseline file, and the build fails as soon as a new one appears.",
		content: "BaselineContent",
	},

	{ href: "/help/", title: "Help", content: "HelpContent" },
	{
		href: "/help/faq/",
		title: "FAQ",
		description:
			"Answers to common questions and error messages: results that changed after an upgrade, rule selections that ran nothing, and unknown options.",
		content: "FaqContent",
	},
	{
		href: "/help/known-limitations/",
		title: "Known limitations",
		description:
			"What a scan doesn't evaluate, what depends on where it runs and what needs a person to review, with what to do about each.",
		content: "KnownLimitationsContent",
	},

	{
		href: "/accessibility-statement/",
		title: "Accessibility statement",
		description:
			"How surea11y.dev itself is tested for WCAG 2.2 AA conformance — automated scanning with @surea11y/core plus manual keyboard and screen-reader testing.",
		content: "AccessibilityStatementContent",
	},
];
