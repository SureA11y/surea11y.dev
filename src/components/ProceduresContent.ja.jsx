import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const toolRows = [
	{ id: "keyboard", tool: <code>keyboard</code>, what: "キーボード" },
	{ id: "pointer", tool: <code>pointer</code>, what: "マウスなどのポインティングデバイス" },
	{ id: "screen-reader", tool: <code>screen-reader</code>, what: "スクリーンリーダー" },
	{ id: "zoom", tool: <code>zoom</code>, what: "ブラウザーのズーム" },
	{ id: "contrast-theme", tool: <code>contrast-theme</code>, what: "ハイコントラストテーマ（強制カラー）" },
	{ id: "devtools", tool: <code>devtools</code>, what: "ブラウザーの開発者ツール" },
];

const functionRows = [
	{ id: "proceduresFor", fn: <code>proceduresFor(requirement, options)</code>, what: <>1つの要件：WCAGの達成基準（<code>'1.4.12'</code>）、<code>'best-practice'</code>、またはパックの要件。</> },
	{ id: "listProcedures", fn: <code>listProcedures(options)</code>, what: "規格のすべての要件を、その順序で、それらを分けるグループ（WCAGの原則とガイドライン）とともに。" },
	{ id: "procedureChecklist", fn: <code>procedureChecklist(options)</code>, what: "規格を評価するために人が行うことを、それぞれ1回ずつ。一般的な手順ごとに1項目。" },
	{ id: "renderProcedures", fn: <code>renderProcedures(input, options)</code>, what: "上の3つのいずれかを、単体で完結したHTMLページ、またはMarkdownとして。" },
	{ id: "relatedRequirements", fn: <code>relatedRequirements(requirement, options)</code>, what: "WCAGとパックの規格の間で、ある達成基準を再掲する要件や関連する要件、およびその逆。" },
	{ id: "procedureLanguages", fn: <code>procedureLanguages(options)</code>, what: "言語の選択肢のために、規格のテスト手順を読める言語と、それぞれがすべてそろっているかどうか。" },
];

const listOptionRows = [
	{ id: "standard", option: <code>standard</code>, what: <><code>'wcag'</code>（デフォルト）、<code>'best-practice'</code>、またはキーか名前で指定するパックの規格。</> },
	{ id: "version", option: <code>version</code>, what: <>WCAGのバージョン（<code>'2.0'</code>、<code>'2.1'</code>、デフォルトの<code>'2.2'</code>）、またはパックの規格のバージョン。</> },
	{ id: "levels", option: <code>levels</code>, what: <>WCAGのみ：<code>'A'</code>、<code>'AA'</code>、<code>'AAA'</code>、またはそのリスト。デフォルトではすべてのレベル。</> },
	{ id: "locale", option: <code>locale</code>, what: <>タグ（<code>'fr-CA'</code>は<code>fr-ca</code>、次に<code>fr</code>を読みます）、または優先度の高い順のリスト。ロケールにないテキストは英語になります。</> },
	{ id: "tools", option: <code>tools</code>, what: <>手順がこれらのツールのいずれかを必要とするファセットだけ（<code>'screen-reader'</code>）。</> },
	{ id: "automation", option: <code>automation</code>, what: <>ルールが完全に、一部だけ、またはまったく判定しないファセットだけ。<code>['manual', 'partial']</code>は、スキャンが人に任せるものです。</> },
	{ id: "rules", option: <code>rules</code>, what: <>これらのルールのいずれかが対象とするファセットだけ（<code>'img-alt-present'</code>）。</> },
	{ id: "packs", option: <code>packs</code>, what: "規格やルールを読むパック。" },
	{ id: "profile", option: <code>profile</code>, what: <>法律を示すパックのプロファイル。その法律が求める要件だけを、一覧の見出しにその法律の名前を添えて返します（core 1.16.0、実験的。<a href="/configuration/packs/#laws">パック</a>を参照）。</> },
];

const renderOptionRows = [
	{ id: "format", option: <code>format</code>, what: <><code>'html'</code>（デフォルト）または<code>'markdown'</code>。</> },
	{ id: "locale", option: <code>locale</code>, what: "ページ自身の文言の言語。デフォルトは、テスト手順を読んだ言語です。" },
	{ id: "title", option: <code>title</code>, what: <>ページのタイトルと見出し。デフォルトは規格の名前を含むもの（「WCAG 2.2：手動チェックリスト」）。</> },
	{ id: "variants", option: <code>variants</code>, what: <><code>true</code>にすると、一覧の各ファセットの下に、スキャンの未判定の検出結果がそのファセットについて示す手順を、閉じた開閉部の中に加えます。</> },
	{ id: "record", option: <code>record</code>, what: <><code>false</code>にすると、チェックリストのページの結果欄とそのスクリプトを省きます。</> },
	{ id: "before", option: <code>before</code>, what: <><code>false</code>にすると、結果を信頼できるものにするための習慣である「始める前に」を省きます。</> },
	{ id: "fragment", option: <code>fragment</code>, what: <><code>true</code>にすると、文書、スタイル、スクリプトのない内容だけを返し、独自のページに入れられるようにします。</> },
	{ id: "packs", option: <code>packs</code>, what: "テスト手順を読むのに使ったパック。" },
];

export function ProceduresContent() {
	return (
		<>
			<p>
				スキャンが判定するのは、ルールが判定できるものです。評価の残りは人が行います。スキャンが未決のまま残す問い（<code>cantTell</code>）と、どのルールもまったくテストしない達成基準の部分です。<code>@surea11y/core</code> 1.15.0以降、コアはその部分のやり方も示します。ルールが評価するWCAGの各達成基準と、ベストプラクティスのすべてのファセットについての<strong>テスト手順</strong>で、手順、必要なツール、何が合格で何が不合格かを、英語、フランス語、ドイツ語、スペイン語、日本語で示します。検出結果の<a href="/results-reports/output-schema/#how-to-check">「確認方法」</a>もこれと同じ文章から作られているので、チームの手動のチェックとスキャンは同じ内容を読みます。
			</p>
			<p>
				スキャンをまったく使わない手動の監査に、スキャンが人に任せるものについてはスキャンと並べて、あるいはルールが何も見つけなかったものの全体はカバーしていない達成基準を説明するために使えます。検出結果の手順と同じく、テスト手順は助言であって検出結果の同一性の一部ではなく、文言はどのリリースでも改善されることがあります。
			</p>

			<h2 id="see-them">実際に見る</h2>
			<p>
				次の2つのページは、WCAG 2.2のレベルAとAAについてのコア自身の出力で、このサイトが追従するリリースごとに再生成しています。ディスクから開け、ほかの場所からは何も読み込みません。
			</p>
			<ul>
				<li>
					<a href="/procedures/wcag-22-aa.html">リファレンス</a>
					：WCAGの原則とガイドラインのもとで、すべての達成基準をファセットごとにどう評価するか。
				</li>
				<li>
					<a href="/procedures/wcag-22-aa-checklist.html">ワークシート</a>
					：各チェックを1回ずつ、記録する結果（<em>未確認</em>、<em>合格</em>、<em>不合格</em>、<em>該当なし</em>）とメモの欄とともに示します。記録はブラウザーに保存され、JSONまたはCSVでダウンロードできます。
				</li>
			</ul>
			<p>
				どちらのページも、jsdomとChromiumで、ライトモードとダークモードで、WCAG 2.2 AAのプロファイルにおいて、コア自身のルールを満たしています。スキップリンク、1レベルずつの見出し、ラベル付きの領域、本物のリストとフィールドセット、見えるフォーカス、色だけに頼らない表示、強制カラーのテーマへの追従、スマートフォンの幅、印刷できるレイアウトです。
			</p>

			<h2 id="what-a-procedure-is">テスト手順とは</h2>
			<p>
				達成基準には<strong>ファセット</strong>があります。人がその達成基準を評価するために確認するテストの目的です。ルールが判定するファセットは<code>full</code>、ルールが一部を判定するファセットは<code>partial</code>、人だけが判断できるファセットは<code>manual</code>です。ファセットには<strong>一般的な手順</strong>があります。人がページ全体に対して、ブラウザーとその開発者ツール、キーボード、必要な場合はスクリーンリーダーを使って行う手順、合格の場合と不合格の場合にそれぞれ何が見えるか（不合格となる達成基準の名前とともに）、そしてブラウザー以外に必要な<strong>ツール</strong>です。
			</p>
			<DataTable
				label="テスト手順が必要とすることがあるツール"
				rowKey="id"
				columns={[
					{ key: "tool", label: "ツール", width: "30%" },
					{ key: "what", label: "内容", wrap: true },
				]}
				rows={toolRows}
			/>
			<ul>
				<li>
					<strong>技術ファセット</strong>
					は、ルールが1種類の要素に対して行う1つのテストです（<code>&lt;img&gt;</code>が<code>alt</code>属性を持つ）。それ自身の手順は持たず、<code>coveredBy</code>が、その手順でそれを評価するより広いファセットを示します。そのため、チェックリストには人が行うことが1回ずつ挙がります。
				</li>
				<li>
					<strong>バリアント</strong>
					は、1つのルールが1つの要素について問う、より狭い問いです。その未判定の検出結果が<code>howToCheck</code>として示す手順です。検出結果は常にそのバリアントを示し、一般的な文章は示しません。両者が矛盾することはありません。コアのルールが<code>cantTell</code>として報告しうるすべての理由コードは、ちょうど1つのファセットに属します。
				</li>
				<li>
					どの達成基準も求めていないものは<code>best-practice</code>のもとに分けてあるので、達成基準のテスト手順が助言を不合格として示すことはありません。
				</li>
			</ul>

			<h2 id="which-criteria-have-procedures">テスト手順がある達成基準</h2>
			<p>
				コアのルールが、完全に、一部だけ、または<code>cantTell</code>として評価するすべての達成基準は、どのルールもチェックしないファセットも含めて、すべてのファセットに手順を持ちます。スキャンが始めたことを人が終えるにはそれらが必要だからです。レベルA、AA、AAAのWCAG 2.2の87の達成基準と4.1.1（2.2で削除）のうち36で、ファセットは170、独自の手順が56、そのいずれかでカバーされる技術ファセットが114です。そうした達成基準は<code>complete</code>です。どのルールも評価しない残りの51の達成基準（たとえば1.2.3「音声解説、又はメディアに対する代替（収録済）」）は、ファセットとともに手順なしで挙げられます。それらを手作業でどう評価するかは、コアの範囲外です。ベストプラクティスは、13のファセットそれぞれに手順を持ちます。ランドマーク、ランドマーク内のコンテンツ、見出し、表のマークアップ、ARIAのロール、フォーカス順序、アクセスキー、スキップリンク、名前とラベル、ズーム、繰り返される名前、新しいウィンドウとダウンロード、動きの抑制です。
			</p>

			<h2 id="reading-them">読み取る</h2>
			<DataTable
				label="テスト手順の関数"
				rowKey="id"
				columns={[
					{ key: "fn", label: "関数", width: "38%", wrap: true },
					{ key: "what", label: "返すもの", wrap: true },
				]}
				rows={functionRows}
			/>
			<p>
				Nodeでは、辞書をディスクから読む<code>@surea11y/core</code>から使います。ブラウザーで動くコードは、同じものを<code>@surea11y/core/procedures</code>から<code>From</code>の接尾辞付きで（<code>proceduresFrom</code>、<code>listProceduresFrom</code>、<code>procedureChecklistFrom</code>、<code>renderProceduresFrom</code>、<code>procedureLanguagesFrom</code>）インポートし、<code>{"@surea11y/core/procedures/<locale>"}</code>としてインポートした辞書を渡します。ファイルシステムを必要とせず、ルールにも一切触れません。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { proceduresFor } = require('@surea11y/core');",
					"",
					"proceduresFor('1.4.12', { locale: 'fr' });",
					"// { standard: 'wcag', id: '1.4.12', title: 'Espacement du texte', level: 'AA', complete: true,",
					"//   rules: ['avoid-inline-spacing', 'text-spacing-content-loss'], facets: [ … ] }",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"import { proceduresFrom } from '@surea11y/core/procedures';",
					"import en from '@surea11y/core/procedures/en';",
					"import fr from '@surea11y/core/procedures/fr';",
					"",
					"proceduresFrom({ en, fr }, '1.4.12', { locale: 'fr' });",
				]}
			/>
			<p>
				各ファセットは、その<code>label</code>、<code>automation</code>、それを対象とする<code>rules</code>、その<code>tools</code>、その<code>procedure</code>（<code>{"{ steps, passWhen, failWhen }"}</code>、または技術ファセットでは<code>coveredBy</code>とともに<code>null</code>）、そしてその<code>variants</code>を持ちます。各バリアントは、そのコードについてのそのルールの検出結果の<code>howToCheck</code>とまったく同じものです。読んだ言語とは別の言語のテキスト（2.1での4.1.1の「<span lang="en">Parsing</span>」のような以前のWCAG自身のタイトルや、ロケールにないテキスト）はその言語を示すので、ツールはWCAG 3.1.2が求めるとおり<code>lang</code>で示せます。形の全体は、GitHub上のコアの<a href={`${core}/docs/PROCEDURES.md#the-shape`}><code>PROCEDURES.md</code></a>にあります。
			</p>

			<h2 id="listing-them">一覧にする</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures } = require('@surea11y/core');",
					"",
					"listProcedures();                                         // WCAG 2.2, every level",
					"listProcedures({ version: '2.1', levels: ['A', 'AA'] });  // WCAG 2.1 A and AA",
					"listProcedures({ standard: 'best-practice' });",
					"listProcedures({ levels: ['A', 'AA'], automation: ['manual', 'partial'] }); // what a scan leaves",
				]}
			/>
			<DataTable
				label="listProceduresとprocedureChecklistのオプション"
				rowKey="id"
				columns={[
					{ key: "option", label: "オプション", width: "22%" },
					{ key: "what", label: "効果", wrap: true },
				]}
				rows={listOptionRows}
			/>
			<p>
				WCAGの達成基準は、そのバージョンがそのレベルで持つものです。2.0と2.1は4.1.1を「構文解析」という名前のレベルAの達成基準として挙げ、2.2は挙げません。複数のフィルターを指定すると、ファセットはそのそれぞれに一致する必要があります。要件の<code>complete</code>は、その要件自身のもののままです。
			</p>

			<h2 id="a-checklist">チェックリスト</h2>
			<p>
				<code>procedureChecklist</code>は同じオプションを受け取り、規格を評価するために人が行うことを、それぞれ1回ずつ返します。一般的な手順ごとに1項目で、それがあわせて評価する技術ファセットを<code>covers</code>に、その背後にあるルールを<code>rules</code>に持ちます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { procedureChecklist } = require('@surea11y/core');",
					"",
					"procedureChecklist({ levels: ['A', 'AA'] }).items[0];",
					"// {",
					"//   key: '1.1.1/text-alternative-mechanism',",
					"//   label: 'Non-text content that conveys something has a text alternative',",
					"//   automation: 'partial',",
					"//   wcag: '1.1.1',",
					"//   requirements: ['1.1.1'],",
					"//   covers: ['img-alt-attr-present', 'role-img-text-alternative-present', …],",
					"//   rules: ['img-alt-present', …],",
					"//   tools: [{ id: 'devtools', label: \"The browser's developer tools\" }],",
					"//   procedure: { steps: ['…'], passWhen: '…', failWhen: '… which fails WCAG 1.1.1.' }",
					"// }",
				]}
			/>

			<h2 id="rendering-them">ページとワークシート</h2>
			<p>
				<code>renderProcedures</code>は、<code>listProcedures</code>、<code>procedureChecklist</code>、<code>proceduresFor</code>が返すものを、人が読んだり順に進めたりする文書に変えます。サーバー、ネットワーク、ほかの場所のフォントやスクリプトなしでディスクから開ける、単体で完結した1つのHTMLページか、Markdownです。同じ入力とオプションからは、常に同じページが作られます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures, procedureChecklist, renderProcedures } = require('@surea11y/core');",
					"const fs = require('node:fs');",
					"",
					"// A reference: how to assess every WCAG 2.2 A and AA criterion.",
					"fs.writeFileSync('wcag-22-aa.html', renderProcedures(listProcedures({ levels: ['A', 'AA'] })));",
					"",
					"// A worksheet: each check once, with a result and notes to record.",
					"fs.writeFileSync('wcag-22-aa-checklist.html', renderProcedures(procedureChecklist({ levels: ['A', 'AA'] })));",
					"",
					"// The same in Markdown, for a repository or a wiki.",
					"fs.writeFileSync('wcag-22-aa.md', renderProcedures(listProcedures({ levels: ['A', 'AA'] }), { format: 'markdown' }));",
				]}
			/>
			<DataTable
				label="renderProceduresのオプション"
				rowKey="id"
				columns={[
					{ key: "option", label: "オプション", width: "22%" },
					{ key: "what", label: "効果", wrap: true },
				]}
				rows={renderOptionRows}
			/>
			<p>
				<strong>一覧のページ</strong>
				は規格のリファレンスです。タイトルと範囲、結果の意味（ベストプラクティスはどの適合性にも数えられず、レベルAAAは助言です）、「始める前に」、目次、そして各要件とそのファセットを示します。各ファセットが何をチェックするか、ルールがどこまで判定するか、ツール、手順、何が合格で何が不合格か、それをテストするルールです。
			</p>
			<p>
				<strong>チェックリストのページ</strong>
				はワークシートです。各項目の下に、人が結果とメモを記録します。ページは結果を数えてスクリーンリーダーが読み上げるステータスメッセージに示し、ブラウザーに保存し（<code>localStorage</code>。規格、バージョン、タイトルをキーにします）、各要件の結果をその項目から集約したJSON、またはアクセント記号付きの文字もそのまま表計算ソフトで開けるCSVとしてダウンロードします。要件は、項目のどれかが不合格なら不合格、まだ確認していない項目があれば<code>open</code>、該当する項目がなければ<code>notApplicable</code>、それ以外は合格になります。
			</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "title": "WCAG 2.2: manual checklist",',
					'  "standard": "wcag",',
					'  "version": "2.2",',
					'  "items": [',
					"    {",
					'      "key": "1.1.1/text-alternative-mechanism",',
					'      "requirements": ["1.1.1"],',
					'      "outcome": "fail",',
					'      "notes": "The logo has no alt."',
					"    }",
					"  ],",
					'  "requirements": [{ "id": "1.1.1", "outcome": "fail" }]',
					"}",
				]}
			/>
			<p>
				ページ自身の文言は、コアが同梱するすべての言語でそろっています。テスト手順、ファセットのラベル、WCAGの原則、ガイドライン、達成基準も同様で、名前は各言語で公開されているWCAGの翻訳に従います。ページとは別の言語のものはその言語で示されるので、スクリーンリーダーは各部分をその言語で読み上げます。<code>fragment: true</code>は、独自のスタイルを持つドキュメントサイトのために、内容だけを<code>h1</code>から始まる見出しとともに<code>{'<div class="surea11y-procedures">'}</code>に入れて返します。
			</p>

			<h2 id="from-the-cli">CLIから</h2>
			<p>
				<a href="/getting-started/cli/#manual-checks"><code>@surea11y/cli</code></a> 1.5.0は、コードを書かずに同じページを書き出します。スキャンなしでは<code>surea11y procedures</code>、スキャンと並べてスキャンが人に任せるチェックには<code>--manual-checks</code>を使います。
			</p>
			<CodeBlock
				lines={[
					"# How to assess every WCAG 2.2 A and AA criterion, or a worksheet for a manual audit",
					{ text: "surea11y procedures --wcag-level AA -o wcag-22-aa.html", command: true },
					{ text: 'surea11y procedures --wcag-level AA --checklist --title "Audit: example.com" -o audit.html', command: true },
					"",
					"# The checks a scan leaves to a person, as a worksheet next to its report",
					{ text: "surea11y scan https://example.com/ --wcag 2.2 --html report.html --manual-checks manual-checks.html", command: true },
				]}
			/>

			<h2 id="in-the-html-report">HTMLレポートで</h2>
			<p>
				<a href="/results-reports/html-report/">HTMLレポート</a>には「人による確認が残っているもの」のセクションがあります。スキャンした規格の要件のうち、どのルールも完全には判定しないチェックを持つものすべてを、スキャンでの判定結果を横に付けて示し、その下に折りたたんだ形で、それらのチェックを手順とともに示します。ルールがすべて合格した要件も、そのチェックが合格して初めて満たされ、レポートもそう示します。<code>{"renderHtmlReport(result, { manualChecks: false })"}</code>にすると、このセクションを省きます。
			</p>

			<h2 id="uses">使い方</h2>
			<p>
				<strong>スキャンなしの手動の監査。</strong>監査担当者は、監査の対象となる規格のワークシートを順に進め、各結果とメモを記録し、レポートのためにJSONをダウンロードします。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const checklist = procedureChecklist({ version: '2.2', levels: ['A', 'AA'] });",
					"fs.writeFileSync('audit-worksheet.html', renderProcedures(checklist, { title: 'Accessibility audit: example.com' }));",
				]}
			/>
			<p>
				<strong>テスト実行の添付ファイル。</strong>ページをスキャンするPlaywrightのテストは、ルールが判定しないチェックを添付できるので、それらはテストレポートの中でスキャンと並びます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('home page', async ({ page }, testInfo) => {",
					"  // ... scan the page ...",
					"  const left = procedureChecklist({ levels: ['A', 'AA'], automation: ['manual', 'partial'] });",
					"  await testInfo.attach('manual-checks.html', {",
					"    body: renderProcedures(left, { record: false }),",
					"    contentType: 'text/html'",
					"  });",
					"});",
				]}
			/>
			<p>
				<strong>スクリーンリーダーの利用者とのセッション。</strong>スクリーンリーダーを毎日使う人とのセッションのために、スクリーンリーダーが必要なものだけを示します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const sr = listProcedures({ levels: ['A', 'AA'], tools: 'screen-reader' });",
					"fs.writeFileSync('screen-reader-session.html', renderProcedures(sr, { title: 'Screen reader session' }));",
				]}
			/>
			<p>
				<strong>ドキュメント。</strong>ドキュメントサイトやリポジトリに規格ごとに1つのMarkdownファイルを置き、コアを更新したときに再生成すれば、チームはツールが使うのと同じテスト手順を読めます。<strong>必要な場所で、1つの達成基準を。</strong>検出結果を表示するツールは、<code>{"renderProcedures(proceduresFor('1.4.12', { locale: 'de' }), { fragment: true })"}</code>で、その達成基準全体の評価方法を示せます。
			</p>

			<h2 id="a-packs-standard">パックの規格</h2>
			<p>
				<a href="/configuration/packs/#procedures">パック</a>の規格は、人がその独自の要件をどう評価するかを示すことができ、上のすべての関数は、パックを渡せばそれを読みます。その規格自身の番号とグループで、言語を宣言していればその言語で読みます。WCAGの達成基準を再掲する要件は、その達成基準のテスト手順を、その要件として読み替えて使います（「which fails EN 301 549 9.1.4.3」）。core 1.16.0以降、ファセットは、規格の対応付けがそれが評価するものに振り分けるコアのルールも列挙します（<code>mappedRules</code>。チェックリスト項目の<code>mappedRules</code>にも）。そのため、コアのルールだけがチェックする要件やテストが、チェックされていないように見えることはありません。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const en301549 = require('@surea11y/pack-en301549');",
					"",
					"proceduresFor('9.1.4.3', { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' });",
					"relatedRequirements('1.4.3', { packs: [en301549] });",
					"// [{ standard: 'EN 301 549', id: '9.1.4.3', version: 'V4.1.1', relation: 'restates', … }]",
					"",
					"const options = { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' };",
					"fs.writeFileSync('en-301-549.html', renderProcedures(procedureChecklist(options), { packs: [en301549] }));",
				]}
			/>
			<p>
				<a href="/configuration/packs/#en-301-549-pack">EN 301 549のパック</a> 1.2.0は、コアのルールが評価する達成基準を持つ第9章のすべての条項についてテスト手順を5つの言語で提供し、<a href="/configuration/packs/#wai-aria-pack">WAI-ARIAのパック</a>は、各要件のチェックリストを、妥当なロール、状態、値をすべて列挙して提供します。テスト手順を提供しないパックは何も変えません。WCAGのテスト手順は、パックがあってもなくても同じです。
			</p>
		</>
	);
}
