import React from "react";

/** Opens each binding's internals-hook passage; the snippet and its binding-specific note follow. */
const webComponents = (
	<p>
		<strong>Webコンポーネント。</strong>
		<code>ElementInternals</code>
		をプライベートフィールドに保持し、それを通じて名前や状態、ロールを自分に設定するコンポーネントは、ページのどのスクリプトからも読み取れません。そのため既定では、スキャンはそのようなコンポーネントを判定せずに確認を求め（
		<code>cantTell</code>
		）、その方法だけで設定されたロールはまったくチェックされません。コンポーネントライブラリーを作ったりテストしたりしているなら、ページ自身のスクリプトが実行される前に、バインディングのオプトインのinternalsフックをインストールしてください。そうすれば、それらのコンポーネントもほかのコントロールと同じように判定されます。
	</p>
);

const hookCaveat = (repo) => (
	<p>
		このフックはテストや監査の実行のためのものです。記録した内容をページのどのスクリプトからも読める場所に保持するため、オプトインになっています。フックがない場合、スキャンはそのようなコンポーネントについて確認を求めたときに、一度だけそのことを知らせます。詳しくは
		<a href={`https://github.com/SureA11y/${repo}#web-components-the-internals-hook`}>READMEのinternalsフックの節</a>
		を参照してください。
	</p>
);

/** A pointer to the builder methods this page leaves to the binding's README. */
const alsoAvailable = (repo, { logger = true } = {}) => (
	<p>
		<code>A11yCoreBuilder</code>
		にはほかにも、実行するルールを変えずに報告する達成基準をWCAGのレベルまでに絞る
		<code>.wcagLevel()</code>
		、タグのルールに名前を挙げたルールを加えて実行する
		<code>.includeMode('or')</code>
		、スキャンが何をチェックするかを実行前に一覧にし、何も実行しない選択が問題のないスキャンに見えないようにする
		<code>.plannedChecks()</code>
		と
		<code>.plannedCriteria()</code>
		、
		{logger ? (
			<>
				スキャンギャップの警告を自分のログに送る
				<code>.logger()</code>
				、
			</>
		) : null}
		ページがどのようにスキャンされたかを示す
		<code>getScanNotes(results)</code>
		があります。それぞれの説明は
		<a href={`https://github.com/SureA11y/${repo}#readme`}>バインディングのREADME</a>
		にあります。
	</p>
);

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
		install: ["npm install @surea11y/core @surea11y/cypress cypress"],
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
			"    .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
		packs: (
			<p>
				<a href="/configuration/packs/">パック</a>はNodeで準備され、Cypressのテストはブラウザーで実行されます。そのため、Cypressの<code>.withPacks()</code>は各パックのモジュール名（パッケージ名、またはプロジェクトのルートからのパス）を受け取り、バインディングのプラグイン<code>@surea11y/cypress/plugin</code>がNodeでパックを準備します。<code>setupNodeEvents</code>で<code>surea11y(on, config)</code>として登録してください。<code>{".options({ profile })"}</code>でパックのプロファイルを選びます。実行されなかったパックは<code>'pack-skipped'</code>のスキャンギャップとして報告されます。
			</p>
		),
		internals: {
			intro: webComponents,
			code: [
				"// cypress/support/e2e.js",
				"import { installInternalsHook } from '@surea11y/cypress';",
				"",
				"installInternalsHook();",
			],
			note: (
				<p>
					サポートファイルで一度呼び出せば、Cypressの
					<code>window:before:load</code>
					を通じてすべての訪問で実行されます。1回の訪問だけなら、
					<code>cy.visit()</code>
					に
					<code>{"{ onBeforeLoad: installInternalsHook }"}</code>
					として渡します。アプリのウィンドウの
					<code>eval</code>
					で実行されます。Cypressは既定でアプリのContent Security Policyを取り除くので、これで動作します。アプリ内のフレームには適用されません。
				</p>
			),
			caveat: hookCaveat("cypress"),
		},
		more: alsoAvailable("cypress", { logger: false }),
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
			"npm install @surea11y/core @surea11y/playwright playwright",
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
		internals: {
			intro: webComponents,
			code: [
				"const context = await browser.newContext();",
				"await A11yCoreBuilder.installInternalsHook(context); // before any page navigates",
				"const page = await context.newPage();",
				"await page.goto('https://example.com/');",
			],
			note: (
				<p>
					<code>page.goto()</code>
					の前に、ページかそのブラウザーコンテキストに対して呼び出してください。
					<code>addInitScript()</code>
					を通じて実行されるので、1回の呼び出しでページの、あるいはコンテキストが開くすべてのページの、すべてのフレームとナビゲーションがカバーされます。Chromium、Firefox、WebKitで動作します。
					<code>@playwright/test</code>
					では、
					<code>context</code>
					フィクスチャーに対する
					<code>beforeEach</code>
					で呼び出します。
				</p>
			),
			caveat: hookCaveat("playwright"),
		},
		more: alsoAvailable("playwright"),
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
		install: ["npm install @surea11y/core @surea11y/puppeteer puppeteer"],
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await browser.close();",
		],
		note: null,
		internals: {
			intro: webComponents,
			code: [
				"const page = await browser.newPage();",
				"await A11yCoreBuilder.installInternalsHook(page); // before goto",
				"await page.goto('https://example.com/');",
			],
			note: (
				<p>
					<code>page.goto()</code>
					の前に呼び出してください。
					<code>page.evaluateOnNewDocument()</code>
					を通じて実行されるので、1回の呼び出しでページが存在する間のフレームとナビゲーションがすべてカバーされます。ChromeとFirefoxで動作します。ページ自身が開いた新しいタブには適用されません。
				</p>
			),
			caveat: hookCaveat("puppeteer"),
		},
		more: alsoAvailable("puppeteer"),
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
		install: ["npm install @surea11y/core @surea11y/selenium selenium-webdriver"],
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
		internals: {
			intro: webComponents,
			code: [
				"const options = new chrome.Options().enableBidi(); // the webSocketUrl: true capability",
				"const driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();",
				"",
				"await A11yCoreBuilder.installInternalsHook(driver); // 'bidi' (or 'cdp' without BiDi on Chrome)",
				"await driver.get('https://example.com/');",
			],
			note: (
				<p>
					<code>driver.get()</code>
					の前に呼び出してください。従来のWebDriverではページのスクリプトより前にスクリプトを実行できないため、フックはセッションがWebDriver BiDiに対応していればそれを使い（Chrome、Edge、Firefoxで、上の例のようにドライバーの作成時にBiDiを有効にした場合）、そうでなければChromeとEdgeでDevToolsプロトコルを使います。戻り値は
					<code>'bidi'</code>
					か
					<code>'cdp'</code>
					です。Safari、またはBiDiなしのFirefoxでの従来のセッションでは、呼び出しは拒否されます。
				</p>
			),
			caveat: hookCaveat("selenium"),
		},
		more: alsoAvailable("selenium"),
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
		install: ["npm install @surea11y/core @surea11y/webdriverio webdriverio"],
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
		internals: {
			intro: webComponents,
			code: [
				"await A11yCoreBuilder.installInternalsHook(browser); // 'bidi' or 'cdp'",
				"await browser.url('https://example.com/');",
			],
			note: (
				<p>
					<code>browser.url()</code>
					の前に呼び出してください。WDIOのテストランナーでは
					<code>before</code>
					フックで呼び出します。BiDiセッションでは
					<code>browser.addInitScript()</code>
					を、そうでなければChromeとEdgeでchromedriver経由のDevToolsプロトコルを使います。上で推奨している従来のセッションもこれでカバーされます。FirefoxまたはSafariでの従来のセッションでは、呼び出しは拒否されます。
				</p>
			),
			caveat: hookCaveat("webdriverio"),
		},
		more: alsoAvailable("webdriverio"),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
