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
				ためだけにあり、別のAPIを追加するものではありません。
			</p>
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
				の<span lang="en">Pattern 1</span>/<span lang="en">Pattern 2</span>にあたります。実際のブラウザーなしでNode上のjsdomを使う方法と、バインディングを経由せずにPuppeteer/Playwrightを自分で操作する方法です。
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
				とともに、まだ完了していなかったものを示します。
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
		</>
	);
}
