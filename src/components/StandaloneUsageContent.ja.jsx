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

			<h2 id="from-the-browser-console">ブラウザーのコンソールから</h2>
			<p>
				手作業でスキャンするために、バンドルにはいくつかの補助関数があります。ブラウザーのコンソール（開発者ツールのConsoleタブ）から開いているページにバンドルを読み込み、スキャン、検出結果の一覧表示、ページ上での枠表示、HTMLレポートの表示ができます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Pasted into the console of the page to check.",
					"const s = document.createElement('script');",
					"s.src = 'https://cdn.jsdelivr.net/npm/@surea11y/core/surea11y.browser.js';",
					"document.head.append(s);",
					"",
					"// Once it has loaded:",
					"a11ycore.version; // the engine's version",
					"const result = await a11ycore.run(); // scan the page",
					"a11ycore.table(result); // the findings, worst first",
					"a11ycore.highlight(result); // box each one on the page",
					"await a11ycore.openReport(result); // the HTML report, in a new tab",
					"await a11ycore.inspect('headings'); // what a person checks by hand",
				]}
			/>
			<p>
				<code>run(options)</code>
				はエンジンのオプションに加えて、独自の
				<code>context</code>
				（ページの一部だけをスキャンするセレクター）と
				<code>runOnly</code>
				を受け取り、スキャンの前に、ページ自身が読めないスタイルシートを取得します。
				<code>table()</code>
				は検出結果を1行ずつ表示します。まず失敗、次に不適合に傾いた問い、適合に傾いた問い、人だけが判断できる問いの順です。
				<code>highlight()</code>
				は、
				<code>fail</code>
				（赤の実線）や
				<code>cantTell</code>
				（琥珀色の破線）が示す各要素に枠を描きます。枠は専用のレイヤーに描かれ、ページの要素には手を加えません。
				<code>clearHighlights()</code>
				で消せます。
				<code>inspect()</code>
				は、ページを確認する人が手作業でチェックする内容を描くだけで、何も判定しません（
				<code>'headings'</code>
				、
				<code>'landmarks'</code>
				、
				<code>'names'</code>
				、
				<code>'focus-order'</code>
				）。
				<code>openReport()</code>
				は初回にバンドルの隣から
				<code>surea11y.report.js</code>
				を取得し、レポートには各問いの確認方法が示されます。ページのContent Security PolicyがCDNのスクリプトを遮断する場合は、ページ自身のオリジンからファイルを読み込むか、ドライバーでスキャンしてください。すべてのオプションは、GitHubにある連携ガイド
				<a href={`${core}/docs/INTEGRATION.md#from-the-browser-console`}>
					<code>INTEGRATION.md</code>
					のブラウザーのコンソールの節
				</a>
				にあります。
			</p>

			<h2 id="packs-in-a-page">ページ内でのパック</h2>
			<p>
				<a href="/configuration/packs/">パック</a>
				はNodeで用意されるため、スクリプトとしてページに届きます。スクリプトをファイルとして読み込むページ（
				<code>&lt;script&gt;</code>
				タグ、ブックマークレット、拡張機能）では、Nodeで1つのファイルを作ってください。
				<code>@surea11y/core/pack</code>
				の
				<code>buildBrowserBundle({"{ packs }"})</code>
				は、バンドルの後にパックを登録したファイルを作ります。そのうえで、
				<code>engineOptions.packs</code>
				でパックを
				<code>name@version</code>
				の形で指定してください。ルールのコードは関数としてスクリプトに書き込まれるため、コンテンツセキュリティポリシーが
				<code>eval</code>
				を禁止している環境でも動作します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node, once per release of core or of a pack.",
					"const fs = require('node:fs');",
					"const { buildBrowserBundle } = require('@surea11y/core/pack');",
					"const acmePolicy = require('./acme-policy-pack');",
					"fs.writeFileSync('surea11y-acme.js', buildBrowserBundle({ packs: [acmePolicy] }));",
				]}
			/>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y-acme.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {",
					"    packs: ['@acme/a11y-policy@1.0.0'],",
					"    profile: 'acme-web-2026'",
					"  }, null);",
					"</script>",
				]}
			/>
			<p>
				パックのスクリプトは、それを書き出したコアでしか動作しません。コアとパックが合わせて作るカタログを、Nodeで検証したうえで含んでいるためです。バンドルが別のバージョンのコアであるページは、パックなしでスキャンを実行し、各パックを2つのバージョンとともに
				<code>skippedPacks</code>
				に列挙します。1つのファイルに両方が入っていれば、ずれることはありません。コアやパックを更新したら作り直し、ページが指定する
				<code>name@version</code>
				も更新してください。
			</p>
			<p>
				コアのバンドルがすでにページにある場合は、同じコアで
				<code>packScript(packs)</code>
				をファイルに書き出し、バンドルの後に（スキャンするすべてのフレームにも）読み込んでください。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node, with the core whose bundle the page loads.",
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

			<h2 id="style-sheets-from-another-origin">別オリジンのスタイルシート</h2>
			<p>
				ページのスクリプトは、別オリジン（CDNやフォントサービス）から配信されたスタイルシートのルールを読めません。そのため、
				<code>css-orientation-lock</code>
				のようにCSSの中の何かを探すルールは、それがあるかどうかを判断できず、確認を求めます。
				<code>engineOptions.styleSheetTexts</code>
				（
				<code>{"[{ href, text }]"}</code>
				）でスキャンにそのテキストを渡すと、
				<code>css-orientation-lock</code>
				、
				<code>css-hidden-focus</code>
				、
				<code>css-focus-indicator-suppressed</code>
				がそれを読みます。バンドルでは、
				<code>runa11yCoreInPageAsync</code>
				が
				<code>runa11yCoreInPage</code>
				と同じ4つの引数を受け取り、サーバーが共有している（CORS）スタイルシートを
				<code>preloadStyleSheets()</code>
				で取得してからスキャンします。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await a11ycore.runa11yCoreInPageAsync(location.href, null, {}, null);",
				]}
			/>
			<p>
				サーバーが共有していないスタイルシートは、ページからはまったく読めません。ブラウザーを操作するツールなら、CORSが適用されないページの外から取得して、同じオプションで渡せます。バインディングはそうしています。
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

			<h2 id="listener-and-live-region-hooks">クリックハンドラーとライブリージョン</h2>
			<p>
				core 1.14から、オプトインのフックがさらに2つあり、internalsフックと同じように、ページ自身のスクリプトより前にインストールします。
				<code>listenerHookScript()</code>
				は、ページがスクリプトから追加するクリック、キー、フォーカス、マウス、貼り付けのリスナーを記録し、キーボードのルールがそれを判定できるようにします。クリックリスナーを持ち、そこからのキーイベントが届く先のどこにもキーリスナーがない
				<code>&lt;div role="button"&gt;</code>
				は失敗します（
				<code>CLICK_HANDLER_NO_KEY_LISTENER</code>
				）。
				<code>liveRegionHookScript()</code>
				は、ライブリージョンに何が与えられたかを記録します。すると
				<code>live-region-announcements</code>
				は、テキストが入った状態で追加されたリージョンや、表示と同時に中身が入ったリージョンなど、スクリーンリーダーが読み上げないことの多いものについて確認を求め、
				<code>getAnnouncements()</code>
				はページが読み上げ用に提供した内容を返します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { listenerHookScript, liveRegionHookScript, getAnnouncements } = require('@surea11y/core');",
					"",
					"// Playwright: before the page's own scripts",
					"await page.addInitScript({ content: listenerHookScript() });",
					"await page.addInitScript({ content: liveRegionHookScript() });",
					"await page.goto('https://example.com/settings');",
					"",
					"await page.click('text=Save');",
					"const said = await page.evaluate(getAnnouncements, { selectors: true });",
					"// [{ text: 'Saved', politeness: 'polite', time: 1234.5, order: 7, behindModal: false, selector: '#status' }]",
				]}
			/>
			<p>
				<code>engine.environment.listenerHook</code>
				と
				<code>.liveRegionHook</code>
				は、スキャンがフックを確認できたかを示します。リスナーがないことを示せるのは、ページのスクリプトより前にインストールされたリスナーフック（
				<code>'early'</code>
				）だけで、後からインストールした場合、ルールは確認を求めるだけです。バンドルでは
				<code>a11ycore.getAnnouncements()</code>
				がページ内で記録を読みます。internalsフックと同じく、どちらも記録した内容をページのどのスクリプトからも読める場所に保持するので、テストや監査の実行のためにインストールしてください。jsdomのセットアップファイルでは
				<code>{"{ early: true }"}</code>
				を渡し、リスナーフックの前にセレクターを1回実行してください（
				<code>document.querySelector('*')</code>
				）。jsdomは最初にセレクターを実行したときに独自のキーリスナーを追加するためです。jsdomで<code>showModal()</code>の代わりにダイアログに<code>open</code>と<code>aria-modal="true"</code>を設定するテストは、ライブリージョンフックを<code>{"{ early: true, assumeModal: true }"}</code>でインストールし、<code>engineOptions.assumeModal: true</code>でスキャンします（core 1.16.0以降）。
			</p>
			<p>
				<strong>Playwrightの<code>setContent()</code>はナビゲーションではありません。</strong>マークアップを、すでに読み込みを終えたページの現在の文書に書き込むので、その文書の読み込み中に初期化スクリプトが実行されることはありません。ページを開く前にコンテキストに追加したスクリプトは、ページの最初の空の文書で実行されます。<code>setContent()</code>がページを書き込むときにフックはありますが、<code>'late'</code>として記録され、早期のフックなら要素を不合格にしていたところで、<code>click-handler-keyboard-operable</code>は確認を求めます。すでに開いているページに追加したスクリプトは次の文書を待ちますが、<code>setContent()</code>は文書を作らないので、スキャンはフックなしで実行されます。早期に記録するには、実際のナビゲーションでページを読み込んでください。サーバーや<code>file://</code>のURLへの<code>page.goto()</code>、またはURLにマークアップで応答する<code>page.route()</code>です。internalsフックも同様です。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"await context.addInitScript({ content: listenerHookScript() });",
					"const page = await context.newPage();",
					"await page.route('https://test.local/', (route) =>",
					"  route.fulfill({ body: html, contentType: 'text/html' })",
					");",
					"await page.goto('https://test.local/'); // listenerHook: 'early'",
				]}
			/>
			<p>
				残りは、GitHubにある連携ガイド
				<code>INTEGRATION.md</code>
				の
				<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
					リスナーフック
				</a>
				と
				<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}>
					ライブリージョンフック
				</a>
				の節にあります。
			</p>

			<h2 id="questions-and-steps">問いの傾きと確認方法</h2>
			<p>
				core 1.14から、
				<code>cantTell</code>
				の出現箇所は
				<code>lean</code>
				を持つことがあります。ページの証拠がどちらを示しているか（
				<code>toward: 'fail'</code>
				または
				<code>'pass'</code>
				）、その理由、それが誤りになりうる点です。判定結果は
				<code>cantTell</code>
				のままです。coreのルールの各問いには、人が答えるための手順である
				<code>howToCheck</code>
				も、スキャンのロケールで含まれます。これはページ内のエンジンではなくNodeで追加されます。
				<code>runDomRulesInPage</code>
				は自動で追加し、ページから返ってきた結果には
				<code>addHowToCheck(result)</code>
				が手順を加えたコピーを返します。
				<code>leaningFailures(result)</code>
				は、独自のゲートのために、不適合に傾いた検出結果を一覧にします。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { runa11yCoreInPage, addHowToCheck, leaningFailures } = require('@surea11y/core');",
					"",
					"const raw = await page.evaluate(runa11yCoreInPage, page.url(), null, {}, null);",
					"const result = addHowToCheck(raw); // a copy, with each question's steps",
					"const likelyFailures = leaningFailures(result);",
				]}
			/>
			<p>
				検出結果が傾くかどうかとその文言はcoreのマイナーリリースで変わることがありますが、
				<code>lean</code>
				の形は安定しています。両方のフィールドについては
				<a href="/results-reports/output-schema/#leans">出力スキーマ</a>
				を参照してください。
			</p>

			<h2 id="procedures-in-a-browser">ブラウザーでのテスト手順</h2>
			<p>
				core 1.15以降、人が各達成基準を手作業で評価する方法である<a href="/conformance/procedures/">テスト手順</a>は、ブラウザーで動くコードからも<code>@surea11y/core/procedures</code>を通じて使えます。ファイルシステムを必要とせず、ルールにも一切触れないので、ブラウザー拡張機能や独自のページが、インポートした辞書を使ってテスト手順を表示したり、ワークシートを開いたりできます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"import { procedureChecklistFrom, renderProceduresFrom } from '@surea11y/core/procedures';",
					"import en from '@surea11y/core/procedures/en';",
					"import fr from '@surea11y/core/procedures/fr';",
					"",
					"const dictionaries = { en, fr };",
					"const checklist = procedureChecklistFrom(dictionaries, { levels: ['A', 'AA'], locale: 'fr' });",
					"const html = renderProceduresFrom(dictionaries, checklist);",
					"window.open(URL.createObjectURL(new Blob([html], { type: 'text/html' })));",
				]}
			/>

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
				が付きます。こうした達成基準は「一部だけチェック済み」として示し、合格とは決して表示しないでください。core 1.14からは、合格と報告される達成基準はそもそもありません。達成基準が合格になるのは、そのルールが基準の求めることをすべてチェックする場合だけで、完全にチェックできるとされた基準はまだないためです。core上に自分のツール（CLI、CI連携、ダッシュボード、適合性レポートの生成ツールなど）を作る方法は、GitHubの
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}>
					<code>BUILDING_ON_CORE.md</code>
				</a>
				にあります。頼れる契約、スキャンの実行、チェックの選び方、結果を誠実に示す方法、実行結果の比較を扱っています。
			</p>
		</>
	);
}
