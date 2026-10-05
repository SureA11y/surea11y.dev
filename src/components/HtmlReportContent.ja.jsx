import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

export function HtmlReportContent() {
	return (
		<>
			<p>
				スキャン後にブラウザーで開ける、単体で完結したHTMLレポートです。サーバーも外部アセットもネットワークリクエストも要りません。生のJSONやターミナルの概要ではなく、スキャン結果を閲覧できる形で見たいQA担当者や手動テストの担当者向けに作っています。
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --html report.html", command: true }]} />
			<p>
				<code>report.html</code>
				はディスクから直接開いてください。ほかのどの出力モードとも併用できます。
				<code>--html</code>
				は
				<code>--json</code>
				やデフォルトの概要表示を置き換えるものではなく、指定したパスに書き出される追加の成果物です。
			</p>

			<h2>表示される内容</h2>
			<ul>
				<li>
					<strong>ヒーロー</strong>
					：「<span lang="en">N of M applicable checks passed</span>」のような平易な言葉の見出し1つと、判定結果（
					<code>fail</code>
					/
					<code>cantTell</code>
					/
					<code>pass</code>
					/
					<code>notApplicable</code>
					）ごとの内訳を示す積み上げ棒グラフと凡例（アイコン＋ラベル＋件数。状態を色だけで示すことはありません）。
				</li>
				<li>
					<strong>確認が必要な項目</strong>
					：
					<code>fail</code>
					/
					<code>cantTell</code>
					の検出箇所があるルールごとに1枚のカード（検出箇所ごとではありません。同じ検出箇所がたくさんあるルールは、注意すべき事柄として1つであり、多数ではないからです）。各カードには重大度、WCAG達成基準のチップ、代表的な検出箇所、検出箇所の総数を表示します。表示するのは優先度の高い上位24件のルールまでで、それを超える分は注記で示します。
				</li>
				<li>
					<strong>限界に最も近いもの</strong>
					：スキャンにmarginがある場合（
					<a href="/results-reports/output-schema/#margin">チェック結果の<code>margin</code></a>
					）に表示されます。しきい値に対して計測するルールごとに1行で、合格した中で最も近い値、限界値、残りの余裕、要素を示します。ピクセルは整数に丸め、1未満は「1 px未満」と表示します。比は小数点以下2桁で表示します。わずかな余裕で合格したルールは、小さな変更で不合格に変わりうるルールです。
				</li>
				<li>
					<strong>WCAG集約</strong>
					：適合レベル（A / AA / AAA）ごとにまとめたもので、エンジン自身の
					<code>rulesResults[]</code>
					の複合集約をそのまま使っています（
					<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>
					を参照）。達成基準ごとに1行で（その達成基準を再掲するEN 301 549の条項があり、スキャンがEN 301 549の条項を要求した場合はその条項も）、その判定結果、合格/不合格/要レビュー/該当なしの内訳、寄与したアトミックルールを表示します。独自に作ったグループ分けではなく、実際のエンジンのデータです。生のJSONの
					<code>rulesResults</code>
					から得られるものと同じ集約です。
				</li>
				<li>
					<strong>規格独自の集約</strong>
					：独自の集約を持つ規格のルールをスキャンで実行した場合（その規格のプロファイル、または
					<code>engineOptions.optInRules</code>
					）だけ表示され、集約ごとに1行で、規格の文言、内訳、寄与したルールを示します。
				</li>
				<li>
					<strong>技術データの全体</strong>
					（デフォルトでは折りたたみ）：スコアカード（判定結果ごとのタイル）と、スキャン全体の個々の検出箇所をすべて載せた、検索・フィルター（判定結果別）・ページ送りが可能な表。
				</li>
			</ul>
			<p>
				ヘッダーの下のメタ情報バーには、ルール数、検出箇所の数、エンジンのタグ、スキーマのバージョン、スキャンが対象としたWCAGのバージョン、使用した
				<code>engineOptions.profile</code>
				（ある場合）、
				<code>engineOptions.optInRules</code>
				が追加したオプトインルールのタグ（追加した場合）、ページがレンダリングされた条件、スキャンで解決されたロケールが表示されます。条件とは、ビューポート（デバイスピクセル比が1でない場合はその値も）とカラースキーム、そしてWebフォントがまだ読み込み中だった場合はそのことです。jsdomでのスキャンのようにレイアウトがない場合は、代わりにそのことが表示されます。レイアウトに依存する検出結果はビューポートの幅によって出たり消えたりするため、レポートがどの幅を表しているかをチップで示します。ロケールのフォールバックは文字列単位で行われ、テキスト自体からは見分けがつきません。そのため、
				<strong>エンジンが持っていない言語で要求したレポートは、ふつうの英語のレポートとして表示されます</strong>
				。要求したロケールと解決されたロケールが異なる場合は、チップに両方が表示されます。
				<a href="/configuration/locales/">ロケール</a>
				を参照してください。
			</p>
			<p>
				ページ全体が、スキャンで解決されたロケールで書かれます。見出し、表の列、判定結果と重大度の名前、見出し文、ページ送り、日付の形式です。
				<code>&lt;html lang&gt;</code>
				はそのロケールを示します。検出箇所のフィルターにある判定結果のコード（
				<code>fail</code>
				、
				<code>cantTell</code>
				など）はそのままです。JSONの結果で検索するときの値だからです。
			</p>
			<p>
				英語のラベルのままになるケースが1つあります。エンジンが同梱していない言語で、呼び出し側が用意した
				<code>engineOptions.messages</code>
				の辞書を使ってスキャンした場合です。その辞書は結果に含まれないため、レポートはそこからラベルを読めません。その場合、検出結果にはそれぞれの言語（例：
				<code>lang="nl"</code>
				）が付くので、スクリーンリーダーは正しい音声で読み上げます。
			</p>

			<h2>ライブラリーとしての使い方</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderHtmlReport } = require('@surea11y/core/report');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, {}, null);",
					"const html = renderHtmlReport(result, { title: 'My scan report' });",
					"",
					"require('fs').writeFileSync('report.html', html);",
				]}
			/>
			<p>
				<code>renderHtmlReport(result, options)</code>
				は文字列を返します。
				<strong>関数自体がファイルシステムに触れることはありません</strong>
				（書き込みはCLIの
				<code>--html</code>
				フラグが行います）。ページの日付は結果の
				<code>timestamp</code>
				（
				<code>engineOptions.timestamp</code>
				で設定します）をUTCで表示したものなので、同じ結果からは常に同じページが生成されます。timestampのない結果では、レンダリングした時刻が日付になります。
				<code>options.title</code>
				は省略可能です（デフォルトは
				<code>"surea11y scan report"</code>
				）。
			</p>

			<h2>対象範囲</h2>
			<p>
				<strong>これは1回のスキャンのレポートです。ある時点のスナップショットであり、多数のスキャンの結果を時系列で追跡するダッシュボードではありません。</strong>
				複数回の実行にわたる結果の追跡は別の、より大きな課題であり、このツールには含まれていません。各スキャンのJSONを保存して自分で差分を取るか、履歴機能をすでに備えたダッシュボードにSARIFを渡してください（
				<a href="/results-reports/sarif-report/">SARIFレポート</a>
				を参照）。
			</p>
		</>
	);
}
