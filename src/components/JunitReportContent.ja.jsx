import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const outcomeRows = [
	{
		id: "fail",
		outcome: <code>fail</code>,
		junit: (
			<>
				<code>&lt;failure type="fail"&gt;</code>。不合格の検出箇所ごとに1行（メッセージ、ヒント、セレクター、マークアップ）。続いて、ルールが<code>http(s)</code>のヘルプリンク（<code>meta.helpUrl</code>）を持つ場合は<code>help: &lt;url&gt;</code>、持たない場合は最初のWCAG達成基準のUnderstanding文書
			</>
		),
		why: "決定論的で、ゲートを止めるケースです。",
	},
	{
		id: "cantTell",
		outcome: <code>cantTell</code>,
		junit: (
			<>
				手動レビューが必要な検出箇所の数を示す<code>&lt;skipped&gt;</code>
			</>
		),
		why: (
			<>
				JUnitには「判断できない」がありません。スキップにすればビルドを赤にせずに表示でき、
				<a href="/results-reports/sarif-report/">SARIF</a>
				が<code>warning</code>で引いているのと同じ線引きになります。
			</>
		),
	},
	{ id: "pass", outcome: <code>pass</code>, junit: <>中身のない<code>&lt;testcase&gt;</code></>, why: "" },
	{
		id: "notApplicable",
		outcome: <code>notApplicable</code>,
		junit: "省略",
		why: (
			<>
				1ページに数百あり、どれも何も伝えません。<code>includeNotApplicable: true</code>を指定すると<code>&lt;skipped message="Not applicable"&gt;</code>として追加します。
			</>
		),
	},
	{
		id: "ruleError",
		outcome: <>完了しなかったルール（検出箇所がなく<code>error</code>を持つ<code>cantTell</code>。例外を投げたもの）</>,
		junit: <>エラーを含む<code>&lt;error type="ruleError"&gt;</code>。<code>errors</code>に数えられます</>,
		why: "実行できなかったテストを表すJUnitの要素です。ページはそのルールで検査されておらず、それは合格でもレビューすべきものでもありません。",
	},
];

const optionRows = [
	{
		id: "cantTellAs",
		option: <code>cantTellAs</code>,
		default: <code>'skipped'</code>,
		effect: (
			<>
				<code>'failure'</code>を指定すると、<code>cantTell</code>のルールを<code>&lt;failure type="cantTell"&gt;</code>として報告します。未判断のものが残っている間は合格させてはいけないパイプライン向けです。値は大文字小文字を区別せずに読みます。それ以外の値は<code>TypeError</code>を投げます。綴りを誤った値は、黙ってゲートしなくなるためです。
			</>
		),
	},
	{
		id: "leanFailAs",
		option: <code>leanFailAs</code>,
		default: <code>'skipped'</code>,
		effect: (
			<>
				<code>'failure'</code>を指定すると、未判定の検出結果に不適合に傾くもの（その<a href="/results-reports/output-schema/#leans"><code>lean</code></a>）を含むルールを<code>&lt;failure type="leanFail"&gt;</code>として報告し、それらの検出結果を列挙します。それぞれに、不適合の可能性が高い理由（<code>likely fails:</code>）、傾きの注意事項（ある場合）、人が確かめる方法（<code>how to check:</code>、検出結果の<a href="/results-reports/output-schema/#how-to-check"><code>howToCheck</code></a>の手順、続いて<code>fails when:</code>）が付きます。手順を持たない結果には、レポートがNodeで追加します。そのルールのほかの未判定の検出結果は<code>cantTellAs</code>の指定どおりになります。すべての問いではなく、不適合の可能性が高いものでゲートするパイプライン向けです。ベストプラクティスのルールも対象です。そうしたルールはどのWCAG達成基準にも対応せず、<code>fail</code>になることはありませんが、示す事実は無条件で不適合に傾くため、見出しレベルの飛び（<code>heading-order</code>で<code>&lt;h1&gt;</code>の次に<code>&lt;h3&gt;</code>）は<code>Other checks</code>の<code>&lt;failure type="leanFail"&gt;</code>になります。対応するすべての達成基準がスキャンの目標の外にあるルールは、不合格の場合と同じくゲートしません。値は大文字小文字を区別せずに読みます。それ以外の値は<code>TypeError</code>を投げます。<code>@surea11y/core</code>の<code>leaningFailures(result, {"{ wcagOnly }"})</code>は、これがゲートする検出結果を、ベースラインを適用する前の状態で列挙します。
			</>
		),
	},
	{
		id: "leanFailWcagOnly",
		option: <code>leanFailWcagOnly</code>,
		default: <code>false</code>,
		effect: (
			<>
				<code>leanFailAs: 'failure'</code>と組み合わせて<code>true</code>にすると、スキャンの目標内のWCAG達成基準に対応するルールの検出結果だけでゲートし、ベストプラクティスのルールの傾きは除きます。<code>true</code>と<code>false</code>以外の値は<code>TypeError</code>を投げます。
			</>
		),
	},
	{
		id: "includeNotApplicable",
		option: <code>includeNotApplicable</code>,
		default: <code>false</code>,
		effect: <><code>notApplicable</code>のルールをスキップされたテストとして含めます。</>,
	},
	{
		id: "baselineEntries",
		option: <code>baselineEntries</code>,
		default: "なし",
		effect: (
			<>
				<a href="/conformance/baseline/">ベースライン</a>
				の<code>buildBaselineEntries()</code>で作るエントリーです。そこに記録された不合格の検出箇所は、SARIFとまったく同じように除外されます。保存したままのベースラインファイル（それを<code>JSON.parse</code>したもの）か、その<code>entries</code>リストを受け取ります。不合格がすべて既知のルールは、合格ではなく<code>&lt;skipped message="N known failures recorded in the baseline"&gt;</code>になります。合格したわけではないからです。1.13が書いたエントリーのうち、1.14で変わった理由コードのものも、<a href="/conformance/baseline/#upgrading">新しいコードの検出結果に一致します</a>。<code>leanFailAs: 'failure'</code>のもとでは、不適合に傾き、<code>lean: 'fail'</code>と示したエントリー（<code>{"buildBaselineEntries(result, { leanFail: true })"}</code>）がある検出結果もゲートせず、<code>&lt;skipped&gt;</code>のメッセージはそれを<code>known likely failures recorded in the baseline</code>に数えます。
			</>
		),
	},
	{
		id: "packs",
		option: <code>packs</code>,
		default: "なし",
		effect: (
			<>
				スキャンが実行したパック（<code>engineOptions.packs</code>）です。<code>leanFailAs: 'failure'</code>のもとでは、<a href="/results-reports/html-report/">HTMLレポート</a>と同じく、パックのルールの不適合の可能性が高いものに、そのルール自身の<code>meta.review</code>の手順が付きます。
			</>
		),
	},
	{
		id: "name",
		option: <code>name</code>,
		default: <code>'surea11y'</code>,
		effect: (
			<>
				ルートの<code>&lt;testsuites&gt;</code>の<code>name</code>です。1つのダッシュボードで複数ページのレポートを見分けるために使います。
			</>
		),
	},
];

export function JunitReportContent() {
	return (
		<>
			<p>
				<code>@surea11y/core/junit</code>は、スキャン結果を<span lang="en">JUnit XML</span>として出力します。CIダッシュボードがネイティブに読めるテストレポートの形式で、GitLabのマージリクエストのテストウィジェット、<span lang="en">Azure DevOps</span>のTestsタブ、Jenkins、CircleCIが対応しています。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderJunitReport } = require('@surea11y/core/junit');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, { profile: 'wcag22-aa' }, null);",
					"require('fs').writeFileSync('surea11y.junit.xml', renderJunitReport(result));",
				]}
			/>
			<p>
				<code>renderJunitReport(result, options)</code>は純粋関数で、XMLを文字列として返し、ファイルシステムには触れません。
				<a href="https://github.com/SureA11y/cli#readme">
					<code>@surea11y/cli</code>
				</a>
				の<code>surea11y scan &lt;target&gt; --json</code>の出力のように、以前にJSONとして保存した結果にも同じように使えます。コマンドラインからは呼び出す必要はありません。<code>surea11y scan &lt;target&gt; --junit a11y.junit.xml</code>（CLI 1.1.0以降）がデフォルトのオプションと<code>--baseline</code>ファイルの<code>baselineEntries</code>でレポートを書き出します。GitLabと<span lang="en">Azure DevOps</span>のレシピは
				<a href="/configuration/ci-integration/#junit-test-reports">CI連携</a>
				を参照してください。
			</p>

			<h2>構造</h2>
			<p>
				WCAGの達成基準ごとに1つの<code>&lt;testsuite&gt;</code>、そこに対応するルールごとに1つの<code>&lt;testcase&gt;</code>です。上の呼び出しで次のページをスキャンすると：
			</p>
			<CodeBlock
				lang="html"
				lines={[
					"<!doctype html>",
					'<html lang="en">',
					"<head><title>Home</title></head>",
					'<body><main><h1>Welcome</h1><img src="a.png"></main></body>',
					"</html>",
				]}
			/>
			<p>結果は次のとおりです。</p>
			<CodeBlock
				lang="html"
				lines={[
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<testsuites name="surea11y" tests="14" failures="1" errors="0" skipped="4" time="0">',
					'  <testsuite name="WCAG 1.1.1" tests="1" failures="1" errors="0" skipped="0" time="0">',
					"    <properties>",
					'      <property name="wcagCriterion" value="1.1.1"/>',
					'      <property name="title" value="Non-text content: text alternatives"/>',
					'      <property name="wcagLevel" value="A"/>',
					'      <property name="criterionOutcome" value="fail"/>',
					'      <property name="engine" value="a11ycore"/>',
					'      <property name="schemaVersion" value="1.0.0"/>',
					'      <property name="wcagVersion" value="2.2"/>',
					'      <property name="profile" value="wcag22-aa"/>',
					'      <property name="layout" value="false"/>',
					'      <property name="locale" value="en"/>',
					'      <property name="url" value="https://example.test/"/>',
					"    </properties>",
					'    <testcase classname="wcag-1.1.1" name="img-alt-present" time="0">',
					'      <failure type="fail" message="1 failing occurrence: This &lt;img&gt; has no alt attribute.">- This &lt;img&gt; has no alt attribute. Add an alt attribute that says what the image shows, or alt=&quot;&quot; if the image is purely decorative.',
					"  selector: html &gt; body &gt; main &gt; img",
					"  html: &lt;img src=&quot;a.png&quot;&gt;",
					"help: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html</failure>",
					"    </testcase>",
					"  </testsuite>",
					"  <!-- 10 more suites trimmed: 13 tests, 4 of them skipped (manual review) -->",
					"</testsuites>",
				]}
			/>
			<ul>
				<li>
					<strong>達成基準の名前を持つ緑のスイート</strong>は、その達成基準について実行されたルールが失敗を報告しなかったことを意味します。達成基準が完全にチェックされた、あるいは満たされたという意味ではありません。ほとんどの達成基準には、どのルールも扱わない部分があります（<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照）。<code>criterionOutcome</code>プロパティがそれを示します。ルールが合格しても達成基準の一部しかチェックしない場合は<code>cantTell</code>で、現時点ではすべての達成基準がそうです。
				</li>
				<li>
					<strong>スイートは達成基準に従います。</strong>人が追跡するのは達成基準だからです。<strong>テストケースは検出箇所ではなくルールに従います。</strong>そのため、ページ内で40回繰り返される不具合も、本文に40件すべてを列挙した1つの失敗したテストになり、テスト数は実行ごとに安定します。
				</li>
				<li id="names-in-every-locale">
					<strong>名前はどのロケールでも同じです。</strong>スイートの名前は<code>WCAG &lt;criterion&gt;</code>（<code>WCAG 1.4.3</code>）、どの達成基準にも対応しないルールのスイートは<code>Other checks</code>、テストケースの名前はルールのid、その<code>classname</code>は<code>wcag-&lt;criterion&gt;</code>または<code>other</code>で、スキャンがどの<code>engineOptions.locale</code>で実行されても変わりません。CIのテスト履歴（GitLab、Jenkins、GitHubのテストレポーター）はこれらの名前をキーにしているため、フランス語で読んだスキャンも英語で読んだスキャンと同じテストになります。翻訳される達成基準のタイトルは、スイートの<code>title</code>プロパティに入ります（<code>Contrast: minimum</code>、<code>Contraste (minimum)</code>）。検出結果自身のテキスト（各検出箇所のメッセージとヒント）はスキャンのロケールで、レポートがその周りに加える語句はどのロケールでも英語です。<code>message</code>の先頭の件数（<code>1 failing occurrence: Cet élément &lt;img&gt; n’a pas d’attribut alt.</code>）、<code>selector:</code>、<code>html:</code>、<code>help:</code>のラベル、<code>&lt;skipped&gt;</code>のメッセージがそれに当たります。<strong>core 1.12より前は、スイートの名前に達成基準のタイトルが含まれていました</strong>（<code>WCAG 1.1.1 Non-text content: text alternatives</code>）。そのため、古い名前で追跡していたダッシュボードでは、アップグレード後の最初のレポートですべてのテストが一度だけ新規として表示され、履歴はそこから始まり直します。
				</li>
				<li>
					スイートは複合ルールではなく各ルール自身のWCAGとの対応から作られるため、複合ルールを除外していても、実行されたすべてのルールが報告されます。複合ルールが実行された場合は、スイートの<code>title</code>プロパティと<code>criterionOutcome</code>プロパティを提供します。このプロパティは、その達成基準に対応するカスタムルールを組み込みルールと同じように数えます。複数の複合ルールが検査する達成基準（4.1.2：アクセシブルな名前とARIAの妥当性）は、それらの判定結果のうち最も悪いもの（一部が<code>fail</code>なら達成基準も<code>fail</code>になるため）と、それらのタイトルに共通するタイトル（<code>Name, role, value</code>）を取ります。2つの達成基準に対応するルールは両方のスイートに現れます。どの達成基準にも対応しないルールは、<code>classname="other"</code>を持つ最後の<code>Other checks</code>スイートに入ります。
				</li>
				<li>
					<strong>スイートはスキャンのWCAGのレベルとバージョンに従います。</strong>それらによってスキャンが<code>rulesResults</code>から外した達成基準にはスイートがありません。<code>engineOptions.wcagLevel: 'AA'</code>（<code>engine.wcagLevel</code>）のもとでのAAAの達成基準や、WCAG 2.2（<code>engine.wcagVersion</code>）で<code>{"includeRuleIds: ['duplicate-id']"}</code>を実行したときの、2.2で削除された4.1.1（構文解析）です。スキャンが報告する達成基準は残ります。レベルより上でもIDで指定された集約、<a href="/results-reports/output-schema/#partly-checked">一部だけチェックされた</a>達成基準、4.1.1を選んだ2.2のスキャンでの4.1.1などです。外された達成基準だけに対応するルールは<code>Other checks</code>に入り、その失敗は<code>&lt;skipped message="Not counted: WCAG 1.4.6 is outside the scan's target, WCAG 2.2 AA; 1 failing occurrence"&gt;</code>になり、検出箇所は<code>&lt;system-out&gt;</code>に入ります。ルールは実行されて失敗しており、レポートはそれを示しますが、AAのビルドがAAAの達成基準で失敗することはありません。完了しなかったルールは引き続き<code>&lt;error&gt;</code>です。選択が示すレベル（<code>runOnly.wcag.level</code>、またはレベルのタグ）も<code>engine.wcagLevel</code>として記録され、同じようにスイートを絞り込みます。古いエンジンの結果のように、<code>engine.wcagLevel</code>も<code>engine.wcagVersion</code>も記録していない結果では、すべての達成基準が残ります。
				</li>
				<li>
					実行の<code>engine</code>、<code>schemaVersion</code>、<code>wcagVersion</code>、<code>profile</code>、<code>optInRules</code>、<a href="/results-reports/output-schema/"><code>engine.environment</code></a>にあるレンダリングの条件（<code>layout</code>と、ブラウザーでは<code>1280x720</code>の形の<code>viewport</code>、<code>devicePixelRatio</code>、<code>colorScheme</code>、<code>forcedColors</code>、<code>fonts</code>）、<code>locale</code>、<code>url</code>は、結果にある場合だけ、各スイートのプロパティとして繰り返されます。ビューポートの幅によって出たり消えたりする失敗は、実行が使った幅までたどれます。上の例はjsdomでのスキャンなので、レイアウトがありません。
				</li>
				<li>
					複数のビューポート幅でスキャンしたページは、どの幅でも同じスイート名とテスト名になるため、CIのテスト表示でまとめられてしまうことがあります。幅ごとに1つのファイルを書き出し、CIのレポート設定でファイルを幅ごとに名前付けするかグループ化してください。<code>viewport</code>プロパティには、そのファイルがどの幅を表しているかが記録されます。
				</li>
				<li>
					スイートは達成基準の番号順（1.4.10より1.4.3が先）、テストケースはルールのid順に並びます。
				</li>
				<li>
					<code>en301549</code>プロパティは、その達成基準を再掲するEN 301 549の条項を示します。条項があり、スキャンがEN 301 549の条項を要求した場合だけです（<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>を参照）。結果の<code>standards</code>に列挙されたほかの各規格は、そのキーを名前とするプロパティを、スイートのルールが対応するその規格の要件ごとに1つ追加します。ルールをまとめる<a href="/configuration/packs/">パック</a>のチェックリスト項目は、そのidで列挙されます（<code>&lt;property name="acme" value="acme-images"/&gt;</code>）。カスタムルールだけが指定する規格は、プロパティを追加しません。
				</li>
			</ul>
			<p>
				コンパクトな結果（<code>engineOptions.output.detail: 'findings'</code>）は、それが表す完全な結果として読まれるので、同じように報告されます。
			</p>

			<h2 id="cross-frame-results">フレーム横断の結果</h2>
			<p>
				フレーム横断の結果（<a href="/results-reports/output-schema/#cross-frame-result">出力スキーマ</a>を参照）では、まずページのスイートが、続いて各フレームのスイートが出力されます。フレームのスイートはフレームのパスで名前が付けられ（<code>Frame #checkout: WCAG 1.1.1</code>。どのロケールでも同じです）、パスを保持する<code>frame</code>プロパティを持ち、そのテストケースの<code>classname</code>はパスで始まります（<code>frame #checkout wcag-1.1.1</code>）。そのため、スイート名、または<code>classname</code>と<code>name</code>をキーにするCIでも、フレーム内の失敗がページの失敗と混ざることはありません。応答しなかったフレームは、スキップされたテストケース<code>Not scanned: &lt;error&gt;</code>を1つ持つスイート<code>Frame &lt;path&gt;</code>になります。そのフレームは検査されておらず、それは合格ではないからです。<code>&lt;testsuites&gt;</code>の合計はすべてのフレームを数えます。
			</p>

			<h2 id="outcomes">判定結果</h2>
			<DataTable
				label="JUnitでのルールの判定結果"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "ルールの判定結果", width: "18%" },
					{ key: "junit", label: "JUnit", wrap: true },
					{ key: "why", label: "理由", wrap: true },
				]}
				rows={outcomeRows}
			/>
			<p>
				<code>cantTell</code>の検出箇所も持つ<code>fail</code>のルールは、不合格を<code>&lt;failure&gt;</code>に、未判断のものをダッシュボードがテスト出力を表示する<code>&lt;system-out&gt;</code>に報告します。スキップされた<code>cantTell</code>のルールも同様です。
			</p>
			<p>
				シャドウツリー内の要素の<code>selector:</code>行は、シャドウホストを先に、続いて要素を示し、<code>{" >>> "}</code>でつなぎます：<code>{"html > body > main > x-card >>> button"}</code>。<a href="/results-reports/sarif-report/#field-mapping">SARIF</a>と<a href="/results-reports/html-report/">HTMLレポート</a>が示すのと同じ位置です。
			</p>

			<h2 id="options">オプション</h2>
			<DataTable
				label="JUnitレポートのオプション"
				rowKey="id"
				columns={[
					{ key: "option", label: "オプション", width: "22%" },
					{ key: "default", label: "デフォルト", width: "14%" },
					{ key: "effect", label: "効果", wrap: true },
				]}
				rows={optionRows}
			/>

			<h2>決定性</h2>
			<p>
				エンジンは時計を持たず、このレポートも時刻を作り出しません。<code>time</code>はすべて<code>"0"</code>で、<code>timestamp</code>属性は結果が持っている場合（<code>engineOptions.timestamp</code>）だけ各スイートに付きます。同じスキャンからは常にバイト単位で同一のXMLが生成されるため、レポートをコミットしたり差分を取ったりできます。
			</p>
			<p>
				テキストはXML用にエスケープし、エスケープしてもXML 1.0が許可しない文字（ほとんどの制御文字、対になっていないサロゲート）は削除します。ページから取得したマークアップにはそうした文字が含まれることがあるためです。
			</p>
		</>
	);
}
