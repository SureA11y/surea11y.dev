import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const outcomeRows = [
	{
		id: "fail",
		outcome: <code>fail</code>,
		junit: (
			<>
				<code>&lt;failure type="fail"&gt;</code>。不合格の検出箇所ごとに1行（メッセージ、ヒント、セレクター、マークアップ）
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
];

const optionRows = [
	{
		id: "cantTellAs",
		option: <code>cantTellAs</code>,
		default: <code>'skipped'</code>,
		effect: (
			<>
				<code>'failure'</code>を指定すると、<code>cantTell</code>のルールを<code>&lt;failure type="cantTell"&gt;</code>として報告します。未判断のものが残っている間は合格させてはいけないパイプライン向けです。
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
				の<code>buildBaselineEntries()</code>で作るエントリーです。そこに記録された不合格の検出箇所は、SARIFとまったく同じように除外されます。不合格がすべて既知のルールは、合格ではなく<code>&lt;skipped message="N known failures recorded in the baseline"&gt;</code>になります。合格したわけではないからです。
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
				の<code>surea11y scan &lt;target&gt; --json</code>の出力のように、以前にJSONとして保存した結果にも同じように使えます。GitLabと<span lang="en">Azure DevOps</span>のレシピは
				<a href="/configuration/ci-integration/#junit-test-reports">CI連携</a>
				を参照してください。
			</p>

			<h2>構造</h2>
			<p>
				WCAGの達成基準ごとに1つの<code>&lt;testsuite&gt;</code>、そこに対応するルールごとに1つの<code>&lt;testcase&gt;</code>です。
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<testsuites name="surea11y" tests="14" failures="2" errors="0" skipped="4" time="0">',
					'  <testsuite name="WCAG 1.1.1 Non-text content: text alternatives" tests="1" failures="1" errors="0" skipped="0" time="0">',
					"    <properties>",
					'      <property name="wcagCriterion" value="1.1.1"/>',
					'      <property name="wcagLevel" value="A"/>',
					'      <property name="en301549" value="9.1.1.1"/>',
					'      <property name="criterionOutcome" value="fail"/>',
					'      <property name="engine" value="a11ycore"/>',
					'      <property name="schemaVersion" value="1.0.0"/>',
					'      <property name="wcagVersion" value="2.2"/>',
					'      <property name="profile" value="wcag22-aa"/>',
					'      <property name="locale" value="en"/>',
					'      <property name="url" value="https://example.test/"/>',
					"    </properties>",
					'    <testcase classname="wcag-1.1.1" name="img-alt-present" time="0">',
					'      <failure type="fail" message="1 failing occurrence: Missing alt attribute on &lt;img&gt;.">- Missing alt attribute on &lt;img&gt;. Add an alt attribute (use alt=&quot;&quot; only for decorative images).',
					"  selector: html &gt; body &gt; main &gt; img",
					"  html: &lt;img src=&quot;a.png&quot;&gt;</failure>",
					"    </testcase>",
					"  </testsuite>",
					"</testsuites>",
				]}
			/>
			<ul>
				<li>
					<strong>スイートは達成基準に従います。</strong>人が追跡するのは達成基準だからです。<strong>テストケースは検出箇所ではなくルールに従います。</strong>そのため、ページ内で40回繰り返される不具合も、本文に40件すべてを列挙した1つの失敗したテストになり、テスト数は実行ごとに安定します。
				</li>
				<li>
					スイートは複合ルールではなく各ルール自身のWCAGとの対応から作られるため、複合ルールを除外していても、実行されたすべてのルールが報告されます。複合ルールが実行された場合は、スイートのタイトルと<code>criterionOutcome</code>プロパティを提供します。2つの達成基準に対応するルールは両方のスイートに現れます。どの達成基準にも対応しないルールは、<code>classname="other"</code>を持つ最後の<code>Other checks</code>スイートに入ります。
				</li>
				<li>
					実行の<code>engine</code>、<code>schemaVersion</code>、<code>wcagVersion</code>、<code>profile</code>、<code>optInRules</code>、<code>locale</code>、<code>url</code>は、結果にある場合だけ、各スイートのプロパティとして繰り返されます。
				</li>
				<li>
					スイートは達成基準の番号順（1.4.10より1.4.3が先）、テストケースはルールのid順に並びます。
				</li>
				<li>
					<code>en301549</code>プロパティは、その達成基準を再掲するEN 301 549の条項を示します。条項があり、スキャンがEN 301 549の条項を要求した場合だけです（<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>を参照）。
				</li>
			</ul>

			<h2>判定結果</h2>
			<DataTable
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

			<h2>オプション</h2>
			<DataTable
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
