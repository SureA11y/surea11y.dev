import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function StandaloneUsageContent() {
	return (
		<>
			<h2>使いどころ</h2>
			<p>
				実際のブラウザーで開いているページの手動チェック、ブックマークレット、そのほか自動化ドライバーもビルド手順も使えない状況に向いています。
			</p>

			<h2>使い方</h2>
			<p>
				<code>@surea11y/core</code>
				はパッケージのルートに
				<code>surea11y.browser.js</code>
				を同梱しています。Nodeパッケージと同じルールのソースから生成したバンドルです。直接読み込むと、グローバル変数
				<code>a11ycore</code>
				が1つ定義されます。
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
					"  console.log(result.checksResults.filter((r) => r.outcome === 'fail'));",
					"</script>",
				]}
			/>
			<p>
				<code>a11ycore.runa11yCoreInPage</code>
				は、各バインディングが内部で呼び出しているのとまったく同じ関数です。このバンドルは、
				<code>require</code>
				やモジュールシステムなしで関数を
				<em>読み込む</em>
				ためだけにあり、別のAPIを追加するものではありません。引数もほかの場所と同じです。次の例は、1つの領域に絞り、WCAG 2.2のAとAAに限定し、ノイズの多い2つのウィジェットを除外したスキャンです。
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(",
					"    location.href,",
					"    '#main', // contextSelector: scan only this region",
					"    {",
					"      excludeSelectors: ['#cookie-banner', '.intercom-launcher'],",
					"      contrast: { mode: 'auditorAssist' } // trade some false-positive protection for more findings",
					"    },",
					"    { wcag: { version: '2.2', level: 'AA' } } // runOnly",
					"  );",
					"</script>",
				]}
			/>
			<p>
				<strong>バンドルに含まれるのは英語だけです。</strong>
				ほかのロケールはそれぞれ別ファイルとしてバンドルの横に同梱しています。バンドルの後に読み込むと、その言語が使えるようになります。
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					'<script src="node_modules/@surea11y/core/surea11y.i18n.de.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, { locale: 'de' }, null);",
					"</script>",
				]}
			/>
			<p>
				ファイルを読み込んでいないロケールを指定すると、エラーにはならず英語が返ります。
				<a href="/configuration/locales/">ロケール</a>
				を参照してください。
			</p>
			<p>
				バンドルはモジュールとしても読み込めます。
				<code>import a11ycore from '@surea11y/core/browser'</code>
				、
				<code>runa11yCoreInPage</code>
				の名前付きインポート、
				<code>require()</code>
				のどれでもそのAPIを得られ、グローバルも引き続き定義されます。
			</p>
			<p>
				<strong>バンドルから意図的に除外しているもの</strong>
				：
				<code>runa11yCoreAcrossFrames</code>
				／
				<code>a11yCoreEnableFrameResponder</code>
				（フレームをまたぐスキャンには、埋め込まれたフレーム側でもエンジンを読み込んでオプトインする必要があり、scriptタグを1つ置くだけの使い方には合いません）。必要な場合はnpmパッケージを直接使ってください。
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				を参照してください。
			</p>
			<p>
				バインディングを使わずに
				<code>require('@surea11y/core')</code>
				を直接呼び出すのが、もう1つのスタンドアロンな方法です。
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
				の<span lang="en">Pattern 1</span>/<span lang="en">Pattern 2</span>にあたります。実際のブラウザーなしでNode上のjsdomを使う方法と、バインディングを経由せずにPuppeteer/Playwrightを自分で操作する方法です。テストでは、
				<code>@surea11y/core/testing</code>
				の
				<code>runa11yCoreOnHtml(html, options)</code>
				が、ドキュメントを用意したうえでHTML文字列をjsdomでスキャンします。core 1.12からは、その
				<code>contentType</code>
				オプションで、SVGやXHTMLのドキュメントをその形式どおりに解析できます。
			</p>

			<h2 id="packs-in-a-page">ページ内でのパック</h2>
			<p>
				<a href="/configuration/packs/">パック</a>
				はNodeで用意されるため、スクリプトとしてページに届きます。
				<code>@surea11y/core/pack</code>
				の
				<code>packScript(packs)</code>
				は、パックを登録するスクリプトを返します。バンドルの後に（スキャンするすべてのフレームにも）読み込み、
				<code>engineOptions.packs</code>
				でパックを
				<code>name@version</code>
				の形で指定してください。あるいは、
				<code>buildBrowserBundle({"{ packs }"})</code>
				で、バンドルの後にパックを登録した1つのファイルとして配布することもできます。ルールのコードは関数としてスクリプトに書き込まれるため、コンテンツセキュリティポリシーが
				<code>eval</code>
				を禁止している環境でも動作します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node: write the script once, beside the bundle.",
					"const fs = require('node:fs');",
					"const { packScript } = require('@surea11y/core/pack');",
					"const acmePolicy = require('./acme-policy-pack');",
					"fs.writeFileSync('acme-pack.js', packScript([acmePolicy]));",
				]}
			/>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					'<script src="acme-pack.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {",
					"    packs: ['@acme/a11y-policy@1.0.0'],",
					"    profile: 'acme-web-2026'",
					"  }, null);",
					"</script>",
				]}
			/>
			<p>
				ページが実行するのは、1回の
				<code>packScript</code>
				の呼び出しが登録したとおりのパックのセットで、そのスクリプトを用意したときと同じコアで実行されます。スキャンに必要なパックはすべて1回の呼び出しに渡してください。指定されてもページが実行しないパックは、理由とともに
				<code>skippedPacks</code>
				に列挙されます。バインディングでは、
				<code>.withPacks()</code>
				がこれをすべて行います。
			</p>

			<h2 id="waiting-for-the-page">スキャン前にページの準備を待つ</h2>
			<p>
				スキャンは、その時点のページの状態を読み取ります。開いたばかりのページでは、Webフォントがまだ読み込み中だったり、画像が届いていなかったりするため、同じページでも1秒後にスキャンすると別の結果になることがあります。スキャンはこの状態を
				<code>engine.environment.fonts</code>
				と
				<code>.images</code>
				に記録します（
				<a href="/results-reports/output-schema/">出力スキーマ</a>
				を参照）。ただし、より良い方法は、ページが落ち着くまでスキャンしないことです。
			</p>
			<p>
				その待機を行うのが
				<code>waitForPageReady(options)</code>
				で、バンドルでは同じグローバルに用意されています。スキャンがこれを自動で呼ぶことはないので、スキャンの直前に呼び出してください。ウィンドウの
				<code>load</code>
				イベント、
				<code>document.fonts.ready</code>
				、読み込み中のすべての画像（
				<code>loading="lazy"</code>
				のものを除く）を、最大
				<code>timeoutMs</code>
				（デフォルトは
				<code>5000</code>
				）まで待ちます。rejectすることはありません。時間切れになってもresolveし、
				<code>ready: false</code>
				とともに、まだ完了していなかったものを示します。それでもスキャンするか、もっと待つか、やめるかは、あなたが決めることです。スキャンする場合は、未完了だったものを結果と一緒に残してください。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const ready = await a11ycore.waitForPageReady({ timeoutMs: 3000 });",
					"const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
				]}
			/>
			<p>
				自分で操作するドライバーからは、
				<code>runa11yCoreInPage</code>
				と同じ方法でページに送り込めます（
				<code>page.evaluate(waitForPageReady, {"{ timeoutMs: 5000 }"})</code>
				）。jsdomでは待つものがないため、すぐに
				<code>ready: true</code>
				でresolveします。そのほかのオプション（
				<code>quietMs</code>
				、
				<code>document</code>
				）と戻り値の詳細は、GitHub上の統合ガイド
				<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}><code>INTEGRATION.md</code></a>
				にあります。
			</p>

			<h2 id="a-time-limit-on-a-scan">スキャンの制限時間</h2>
			<p>
				スキャンはページ内で一度に実行され、いったん始まるとページ内のどれもそれを止められません。戻らないページのゲッターやルールは、そのタブを止めたままにします。スキャンを開始する側で時間を制限し、制限を過ぎたらそのタブを諦めてください。時間制限で止まるのは待機であり、ページ内で実行中のスクリプトではありません。60秒は通常のページにかかる時間をはるかに上回るので、引っかかるのは壊れたページだけです。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Playwright or Puppeteer: page.evaluate has no time limit of its own.",
					"async function scanWithin(page, ms, scan) {",
					"  let timer;",
					"  const late = new Promise((_, reject) => {",
					"    timer = setTimeout(() => reject(new Error(`the scan took longer than ${ms} ms`)), ms);",
					"  });",
					"  try {",
					"    return await Promise.race([scan(), late]);",
					"  } catch (err) {",
					"    // The tab may still be busy with the scan: close it, and use a new one.",
					"    await page.close().catch(() => {});",
					"    throw err;",
					"  } finally {",
					"    clearTimeout(timer);",
					"  }",
					"}",
					"",
					"const fs = require('node:fs');",
					"await page.evaluate(fs.readFileSync(require.resolve('@surea11y/core/browser'), 'utf8'));",
					"const result = await scanWithin(page, 60_000, () =>",
					"  page.evaluate(() => window.a11ycore.runa11yCoreInPage(location.href, null, {}, null))",
					");",
				]}
			/>
			<p>
				jsdomではスキャンがNode自身のスレッドで実行されるため、そこでのタイマーはスキャンが終わるまで発火できません。スキャンをワーカースレッドか子プロセスで実行し、制限を過ぎたらそれを終了してください。どちらの場合も、最後の手段はCIジョブ自体の制限時間です。
			</p>

			<h2 id="internals-hook">非公開のinternalsを持つWebコンポーネント</h2>
			<p>
				カスタム要素は、
				<code>ElementInternals</code>
				を通じて名前を付けたり、状態を設定したり、ロールを与えたりできます。多くのコンポーネントはそれをプライベートフィールドに保持しており、スクリプトからは読み返せません。そのためスキャンはそうした要素を判定せずに問いかけ（
				<code>cantTell</code>
				）、このように設定されたロールはまったく認識しません。
			</p>
			<p>
				<code>@surea11y/core</code>
				の
				<code>internalsHookScript()</code>
				（バンドルには含まれません）は、ページが取り付ける各要素のinternalsを記録するスクリプトを返し、スキャンがそれを読めるようにします。オプトインで、coreが自動でインストールすることはありません。スキャンするすべてのフレームで、ページ自身のスクリプトより前にインストールしてください。ドライバーの初期化スクリプト用APIを使うか、自分で作るページなら
				<code>&lt;head&gt;</code>
				の最初の
				<code>&lt;script&gt;</code>
				として置きます。jsdomのセットアップファイルは、ドキュメントの読み込み後、どのコンポーネントも定義される前に実行されるので、
				<code>{"{ early: true }"}</code>
				を渡してください。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { internalsHookScript } = require('@surea11y/core');",
					"",
					"// Playwright",
					"await page.addInitScript({ content: internalsHookScript() });",
					"",
					"// Puppeteer",
					"await page.evaluateOnNewDocument(internalsHookScript());",
					"",
					"// jest.setup.js or vitest.setup.js, before any component is imported",
					"window.eval(internalsHookScript({ early: true }));",
				]}
			/>
			<p>
				フックがあったかどうかは、結果の
				<code>engine.environment.internalsHook</code>
				でわかります。ページのスクリプトより前にインストールされた場合は
				<code>'early'</code>
				、後からインストールされ、それ以降にページが取り付けたものしか見ていない場合は
				<code>'late'</code>
				です。フックが記録したものはページ内のどのスクリプトからも読めるため、コンポーネントの非公開のinternalsは非公開でなくなります。テストや監査のための実行でだけインストールし、利用者に配信するページでは使わないでください。そのほかのインストール方法や、ページから何が見えるかは、
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
					<code>INTEGRATION.md</code>
				</a>
				にあります。
			</p>

			<h2 id="what-a-scan-covers">スキャンの対象を事前に知る</h2>
			<p>
				WCAGの達成基準ごとに報告し、利用者にチェックを選ばせるツールでは、スキャンの目標を指定できます。
				<code>wcagVersion</code>
				と並べて指定する
				<code>engineOptions.wcagLevel</code>
				は、実行するチェックを変えずに、そのレベルを超える達成基準を報告から外します。
				<code>getRulesForRunOnly(runOnly, engineOptions)</code>
				は、その選択でスキャンが報告する達成基準を、実行する前に、スキャン自身のロジックで一覧にします。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { getRulesForRunOnly, runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const engineOptions = { wcagVersion: '2.2', wcagLevel: 'AA' };",
					"const runOnly = { includeRuleIds: ['contrast-computable'] };",
					"",
					"getRulesForRunOnly(runOnly, engineOptions).map((r) => r.id); // before the scan",
					"const result = runDomRulesInPage(url, null, engineOptions, runOnly);",
				]}
			/>
			<p>
				チェックの一部しか実行されなかった達成基準は
				<code>cantTell</code>
				として返り、実行されなかった各チェックには
				<code>notSelected: true</code>
				が付きます。こうした達成基準は「一部だけチェック済み」として示し、合格とは決して表示しないでください。core上に自分のツール（CLI、CI連携、ダッシュボード、適合性レポートの生成ツールなど）を作る方法は、GitHubの
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}>
					<code>BUILDING_ON_CORE.md</code>
				</a>
				にあります。頼れる契約、スキャンの実行、チェックの選び方、結果を誠実に示す方法、実行結果の比較を扱っています。
			</p>
		</>
	);
}
