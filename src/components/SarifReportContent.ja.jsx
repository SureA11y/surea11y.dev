import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const sarifLevelRows = [
	{ id: "fail", outcome: <code>fail</code>, level: <code>error</code>, meaning: "決定論的な違反です。CIのゲート判定に使うのはこのケースです。" },
	{ id: "cantTell", outcome: <code>cantTell</code>, level: <code>warning</code>, meaning: "人間によるレビューが必要です。表示はされますが、それだけでビルドを止めるべきではありません。" },
];

const sarifFieldRows = [
	{ id: "ruleId", field: <code>results[].ruleId</code>, source: <code>checksResults[i].ruleId</code> },
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code>＋<code>occurrence.hint</code></> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>スキャン対象そのものです。後述の<a href="#sarif-locations">位置情報</a>を参照してください。</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>, source: <><code>occurrence.selector</code>（ある場合）。</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v1"]</code>,
		source: (
			<>
				<a href="/conformance/baseline/">ベースライン／許可リスト</a>
				（
				<code>computeBaselineKey</code>
				）で使うものと同じ
				<code>ruleId + reasonCode + html</code>
				の識別キーです。位置ではなく内容に基づく、安定したフィンガープリントです。
			</>
		),
	},
	{ id: "props", field: <><code>results[].properties.severity</code>／<code>.confidence</code>／<code>.reasonCode</code>／<code>.html</code></>, source: <>結果自身の<code>severity</code>／<code>confidence</code>と、上のフィンガープリントのキーになっているのと同じ<code>reasonCode</code>と<code>html</code>の断片です。参考情報であり、SARIF自体のスキーマには含まれません。</> },
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>、<code>automatic</code>／<code>manual</code>、そして<code>meta.normativeMappings</code>内のWCAG達成基準ごとに1つの<code>wcag-&lt;SC&gt;</code>タグです。Understanding文書のエントリーにはタグを付けません。結果が持つEN 301 549の各条項（スキャンが要求した場合のみ。<a href="/configuration/engine-options/#other-standards-mappings">ほかの規格</a>を参照）には<code>en301549-&lt;条項&gt;</code>タグ（例：<code>en301549-9.1.1.1</code>）が付きます。条項番号はそれを含むどのバージョンでも同じなので、タグにバージョンは含めません。</> },
	{ id: "runProps", field: <code>runs[0].properties</code>, source: <>結果の<code>engine</code>にある<code>wcagVersion</code>、<code>profile</code>、<code>optInRules</code>です。実行が使った適合性の目標を示すので、ダッシュボードはWCAG 2.1の実行と2.2の実行を区別できます。その目標を超えてオプトインルールのタグを追加した場合は、それも示します。これらのフィールドより前のエンジンの結果では省略されます。</> },
];

export function SarifReportContent() {
	return (
		<>
			<p>
				<code>--sarif &lt;path&gt;</code>
				は、
				<code>--json</code>
				が出すエンジンの生の結果の代わりに、またはそれと並べて、
				<a href="https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html">SARIF 2.1.0</a>
				のログを書き出します。<span lang="en">GitHub Code Scanning</span>（やその他のSARIFを読み込むダッシュボード）が前提とする標準形式です。
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --sarif results.sarif", command: true }]} />
			<p>
				スキャンを実行して
				<code>results.sarif</code>
				を「<span lang="en">Security</span>」タブにアップロードする、そのまま貼り付けて使える<span lang="en">GitHub Actions</span>のワークフローは
				<a href="/configuration/ci-integration/">CI連携</a>
				を参照してください。
			</p>

			<h2>
				<code>--json</code>
				とは別の形式にしている理由
			</h2>
			<p>
				<code>--json</code>
				の生の結果（
				<a href="/results-reports/output-schema/">出力スキーマ</a>
				を参照）はこのエンジン独自の契約で、
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a>
				に従ってバージョン管理され、安定しています。SARIFはそれとは別の、外部で定義された契約で、コードスキャンのダッシュボード向けに作られています。
				<code>checksResults[]</code>
				のエントリーとSARIFの
				<code>result</code>
				は1対1に対応しないので、
				<strong>これは単なるシリアライズのし直しではなく、本当の意味での変換です</strong>
				。
			</p>

			<h2>SARIFのresultになるもの</h2>
			<p>
				<strong>
					SARIFのresultになるのは
					<code>fail</code>
					／
					<code>cantTell</code>
					の検出箇所だけです
				</strong>
				（
				<a href="/results-reports/html-report/">HTMLレポート</a>
				と同じく「違反だけ」という考え方です）。
			</p>
			<p>
				<code>notApplicable</code>
				のチェックが常に空とは限りません。ルールは、判定する対象がなかった理由を説明する検出箇所を1つ付けることがあり、コントラストのルールは、背景を計算できるテキストが1つもなかったときにそうします。これらがresultになることはありません（利用側はすべてのresultをアラートとして扱いますが、「評価されなかった」はアラートではないからです）。ただし、捨てられもしません。
				<code>runs[0].invocations[0].toolExecutionNotices</code>
				に
				<code>note</code>
				レベルのエントリーとして記録され、それぞれ
				<code>associatedRule.id</code>
				で元のルールを示します。
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"invocations": [',
					"  {",
					'    "executionSuccessful": true,',
					'    "toolExecutionNotices": [',
					"      {",
					'        "level": "note",',
					'        "message": { "text": "No eligible text had computable contrast (eligible text nodes: 13). See the contrast computability rule for details." },',
					'        "associatedRule": { "id": "contrast-minimum" }',
					"      }",
					"    ]",
					"  }",
					"]",
				]}
			/>
			<p>
				<strong>これにより、SARIFだけを使うパイプラインが、何も報告がないことを問題なしと読み違えずに済みます</strong>
				。コントラストのアラートがないのは、ページに問題がないからかもしれませんし、コントラストがそもそも計算できなかったからかもしれません。その2つを区別できるのはこの通知だけです。このブロックは伝えることがあるときにだけ出力されるので、報告することがない実行では
				<code>invocations</code>
				キー自体がありません。
			</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "outcome", label: "エンジンの判定結果", width: "22%" },
					{ key: "level", label: "SARIFのlevel", width: "18%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={sarifLevelRows}
			/>
			<p>
				実行されたルールは（resultを出したかどうかにかかわらず）すべて
				<code>runs[0].tool.driver.rules</code>
				に1度ずつ列挙され、
				<code>defaultConfiguration.level</code>
				はルールの
				<code>type</code>
				から決まります。
				<code>automatic</code>
				（failを出せる）なら
				<code>error</code>
				、
				<code>manual</code>
				（
				<code>cantTell</code>
				まで）なら
				<code>warning</code>
				です。
			</p>

			<h2>フィールドの対応</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "SARIFのフィールド", width: "36%", wrap: true },
					{ key: "source", label: "元の値", wrap: true },
				]}
				rows={sarifFieldRows}
			/>

			<h2 id="sarif-locations">位置情報</h2>
			<p>
				DOMベースのスキャンには報告できる行／列がないので、
				<code>physicalLocation.artifactLocation.uri</code>
				はソースファイル上の位置ではなく、スキャン対象そのものになります。
			</p>
			<ul>
				<li>
					<strong>ローカルファイルのスキャン</strong>
					：現在の作業ディレクトリからの相対パス（区切りはスラッシュ）です。これがリポジトリ内の実在するファイルと一致すれば、<span lang="en">GitHub Code Scanning</span>は検出結果をインラインの注釈として表示できます。
				</li>
				<li>
					<strong>URLのスキャン</strong>
					：スキャンしたURLそのものです。<span lang="en">GitHub Code Scanning</span>は検出結果を一覧には表示しますが、リポジトリ内のファイルではないURLにインラインの注釈を付けることはできません。これはSARIF／<span lang="en">Code Scanning</span>が検出結果とソースを結び付ける仕組みによるもので、surea11yの制限ではありません。インラインの注釈が必要なら、公開中のURLではなく、レンダリング済みのHTMLファイル（ビルド成果物など）をスキャンしてください。
				</li>
			</ul>
			<p>
				<code>occurrence.selector</code>
				は
				<code>logicalLocations[].fullyQualifiedName</code>
				としても記録されるので、論理的な位置を読む利用側なら、使える物理的な位置がなくても「どの要素か」という情報を得られます。
			</p>

			<h2>
				<code>--baseline</code>
				との併用
			</h2>
			<p>
				一般的なSARIFの利用側には、「既知なのでこれでは止めない」という概念がありません。SARIFの出力でベースラインを忠実に反映する唯一の方法は、
				<strong>
					既知の
					<code>fail</code>
					の検出箇所を
					<code>warning</code>
					に格下げするのではなく、完全に省くことです
				</strong>
				。
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --baseline baseline.json --sarif results.sarif", command: true }]} />
			<p>
				<code>cantTell</code>
				の検出箇所がベースラインで除外されることはありません。ベースラインの仕組みが追跡するのは
				<code>fail</code>
				の検出箇所だけです（
				<code>--write-baseline</code>
				と同じです。
				<a href="/conformance/baseline/">ベースライン／許可リスト</a>
				を参照）。
			</p>

			<h2>
				<code>--html</code>
				／
				<code>--json</code>
				との併用
			</h2>
			<p>
				<code>--sarif</code>
				、
				<code>--html</code>
				、
				<code>--json</code>
				は互いに独立した出力フラグです。1回の実行でどう組み合わせても構いません。どれも同じ1回のスキャンから、それぞれのレポートを書き出し／出力します。
			</p>
		</>
	);
}
