import React from "react";

export const bindingUsage = {
	cypress: {
		intro: (
			<p>
				<a href="https://www.cypress.io/">Cypress</a>
				は、テスト対象のアプリと並んでブラウザー自体の中でテストを実行するJavaScriptのE2Eテストフレームワークです。surea11yは
				<a href="https://github.com/SureA11y/cypress"><code>@surea11y/cypress</code></a>
				バインディングで連携します。
			</p>
		),
		install: ["npm install @surea11y/cypress cypress"],
		installNote: (
			<p>
				<code>cypress</code>
				は
				<code>peerDependencies</code>
				のエントリーです。ふつうにCypressのspecを書くときと同じく、型とランタイムを解決するにはCypressを自分でインストールしておく必要があります。
			</p>
		),
		usage: [
			"// cypress/e2e/my-page.cy.js",
			"const { A11yCoreBuilder } = require('@surea11y/cypress');",
			"",
			"it('has no accessibility violations', () => {",
			"  cy.visit('https://example.com/');",
			"",
			"  new A11yCoreBuilder()",
			"    .include('#main')            // optional -- call multiple times for multi-region scans",
			"    .exclude('.cookie-banner')    // optional",
			"    .withTags(['wcag2a', 'wcag2aa'])",
			"    .disableRules(['meta-refresh-no-exceptions'])",
			"    .analyze()",
			"    .then((results) => {",
			"      const fails = results.checksResults.filter((r) => r.outcome === 'fail');",
			"      expect(fails).to.have.length(0);",
			"    });",
			"});",
		],
		note: (
			<p>
				ドライバーを使うほかのバインディングと違い、コンストラクターに
				<code>{"{ page }"}</code>
				／
				<code>{"{ browser }"}</code>
				／
				<code>{"{ driver }"}</code>
				の引数はありません。Cypressにはそのようなハンドルがないからです。
				<code>cy</code>
				はすべてのspecファイルで暗黙的に使え、それ自体が
				<em>ドライバー</em>
				です。
				<strong>
					<code>analyze()</code>
					が返すのはPromiseではなくCypressのchainableなので、
					<code>await</code>
					しないでください
				</strong>
				。例のように
				<code>.then()</code>
				を呼び出します。
			</p>
		),
		exampleHref: "https://github.com/SureA11y/cypress/blob/main/examples/basic-scan.cy.js",
	},

	playwright: {
		intro: (
			<p>
				<a href="https://playwright.dev/">Playwright</a>
				は、Microsoftが開発したクロスブラウザーのE2Eテストフレームワークで、Node.jsから実際のChromium、Firefox、WebKitのエンジンを操作します。surea11yは
				<a href="https://github.com/SureA11y/playwright"><code>@surea11y/playwright</code></a>
				バインディングで連携します。
			</p>
		),
		install: [
			"npm install @surea11y/playwright playwright",
			"npx playwright install chromium",
		],
		installNote: (
			<p>
				2つ目のコマンドが重要です。どのテストも実際のブラウザーを起動しますが、
				<code>npm install</code>
				だけではブラウザーは取得されません。
			</p>
		),
		usage: [
			"const { chromium } = require('playwright');",
			"const { A11yCoreBuilder } = require('@surea11y/playwright');",
			"",
			"const browser = await chromium.launch();",
			"const page = await browser.newPage();",
			"await page.goto('https://example.com/');",
			"",
			"const results = await new A11yCoreBuilder({ page })",
			"  .include('#main')            // optional -- call multiple times for multi-region scans",
			"  .exclude('.cookie-banner')    // optional",
			"  .withTags(['wcag2a', 'wcag2aa'])",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await browser.close();",
		],
		note: (
			<p>
				Chromiumだけでなく、Playwrightの3つのエンジンすべてで動作します。実際のFirefoxとWebKitでの実行で検証済みです。
			</p>
		),
		exampleHref: "https://github.com/SureA11y/playwright/blob/main/examples/basic-scan.js",
	},

	puppeteer: {
		intro: (
			<p>
				<a href="https://pptr.dev/">Puppeteer</a>
				は、DevToolsプロトコル経由でヘッドレスまたは通常のChrome/Chromiumを操作するNode.jsライブラリーです。ブラウザーの自動化とスクリプト実行のためのもので、テストによく使われますが、それ自体はテストフレームワークではありません。surea11yは
				<a href="https://github.com/SureA11y/puppeteer"><code>@surea11y/puppeteer</code></a>
				バインディングで連携します。
			</p>
		),
		install: ["npm install @surea11y/puppeteer puppeteer"],
		installNote: (
			<p>
				Puppeteerは
				<code>npm install</code>
				の一部として専用のChromeをダウンロードします。Playwrightと違い、ブラウザーを別途インストールする手順はありません。
			</p>
		),
		usage: [
			"const puppeteer = require('puppeteer');",
			"const { A11yCoreBuilder } = require('@surea11y/puppeteer');",
			"",
			"const browser = await puppeteer.launch();",
			"const page = await browser.newPage();",
			"await page.goto('https://example.com/');",
			"",
			"const results = await new A11yCoreBuilder({ page })",
			"  .include('#main')            // optional -- call multiple times for multi-region scans",
			"  .exclude('.cookie-banner')    // optional",
			"  .withTags(['wcag2a', 'wcag2aa'])",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await browser.close();",
		],
		note: null,
		exampleHref: "https://github.com/SureA11y/puppeteer/blob/main/examples/basic-scan.js",
	},

	selenium: {
		intro: (
			<p>
				<a href="https://www.selenium.dev/"><span lang="en">Selenium WebDriver</span></a>
				は、あらゆる言語から実際のブラウザーを操作するための昔からの標準です。クロスブラウザーの自動化ツールとして最も定着しており、E2Eテストによく使われます。surea11yは
				<a href="https://github.com/SureA11y/selenium"><code>@surea11y/selenium</code></a>
				バインディングで連携します。
			</p>
		),
		install: ["npm install @surea11y/selenium selenium-webdriver"],
		installNote: (
			<p>
				<code>selenium-webdriver</code>
				にはSelenium Managerが同梱されており、初めてドライバーを作成するときに、対応する
				<code>chromedriver</code>
				を自動でダウンロードして管理します。Seleniumサーバーを別に用意する必要も、ドライバーを手動でインストールする必要もありません（Chrome自体は、あらかじめマシンにインストールしておいてください）。
			</p>
		),
		usage: [
			"const { Builder, Browser } = require('selenium-webdriver');",
			"const chrome = require('selenium-webdriver/chrome');",
			"const { A11yCoreBuilder } = require('@surea11y/selenium');",
			"",
			"const options = new chrome.Options().addArguments('--headless=new');",
			"const driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();",
			"await driver.get('https://example.com/');",
			"",
			"const results = await new A11yCoreBuilder({ driver })",
			"  .include('#main')            // optional -- call multiple times for multi-region scans",
			"  .exclude('.cookie-banner')    // optional",
			"  .withTags(['wcag2a', 'wcag2aa'])",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await driver.quit();",
		],
		note: (
			<p>
				Puppeteer/Playwrightが
				<code>{"{ page }"}</code>
				を受け取るのに対し、このビルダーは
				<code>{"{ driver }"}</code>
				（Seleniumの
				<code>WebDriver</code>
				）を受け取ります。生成時の違いはこの1点だけで、それ以降はすべて同じです。
			</p>
		),
		exampleHref: "https://github.com/SureA11y/selenium/blob/main/examples/basic-scan.js",
	},

	webdriverio: {
		intro: (
			<p>
				<a href="https://webdriver.io/">WebdriverIO</a>
				は、WebDriverプロトコルの上に構築されたNode.jsのテスト自動化フレームワークで、E2Eテストとコンポーネントテストの両方に対応しています。surea11yは
				<a href="https://github.com/SureA11y/webdriverio"><code>@surea11y/webdriverio</code></a>
				バインディングで連携します。
			</p>
		),
		install: ["npm install @surea11y/webdriverio webdriverio"],
		installNote: (
			<p>
				WebdriverIO v9は、初めてChromeを起動するときにローカルの
				<code>chromedriver</code>
				を自動で管理します。インストールしたばかりの状態で、そのまま実際のヘッドレスChromeを起動できます。
			</p>
		),
		usage: [
			"const { remote } = require('webdriverio');",
			"const { A11yCoreBuilder } = require('@surea11y/webdriverio');",
			"",
			"const browser = await remote({",
			"  capabilities: {",
			"    browserName: 'chrome',",
			"    'wdio:enforceWebDriverClassic': true,               // recommended -- see below",
			"    'goog:chromeOptions': { args: ['--headless=new'] }",
			"  }",
			"});",
			"await browser.url('https://example.com/');",
			"",
			"const results = await new A11yCoreBuilder({ browser })",
			"  .include('#main')            // optional -- call multiple times for multi-region scans",
			"  .exclude('.cookie-banner')    // optional",
			"  .withTags(['wcag2a', 'wcag2aa'])",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await browser.deleteSession();",
		],
		note: (
			<p>
				<strong>この用途では、BiDiではなく従来のWebDriverを強制してください。</strong>
				WebdriverIO v9はデフォルトでBiDiプロトコルを使います。多数の
				<code>browser.execute()</code>
				呼び出しを発行する長時間のセッション（スキャンがまさにそれです）は、テストでBiDi上では大きく性能が落ち、1回のスキャンの所要時間が約2秒から数分にまで伸びました。上の例のように
				<code>'wdio:enforceWebDriverClassic': true</code>
				で従来のWebDriverを強制すると、1回のスキャンあたり約150msで安定しました。
			</p>
		),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
