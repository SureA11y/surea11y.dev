import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "https://github.com/SureA11y/pack-en301549#readme";

// The example pack each binding ships as examples/acme-policy-pack.js.
const examplePack = [
	"'use strict';",
	"",
	"// A small pack: one house rule, a checklist profile and two checklist items.",
	"// A real pack is a package of its own; `npx surea11y-pack new <folder>` writes one.",
	"",
	"const { definePack, wcagTags } = require('@surea11y/core/pack');",
	"",
	"module.exports = definePack({",
	"  name: '@acme/a11y-policy',",
	"  title: 'Acme web policy',",
	"  version: '1.0.0',",
	"  namespace: 'acme',",
	"  core: '^1.11.1',",
	"  rules: [",
	"    {",
	"      id: 'acme-no-autoplay',",
	"      meta: {",
	"        title: 'Videos do not play sound on their own',",
	"        description: 'A video that starts with sound talks over a screen reader.',",
	"        tags: ['acme'],",
	"        defaultSeverity: 'serious'",
	"      },",
	"      runInPage(ctx) {",
	"        // defaultMuted reflects the muted attribute where muted isn't set from it yet (jsdom).",
	"        const loud = [...ctx.document.querySelectorAll('video[autoplay]')].filter((v) => !(v.muted || v.defaultMuted));",
	"        return loud.length",
	"          ? {",
	"              outcome: 'fail',",
	"              occurrences: loud.map((v) =>",
	"                ctx.helpers.reportOccurrence(v, { summary: 'This video plays with sound as the page opens.', hint: 'Remove autoplay, or add muted.' })",
	"              )",
	"            }",
	"          : { outcome: 'pass', occurrences: [] };",
	"      }",
	"    }",
	"  ],",
	"  profiles: {",
	"    'acme-web-2026': { tags: wcagTags('2.2', ['A', 'AA']), rules: ['region', 'acme-no-autoplay'] }",
	"  },",
	"  rollups: [",
	"    { id: 'acme-images', title: 'Images have a text alternative', checksIds: ['img-alt-present'] },",
	"    { id: 'acme-media', title: 'Media stays quiet until asked', checksIds: ['acme-no-autoplay'] }",
	"  ]",
	"});",
];

const kindRows = [
	{
		id: "checklist",
		have: "組織のアクセシビリティ方針：「WCAG 2.2 AAに、これらのルールを加え、あのルールを除き、これらの項目をレポートに載せる」",
		kind: <strong>チェックリスト</strong>,
		holds: "コアのルールと独自のルールを選ぶプロファイルと、チェックリストの項目となる集約。",
	},
	{
		id: "standard",
		have: "独自の要件を持つ規格（RGAAのような国の規格や、業界の規格）：番号の付いた要件があり、それぞれをいくつかのルールが検査する",
		kind: <strong>規格</strong>,
		holds: "要件の表、各要件を検査するルール、要件ごとの結果、プロファイル。",
	},
	{
		id: "rules",
		have: "プロファイルなしで、すべてのスキャンに追加したいいくつかのルール",
		kind: "ルールのみ",
		holds: "ルールと、コアのルールのバリアントや上書き。チェックリストから始めて、そのプロファイルと集約を削除してください。",
	},
];

const fileRows = [
	{ id: "index", file: <code>index.js</code>, what: <><code>@surea11y/core/pack</code>の<code>definePack()</code>で書いたパックです。</> },
	{ id: "auto", file: <code>rules/automatic/&lt;ns&gt;-link-text-specific.js</code>, what: "コアのヘルパーを使って判定するルールです。" },
	{ id: "variant", file: <code>rules/automatic/&lt;ns&gt;-contrast-enhanced.js</code>, what: <>7:1で判定する、コアの<code>contrast-minimum</code>のバリアントです。</> },
	{ id: "manual", file: <code>rules/manual/&lt;ns&gt;-new-window-review.js</code>, what: "人によるレビューが必要な手動ルールです。" },
	{ id: "i18n", file: <code>i18n/en.json</code>, what: "メッセージです。" },
	{ id: "tests", file: <><code>tests/rules/*.test.js</code>、<code>tests/profiles.test.js</code></>, what: "ルールごとのテストと、各プロファイルが実行するもののテストです。" },
	{ id: "examples", file: <code>docs/RULE_EXAMPLES.md</code>, what: "各ルールの判定結果の例です。" },
	{ id: "eslint", file: <code>eslint.config.js</code>, what: "ルールに対するコアのlintルールです。" },
	{ id: "standard", file: <><code>requirements.js</code>、<code>rule-map.js</code></>, what: "規格の場合のみ：要件と、それぞれを検査するルールです。" },
];

const profileFieldRows = [
	{ id: "tags", field: <code>tags</code>, what: <>これらのタグのいずれかを持つルールです。<code>@surea11y/core/pack</code>の<code>wcagTags(version, levels)</code>はコアのWCAGのタグを返します（<code>wcagTags('2.1')</code>は2.0と2.1の、AとAAです）。</> },
	{ id: "rules", field: <code>rules</code>, what: <>コアまたはパックのルールをIDで指定します。WCAGのタグでは選択されないベストプラクティスのルールや、<code>tags: []</code>と組み合わせて、パック自身のルールのほかにプロファイルが実行するコアのルールを指定します。</> },
	{ id: "exclude", field: <code>exclude</code>, what: <><code>{"{ rules: [...] }"}</code>はルールをスキャンから除外します。<code>{"{ criteria: ['2.5.8'] }"}</code>はそれらの達成基準を免除します。その集約は除かれ、すべての達成基準が免除されたルールも除かれます。プロファイルが残す達成基準も検査するルールは引き続き実行されます。これはスキャンがチェックする範囲を狭めるもので、WCAGの要件は変わりません。</> },
	{ id: "severity", field: <code>severity</code>, what: <><code>{"{ ruleId: level }"}</code>：そのプロファイルでの別の重大度です。結果にはそれが表示され、ルール自身の重大度は<code>ruleSeverity</code>として保持されます。ベースラインと検出結果のIDは変わりません。</> },
	{ id: "wcagVersion", field: <code>wcagVersion</code>, what: <><code>'2.0'</code>、<code>'2.1'</code>、<code>'2.2'</code>のいずれかで、プロファイルのスキャンを判定するWCAGのバージョン（<code>engine.wcagVersion</code>）です。指定しない場合は<code>tags</code>のWCAGのタグがバージョンを示し、WCAGのタグがないプロファイルは2.2で判定されます。スキャン自身の<code>engineOptions.wcagVersion</code>が引き続き優先されます。コア1.12.0以降です。</> },
	{ id: "version", field: <><code>version</code>、<code>mappedRules</code></>, what: <>規格のプロファイルの場合のみ：対象とする規格のバージョンと、そのバージョンで規格が対応付けるすべてのルールを実行するための<code>mappedRules: true</code>です。</> },
];

export function PacksContent() {
	return (
		<>
			<p>
				<strong>パック</strong>は、ルール、コアのルールのバリアント、規格やチェックリストと、それらのプロファイルやメッセージを、コアをフォークもビルドもせずに、それ自身のパッケージとして<code>@surea11y/core</code>に提供します。RGAAのような国の規格もパックにでき、組織のアクセシビリティ方針もパックにできます。スキャンは<code>engineOptions.packs</code>でパックを受け取り、コア自身のルールや規格と同じように実行します。Nodeでもブラウザーでも、CLI、バインディング、test-matchersのどこからでも動作し、結果、集約、レポートの項目はコアのものと同じ形式になります。パックには<code>@surea11y/core</code> 1.11.1以降が必要です。
			</p>

			<h2 id="which-kind-of-pack">パックの種類</h2>
			<DataTable
				label="パックの種類"
				rowKey="id"
				columns={[
					{ key: "have", label: "手元にあるもの", wrap: true },
					{ key: "kind", label: "種類", width: "16%" },
					{ key: "holds", label: "含むもの", wrap: true },
				]}
				rows={kindRows}
			/>
			<p>
				パックのルールとプロファイルは、コアのどのルールでも使えます。チェックリストや規格の大部分は、選んでまとめたコアのルールに、コアにない少数のルールを加えたものです。このページの例では、すべてのバインディングが<code>examples/</code>フォルダーに同梱している小さなパック<code>acme-policy-pack.js</code>を使います。独自ルール1つ、チェックリストのプロファイル（WCAG 2.2のAとAA、<code>region</code>、独自ルール）、チェックリストの項目2つを持ちます。<a href="#start-from-the-example">そのソース</a>は後述します。
			</p>

			<h2 id="en-301-549-pack">EN 301 549のパック</h2>
			<p>
				<a href={pack}><code>@surea11y/pack-en301549</code></a>は、SureA11yファミリーの、すぐにインストールできる規格パックです。EN 301 549の第9章（Web）を、V3.2.1とV4.1.1で扱います。バージョンごとのプロファイル<code>en301549-v4.1.1</code>と<code>en301549-v3.2.1</code>は条項ごとに結果を1つ報告し、<code>mappings: ['en301549']</code>は、WCAGのスキャンを含むあらゆるスキャンの結果に条項を示します。<code>@surea11y/core</code> 1.13.0以降が必要です。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// npm install @surea11y/core @surea11y/pack-en301549",
					"const en301549 = require('@surea11y/pack-en301549');",
					"",
					"runDomRulesInPage(url, null, { packs: [en301549], profile: 'en301549-v4.1.1' });",
					"runDomRulesInPage(url, null, { packs: [en301549], profile: 'wcag22-aa', mappings: ['en301549:V4.1.1'] });",
				]}
			/>
			<p>
				独自の規格を作るときの実例でもあります。ルールは持ちません。第9章はWCAGを再掲したものなので、各条項はその達成基準に対するコアのルールで確認します。プロファイルはそれらのルールを選び（<code>tags</code>、<code>mappedRules: true</code>）、規格の各バージョンを判定するWCAGのバージョンを示します（<code>wcagVersion</code>）。ルールの対応表はインストールされたコアのカタログから導くため、コアが追加したルールもパックを変えずに対象になります。WCAGにない要件を持つ規格も同じ形で、独自のルールを加えます。ソースは短いので、後述の<a href="#writing-a-pack">パックを書く</a>と合わせて読む価値があります。
			</p>
			<p>
				コアは1.13.0までEN 301 549を内蔵していましたが、1.13.0でこのパックに置き換える形で非推奨にしました（<a href="/conformance/wcag-mapping/#en-301-549">WCAG適合性との対応</a>を参照）。ほかのプロファイルと同じく、パックのプロファイルが決めるのは何を実行するかです。適合を表明するには、引き続き人がすべての条項を確認する必要があります。
			</p>

			<h2 id="using-a-pack">パックを使う</h2>

			<h3 id="from-node">Nodeから</h3>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' }, null);",
					"result.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
				]}
			/>
			<p>
				パックは1回だけ準備され、同じパックのオブジェクトでの次のスキャンのために保持されます。そのため、すべてのページに同じパックを渡すクロールでは、準備は1回で済みます。<code>definePack</code>はパックのオブジェクトを凍結します。変更できないものとして扱い、スキャン間では同じオブジェクトを再利用してください。パックを渡すとスキャンに登録されますが、そのルールが選択されるわけではありません。パックの名前空間のタグを持つパックのルールはオプトインです。パックのプロファイルを使わない場合、IDかそのタグで選択されたときだけ実行されます（<a href="#names">名前</a>を参照）。このタグを持たないパックのルールはコアのルールと同じように選択されるため、パックを渡したデフォルトのスキャンで実行されます。ベストプラクティスも実行するには、プロファイルと並べて<code>{"runOnly: { bestPractices: true }"}</code>を追加してください。
			</p>

			<h3 id="with-a-browser-binding">ブラウザーのバインディングで</h3>
			<p>
				Playwright、Puppeteer、Selenium、WebdriverIOは、<code>.withPacks()</code>でパックのオブジェクトを受け取り、スキャンの前にページに、また<code>.frames(true)</code>ではすべてのフレームに登録します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { A11yCoreBuilder, getScanGaps } = require('@surea11y/playwright');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const results = await new A11yCoreBuilder({ page })",
					"  .withPacks(acmePolicy)",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze();",
					"",
					"results.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"",
					"// A checklist's items, each one result, beside core's WCAG rollups:",
					"results.rulesResults.filter((r) => r.meta && r.meta.standard === 'Acme web policy');",
				]}
			/>
			<p>
				複数のパックでスキャンするには、配列を渡すか、<code>.withPacks()</code>をもう一度呼び出してください。バインディングは<code>.withPacks()</code>を共通して持ちますが、各ビルダーはそれぞれのドライバーのオブジェクト（<code>{"{ page }"}</code>、<code>{"{ driver }"}</code>、<code>{"{ browser }"}</code>）を受け取り、それぞれのセットアップが必要です。<a href="/getting-started/playwright/">Playwright</a>、<a href="/getting-started/puppeteer/">Puppeteer</a>、<a href="/getting-started/selenium/">Selenium</a>、<a href="/getting-started/webdriverio/">WebdriverIO</a>を参照してください。
			</p>

			<h3 id="with-cypress">Cypressで</h3>
			<p>
				パックはNodeで準備されますが、Cypressのspecはブラウザーで実行されます。そのためCypressでは、<code>.withPacks()</code>は各パックのモジュール名（パッケージ名、またはプロジェクトのルートからのパス）を受け取り、バインディングのプラグインがNodeでパックを準備します。プラグインは1回だけ登録してください。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// cypress.config.js",
					"const { defineConfig } = require('cypress');",
					"const surea11y = require('@surea11y/cypress/plugin');",
					"",
					"module.exports = defineConfig({",
					"  e2e: {",
					"    setupNodeEvents(on, config) {",
					"      surea11y(on, config);",
					"    }",
					"  }",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"new A11yCoreBuilder()",
					"  .withPacks('./examples/acme-policy-pack.js') // or a package name, '@acme/a11y-policy'",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze()",
					"  .then((results) => {",
					"    expect(results.engine.packs).to.deep.equal(['@acme/a11y-policy@1.0.0']);",
					"  });",
				]}
			/>
			<p>
				<code>.analyze()</code>は、パックを登録するスクリプトを<code>cy.task</code>を通じてプラグインに求め、それをページで、また<code>.frames(true)</code>では同一オリジンのすべてのフレームで実行します。プラグインは実行が終わるまでパックを保持するため、パックのファイルへの変更は、次の<code>cypress run</code>か、<code>cypress open</code>を再起動した後に反映されます。ほかのバインディングが受け取るようなパックのオブジェクトを渡すと、ブラウザーでは準備できないため、<code>.withPacks()</code>で例外が投げられます。
			</p>

			<h3 id="with-the-test-matchers">test-matchersで</h3>
			<p>
				<code>@surea11y/test-matchers</code>はNodeでスキャンするため、パックはオブジェクトそのものとして渡します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const acmePolicy = require('./acme-policy-pack');",
					"const policy = { packs: [acmePolicy], profile: 'acme-web-2026' };",
					"",
					"test(\"a page that breaks the pack's house rule fails the assertion\", () => {",
					"  document.body.innerHTML = '<main><h1>Welcome</h1><video autoplay src=\"intro.mp4\"></video></main>';",
					"  expect(document).not.toHaveNoA11yViolations(policy);",
					"});",
				]}
			/>
			<p>
				すべてのテストが同じパックのオブジェクトを渡すよう、パックのオブジェクトは1か所（セットアップファイルやモジュール）にまとめてください。実行されなかったパックは、アサーションを失敗させます。<a href="/getting-started/test-matchers/#packs">test-matchers</a>を参照してください。
			</p>

			<h3 id="from-the-cli">CLIから</h3>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				<code>--pack</code>は、作業ディレクトリのプロジェクトから解決されるパッケージ名か、パスを受け取り、複数のパックには繰り返して指定します。パックは<code>@surea11y/core/pack</code>を読み込みます。これは、プロジェクトに<code>@surea11y/cli</code>をインストールすると、CLIと並んでインストールされます。<a href="/getting-started/cli/#packs">CLI</a>を参照してください。
			</p>

			<h3 id="in-a-page-of-your-own">独自のページで</h3>
			<p>
				ブラウザー拡張機能や独自の<code>page.evaluate</code>では、コアのブラウザー用バンドルの後に<code>@surea11y/core/pack</code>の<code>packScript([acmePolicy])</code>を注入するか、<code>buildBrowserBundle({"{ packs: [acmePolicy] }"})</code>で作った1つのファイルを配布し、パックを<code>name@version</code>として指定してください。<a href="/getting-started/standalone/#packs-in-a-page">スタンドアロン</a>を参照してください。スクリプトをファイルとして読み込むページには、<code>buildBrowserBundle</code>で作る1つのファイルが最適です。パックのスクリプトは、それを書き出したコアでしか動作しません。
			</p>

			<h2 id="what-a-scan-reports">スキャンが報告するもの</h2>
			<ul>
				<li>
					<code>engine.packs</code>は実行された各パックを<code>name@version</code>の形で示し、<code>engine.profile</code>は適用されたプロファイルを示します。
				</li>
				<li>
					パックのルールはコアのルールと同じように<code>checksResults</code>に現れ、そのIDはパックの名前空間で始まります（<code>acme-no-autoplay</code>）。WCAGの達成基準に対応するパックのルールは、その達成基準の集約に算入されます。ただし、パックのオプトインの名前空間のタグを持つルールは除きます。それらのルールはWCAGが求めていないことをチェックするため、パック自身の集約にだけ算入されます。それでもその<code>wcagSc</code>は、レポーターのために、検査するWCAGの達成基準を示します。ほかの規格（すべてのルールをWCAGの達成基準で対応付けるEN 301 549）がそれらを自身のものとすることはありません。上書きは、置き換えるコアのルールの代わりに、それ自身の対応が示す集約に算入されます。
				</li>
				<li>
					チェックリストの項目や規格の要件は<code>rulesResults</code>の集約で、チェックリストや規格の名前を<code>meta.standard</code>として持ちます。<a href="/results-reports/html-report/">HTMLレポート</a>はそれらを独自のセクションに表示し、<a href="/results-reports/sarif-report/">SARIF</a>は各ルールに、それが属する項目のタグ（<code>acme-images</code>）を付け、<a href="/results-reports/junit-report/">JUnit</a>はそれらをプロパティとして列挙します。結果の<code>standards</code>がチェックリストを示すため、保存した結果はどこでレンダリングしても同じになります。
				</li>
				<li>
					プロファイルの<code>severity</code>は、それが変更する結果に表示され、ルール自身の重大度は<code>ruleSeverity</code>として保持されます。
				</li>
			</ul>

			<h2 id="when-a-pack-doesnt-run">パックが実行されない場合</h2>
			<p>
				<code>core</code>の範囲がインストールされているコアを含まないパック、妥当でないパック、コアと両立しないパック（名前空間の外にあるルールID、コアが持つ辞書のキー、存在しないルールのバリアント）はスキップされます。スキャンはそのパックなしで実行され、警告を出し、<code>skippedPacks</code>に<code>{"{ name, reason }"}</code>として列挙します。<code>strictOptions</code>のもとでは、<code>engineOptions.packs</code>のすべてのエラーと同じく<code>code: 'INVALID_ENGINE_OPTIONS'</code>付きのエラーを投げます。互いに衝突する2つのパック（両方が定義する辞書のキー、1つのキーを持つ2つの規格）はエラーを投げます。どちらかを選ぶ方法は、どれも渡された順序に左右されてしまうからです。ページ内では、<code>engineOptions.packs</code>で指定されたのに、どの<code>packScript</code>の呼び出しも登録していないパックや、別のバージョンのコアで登録されたパックが、同じように列挙されます。そのため、パックを追加した目的のチェックがないままスキャンが終わることもあります。パックに依存するツールは、スキャンを完了したものとして扱う前に<code>skippedPacks</code>を確認してください。
			</p>
			<p>どのツールも、スキップされたパックを目に見える失敗に変えます。</p>
			<ul>
				<li>
					ブラウザーのバインディングは、<code>.withPacks()</code>を呼び出したときに各パックを確認し、コアが実行できないパックがあればスキャンの前に例外を投げます。それでもページが実行しなかったパックは、<code>getScanGaps(results)</code>の<code>'pack-skipped'</code>のスキャンギャップになり、<code>.analyze()</code>がそれについて警告するため、スキャンギャップを検証するテストは失敗します。
				</li>
				<li>test-matchersは、パックと理由を示してアサーションを失敗させます。</li>
				<li>
					CLIは、見つからない、または読み込めないパックや、エンジンがスキップするパックに対して、レポートもベースラインも書き出さずに終了コード<code>2</code>で終了します。
				</li>
			</ul>
			<p>
				パックは<code>@surea11y/core</code>およびそれを実行するパッケージと並べてインストールし、3つが同じコアを共有するようにしてください。
			</p>

			<h2 id="writing-a-pack">パックを書く</h2>

			<h3 id="start-from-the-example">例から始める</h3>
			<p>
				パックは、<code>@surea11y/core/pack</code>の<code>definePack</code>で作るオブジェクトです。これは、バインディングが同梱している例の<code>acme-policy-pack.js</code>です。
			</p>
			<CodeBlock lang="js" lines={examplePack} />
			<p>
				そのプロファイル<code>acme-web-2026</code>は、コアのWCAG 2.2のAとAAのルール、どのWCAGのタグでも選択されないベストプラクティスのルール<code>region</code>、そして独自ルールを実行します。2つの集約はチェックリストの項目で、それぞれがコアまたはパックのルールを1つの結果にまとめます。
			</p>

			<p>
				規格の場合は、<a href="#en-301-549-pack">EN 301 549のパック</a>が、公開済みの完全な例です。
			</p>

			<h3 id="create-one"><code>surea11y-pack new</code>で作る</h3>
			<p>独自のパックを作るには、生成したパッケージから始めてください。</p>
			<CodeBlock
				lines={[
					{ text: "npx -p @surea11y/core surea11y-pack new acme-a11y --name @acme/a11y-pack", command: true },
					"# or, for a standard:",
					{ text: "npx -p @surea11y/core surea11y-pack new city-standard --name @city/a11y-standard --kind standard --title \"City Standard\"", command: true },
					"",
					{ text: "cd acme-a11y", command: true },
					{ text: "npm install", command: true },
					{ text: "npx playwright install chromium   # once, for npm run docs", command: true },
					{ text: "npm test && npm run lint && npm run docs", command: true },
				]}
			/>
			<p>
				パックは生成した時点で動作します。テストは合格し、ルールはlintを通り、例はルールと一致します。<code>surea11y-pack new</code>は、何かを書き出す前にスキャンと同じようにパックを確認し、パックを無効にする名前、名前空間、タイトル（<code>WCAG</code>というタイトルは、その規格をコアの規格の1つとして示してしまいます）を、理由を示して拒否します。そこから少しずつ変更し、その都度<code>npm test</code>を実行してください。READMEが各ファイルを順に説明しています。
			</p>
			<DataTable
				label="生成されたパックのファイル"
				rowKey="id"
				columns={[
					{ key: "file", label: "ファイル", width: "40%", wrap: true },
					{ key: "what", label: "含むもの", wrap: true },
				]}
				rows={fileRows}
			/>

			<h3 id="names">名前</h3>
			<ul>
				<li>
					<strong>パッケージ名とバージョン</strong>は、npmのパッケージ名と完全なバージョン（<code>1.0.0</code>）です。スキャンはそれらを<code>engine.packs</code>で報告します。
				</li>
				<li>
					<strong>名前空間</strong>（<code>namespace: 'acme'</code>）は、パックのIDをコアやほかのパックのIDと区別します。すべてのルール、集約、プロファイルのIDは、名前空間と<code>-</code>で始まります。コアのルールIDの接頭辞になる名前（<code>img-alt-present</code>に対する<code>img</code>のように、<code>img</code>、<code>aria</code>、<code>link</code>）や、<code>wcag</code>で始まる名前は使えず、1つのスキャンにある2つのパックが同じ名前空間を持つことはできません。名前空間は、パック自身のルールをオプトインにするタグでもあります。このタグを持つルールは、パックのいずれかのプロファイルのもとか、IDか、タグ（<code>optInRules: ['acme']</code>）で選択されたときだけ実行されます。そのため、デフォルトでは、WCAGを対象とするスキャンでは実行されません。<code>optInRules</code>でこのタグを有効にしても、スキャンのプロファイルやフィルターはなくなりません。WCAGのプロファイルのもとでは、有効にしたルールは、そのタグがプロファイルにも一致するときだけ実行されます。パックを使うすべてのスキャンで実行すべきルールには、このタグを付けないでください。そうすると、そのルールはコアのルールと同じように選択され、タグが一致すれば、WCAGを対象とするスキャンでも実行されて不合格を報告することがあります。
				</li>
				<li>
					<strong><code>core</code></strong>は、パックが動作するコアのバージョンの範囲（<code>'^1.11.1'</code>）で、npmと同じように範囲として読まれます。新しいパックは1.11.1から始めてください。1.11.0のパッケージには、Nodeでパックに必要なファイルが含まれていませんでした。範囲外のコアでのスキャンはパックをスキップし、理由を<code>skippedPacks</code>に示します。
				</li>
				<li>
					<strong><code>title</code></strong>は結果やレポートでのチェックリストの呼び名、<strong><code>description</code></strong>はパックが何をチェックするかを述べる1文で、利用者にパックを選ばせるツールのためのものです（<code>describePacks</code>がそれを返します）。
				</li>
			</ul>

			<h3 id="profiles">プロファイル</h3>
			<p>
				プロファイルは名前の付いた選択で、<code>engineOptions.profile</code>で実行します。ルールは、そのプロファイルの<code>tags</code>のいずれかを持つか、IDが<code>rules</code>にあり、<code>exclude</code>にない場合に、そのもとで実行されます。パックの名前空間のタグを持つパックのルールは、パックのすべてのプロファイルのもとで実行されます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"profiles: {",
					"  'acme-policy': {",
					"    tags: wcagTags('2.2', ['A', 'AA']),               // core's WCAG 2.2 A and AA rules",
					"    rules: ['region', 'heading-order'],               // and these, by id",
					"    exclude: { rules: ['contrast-minimum'] },         // but not this one",
					"    severity: { 'img-alt-present': 'critical' }       // and this one is critical here",
					"  },",
					"  'acme-quick': {",
					"    tags: [],",
					"    rules: ['img-alt-present', 'link-name-present', 'page-title-present']",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="プロファイルのフィールド"
				rowKey="id"
				columns={[
					{ key: "field", label: "フィールド", width: "22%" },
					{ key: "what", label: "働き", wrap: true },
				]}
				rows={profileFieldRows}
			/>
			<p>
				<strong>規格が求めるものだけを実行するプロファイル。</strong><code>{"tags: [<ns>]"}</code>と<code>mappedRules: true</code>を持つ規格のプロファイルは、パック自身のルールと、その対応表が要件に結び付けるコアのルールだけを実行します。規格が求めないことを検査するルールはなく、結果にWCAGの達成基準は含まれません。ただし、WCAGのタグがないため、その規格がどのWCAGのバージョンに基づくかを示すものがなく、実行は2.2で判定されます。2.1に基づく規格ではこれは誤りです。4.1.1「構文解析」は2.2にはないため、<code>duplicate-id</code>は不合格にせず確認を求めます。バージョンを指定してください。生成された<code>index.js</code>は、それを<code>requirements.js</code>から読みます。そこでは規格の各バージョンが、基づくWCAGのバージョンを示しています（<code>{"{ version: '1.0', wcagVersion: '2.2' }"}</code>）。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'city-1.0': {",
					"  version: '1.0',",
					"  tags: ['city'],                      // the pack's own rules",
					"  mappedRules: true,                   // and the core rules its map links to a requirement",
					"  wcagVersion: wcagVersionOf('1.0')    // judged by the WCAG version requirements.js gives for 1.0",
					"}",
				]}
			/>
			<p>
				コアのルールとそのID、タグは、<a href="/rules/">ルール</a>のカタログにあります。
			</p>

			<h3 id="checklist-items-and-requirements">チェックリストの項目と要件</h3>
			<p>
				<strong>チェックリストの項目</strong>は、その<code>rollups</code>です。<code>{"{ id, title, checksIds }"}</code>の形で、それぞれがルールを1つの結果にまとめます。項目は、ルールのいずれかが不合格なら不合格になり、すべてが合格すれば合格します。不合格のルールがなく、いずれかが<code>cantTell</code>を返した場合、項目も<code>cantTell</code>になり、人によるレビューが必要です。パックが持つのは、<code>profiles</code>と<code>rollups</code>（チェックリスト）か、<code>standard</code>のどちらか一方で、両方は持ちません。
			</p>
			<p>
				<strong>規格の要件</strong>は、ジェネレーターが書き出す2つの表から来ます。<code>requirements.js</code>（バージョンごとに、各要件の番号、文言、WCAGの達成基準）と<code>rule-map.js</code>（各ルールがどの要件を検査するか、そしてその理由）です。<code>@surea11y/core/pack</code>の<code>ruleMappedStandard()</code>は、それらを規格に変換します。要件ごとの集約、各ルールの結果が示す要件、そしてパックを準備するときの両方の表の確認です。
			</p>

			<h3 id="rules">ルール</h3>
			<p>
				ルールはコアのルールモジュールと同じ形です。<code>{"{ id, meta, runInPage }"}</code>に、一部の場合にだけ適用されるときは<code>applicability</code>を加え、同じ<code>ctx</code>を受け取ります。<code>runInPage(ctx)</code>はページ内で実行されるため、<code>ctx</code>だけを使い、その外の変数やモジュールは決して使いません。また、読み取りしか行いません。パックのルールはコアのルールの後に実行され、渡されるヘルパーとオプションは読み取り専用です。読み取り専用は決まりであって、サンドボックスではありません。ルールのコードがそれ以上のことをするのを止めるものはないため、信頼できるパックだけを読み込んでください（GitHub上のコアの<a href={`${core}/SECURITY.md`}>セキュリティポリシー</a>を参照）。コードがほとんど、またはまったく要らない近道が3つあります。<strong>バリアント</strong>はコアのルールを別の設定で実行し（<code>{"{ id, from: 'contrast-minimum', config: { normalTextRatio: 7 }, meta }"}</code>。各設定はしきい値で、0より大きい有限の数です。<code>definePack</code>はそれ以外の値を拒否します）、<strong>上書き</strong>はコアのルールを置き換え（<code>overrides</code>に列挙し、結果の<code>overriddenBuiltinIds</code>にも示されます）、<strong>そのままのコアのルール</strong>はプロファイルや集約にIDを書くだけで済みます。ルールの書き方は、GitHub上のコアの<a href={`${core}/docs/RULE_AUTHORING.md`}>ルール作成ガイド</a>にあります。
			</p>

			<h3 id="messages">メッセージと言語</h3>
			<p>
				ルールが表示する各テキストはキーを持ち、ロケールごとに<code>i18n/&lt;locale&gt;.json</code>に置かれ、パックの<code>dictionaries</code>に列挙されます。<code>engineOptions.locale: 'fr'</code>でのスキャンはフランス語のテキストを表示し、パックに辞書がないロケールでは英語が表示されます。パックのキーは名前空間で始まるパック独自のもので、パックがコアの同梱するロケールのコアのメッセージを変更することはできません。
			</p>

			<h3 id="test-lint-document">テスト、lint、ドキュメント</h3>
			<ul>
				<li>
					<strong>テスト</strong>には、コア自身のルールのテストが使う<code>@surea11y/core/testing</code>を使います。<code>runa11yCoreOnHtml(html, {"{ engineOptions }"})</code>はHTMLをjsdomでスキャンし、<code>assertRule(result, ruleId, outcome)</code>はルールを確認します。パックがある場合、スキャンはパックのオブジェクトからと、ページが持つ形の両方でパックを実行するため、関数の外の変数を読むルールはテストで失敗します。開発用の依存関係としてjsdomが必要です。
				</li>
				<li>
					<strong>lint</strong>（<code>npm run lint</code>、<code>@surea11y/core/eslint-plugin</code>）は、パックのルールに、コアのルールと同じlintルールを適用します。
				</li>
				<li>
					<strong>ドキュメント</strong>（<code>npm run docs</code>、<code>surea11y-pack docs</code>）は、パックの<code>docs/RULE_CATALOG.md</code>を書き出し、その<code>docs/RULE_EXAMPLES.md</code>のすべての例をChromiumで実行します（<code>CHROMIUM_EXECUTABLE_PATH</code>で別のChromiumビルドを指定できます）。<code>--check</code>は、どちらかが古くなっていれば失敗するので、パックのCIで使えます。
				</li>
			</ul>

			<h3 id="publish">公開する</h3>
			<p>
				生成されたパッケージは<code>private</code>です。ライセンスを選び、<code>package.json</code>で<code>license</code>を設定して<code>private</code>を削除し、<code>npm publish</code>してください。<code>@surea11y/core</code>は<span lang="en">peer dependency</span>のままにし、範囲は<code>core</code>に合わせます。パックが土台にするものはセマンティックバージョニングの対象です。コア1.11向けに書いたパックは、それ以降の1.xのバージョンでも動作し続けます。パックの利用者にとって、ルールのIDとその理由コードはベースラインが保持するものです。名前の変更や削除は、パックのメジャーバージョンでだけ行ってください。
			</p>
			<p>
				空のフォルダーから公開済みのパックまでの完全なガイドは、GitHub上のコアの<a href={`${core}/docs/PACKS.md`}><code>PACKS.md</code></a>にあり、すべてのフィールドは<a href={`${core}/docs/ENGINE_OPTIONS.md#packs--rules-and-standards-from-outside-core`}><code>ENGINE_OPTIONS.md</code></a>のパックのリファレンスにあります。
			</p>
		</>
	);
}
