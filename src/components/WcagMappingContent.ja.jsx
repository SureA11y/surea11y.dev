import React from "react";
import engine from "../data/engine.generated.json";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "/configuration/packs/#en-301-549-pack";

const precedenceRows = [
	{
		id: "fail",
		condition: (
			<>
				構成ルールのいずれかが
				<code>fail</code>
			</>
		),
		outcome: <code>fail</code>,
	},
	{
		id: "canttell",
		condition: (
			<>
				<code>fail</code>
				はないが、構成ルールのいずれかが
				<code>cantTell</code>
				、または一覧にある構成ルールが1つでも実行されなかった
			</>
		),
		outcome: <code>cantTell</code>,
	},
	{
		id: "na",
		condition: (
			<>
				すべての構成ルールが<code>notApplicable</code>で、その達成基準が適用されるすべてのケースをルールが見つけられる場合
			</>
		),
		outcome: <code>notApplicable</code>,
	},
	{
		id: "na-partial",
		condition: (
			<>
				すべての構成ルールが<code>notApplicable</code>で、それ以外の達成基準の場合
			</>
		),
		outcome: (
			<>
				<code>cantTell</code>（<code>composite.rollup.cantTell.partialCoverage</code>）
			</>
		),
	},
	{
		id: "pass",
		condition: "それ以外（すべて実行され、failもcantTellもなく、すべてがN/Aではない）で、その達成基準が求めることをすべてルールがチェックする場合",
		outcome: <code>pass</code>,
	},
	{
		id: "pass-partial",
		condition: "それ以外で、ほかの達成基準の場合",
		outcome: (
			<>
				<code>cantTell</code>（<code>composite.rollup.cantTell.partialCheck</code>）
			</>
		),
	},
];

export function WcagMappingContent() {
	return (
		<>
			<p>
				個々のルールの結果がWCAGの達成基準（SC）とどう関係するか、そして全体の適合性についてsurea11yが言えること・言えないことを説明します。
			</p>

			<h2>3つの層</h2>
			<ol>
				<li>
					<strong>アトミックルール</strong>
					（
					<code>checksResults[]</code>
					）：それぞれが1つの規範的な判定を行います。たとえば「この
					<code>&lt;img&gt;</code>
					には
					<code>alt</code>
					属性があるか」です。すべてのルールは
					<a href="/rules/">ルールカタログ</a>
					を参照してください。
				</li>
				<li>
					<strong>ファセット</strong>
					：WCAGの達成基準は、たいてい1つのルールで決定論的に判定できる範囲より大きなものです。内部では、各達成基準を名前付きの「ファセット」に分けています（たとえば1.1.1「非テキストコンテンツ」には
					<code>img-alt-attr-present</code>
					、
					<code>text-alternative-quality</code>
					、
					<code>decorative-null</code>
					などのファセットがあります）。ファセットは
					<code>src/coverage/wcag-facets.js</code>
					で管理され、それぞれ
					<code>full</code>
					（ルールが高い確度で判定する）、
					<code>partial</code>
					（ルールがその
					<em>一部</em>
					を判定する。各ルールの範囲に関する注記を参照）、
					<code>manual</code>
					（安全な自動化のヒューリスティックがまったくない）のいずれかに分類されています。
					<code>npm run coverage</code>
					を実行すると、達成基準ごとのファセットの内訳である
					<code>coverage/coverage-report.md</code>
					が再生成されます。core 1.15.0以降、ルールが評価する達成基準の各ファセットには、人が手作業で評価する方法である手順もあります（<a href="/conformance/procedures/">テスト手順</a>を参照）。
				</li>
				<li>
					<strong>複合ルール（WCAG達成基準ごとの集約ルール）</strong>
					（
					<code>rulesResults[]</code>
					）：1つの達成基準に対応するすべてのアトミックルールを自動生成で集約したものです。何十ものアトミックな結果を自分でまとめなくても、達成基準ごとにpass／fail／cantTell／notApplicableの判定が1つ得られます。
					<a href={`${core}/docs/RULE_CATALOG.md#composite-wcag-sc-rollup-rules-${engine.composites}`}>
						全一覧
					</a>
					を参照してください（たとえば
					<code>wcag-1.1.1-non-text-content</code>
					は21件のアトミックルールを集約しています）。
				</li>
			</ol>

			<h2>複合ルールの判定結果の決まり方</h2>
			<p>その複合ルールを構成するアトミックルールに対して、決まった優先順位で決定論的に評価されます。</p>
			<DataTable
				caption="複合ルールの判定結果の優先順位"
				rowKey="id"
				columns={[
					{ key: "condition", label: "条件", wrap: true, width: "75%" },
					{ key: "outcome", label: "複合ルールの判定結果", width: "25%" },
				]}
				rows={precedenceRows}
			/>
			<h3 id="when-a-criterion-passes">達成基準が<code>pass</code>になるとき、適用されないとき</h3>
			<p>
				1.14からは、達成基準が<code>pass</code>になるのは、その達成基準が求めることをすべてルールがチェックする場合だけです。WCAGでも、達成基準はそのすべてが満たされたときにだけ満たされたとみなされます。ルールがすべて<code>pass</code>でも、わかるのはルールがチェックする部分が満たされていることだけです。<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a>は<code>{'<html lang="fr">'}</code>が言語を示していることを確かめますが、ページがフランス語で書かれていることは確かめません（3.1.1）。<a href="/rules/page-title-present/"><code>page-title-present</code></a>はページにタイトルがあることを確かめますが、それがページを説明していることは確かめません（2.4.2）。そうした達成基準は<code>cantTell</code>になり、理由コードは<code>composite.rollup.cantTell.partialCheck</code>です。<a href="/results-reports/html-report/">HTMLレポート</a>では「一部のみ確認」と表示され、残りは人が確認します。ルールがすべてをチェックする達成基準は<code>src/coverage/complete-applicability.js</code>（<code>COMPLETE_CHECK</code>）にそれぞれの理由とともに列挙されますが、まだ1つもありません。どの達成基準にも、ルールからは見えないことが含まれています。代替テキスト、ラベル、見出し、リンクのテキストが正しい内容を伝えているか、スクリプトが描画・変更するコンテンツがそれを満たしているか、といったことです。
				<strong>そのため、1.14ではWCAGの複合ルールが<code>pass</code>になることはありません。</strong>
			</p>
			<p>
				同じように、達成基準が<code>notApplicable</code>になるのは、その達成基準が適用されるすべてのケースをルールが見つけられる場合だけです。2.4.4と2.4.9ではリンク、2.4.3と2.4.7ではフォーカス可能な要素、2.5.3ではラベルの付いたコンポーネント、4.1.1ではマークアップがそれに当たります。フォームのフィールド（1.3.5、3.3.2）とポインターのターゲット（2.5.8）はこの一覧にありません。ARIAのロールで作ったフィールド、<code>autocomplete</code>のないフィールド、スクリプトによってだけターゲットになる要素は、それらのルールが何も見つけなかったページにもありえるからです。それ以外の達成基準では、ルールがすべて何も見つけなくても、わかるのはルールが探すケースがないことだけです。遅延の後にリダイレクトするスクリプトは<code>{'<meta http-equiv="refresh">'}</code>のない制限時間（2.2.1）ですし、ほかの言語の一節（3.1.2）に<code>lang</code>が付いているとは限りません。WCAG-EMの用語では、「存在しない」と言うにはコンテンツがありうる場所をすべて確認している必要があります。そのため、そうした達成基準は<code>cantTell</code>になり、理由コードは<code>composite.rollup.cantTell.partialCoverage</code>です。
			</p>
			<p>
				つまり、<strong>複合ルールの<code>fail</code>は本物の決定論的な違反であり、構成ルールがすべて<code>pass</code>だった複合ルールの<code>cantTell</code>（<code>partialCheck</code>）は、その達成基準についての自動チェックがすべて問題なく、残りは人が確認するものだということを示します。</strong>それだけでは適合を主張するものではありません。ファセットの表（<code>coverage-report.md</code>）は、各達成基準のどの部分が自動でカバーされ、どの部分を人が確認するかを示します。これらは「チェックは問題なし、確認が必要」「チェックする対象が見つからない」として表示し、<code>pass</code>として表示しないでください。
			</p>
			<p>
				複合ルールの
				<code>data.details.contributors</code>
				配列（
				<a href="/results-reports/output-schema/">出力スキーマ</a>
				を参照）には、すべてのアトミックルールとそれぞれの判定結果が並びます。複合ルールをブラックボックスとして扱うのではなく、どのファセットが
				<code>fail</code>
				／
				<code>cantTell</code>
				の原因になったのかを正確に確認するのに使ってください。
			</p>
			<p>
				実行されたカスタムルール（
				<code>engineOptions.customRules</code>
				）や
				<a href="/configuration/packs/">パック</a>
				のルールは、
				<code>meta.wcagSc</code>
				または
				<code>meta.normativeMappings</code>
				のWCAGのエントリーを通じて、組み込みルールと同じように、対応する各達成基準の複合ルールに算入されます。不合格になったものは複合ルールを不合格にします。カスタムルールは組み込みルールのように仕様と照合されていないため、複合ルールは貢献したルールの中でカスタムルールに
				<code>custom: true</code>
				を付け、
				<code>data.details.customChecksIds</code>
				に列挙します。組み込みルールの上書きは、それ自身の対応付けに従って算入されます。その達成基準に対応していれば組み込みルールの代わりに算入され、どの達成基準にも対応していなければどこにも算入されません（警告が出ます）。
			</p>
			<p>
				達成基準ではなくルールを指定したスキャン（<code>{"includeRuleIds: ['link-name-present']"}</code>のようなIDで、WCAGのタグではないタグで、<code>optInRules</code>で、またはベストプラクティスとして指定）でも、それらのルールがチェックする達成基準の複合ルールが得られます。<code>wcag244</code>のような達成基準のタグを指定した場合は、その達成基準だけが報告されます（<a href="/configuration/engine-options/#which-criteria-a-scan-reports">エンジンオプション</a>を参照）。1.12より前は、そうしたスキャンは複合ルールを1つも報告しませんでした。判定は上の表で決まります。不合格のルールがあればその達成基準は不合格になり、スキャンが選ばなかったルールは実行されなかった構成ルールとして扱われるので、その達成基準はよくても<code>cantTell</code>、つまり一部だけチェックしたものになります（<code>reasonCode</code>は<code>composite.rollup.cantTell.notSelectedChild</code>で、そうした構成ルールにはそれぞれ<code>notSelected: true</code>が付きます。<a href="/results-reports/html-report/">HTMLレポート</a>では「一部のみ確認」と表示されます）。
			</p>

			<h2>適合レベル（A／AA／AAA）を対象にする</h2>
			<p>
				<code>runOnly.wcag</code>
				にWCAGのバージョンとレベルを指定します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best-practice rules, which test no WCAG criterion:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				目標を指定すると、そのバージョンで有効な、そのレベル以下のすべての達成基準のルールが、各達成基準がそのバージョンで持つレベル（
				<code>@surea11y/core/wcag</code>
				の
				<code>WCAG_CRITERIA</code>
				）に従って実行されます。そのため、4.1.1「構文解析」は2.0と2.1の目標には含まれ、2.2の目標には含まれません。目標は、実行のWCAGバージョンと、報告する集約のレベルも設定します。
				<a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">WCAGの目標で選ぶ</a>
				を参照してください。
			</p>
			<p>
				<code>WCAG_CRITERIA</code>
				の各エントリーには、W3CがWCAG 2.2でその達成基準に付けている
				<code>id</code>
				（
				<code>non-text-content</code>
				）もあります。ルールが持つWCAGの対応付けはすべて、2.1と2.2について、そのバージョンの勧告にある達成基準の節（
				<code>url</code>
				）と、そのUnderstanding文書（
				<code>understandingUrl</code>
				）にリンクします。ルール自身にヘルプリンクがない場合、レポーターはUnderstanding文書をヘルプリンクとして使います。
			</p>

			<h3 id="with-tags">タグで指定する</h3>
			<p>
				同じ目標はレベルのタグでも指定できます。
				<code>runOnly.tags</code>
				（または
				<code>engineOptions.tags.include</code>
				）に渡します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 A and AA. Both tags are required: they are not cumulative.",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa'] });",
				]}
			/>
			<p>
				<strong>レベルのタグは入れ子になっていません。ここで最も間違えやすい点です。</strong>
				ルールには、対応する達成基準ごとにレベルのタグが1つ付くだけで、それ以上は付きません。AAの達成基準だけに対応するルールには
				<code>wcag2aa</code>
				が付き、
				<code>wcag2a</code>
				は
				<em>付きません</em>
				。そのため
				<code>{"{ tags: ['wcag2aa'] }"}</code>
				だけを指定すると、2.0のA＋AAを対象にする105件のルールではなく、2.0のAAの達成基準に対応する11件のルールだけが実行されます。対象にするレベルはすべて列挙するか、この問題がない
				<code>runOnly.wcag</code>
				を使ってください。
				<code>engineOptions.profile</code>
				（<code>wcag22-a</code>、<code>wcag22-aa</code>、<code>wcag22-aaa</code>、<code>en301549-v4.1.1</code>、<code>en301549-v3.2.1</code>、<code>section508</code>）に任せることもできます。
				<a href="/configuration/engine-options/#conformance-profiles">適合性プロファイル</a>
				を参照してください。
			</p>
			<p>
				WCAGのバージョンについても同じです。2.1や2.2で追加された達成基準には、追加されたバージョンのタグしか付きません。そのため、適合の対象全体はタグの集合の和になります。バージョンごとの既成のタグセット（WCAG 2.2で追加ではなく削除された1つの達成基準を含む）は
				<a href="/configuration/engine-options/#filtering-by-wcag-version">エンジンオプションのガイド</a>
				を参照してください。
			</p>
			<p>
				<strong>削除された達成基準は自動的に処理されます。</strong>
				どの実行でも、対象とするWCAGのバージョン（
				<code>engineOptions.wcagVersion</code>
				、なければ実行が適用する
				<a href="/configuration/packs/">パック</a>
				のプロファイルの
				<code>wcagVersion</code>
				、それもなければ
				<code>runOnly.wcag</code>
				のバージョン、それもなければバージョンのタグから導かれるもの、それもなければ
				<code>2.2</code>
				）が決まり、
				<code>engine.wcagVersion</code>
				として報告されます。2.2を対象にした場合、SC 4.1.1「構文解析」だけに対応するルールは
				<code>fail</code>
				を報告できません。ルールは実行されて検出箇所を報告しますが、判定結果は
				<code>cantTell</code>
				になり、その読み替えを説明する
				<code>wcagVersionScope</code>
				フィールドが付きます。1.14からは、2.0や2.1を対象にした場合も同じで、<code>wcagVersionScope.by: "errata"</code>が付きます。W3Cによるこれらのバージョンの2023年の正誤表は、HTMLやXMLのコンテンツについて4.1.1を常に満たされているものとみなしているからです。そのため、WCAGのスキャンが4.1.1で失敗することはありません。4.1.1で不合格になるのは、その文言を残している規格のプロファイル、つまり<code>en301549-v3.2.1</code>のように<code>keepsParsing: true</code>を宣言したプロファイルだけです。
			</p>
			<p>
				アトミックルールとは違い、複合ルールは累積的に
				<em>絞り込まれます</em>
				。ランナーは
				<code>engineOptions.wcagLevel</code>
				、なければ
				<code>runOnly.wcag</code>
				のレベル、または
				<code>tags</code>
				で指定された最も高いレベルを読み取り、それより上のレベルの複合ルールをすべて除外します。そのため
				<code>{"['wcag2a', 'wcag2aa']"}</code>
				を指定すると、AAAだけの達成基準については
				<code>rulesResults</code>
				のエントリーが返りません。目標ではなくチェックを指定するスキャンで設定するのは<code>wcagLevel</code>（<code>'A'</code>、<code>'AA'</code>、<code>'AAA'</code>）です。選んだルールはすべて実行され、報告する達成基準だけがそのレベルまでに絞られます。そのため、<code>contrast-computable</code>を<code>'AA'</code>でスキャンすると、AAAの1.4.6ではなく1.4.3が報告されます。実行はこれを<code>engine.wcagLevel</code>として記録します。正確な優先順位が必要なら、
				<code>src/core/dom-runner.js</code>
				の
				<code>targetWcagLevelOf</code>
				／
				<code>isAllowedByTargetLevel</code>
				を参照してください。
			</p>
			<p>
				<code>tags</code>
				を完全に省略すると（デフォルト）、すべてのレベルのすべてのルールが実行され、複合ルールの除外も行われません。
			</p>

			<h2 id="en-301-549">EN 301 549</h2>
			<Callout tone="note" title="非推奨">
				<p>
					EN 301 549は、プロファイル、<code>mappings</code>のキー、<code>@surea11y/core/en301549</code>とともに専用のパック<a href={pack}><code>@surea11y/pack-en301549</code></a>に移り、core 2.0.0で削除されます。それまではすべて従来どおり動作し、プロセスごとに1回<code>console.warn</code>を出します。移行するには、パックを<code>engineOptions.packs</code>に渡します。スキャンは同じ名前をパックから取り、表のエクスポートは<code>@surea11y/pack-en301549/public</code>にあります。<a href={`${core}/docs/API_STABILITY.md#deprecating-a-standard-a-profile-or-an-entry-point`}>coreが規格を非推奨にする手順</a>を参照してください。
				</p>
			</Callout>
			<p>
				EN 301 549の第9章は、WCAGのレベルAとAAの達成基準を、<code>9.</code>に達成基準の番号を続けた条項として再掲しています。WCAG 1.4.3は条項9.1.4.3です。スキャンが要求した場合、アトミックルールと複合ルールのすべての結果は、<code>meta.normativeMappings</code>のWCAGのエントリーの後に、各達成基準の条項を、その達成基準を含む規格のバージョンごとに1つずつ持ちます。スキャンは<code>engineOptions.mappings: ['en301549']</code>（両方のバージョン）や<code>['en301549:V3.2.1']</code>（1つ）で要求するか、EN 301 549のプロファイルを対象にして要求します。プロファイルはその名前のバージョンを追加します。デフォルトでは、結果はWCAGだけを示します（<a href="/configuration/engine-options/#other-standards-mappings">ほかの規格</a>を参照）。
			</p>
			<DataTable
				label="EN 301 549のバージョン"
				rowKey="version"
				columns={[
					{ key: "version", label: "バージョン", width: "20%" },
					{ key: "builtOn", label: "基になったもの", wrap: true },
					{ key: "differs", label: "もう一方との違い", wrap: true },
				]}
				rows={[
					{ version: "V3.2.1 (2021-03)", builtOn: "WCAG 2.1 A・AA、50の達成基準", differs: "9.4.1.1構文解析を含む" },
					{ version: "V4.1.1 (2026-09)", builtOn: "WCAG 2.2 A・AA、55の達成基準", differs: "2.4.11、2.5.7、2.5.8、3.2.6、3.3.7、3.3.8を追加。9.4.1.1は無効" },
				]}
			/>
			<p>
				条項の各エントリーは、再掲している達成基準も<code>{'wcagSc: ["1.4.3"]'}</code>として示します。そのため、達成基準ごとにまとめたビュー（<a href="/results-reports/junit-report/">JUnit</a>のスイート、<a href="/results-reports/html-report/">HTMLレポート</a>の集約）は、複数の達成基準に対応するルールでも正しい達成基準の下に置けます。AAAの達成基準には、どちらのバージョンにも条項がありません。カタログも同じオプションで条項を示します。<code>{"getChecksCatalog({ mappings: ['en301549'] })"}</code>では各エントリーの<code>normativeMappings</code>に、<code>{"getRulesCatalog({ mappings: ['en301549'] })"}</code>が返す複合ルールのエントリーでは<code>meta.standardMappings</code>に入るので、スキャンを実行しなくても達成基準の条項を読み取れます。
			</p>
			<p>
				この表は<code>@surea11y/core/en301549</code>として公開されています。あるバージョンが求める達成基準のうちスキャンが網羅しなかったものなど、逆方向の見方が必要なツール向けです。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { EN301549_CLAUSES, en301549ClausesForSc } = require('@surea11y/core/en301549');",
					"",
					"Object.keys(EN301549_CLAUSES['V3.2.1']);  // the 50 WCAG 2.1 A and AA criteria V3.2.1 restates",
					"en301549ClausesForSc('2.5.8');            // [{ version: 'V4.1.1', clause: '9.2.5.8', title: 'Target size (minimum)' }]",
				]}
			/>
			<p>
				<strong>これは公開された2つの文書の対応関係であり、適合の主張ではありません。</strong>結果に付いた条項は、そのWCAGの達成基準がEN 301 549のどの要件に当たるかを示すだけです。特定の法律がどのバージョンを求めるかは、エンジンの範囲外です。
			</p>
			<p>
				EN 301 549は、ランナー、ルールカタログ、レポート生成のすべてが読む規格の登録簿の1つのエントリーです。独自の判定を持つ規格（自身のルールが検査する要件を持つもの。たとえばRGAAのような国の規格）や組織のチェックリストは、
				<a href="/configuration/packs/">パック</a>
				として提供されます。パックはコアの外にある独自のパッケージで、スキャンは
				<code>engineOptions.packs</code>
				でそれを受け取り、そのエントリーはそのスキャンの間だけ登録簿に加わり、独自のプロファイル、ルール、集約を持ちます。カスタムルールは自身の
				<code>normativeMappings</code>
				で任意の規格を指定できますが、プロファイル、
				<code>mappings</code>
				の切り替え、オプトインルール、集約、SARIF・JUnit・HTMLレポートでの表示を得られるのは、登録された規格（コアの規格と、そのスキャンのパックの規格）だけです。規格をコア自体に組み込む方法は、GitHub上のコントリビューター向けガイドである
				<a href={`${core}/docs/WCAG_CONFORMANCE.md#adding-another-standard`}>
					<code>WCAG_CONFORMANCE.md</code>
				</a>
				を参照してください。
			</p>

			<h2 id="what-this-engine-cannot-tell-you">このエンジンにはわからないこと</h2>
			<p>
				<strong>WCAGへの完全な適合を証明できる自動ツールはありません。このツールも同じです。</strong>
				これはsurea11yに固有の制限ではなく、WCAGそのものに内在するものです。達成基準のうち無視できない割合が、人間の判断（代替テキストが単に
				<em>ある</em>
				だけでなく
				<em>正確</em>
				か、エラーメッセージが
				<em>理解できる</em>
				か）や、このエンジンの静的なDOMスキャンというアーキテクチャではまったくできない動的なテスト（キーボードトラップの検出、拡大時の実際のレイアウト／リフロー）を必要とします。何が対象外で、なぜそうなのかの明示的な全一覧は
				<a href="/help/known-limitations/">既知の制限事項</a>
				を参照してください。
			</p>
			<p>
				そのうえでsurea11yが正直に
				<em>提供できる</em>
				のは、次のことです。
			</p>
			<ul>
				<li>
					コアの組み込みルールは、対象にした規格とバージョンにおける決定論的で規範上の違反に対してだけ
					<code>fail</code>
					を報告し、確信が持てないときは
					<code>cantTell</code>
					を報告するように作られています。これは設計上の目標であり、保証ではありません。ルールがなお誤りうる例外的なケースは
					<a href="/help/known-limitations/">既知の制限事項</a>
					に挙げてあり、各検出結果の検出箇所は何に基づいて判断したかを示し、
					<a href="/rules/">ルールカタログ</a>
					は各ルールの確度を示します。カスタムルール、パックのルール、上書きがどれだけ正確かは、それがどう書かれたかによります。デフォルトではその規格はWCAGです。ほかの規格だけが求める要件のルールはオプトインで、デフォルトではその規格を対象にしたときだけ実行されます（<a href="/configuration/engine-options/#opt-in-rules">オプトインルール</a>を参照）。<code>engineOptions.optInRules</code>は、スキャンのプロファイルやフィルターをなくさずにオプトインルールを有効にします。<code>optInRules: 'all'</code>を指定し、プロファイルもフィルターもない場合、実行はすべてのルールを対象にし、特定の規格を対象にしません。タグのリストを指定した場合は、そのオプトインのグループだけが有効になります。<code>engine.optInRules</code>は、ルールが実行されたタグを列挙します。WCAGのプロファイルのもとでは、有効にしたルールはそのタグがプロファイルに一致するときだけ実行され、実行は引き続きWCAGを対象にします。そのため、コアのルールのうち、WCAGを対象にしたスキャンが実行するのは、対象の達成基準のルールと、追加した場合のベストプラクティスのルールだけです。ベストプラクティスのルールは達成基準を示しませんが、見つけたもの自体がバリアである場合は<code>fail</code>を報告することがあります。空の見出し（<a href="/rules/empty-heading/"><code>empty-heading</code></a>）がその例で、WCAGの複合ルールはそれを算入しません。オプトインのタグを持たないカスタムルール、上書き、パックのルールは、選択に含まれれば実行され、WCAGが求めていない独自のチェックについて<code>fail</code>を報告することがあります。
				</li>
				<li>
					core 1.15.0以降、ルールがWCAGの達成基準を不合格にするのは、WCAG自体が不合格とする場合だけです。WAI-ARIAやHTMLのコンテンツモデルだけが破られていて、ページの名前・役割・値がそれでも保たれている場合、ARIAとHTMLの構造のルールは代わりに問いかけます（<code>cantTell</code>、不確実性<code>spec-only</code>）。そのため、WCAGの不合格が、WCAGが数えない仕様違反を表すことはありません。そうした検出結果をWAI-ARIA自体に基づいて判定するには、WCAGのプロファイルと並べて<a href="/configuration/packs/#wai-aria-pack">WAI-ARIAのパック</a>のプロファイルを実行してください。
				</li>
				<li>
					すべての
					<code>cantTell</code>
					は、不確かさを握りつぶしたものではなく、人間によるレビューが必要だという明示的なフラグです。
				</li>
				<li>
					ルールが一部しかチェックしない達成基準を、複合ルールが<code>pass</code>にすることはありません。ルールがすべて<code>pass</code>でも<code>cantTell</code>（<code>composite.rollup.cantTell.partialCheck</code>）になるので、どのルールもチェックしない部分について<code>pass</code>が黙っていることはありません。
				</li>
				<li>
					ファセットのカバレッジ表を見れば、どの達成基準のどの部分に自動カバレッジがまったくないか、つまり人に残されているのは何かが正確にわかります。そしてコアの<a href="/conformance/procedures/">テスト手順</a>が、ルールが評価するすべての達成基準について、人がそれぞれをどう確認するかを示します。
				</li>
			</ul>
			<p>
				対象レベルのすべての達成基準で複合ルールに<code>fail</code>がなければ、それは
				<em>そのレベルで自動化できるチェックがすべて問題なかった</em>
				という意味です。適合性のうち自動化できる部分を正確に述べたものであって、WCAG自体が求める手動レビューの代わりではありません。
			</p>
		</>
	);
}
