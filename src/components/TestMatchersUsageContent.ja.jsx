import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const apiRows = [
	{
		id: "received",
		param: <code>received</code>,
		type: (
			<>
				<code>Element</code>
				、
				<code>Document</code>
				、またはスキャン結果
			</>
		),
		meaning: (
			<>
				チェック対象です。DOMの
				<code>Element</code>
				／
				<code>Document</code>
				は自動的にスキャンされます。
				<code>{"{ checksResults: [...] }"}</code>
				の形をしたオブジェクトはスキャンせず、そのままアサーションの対象になります。それ以外を渡すと
				<code>TypeError</code>
				が投げられます。
			</>
		),
	},
	{
		id: "engineOptions",
		param: <code>engineOptions</code>,
		type: "object（省略可）",
		meaning: (
			<>
				<code>@surea11y/core</code>
				のスキャンにそのまま渡されます。エコシステムのほかの場所で使うものと同じオプションオブジェクトです（
				<a href="/configuration/engine-options/">エンジンオプション</a>
				を参照）。
				<code>received</code>
				がすでにスキャン結果の場合は無視されます。
			</>
		),
	},
	{
		id: "runOnly",
		param: <code>runOnly</code>,
		type: "object、stringまたはstring[]（省略可）",
		meaning: (
			<>
				スキャンの
				<code>runOnly</code>
				としてそのまま渡されます。WCAGの目標（
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code>
				）、
				<code>bestPractices</code>
				、ルールのID、タグを指定できます。
				<a href="#choosing-a-wcag-target">WCAGの目標を選ぶ</a>
				を参照してください。
				<code>received</code>
				がすでにスキャン結果の場合は無視されます。
			</>
		),
	},
	{
		id: "options",
		param: <code>options</code>,
		type: "オブジェクト（省略可）",
		meaning: (
			<>
				<code>{"{ failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code>
				。
				<a href="#failing-only-on-serious-problems">重大な問題でだけ失敗させる</a>
				と
				<a href="#questions-that-likely-fail">不適合の可能性が高い問い</a>
				を参照してください。それぞれ
				<code>configureA11yMatchers()</code>
				で設定した既定値より優先されます。
			</>
		),
	},
];

export function TestMatchersUsageContent() {
	return (
		<>
			<p>
				ユニットテストやコンポーネントテスト向けです。実際のブラウザーやヘッドレスブラウザーを操作するのではなく、JestやVitestのテストの中で、テストがすでに持っているDOMに対してアクセシビリティをその場でアサーションします。レンダリングされたページ全体をテストする場合は、
				<a href="/getting-started/">ブラウザーを操作するバインディング</a>
				を参照してください。
			</p>
			<p>
				<a href="https://github.com/SureA11y/test-matchers"><code>@surea11y/test-matchers</code></a>
				は
				<code>toHaveNoA11yViolations()</code>
				と、ライブリージョン向けの
				<code>toHaveAnnounced()</code>
				を提供します。2つとも、手を加えずにそのまま、どちらのフレームワークの
				<code>expect.extend()</code>
				にも組み込めます。フレームワーク固有のコードは持っていません。テストがすでに動いているjsdomベースの環境をスキャンするもので、
				<code>jsdom</code>
				自体に依存したり、環境を用意したりはしません。surea11yのエンジンは同期的に動くので、このマッチャーも同期的です。
				<code>await</code>
				は不要で、書き忘れて解決済みのPromiseに対して黙って成功してしまうこともありません。
			</p>
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/core @surea11y/test-matchers", command: true }]} />
			<p>
				<code>@surea11y/core</code>
				はマッチャーが実行するエンジンです。上のとおり、マッチャーと一緒にインストールしてください。テストランナーの外で、ビルドしたHTMLをターミナルやCIのステップからチェックしたい場合は
				<a href="/getting-started/cli/">CLI</a>
				を参照してください。
			</p>

			<h2>セットアップ</h2>
			<p>
				テスト環境はあらかじめjsdomベースになっている必要があります。このマッチャーは、その環境が提供する
				<code>document</code>
				／
				<code>window</code>
				をスキャンします。テストランナーがすでに読み込んでいるセットアップファイルで、マッチャーを1度だけ登録してください。
			</p>
			<h3>Jest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"expect.extend({",
					"  toHaveNoA11yViolations: require('@surea11y/test-matchers').toHaveNoA11yViolations",
					"});",
					"",
					"// jest.config.js",
					"module.exports = {",
					"  testEnvironment: 'jsdom',   // or the explicit jest-environment-jsdom package, depending on your Jest version",
					"  setupFilesAfterEnv: ['./jest.setup.js']",
					"};",
				]}
			/>
			<h3>Vitest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import { toHaveNoA11yViolations } from '@surea11y/test-matchers';",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"",
					"// vitest.config.js",
					"export default {",
					"  test: {",
					"    environment: 'jsdom',   // Vitest doesn't bundle jsdom -- install it as a devDependency too",
					"    setupFiles: ['./vitest.setup.js']",
					"  }",
					"};",
				]}
			/>
			<p>
				同梱の
				<code>.d.ts</code>
				は、Jestのグローバルな
				<code>jest.Matchers</code>
				インターフェースと、Vitestの
				<code>@vitest/expect</code>
				インターフェースの両方を拡張します。そのために
				<code>@types/jest</code>
				や
				<code>vitest</code>
				をimportする必要はありません。実際にインストールされているフレームワークに対応する拡張だけが有効になります。
			</p>

			<h2>使い方</h2>
			<p>通常のDOMノードに対して使えます。</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('no accessibility violations', () => {",
					"  document.body.innerHTML = '<img src=\"logo.png\">';",
					"",
					"  expect(document.body).toHaveNoA11yViolations(); // fails: missing alt",
					"});",
				]}
			/>
			<p>
				<span lang="en">Testing Library</span>系の
				<code>container</code>
				にも使えます。<span lang="en">React Testing Library</span>、<span lang="en">Vue Test Utils</span>の
				<code>wrapper.element</code>
				、<span lang="en">Angular Testing Library</span>、<span lang="en">Svelte Testing Library</span>のいずれも、レンダリングされたDOM要素を同じ形で公開しているからです。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { render } = require('@testing-library/react');",
					"",
					"test('MyComponent has no accessibility violations', () => {",
					"  const { container } = render(<MyComponent />);",
					"",
					"  expect(container).toHaveNoA11yViolations();",
					"});",
				]}
			/>
			<p>
				テストランナーの側でもフレームワークを問いません。マッチャーを登録すれば、上のコードはJestでもVitestでもまったく同じです。
			</p>

			<h3><code>.not</code>によるアサーション</h3>
			<CodeBlock
				lang="js"
				lines={[
					"test('a page with a violation fails the assertion', () => {",
					"  document.body.innerHTML = '<main><img src=\"logo.png\"></main>';",
					"",
					"  expect(document.body).not.toHaveNoA11yViolations();",
					"});",
				]}
			/>

			<h3>1回のスキャン結果を複数のアサーションで使い回す</h3>
			<p>
				複数の
				<code>it()</code>
				ブロックで特定のルールを毎回スキャンし直さずに確認するため、surea11yのスキャン結果を自分で計算している場合は、DOMノードの代わりにその結果オブジェクトを直接渡してください。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(null, '#main', {}, null);",
					"expect(result).toHaveNoA11yViolations();",
				]}
			/>

			<h2>スキャンの絞り込みと設定</h2>
			<p>
				第2引数には
				<code>@surea11y/core</code>
				が受け付けるものなら何でも渡せます。全体は
				<a href="/configuration/engine-options/">エンジンオプション</a>
				を参照してください。よくある例をいくつか挙げます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only run rules relevant to WCAG 2.0 A",
					"expect(container).toHaveNoA11yViolations({ tags: { include: 'wcag2a' } });",
					"",
					"// Skip a rule you've decided not to enforce yet",
					"expect(container).toHaveNoA11yViolations({ rules: { exclude: 'target-size-minimum' } });",
					"",
					"// Ignore a third-party widget you don't control",
					"expect(container).toHaveNoA11yViolations({ excludeSelectors: ['.intercom-launcher'] });",
					"",
					"// EN 301 549 V4.1.1 (WCAG 2.2 A and AA); 'en301549-v3.2.1' for V3.2.1 (WCAG 2.1 A and AA)",
					"expect(container).toHaveNoA11yViolations({ profile: 'en301549-v4.1.1' });",
				]}
			/>

			<h3 id="choosing-a-wcag-target">WCAGの目標を選ぶ（<code>runOnly</code>）</h3>
			<p>
				第3引数はスキャンの
				<code>runOnly</code>
				で、そのままエンジンに渡されます。
				<code>runOnly.wcag</code>
				は適合性の目標で選択します。
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code>
				は、WCAG 2.2のレベルAとAAの達成基準のルールを、各達成基準がそのバージョンで持つレベルに従って実行します。
				<code>bestPractices: true</code>
				は、
				<code>region</code>
				や
				<code>heading-order</code>
				など、WCAGの達成基準を示さないルールを追加します。単独で使うとそれらのルールだけを実行し、
				<code>engineOptions.profile</code>
				と併用するとプロファイルのルールにそれらを追加します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 A and AA",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best practices",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				<code>runOnly</code>
				はルールのIDとタグ（
				<code>includeRuleIds</code>
				、
				<code>tags</code>
				、
				<code>excludeRuleIds</code>
				など）も受け取り、それらは目標のルールに追加されます。除外はその後に適用されます。何かを選択する
				<code>runOnly</code>
				は、
				<code>engineOptions.rules</code>
				／
				<code>.tags</code>
				での選択を完全に置き換えます。選択はどちらか一方の方法で指定し、両方を使わないでください。
				<code>runOnly</code>
				だけが必要な場合は、
				<code>engineOptions</code>
				として
				<code>{"{}"}</code>
				か
				<code>null</code>
				を渡してください。ルールIDは大文字小文字を区別しません（
				<code>'IMG-ALT-PRESENT'</code>
				）。
			</p>
			<p>
				目標を指定すれば、そのレベルも決まります。代わりにルールやタグを指定するテストでは、
				<code>engineOptions.wcagLevel</code>
				（
				<code>@surea11y/core</code>
				1.12.0以降）でレベルを設定できます。実行するルールを変えずに、スキャンが報告する達成基準のレベルを決めるものです。
				<code>contrast-computable</code>
				は1.4.3（AA）と1.4.6（AAA）をチェックするため、下のスキャンは1.4.3だけを報告します。アサーションは
				<code>fail</code>
				の判定結果で決まるので、これで変わるのは結果に含まれる達成基準であり、テストを失敗させるものではありません。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"expect(container).toHaveNoA11yViolations({ wcagLevel: 'AA' }, { includeRuleIds: ['contrast-computable'] });",
				]}
			/>

			<h2 id="packs">パックを使ったスキャン</h2>
			<p>
				<a href="/configuration/packs/">パック</a>
				は、ルール、規格、チェックリストと、それらのプロファイルやメッセージを、それ自身のパッケージとして提供します。マッチャーはNodeでスキャンするため、パックはオブジェクトそのものとして
				<code>engineOptions.packs</code>
				に渡し、そのプロファイルは
				<code>engineOptions.profile</code>
				で選びます。
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
					"",
					"// A pack's checklist profile, and the best practices",
					"expect(container).toHaveNoA11yViolations(policy, { bestPractices: true });",
				]}
			/>
			<p>
				パック自身のルールはコアのルールと同じように結果に現れ、そのIDはパックの名前空間で始まります（
				<code>acme-no-autoplay</code>
				）。パックのオブジェクトは1か所（セットアップファイルやモジュール）にまとめてください。コアはパックのオブジェクトのセットごとにエンジンを用意し、同じセットでの次のスキャンのために保持します。コアが実行できないパック（その
				<code>core</code>
				の範囲がインストールされているコアを含まない、妥当でない、名前空間がほかのパックと衝突する）は結果の
				<code>skippedPacks</code>
				に列挙され、パックのルールが一度も実行されないまま合格するのではなく、アサーションが失敗します。
			</p>

			<h2>API</h2>
			<DataTable
				label="マッチャーのパラメーター"
				rowKey="id"
				columns={[
					{ key: "param", label: "引数", width: "18%" },
					{ key: "type", label: "型", width: "26%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={apiRows}
			/>
			<p>
				2番目の引数には、代わりにすべてをまとめた1つのオブジェクト
				<code>{"{ engineOptions, runOnly, failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code>
				を渡すこともできます（
				<code>{"toHaveNoA11yViolations({ leanFail: true })"}</code>
				）。これらのキーはどれもエンジンのオプションではなく、いずれかのキーがあればこの形として読まれます。これらとエンジンのオプションが混ざったオブジェクトは
				<code>TypeError</code>
				を投げます。
			</p>
			<p>
				どちらのフレームワークの
				<code>expect.extend()</code>
				も期待する
				<code>{"{ pass, message }"}</code>
				の形を返します。これを直接呼ぶことはありません。上の「セットアップ」で示したとおり、
				<code>expect.extend()</code>
				で1度登録するだけです。このパッケージは、スイート全体の既定値を設定する
				<code>configureA11yMatchers(options)</code>
				、
				<a href="#web-components">Webコンポーネント</a>
				向けの
				<code>installInternalsHook(win?)</code>
				、
				<a href="#listener-and-live-region-hooks">クリックハンドラーとライブリージョン</a>
				向けの
				<code>installListenerHook(win?)</code>
				、
				<code>installLiveRegionHook(win?)</code>
				、
				<code>toHaveAnnounced()</code>
				マッチャーもエクスポートしています。
			</p>

			<h2>チェックすること、しないこと</h2>
			<p>
				<strong>アサーションを失敗させるのは失敗の検出結果だけです</strong>
				。これは、
				<code>cantTell</code>
				の結果は失敗ではなく参考情報とする、ほかのすべてのsurea11yバインディングの慣例に合わせています。各検出結果は、そのルールの判定結果ではなく、それ自身の判定結果で読まれます。ある要素で失敗したルールが別の要素について問いかけることがあり、その問いは失敗として数えられません。
				<code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code>
				のようなあいまいなリンクは
				<code>fail</code>
				ではなく
				<code>cantTell</code>
				なので、
				<code>leanFail</code>
				（
				<a href="#questions-that-likely-fail">後述</a>
				）で求めない限り、それだけで成功しているテストが壊れることはありません。ただし、ほかの理由でアサーションが
				<em>実際に</em>
				失敗した場合は、失敗のあとに問いが一覧になるので、見落とすことはありません。このエンジンがまったく自動化しないことについては
				<a href="/help/known-limitations/">既知の制限事項</a>
				を参照してください。
			</p>
			<p>
				<strong>求められたものをチェックできなかったスキャンも失敗します</strong>
				。何もないことで合格にはなりません。スキャンが実行されるドキュメントにない要素（切り離されたもの、または別のドキュメントのもの）、実行されなかったカスタムルール（
				<code>skippedCustomRules</code>
				に列挙されます）、実行されなかったパック（
				<code>skippedPacks</code>
				に列挙されます）が該当します。メッセージはそれぞれを理由とともに示します。テスト自身が除外したカスタムルールは抜け漏れではないので、テストは失敗しません。
			</p>
			<p>
				<strong>選択を指定しない呼び出しでは、ベストプラクティスのルールも実行されます</strong>
				。
				<code>@surea11y/core</code>
				1.12から、その1つである
				<code>empty-heading</code>
				は、アクセシブルな名前のない見出しについて、以前のように問いかけるのではなく不合格にします。そのため、
				<code>&lt;h2&gt;&lt;/h2&gt;</code>
				を描画するコンポーネント（テストでタイトルのpropが空になっていることがよくあります）は、オプションなしの呼び出しで失敗します。スクリーンリーダーは中身のない見出しとして読み上げるので、テストに実際の内容を与えるか、コンポーネントを修正してください。ベストプラクティスを含まないWCAGの目標を指定した呼び出しでは、このルールは実行されません。
			</p>
			<p>
				スキャン自体が例外を投げることもあり、その場合テストはエンジンのエラーで失敗します。エラーは
				<code>code</code>
				を持ちます。
				<code>INVALID_RUN_ONLY</code>
				（どの値もルールやタグを示さないルールやタグのリスト、または目標になっていない
				<code>runOnly.wcag</code>
				）、
				<code>INVALID_ENGINE_OPTIONS</code>
				（
				<code>strictOptions: true</code>
				のとき、エンジンが読まないオプションや使えない値）、
				<code>PAGE_BUILTINS_BROKEN</code>
				（テストやページ自身のコードが、エンジンが依存するJavaScriptの組み込みオブジェクトを壊した）のいずれかです。
			</p>
			<p>
				<strong>要素に範囲を絞ると、その内側のことだけが報告されます</strong>
				。ページのほかの場所にある問題で、1つの
				<code>container</code>
				に絞ったアサーションが失敗することはありません。内部的には、スキャン対象の要素に一時的に固有の属性を付け、そのセレクターでスキャンしています。テストからは見えません。
			</p>
			<p>
				<strong>いくつかのルールはページ全体についての事実をチェックします</strong>
				。特定のサブツリーの中身ではありません。
				<code>page-title-present</code>
				、
				<code>html-lang-attr-present</code>
				などは
				<code>document.title</code>
				／
				<code>document.documentElement</code>
				を直接チェックします。任意のコンポーネントの断片に対して、
				<em>ページ</em>
				にタイトルがあるかを問うのは意味がないからです。
				<code>Element</code>
				（<span lang="en">Testing Library</span>の
				<code>container</code>
				や
				<code>document.body</code>
				）を渡すと、これらは
				<code>fail</code>
				ではなく
				<code>notApplicable</code>
				と報告されるので、
				<code>&lt;title&gt;</code>
				がなくてもコンポーネント単位のテストが壊れることはありません。
				<code>document</code>
				そのものを渡すと、実際に評価されます。
				<code>document</code>
				を直接スキャンする場合は、テストごとではなくセットアップファイルで1度だけ
				<code>document.title</code>
				と
				<code>document.documentElement</code>
				の
				<code>lang</code>
				を設定してください。
			</p>

			<h2 id="failing-only-on-serious-problems">重大な問題でだけ失敗させる</h2>
			<p>
				ルールの結果にはそれぞれ重大度があります（
				<code>critical</code>
				、
				<code>serious</code>
				、
				<code>moderate</code>
				、
				<code>minor</code>
				）。ほかの問題は報告し続けながら、まず重大な問題でだけテストを失敗させるには、セットアップファイルで
				<code>configureA11yMatchers()</code>
				を使ってスイート全体のレベルを設定するか、1つのアサーションのオプションで設定します。オプションは既定値より優先されます（
				<code>failOnSeverity: null</code>
				でそのアサーションだけ無効にできます）。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const { toHaveNoA11yViolations, configureA11yMatchers } = require('@surea11y/test-matchers');",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"configureA11yMatchers({ failOnSeverity: 'serious' });",
					"",
					"// one assertion",
					"expect(container).toHaveNoA11yViolations({ failOnSeverity: 'critical' });",
				]}
			/>
			<p>
				レベル未満で失敗したルールはテストを失敗させませんが、テストが失敗した場合、メッセージはすべての失敗を一覧にし、レベル未満のものに印を付けます。
				<code>surea11y scan --fail-on-severity</code>
				と同じゲートです。何かを取りこぼしたスキャン（何にも一致しなかった範囲、実行されなかったカスタムルールやパック）は、レベルにかかわらずアサーションを失敗させます。
			</p>

			<h2 id="questions-that-likely-fail">不適合の可能性が高い問い</h2>
			<p>
				<code>cantTell</code>
				は人に向けた問いです。
				<code>@surea11y/core</code>
				1.14から、問いは傾くことがあります。ページの証拠が一方を示している場合、どちら（
				<code>fail</code>
				または
				<code>pass</code>
				）に傾くかとその理由を示し、coreのルールの各問いには答えるための手順（
				<code>howToCheck</code>
				）が含まれます。失敗メッセージは失敗のあとに問いを並べます。まず不適合の可能性が高いもの、次に適合の可能性が高いもの（それぞれ理由付き）、最後に未解決のものをルールごとに示します。
				<code>{"{ howToCheck: true }"}</code>
				を付けると、各問いを手順とともにすべて表示します。
			</p>
			<p>
				既定では、問いがテストを失敗させることはありません。
				<code>{"{ leanFail: true }"}</code>
				を付けると不適合の可能性が高い問いでもテストが失敗し、
				<code>wcagOnly: true</code>
				でベストプラクティスのルールのものを除けます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('the settings page has no failures or likely failures', () => {",
					"  const { container } = render(<Settings />); // an <h1>, then an <h3>",
					"  expect(container).toHaveNoA11yViolations(); // passes: heading-order is a question",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true }); // fails: it leans fail",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true, wcagOnly: true }); // passes: heading-order is a best practice",
					"});",
				]}
			/>
			<p>
				傾きは証拠であって証明ではなく、検出結果が傾くかどうか、どちらに傾くかはcoreのマイナーリリースで変わることがあるため、オプトインになっています。
				<code>{"configureA11yMatchers({ leanFail: true })"}</code>
				でスイート全体に適用できます。
			</p>

			<h2 id="web-components">Webコンポーネント</h2>
			<p>
				多くのWebコンポーネントは、
				<code>ElementInternals</code>
				をプライベートフィールドに保持し、それを通じて名前を付けたり、状態を設定したり、ロールを与えたりします。スクリプトからはそれを読み返せないため、既定ではスキャンはそうした要素を判定せずに問いかけます（
				<code>cantTell</code>
				）。テストは失敗しませんが、何もチェックされず、このように設定されたロールはまったく認識されません。
			</p>
			<p>
				<code>installInternalsHook(win?)</code>
				を使うと、スキャンがそれを読めるようになります。すべての
				<code>attachInternals()</code>
				の呼び出しを捉えられるよう、コンポーネントが定義される前に、セットアップファイルで1度呼び出してください。
				<code>win</code>
				の既定値はグローバルの
				<code>window</code>
				です。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"const {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} from '@surea11y/test-matchers';",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<p>
				これにより、
				<code>ElementInternals</code>
				で名前を付けるコンポーネントは合格し、それを取り付けても名前を設定しないコンポーネントは名前のないコントロールと同じく失敗し、それを通じてだけ
				<code>switch</code>
				になるコンポーネントはスイッチとしてチェックされます。フックがあったかどうかは、スキャン結果の
				<code>engine.environment.internalsHook</code>
				でわかります。フックはテスト用ウィンドウの
				<code>HTMLElement.prototype.attachInternals</code>
				をラップします。テストでは無害ですが、オプトインになっているのはこのためです。制限が1つあります。
				<code>jest-environment-jsdom</code>
				30に含まれるjsdom 26では、
				<code>ElementInternals</code>
				にARIAプロパティを設定するコンポーネントは、フックの有無にかかわらず例外を投げます（jsdom 29を使うVitestでは問題ありません）。
				<code>@surea11y/core</code>
				1.14からはVitestでもフックが
				<code>'early'</code>
				として記録されるので、
				<code>ElementInternals</code>
				を一度も取り付けていないコンポーネントも、そこで問いかけになることはなくなりました。詳しくは
				<a href="https://github.com/SureA11y/test-matchers#web-components-names-set-through-elementinternals">
					パッケージのREADME
				</a>
				を参照してください。
			</p>

			<h2 id="listener-and-live-region-hooks">クリックハンドラーとライブリージョン</h2>
			<p>
				<code>@surea11y/core</code>
				1.14からのオプトインのフックがさらに2つあり、同じようにセットアップファイルで、自分のコードが実行される前にインストールします。
				<code>installListenerHook()</code>
				は、それ以降に追加されるクリック、キー、フォーカス、マウスのリスナーを記録し、キーボードのルールがそれを判定できるようにします。
				<code>click</code>
				だけを待ち受ける
				<code>&lt;div role="button"&gt;</code>
				は失敗し（
				<code>CLICK_HANDLER_NO_KEY_LISTENER</code>
				）、
				<code>keydown</code>
				も待ち受ければ合格します。
				<code>installLiveRegionHook()</code>
				は、ページのライブリージョンに何が与えられたかを記録します。スキャンはテキストが入った状態で追加された、スクリーンリーダーが読み上げないことの多いリージョンについて確認を求め、
				<code>toHaveAnnounced()</code>
				は操作の結果がユーザーに伝えられたかを確かめます。必要なものだけをインストールしてください。それぞれ独立しています。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const {",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced,",
					"  installInternalsHook,",
					"  installListenerHook,",
					"  installLiveRegionHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"installListenerHook();",
					"installLiveRegionHook();",
					"expect.extend({",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"test('saving says so', async () => {",
					"  const user = userEvent.setup();",
					"  const { container } = render(<SaveBar />);",
					"  await user.click(screen.getByRole('button', { name: 'Save' }));",
					"",
					"  expect(container).toHaveAnnounced('Saved');",
					"  expect(window).not.toHaveAnnounced(/error/i);",
					"});",
				]}
			/>
			<p>
				文字列はテキスト全体と一致する必要があり、正規表現は一部と一致すれば十分です。要素に対しては、その要素自身かその中にあるライブリージョンだけが対象です。
				<code>window</code>
				や
				<code>document</code>
				に対しては、フックをインストールしてからのすべての読み上げが対象です。これはページが読み上げ用に提供した内容で、スクリーンリーダーが実際に読み上げた内容ではありません。フックがなければ
				<code>toHaveAnnounced()</code>
				は例外を投げます。知っておくべきことが2つあります。Reactはリスナーを各要素ではなく描画先のルートに追加するので、Reactのコンポーネントでは、スキャンはルートのリスナーを見て、フックがない場合と同じくボタンをマークアップで判定します。また、ライブリージョンフックは変更をまとめて読むので、実際のユーザーと同じように、描画してから操作し、その間に
				<code>await</code>
				を挟んでください（
				<code>await user.click()</code>
				）。詳しくは
				<a href="https://github.com/SureA11y/test-matchers#click-handlers-added-from-script-the-listener-hook">
					パッケージのREADME
				</a>
				を参照してください。
			</p>

			<h2>失敗メッセージ</h2>
			<p>
				ルールごとではなく、失敗した出現箇所をすべて一覧にします（1つのルールが複数の要素を指摘することがあります）。ルールID、重大度、読みやすい要約、失敗した要素のセレクター、あれば修正のヒントを示します。バグ報告に引用できるよう、結果を生成した
				<code>@surea11y/core</code>
				のリリースを示し、そのあとに、失敗として数えない問いを一覧にします。画像の隣で見出しレベルが飛んでいる場合は次のとおりです。
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): This <img> has no alt attribute.",
					"   at body > main > img",
					"   Add an alt attribute that says what the image shows, or alt=\"\" if the image is purely decorative.",
					"",
					"Scanned with @surea11y/core 1.14.1.",
					"",
					"2 findings need manual review (cantTell, not counted as failures):",
					"",
					"1) heading-order (minor, likely fails): This heading jumps from level 1 to level 3, skipping a level.",
					"   at body > main > h3",
					"   Go down one level at a time, so an <h2> is followed by an <h3> rather than an <h4>, and the outline of the page stays easy to follow.",
					"   Why it likely fails: The heading skips a level after the one before it.",
					"",
					"Open questions, which only a person can answer: manual-review.",
				]}
			/>
			<p>
				バージョンの行の前に、スキャンがどのように実行されたかの注記が入ることがあります。
				<a href="#web-components">internalsフック</a>
				があれば読めたカスタム要素についてスキャンが問いかけた場合や、
				<a href="#listener-and-live-region-hooks">リスナーフックやライブリージョンフック</a>
				なら判断できた検出結果を判定した場合に、その件数とフックのインストールを促す行が入ります。
				<code>{"{ leanFail: true }"}</code>
				を付けると、不適合の可能性が高い問いは失敗の側に移り、見出しの行は両方を数えます（
				<code>found 1 failure and 1 likely failure:</code>
				）。
			</p>
			<p>実行されなかったパックは、理由とともに示されます。</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but the scan left out what it was asked to check:",
					"",
					"No accessibility violations found in what was scanned.",
					"",
					"Pack \"@acme/a11y-policy\" did not run: it supports core ^2.0.0, and this is core 1.14.0.",
					"",
					"Scanned with @surea11y/core 1.14.1.",
				]}
			/>

			<p>
				両フレームワークの実行可能な例を並べて用意しています：
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>
				、
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
					Vitest
				</a>
				、パックを使った同じ例：
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.test.js">Jest</a>
				、
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.vitest.test.js">
					Vitest
				</a>
				、リスナーフックとライブリージョンフック、
				<code>toHaveAnnounced()</code>
				、
				<code>leanFail</code>
				で小さなコンポーネントをチェックする例：
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.test.js">Jest</a>
				、
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.vitest.test.js">
					Vitest
				</a>
				。
				<code>engineOptions</code>
				の全体（ロケール、コントラストのモード、Shadow DOM、カスタムルール、WCAGバージョンのタグの組み合わせ）については
				<a href={`${core}/docs/ENGINE_OPTIONS.md`}><code>ENGINE_OPTIONS.md</code></a>
				を参照してください。このパッケージは、そのリファレンスを重複して持つのではなく、渡されたものをそのまま転送します。
			</p>
		</>
	);
}
