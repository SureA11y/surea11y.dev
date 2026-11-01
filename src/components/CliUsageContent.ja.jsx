import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const cliDocs = "https://github.com/SureA11y/cli/blob/main/docs/CLI.md";

export function CliUsageContent() {
	return (
		<>
			<p>
				コードの代わりにコマンドで実行します。テストフレームワークもNodeスクリプトも不要なので、パイプラインの1ステップや、ビルド成果物の簡単なチェックに向いています。
			</p>

			<h2>最初のスキャン</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --wcag 2.2", command: true },
				]}
			/>
			<p>
				Node.js
				<code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>
				が必要です。概要には、スキャンを実行した
				<code>@surea11y/core</code>
				のリリースが示されます。
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.14.2",
					"  pass: 16   fail: 4   cantTell: 4   notApplicable: 121",
					"",
					"  occurrences by tier: fail: 4   cantTell: 4",
					"  needs review: likely fail: 1   likely pass: 0   needs a person: 3",
					"",
					"FAIL (4 rule(s)):",
					"",
					"  button-name-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > button",
					"      This button has no accessible name.",
					"      hint: Give the button visible text, or name it with aria-label, so screen",
					"      reader users know what it does.",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 7:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 7:1.",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 16px, font weight: normal). Expected",
					"      contrast ratio of 4.5:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 4.5:1.",
					"",
					"  img-alt-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > img",
					"      This <img> has no alt attribute.",
					"      hint: Add an alt attribute that says what the image shows, or alt=\"\" if",
					"      the image is purely decorative.",
					"",
					"LIKELY FAIL — confirm (1 occurrence(s)):",
					"  - heading-order (minor): html > body > main > h3",
					"    This heading jumps from level 1 to level 3, skipping a level.",
					"    why: The heading skips a level after the one before it.",
					"",
					"cantTell — needs human review (4 rule(s)): heading-order, link-name-quality,",
					"manual-review, page-title-patterns",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.1.1 Non-text content: text alternatives; 1.4.3 Contrast: minimum;",
					"             1.4.6 Contrast: enhanced; 4.1.2 Name, role, value: accessible name",
					"  cantTell   1.2.1 Audio-only and video-only (prerecorded): transcript; 1.2.2",
					"             Captions (Prerecorded); 1.3.1 Info and Relationships; 1.3.4",
					"             Orientation; 1.3.5 Identify Input Purpose; 1.4.1 Use of Color;",
					"             1.4.2 Audio Control; 1.4.4 Resize Text; 1.4.5 Images of Text;",
					"             1.4.12 Text Spacing; 2.1.1 Keyboard; 2.1.3 Keyboard (No Exception);",
					"             2.2.1 Timing Adjustable; 2.2.2 Pause, Stop, Hide; 2.2.4",
					"             Interruptions; 2.4.1 Bypass Blocks; 2.4.2 Page titled; 2.4.3 Focus",
					"             order; 2.4.4 Link Purpose (In Context); 2.4.6 Headings and Labels;",
					"             2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only); 2.5.8 Target",
					"             size: minimum; 3.1.1 Language of page; 3.1.2 Language of Parts;",
					"             3.2.5 Change on Request; 3.3.1 Error Identification; 3.3.2 Labels",
					"             or Instructions; 3.3.8 Accessible Authentication (Minimum); 4.1.2",
					"             Name, role, value: ARIA validity; 4.1.3 Status Messages",
					"  notApplicable: 2",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
				]}
			/>
			<p>
				<code>needs review</code>
				の行は、確認する人がその問いをどう扱うかで問いを分類します。
				<em lang="en">likely fail</em>
				（この例の見出しレベルの飛びのように、ページの証拠が失敗を示しているもの）、
				<em lang="en">likely pass</em>
				、
				<em lang="en">needs a person</em>
				の3つです。不適合の可能性が高いものは、そちらに傾いている理由とともに一覧になり、
				<code>--json</code>
				とレポートの各問いには、答えるための手順（
				<code>howToCheck</code>
				）が含まれます。
			</p>
			<p>
				<code>criteria</code>
				のブロックは、同じスキャンをWCAGの達成基準ごとに読み直したものです。「1.4.3で不合格か」という、よくある問い方に合わせています。
				<code>fail</code>
				、
				<code>cantTell</code>
				の順に並び、
				<code>notApplicable</code>
				は件数だけを示します。
				<code>@surea11y/core</code>
				1.14からは、
				<code>pass</code>
				として示される達成基準はありません。達成基準が合格になるのは、そのルールが基準の求めることをすべてチェックする場合だけで、完全にチェックできるとされた基準はまだないため、ルールがすべて合格した基準も
				<code>cantTell</code>
				になり、残りを人が確認します。このブロックが終了コードを変えることはなく、
				<code>--compact</code>
				では件数だけを示します。失敗したルールがない場合、サマリーの最後に、それはページが適合しているという意味ではないことと、人がまだ確認することが示されます。
			</p>

			<h2 id="several-pages">複数のページ、またはサイトマップ</h2>
			<p>
				複数のページを指定するか、ファイルに一覧にする（1行に1つのパスかURL、
				<code>#</code>
				でコメント）か、サイトマップをスキャンの対象にします。
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html ./dist/pricing.html", command: true },
					{ text: "surea11y scan --urls pages.txt", command: true },
					{ text: "surea11y scan --sitemap https://example.com/sitemap.xml   # up to 50 pages; --max-pages to change it", command: true },
				]}
			/>
			<p>
				サマリーにはページごとのセクションがあり、最後の行で失敗のあったページを数えます。どれか1ページでも失敗すれば、実行全体が失敗します。
				<code>--json</code>
				は配列を出力し、
				<code>--sarif</code>
				と
				<code>--junit</code>
				はすべてのページをまとめた1つのファイルを書き出し、
				<code>--html</code>
				はページごとにレポートを書き出します（
				<code>report.html</code>
				、
				<code>report-2.html</code>
				…）。ベースラインは、既知の失敗がそれぞれどのページにあったかを記録します。サイトマップはURLでもローカルファイルでもよく、gzip圧縮されていてもかまいません。サイトマップインデックスは1階層下までたどります。スキャンできないページがあると、何かを書き出す前にそのページを示して、終了コード
				<code>2</code>
				で実行を止めます。
			</p>

			<h2 id="in-a-real-browser">実際のブラウザーで</h2>
			<p>
				既定では、CLIは静的なHTMLを読みます。JavaScriptで内容をレンダリングするページには、プロジェクトにPlaywrightをインストールして
				<code>--browser</code>
				を付けます。各ページがヘッドレスのChromiumで開かれ、スクリプトが実行され、スキャンはレンダリングされた内容を、レイアウトを測るルールのための実際のレイアウトとともに見ます。エンジンは同じ
				<code>@surea11y/core</code>
				で、レポート、ベースライン、パック、カスタムルールを含むすべてのオプションが使えます。
			</p>
			<CodeBlock
				lines={[
					{ text: "npm install --save-dev playwright", command: true },
					{ text: "npx playwright install chromium", command: true },
					{ text: "surea11y scan https://app.example.com/ https://app.example.com/settings --browser", command: true },
				]}
			/>
			<p>
				読み込み後にデータを取得するアプリでは、スキャンにそのデータを待たせることができます。また、スマートフォンの幅やダークモードで、あるいは複数の値のすべての組み合わせでスキャンできます。
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan https://app.example.com/orders --browser --wait-for \"#orders-table\"", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 320 --color-scheme dark", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 1280,320 --color-scheme light,dark", command: true },
				]}
			/>
			<p>
				<code>--wait-for</code>
				は最大30秒待ち（
				<code>--wait-timeout</code>
				で変更できます）、要素が表示されなければ終了コード
				<code>2</code>
				で実行を止めます。複数の幅やカラースキームを指定すると、ページを1回だけ読み込み、ページごとに1つの結果にスキャンをまとめます。各ルールの判定結果は最も悪いものになり、各検出結果は見つかった組み合わせとともに1回だけ示されます（
				<code>seen in:</code>
				）。
			</p>
			<p>
				各ページの読み込み前に、CLIはcoreのinternalsフックとリスナーフックをインストールします。そのため、スキャンはWebコンポーネントが
				<code>ElementInternals</code>
				で設定した名前と、スクリプトから追加されたクリックハンドラーも判定します。EnterキーやSpaceキーが届かない
				<code>role="button"</code>
				は失敗します。
				<code>--live-regions</code>
				はライブリージョンフックを追加し、テキストが入った状態で追加された、スクリーンリーダーが読み上げないことの多いステータスメッセージについて確認を求めます。
				<code>--no-hooks</code>
				は最初の2つのフックを使いません。サマリーには、各スキャンのビューポート、カラースキーム、フックが示されます。CLIはクリック、入力、ログインをしません。その後に初めて表示される内容には、いずれかのバインディングでブラウザーを操作してください。ページ内のフレームはまだスキャンしません。
			</p>

			<h2 id="choosing-what-runs">実行するものを選ぶ</h2>
			<p>
				<code>--wcag</code>
				は、WCAGの適合性の目標に対応するルールを、各達成基準がそのバージョンで持つレベルに従って選択します。
				<code>--wcag-level</code>
				はその目標のレベルを設定します（指定しなければ
				<code>AA</code>
				）。
				<code>--best-practices</code>
				は、
				<code>region</code>
				や
				<code>heading-order</code>
				など、WCAGの達成基準を検査しないルールを追加します。単独で使うと、それらのルールだけを実行します。
				<code>--profile</code>
				は、
				<code>en301549-v4.1.1</code>
				やパック独自のものなど、適合性プロファイルを実行します。
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --wcag 2.2                    # WCAG 2.2, Level A and AA", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.1 --wcag-level A     # WCAG 2.1, Level A", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.2 --best-practices   # and the best practices", command: true },
				]}
			/>
			<p>
				WCAG 2.2で削除された4.1.1「構文解析」は、
				<code>2.1</code>
				の目標には含まれ、
				<code>2.2</code>
				の目標には含まれません。
				<code>--rules</code>
				と
				<code>--tags</code>
				は目標のルールに追加され、
				<code>--exclude-rules</code>
				はその後に適用されます。
				<code>--profile</code>
				と併用すると、
				<code>--best-practices</code>
				はそのルールを追加し、プロファイルも引き続き適用されます。
				<code>--wcag</code>
				、
				<code>--rules</code>
				、
				<code>--tags</code>
				はプロファイルの代わりにルールを選ぶため、
				<code>--profile</code>
				をこれらのいずれかと併用すると終了コード
				<code>2</code>
				で終了します。これらは
				<code>runOnly.wcag</code>
				、
				<code>runOnly.bestPractices</code>
				、
				<code>engineOptions.profile</code>
				に対応します（
				<a href="/configuration/engine-options/#selecting-which-rules-run">エンジンオプション</a>
				を参照）。
			</p>

			<h2 id="naming-checks">チェックを自分で指定する</h2>
			<p>
				両方を指定すると、
				<code>--rules</code>
				と
				<code>--tags</code>
				は両方に一致するルールを実行します。「この領域に加えて、これらのチェックも」としたい場合は
				<code>--include-mode or</code>
				を指定します。どちらかに一致するルールを実行します。これを付けないと、下のスキャンはルールを1つも実行しません。
				<code>contrast-computable</code>
				には
				<code>forms</code>
				のタグがないためです。その場合、何もチェックせずに合格するのではなく、終了コード
				<code>2</code>
				で終了します。
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/form.html --tags forms --rules contrast-computable --include-mode or", command: true },
				]}
			/>
			<p>
				チェックを指定したスキャンは、それらのチェックが属するWCAGの達成基準を、すべてのレベルで報告します。
				<code>contrast-computable</code>
				は1.4.3（AA）と1.4.6（AAA）をチェックするため、AAを満たすサイトでも、目指していないAAAの達成基準が不合格として表示されることがあります。
				<code>--wcag</code>
				を付けない場合、
				<code>--wcag-level</code>
				は、実行するルールを変えずに、報告する達成基準のレベルを設定します。
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html --rules contrast-computable --wcag-level AA",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.14.2",
					"  WCAG level reported: AA",
					"  pass: 1   fail: 0   cantTell: 0   notApplicable: 0",
					"",
					"  occurrences by tier: fail: 0   cantTell: 0",
					"",
					"criteria (WCAG 2.2 AA):",
					"  cantTell   1.4.3 Contrast: minimum (partly checked: 1 of 2 checks not selected)",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
					"",
					"No rule failed, which is not a claim that the page conforms: the automated rules",
					"found nothing definite. A person still checks the cantTell findings, keyboard",
					"use, how a screen reader reads the page, and the content itself.",
				]}
			/>
			<p>
				1.4.3は
				<em>一部だけチェック済み</em>
				です。もう1つのチェックである
				<code>contrast-minimum</code>
				が選ばれていないため、その判定結果は実行されたチェックだけに基づきます。また、失敗したルールがないため、サマリーの最後に、それはページが適合しているという意味ではないことが示されます。ルールIDとレベルは大文字小文字を区別しません（
				<code>--rules IMG-ALT-PRESENT</code>
				、
				<code>--wcag-level aa</code>
				）。
				<code>--include-mode</code>
				は
				<code>engineOptions.includeMode</code>
				に、
				<code>--wcag</code>
				なしの
				<code>--wcag-level</code>
				は
				<code>engineOptions.wcagLevel</code>
				に対応します。
			</p>

			<h2 id="packs">パック</h2>
			<p>
				<code>--pack</code>
				は、
				<a href="/configuration/packs/">パック</a>
				（ルール、規格、チェックリストと、それらのプロファイル）を、作業ディレクトリのプロジェクトから解決されるパッケージ名か、パスで読み込みます。
				<code>--profile</code>
				はそのプロファイルの1つを実行します。複数のパックでスキャンするには
				<code>--pack</code>
				を繰り返します。
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				概要には、実行されたプロファイルとパックが示され、
				<code>--json</code>
				ではそれらが
				<code>engine.profile</code>
				と
				<code>engine.packs</code>
				に入ります。見つからない、読み込めない、またはエンジンがスキップしたパックは、レポートを書き出さずに終了コード
				<code>2</code>
				で終了します。そのため、パックのチェックが実行されないままスキャンが合格することはありません。
			</p>

			<h2 id="failing-only-on-serious-problems">重大な問題でだけ失敗させる</h2>
			<p>
				<code>--fail-on-severity</code>
				（
				<code>critical</code>
				、
				<code>serious</code>
				、
				<code>moderate</code>
				、
				<code>minor</code>
				）を付けると、その重大度以上で失敗したルールがある場合にだけ実行が失敗します。
				<code>--baseline</code>
				と組み合わせると、新しいものだけが対象です。失敗はすべて引き続き報告され、サマリーではそのレベル未満のものに印が付きます。これで、まず重大な問題でブロックし、未対応の問題が減るにつれてゲートを厳しくしていけます。
			</p>
			<CodeBlock lines={[{ text: "surea11y scan --urls pages.txt --fail-on-severity serious", command: true }]} />

			<h2 id="questions-that-likely-fail">不適合の可能性が高い問い</h2>
			<p>
				<code>--fail-on-lean</code>
				を付けると、不適合の可能性が高い問い（coreの
				<code>leaningFailures()</code>
				）でも実行が失敗します。
				<code>--fail-on-severity</code>
				を指定した場合は、そのレベル以上のものだけが対象です。
				<code>--lean-fail-wcag-only</code>
				は、WCAGの達成基準に対応付けられたルールのものだけを数え、ベストプラクティスを除きます。このオプションを付けると、
				<code>--junit</code>
				はそのようなルールを失敗したテストとして、
				<code>--sarif</code>
				はそのような検出結果を
				<code>error</code>
				として報告し、
				<code>--write-baseline</code>
				は現在の不適合の可能性が高いものも記録するので、
				<code>--baseline</code>
				は新しいものだけでブロックします。傾きは証拠であって証明ではなく、検出結果が傾くかどうか、どちらに傾くかはcoreのマイナーリリースで変わることがあるため、オプトインになっています。
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --lean-fail-wcag-only", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --write-baseline baseline.json   # once, commit it", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --baseline baseline.json         # in CI, from then on", command: true },
				]}
			/>

			<h2 id="compact-results">コンパクトな結果</h2>
			<p>
				<code>--compact</code>
				は、
				<code>pass</code>
				と
				<code>notApplicable</code>
				の各結果を、ルール、判定結果、種類だけにします（
				<code>engineOptions.output.detail: 'findings'</code>
				）。CIのアーティファクトとして結果を保存するための、より小さな
				<code>--json</code>
				です。概要、終了コード、ベースライン、HTML・SARIF・JUnitのレポートは、付けない場合と同じです。
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --compact --json > result.json", command: true }]} />

			<h2>終了コードと制限事項</h2>
			<p>
				<code>--fail-on-lean</code>
				を付けない限り、
				<code>cantTell</code>
				は終了コードに影響しません。
				<code>0</code>
				は失敗となる判定結果なし、
				<code>1</code>
				はいずれかのページに
				<code>fail</code>
				が1件以上ある場合（
				<code>--baseline</code>
				を付けてスキャンした場合は、
				<em>新しい</em>
				<code>fail</code>
				が1件以上ある場合。CIゲートで使うケースです。
				<code>--fail-on-severity</code>
				はそのレベル以上のものだけを数えます。何が「既知」で何が「新規」とみなされるかは
				<a href="/conformance/baseline/">ベースライン／許可リスト</a>
				を参照）、
				<code>2</code>
				は使い方の誤りまたはスキャンのエラー、あるいは何もチェックしないか、求められたより少なくしかチェックしないスキャンです。既知のルールやタグを1つも示さない
				<code>--rules</code>
				／
				<code>--tags</code>
				のリスト、何にも一致しない
				<code>--context</code>
				のセレクター、実行されなかったカスタムルールやパック、適用されなかった
				<code>--profile</code>
				がこれに当たります。core 1.13で書き出したベースラインは、1.14が原因ごとに分けた理由コードの検出結果にも引き続き一致します。
				<code>--migrate-baseline baseline.json</code>
				で新しいコードに書き直せます。
			</p>
			<p>
				<code>--browser</code>
				を付けない場合、CLIが読むのは
				<strong>静的なHTMLだけ</strong>
				です。ローカルファイルか、HTTP(S) GETで取得した生のレスポンスボディを読み、ページのJavaScriptは一切実行しません。どちらのモードもクリック、入力、ログインはしません。その後に初めて表示される内容には、いずれかのバインディングを使うか、自分で操作するブラウザーに対してエンジンを直接呼び出してください（GitHubにある連携ガイド
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
				の<span lang="en">Pattern 2</span>を参照）。
			</p>
			<p>
				フラグの完全なリファレンス、カスタムルールの契約、パック、CIのレシピは
				<a href={cliDocs}><code>docs/CLI.md</code></a>
				にあります。CIパイプラインのテンプレートについては
				<a href="/configuration/ci-integration/">CI連携</a>
				を参照してください。
			</p>
		</>
	);
}
