export interface GettingStartedSection {
	href: string;
	label: string;
}

export const gettingStartedSections: GettingStartedSection[] = [
	{ href: "/getting-started/cypress/", label: "Cypress" },
	{ href: "/getting-started/playwright/", label: "Playwright" },
	{ href: "/getting-started/puppeteer/", label: "Puppeteer" },
	{ href: "/getting-started/selenium/", label: "Selenium" },
	{ href: "/getting-started/webdriverio/", label: "WebdriverIO" },
	{ href: "/getting-started/test-matchers/", label: "test-matchers" },
	{ href: "/getting-started/cli/", label: "CLI" },
	{ href: "/getting-started/standalone/", label: "Standalone" },
];
