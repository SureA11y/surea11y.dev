import type { LocalizedOverride } from "./localize";

export interface GettingStartedSection {
	href: string;
	label: string;
	i18n?: { es?: LocalizedOverride };
}

export const gettingStartedSections: GettingStartedSection[] = [
	{ href: "/getting-started/cypress/", label: "Cypress" },
	{ href: "/getting-started/playwright/", label: "Playwright" },
	{ href: "/getting-started/puppeteer/", label: "Puppeteer" },
	{ href: "/getting-started/selenium/", label: "Selenium" },
	{ href: "/getting-started/webdriverio/", label: "WebdriverIO" },
	{ href: "/getting-started/test-matchers/", label: "test-matchers" },
	{ href: "/getting-started/cli/", label: "CLI" },
	{ href: "/getting-started/standalone/", label: "Standalone", i18n: { es: { label: "Independiente" } } },
];
