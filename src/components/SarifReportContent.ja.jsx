import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const sarifLevelRows = [
	{ id: "fail", outcome: <code>fail</code>, level: <code>error</code>, meaning: "決定論的な違反です。CIのゲート判定に使うのはこのケースです。" },
	{ id: "cantTell", outcome: <code>cantTell</code>, level: <code>warning</code>, meaning: "人間によるレビューが必要です。表示はされますが、それだけでビルドを止めるべきではありません。" },
	{ id: "leanFail", outcome: <><code>fail</code>に傾く<code>cantTell</code>（<code>leanFailAs: 'error'</code>指定時）</>, level: <code>error</code>, meaning: <>未判定ですが、ページの根拠が不適合を指しています（<a href="/results-reports/output-schema/#leans"><code>lean</code></a>）。errorによるゲートで数えられます。</> },
];

const sarifFieldRows = [
	{ id: "ruleId", field: <code>results[].ruleId</code>, source: <code>checksResults[i].ruleId</code> },
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code>＋<code>occurrence.hint</code>。要約のない検出箇所（カスタムルールのものなど）では、ルールのタイトル、またはそのIDを使います。GitHubは空のテキストを持つresultを拒否するためです。未判定の検出結果では、空行の後に手順が続きます。<code>How to check:</code>、番号付きの手順、そして<code>Passes when:</code>と<code>Fails when:</code>で、アラートがそれへの答え方を示すようにします。</> },
	{ id: "howToCheck", field: <code>results[].properties.howToCheck</code>, source: <>未判定の検出結果の手順で、<a href="/results-reports/output-schema/#how-to-check"><code>occurrence.howToCheck</code></a>が示すとおりの<code>{"{ steps, passWhen, failWhen }"}</code>です。バインディングの結果のように手順を持たない結果には、Nodeで追加されます。<code>packs</code>（スキャンが実行したパック）を渡すと、パックのルール自身の手順も追加されます。傾きと同じく、検出結果の同一性には含まれません。</> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>スキャン対象そのものです。後述の<a href="#sarif-locations">位置情報</a>を参照してください。</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>, source: <>要素の位置で、<code>kind: "element"</code>を伴います。<code>occurrence.selector</code>が空でない文字列の場合に含まれます。シャドウツリーの外ではセレクターそのものです。シャドウツリー内の要素では、シャドウホストのセレクター、続いて要素自身のセレクターを<code>{" >>> "}</code>でつないだものです：<code>{"html > body > main > x-card >>> button"}</code>。JUnitの<code>selector:</code>行とHTMLレポートも同じテキストを示します。</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v2"]</code>,
		source: (
			<>
				<a href="/conformance/baseline/">ベースライン／許可リスト</a>
				（
				<code>computeBaselineKey</code>
				）で使うものと同じ
				<code>ruleId + reasonCode + html</code>
				の識別キーのSHA-256ダイジェスト（16進数64桁）です。位置ではなく内容に基づく、安定したフィンガープリントで、これを読む利用側のためのものです。同じ検出結果は、どのレポートでも同じダイジェストになります。1.11より前は
				<code>surea11y/violation/v1</code>
				がキーそのものを保持していたため、
				<code>v1</code>
				を読んでいたツールでは、各検出結果が一度だけ新規として扱われます。
				<strong>理由コードが変わった検出結果は、別のダイジェストになります</strong>
				。1.14では、新たにコードを示すようになった17件のルールの検出結果と、原因ごとに分けられたコードの検出結果がこれに当たり、それらの<span lang="en">Code Scanning</span>のアラートは一度閉じられ、検出結果は新規として戻ります（
				<a href="/conformance/baseline/">ベースライン／許可リスト</a>
				を参照）。
			</>
		),
	},
	{
		id: "lineHash",
		field: <code>results[].partialFingerprints.primaryLocationLineHash</code>,
		source: (
			<>
				ダイジェストの先頭16桁の16進数とカウントで、<code>&lt;16 hex digits&gt;:&lt;n&gt;</code>の形です（<code>v2</code>以前から変わっていません）。<code>n</code>は、ページ上で繰り返される検出結果（同じ壊れたコンポーネントが2つある場合など）を数えます。<span lang="en">GitHub Code Scanning</span>は、アップロード間のアラートをこのフィールドだけで照合します。DOMの検出結果には、GitHubのアップロードアクションがハッシュ化できる行がありません。そのため、これがなかったときはアラートが位置で照合され、ある検出結果を修正すると別の検出結果のアラートが閉じることがありました。core 1.8以前から移行すると、最初のアップロードで既存のアラートがいったん閉じられ、新しいアラートとして開き直されます。これは一度だけです。GitHubで行った却下（dismiss）は、もう一度行う必要があります。
			</>
		),
	},
	{ id: "props", field: <><code>results[].properties.severity</code>／<code>.confidence</code>／<code>.reasonCode</code>／<code>.html</code></>, source: <>結果自身の<code>severity</code>／<code>confidence</code>と、上のフィンガープリントのキーになっているのと同じ<code>reasonCode</code>と<code>html</code>の断片です。参考情報であり、SARIF自体のスキーマには含まれません。</> },
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>、<code>automatic</code>／<code>manual</code>、そして<code>meta.normativeMappings</code>内のWCAG達成基準のうち、スキャンのWCAGのレベルとバージョンが残すものごとに1つの<code>wcag-&lt;SC&gt;</code>タグです。それらによってスキャンが<code>rulesResults</code>から外した達成基準にはタグが付きません。<code>engineOptions.wcagLevel: 'AA'</code>のもとでのAAAの達成基準や、WCAG 2.2で<code>{"includeRuleIds: ['duplicate-id']"}</code>を実行したときの4.1.1です。スキャンが報告する達成基準は、レベルより上でもIDで指定された集約のように、タグを保ちます。<code>engine.wcagLevel</code>も<code>engine.wcagVersion</code>も記録していない結果では、すべての達成基準がタグを保ちます。ルール自体は残り、対応するすべての達成基準が外された場合は、そのresultもnoteとして残ります（<a href="#outside-the-target">前述</a>を参照）。Understanding文書のエントリーにはタグを付けません。結果が持つEN 301 549の各条項（スキャンが要求した場合のみ。<a href="/configuration/engine-options/#other-standards-mappings">ほかの規格</a>を参照）には<code>en301549-&lt;条項&gt;</code>タグ（例：<code>en301549-9.1.1.1</code>）が付きます。条項番号はそれを含むどのバージョンでも同じなので、タグにバージョンは含めません。パックの規格やチェックリストも、それ自身のキーで同じようにタグ付けされます（チェックリスト項目のid、<code>acme-images</code>がそのままタグになります）。続いて、ルール自身の<code>meta.tags</code>（カスタムルールのものも含む）が入ります。エンジンの管理用のタグと、<code>wcag-&lt;SC&gt;</code>タグがすでに示している達成基準のタグは除きます。</> },
	{ id: "helpUri", field: <code>tool.driver.rules[].helpUri</code>, source: <>ルールのヘルプリンクである<code>meta.helpUrl</code>が絶対<code>http(s)</code> URLならその値、そうでなければ対応する最初のWCAG達成基準のUnderstanding文書です。どちらもないルールでは含まれませんが、組み込みルールにそうしたものはありません。どの達成基準にも対応しないルールは、ルールカタログにある自身の節にリンクします。</> },
	{ id: "toolVersion", field: <code>tool.driver.version</code>, source: <><code>toolVersion</code>オプションが指定されていればその値（エンジンを組み込んだツールは自身のバージョンを渡します）、なければ結果を生成したエンジンのリリースである<code>engine.version</code>です。<code>"0.0.0"</code>になるのは、1.10.0より前のリリースによる、この値を持たない結果か、<code>engine.version</code>が文字列でない結果の場合だけです。</> },
	{ id: "category", field: <code>runs[0].automationDetails.id</code>, source: <><code>category</code>オプションの値で、末尾に<code>/</code>がなければ追加します（GitHubは最後のスラッシュまでをカテゴリーとして読むためです）。カテゴリーを指定しない場合は含まれません。<a href="#scanning-at-several-viewport-widths">複数のビューポート幅でのスキャン</a>を参照してください。</> },
	{ id: "runProps", field: <code>runs[0].properties</code>, source: <>結果の<code>engine</code>にある<code>wcagVersion</code>、<code>wcagLevel</code>（スキャンにレベルがあった場合。<code>engineOptions.wcagLevel</code>、または選択が示すレベル）、<code>profile</code>（複数のプロファイルでのスキャンでは最初のプロファイル）、<code>profiles</code>（複数のプロファイルでのスキャンのみ。実行したすべてのプロファイル、<code>engine.profiles</code>）、<code>optInRules</code>、<code>environment</code>（<code>engine.environment</code>のコピー）です。実行が使った適合性の目標を示すので、ダッシュボードはWCAG 2.1の実行と2.2の実行を、またAAの実行とすべてのレベルの実行を区別できます。その目標を超えてオプトインルールのタグを追加した場合は、それも示します。また、ページがレンダリングされた条件（<code>layout</code>、<code>viewport</code>、<code>devicePixelRatio</code>、<code>colorScheme</code>、<code>forcedColors</code>、<code>fonts</code>、フックのものを含むそのほかのすべてのフィールド。<a href="/results-reports/output-schema/#top-level-result">出力スキーマ</a>を参照）も示します。これらのフィールドより前のリリースの結果では省略されます。</> },
];

const sarifOptionRows = [
	{ id: "toolVersion", option: <code>toolVersion</code>, def: <code>engine.version</code>, effect: <><code>tool.driver.version</code>です。エンジンを組み込んだツールのためのものです。</> },
	{ id: "informationUri", option: <code>informationUri</code>, def: <code>'https://github.com/SureA11y/core'</code>, effect: <><code>tool.driver.informationUri</code>、つまりツールのホームページです。</> },
	{ id: "baselineEntries", option: <code>baselineEntries</code>, def: "なし", effect: <>保存したままのベースラインファイル（それを<code>JSON.parse</code>したもの）、またはその<code>entries</code>の一覧です。<a href="/conformance/baseline/#file-format">ファイル形式</a>を参照してください。そこに記録された<code>fail</code>の検出箇所は、<code>--baseline</code>と同じく省かれます（後述）。1つ前のマイナーリリースが書いたエントリーのうち、その後に変わった理由コードのものも、新しいコードの検出結果に一致します（<a href="/conformance/baseline/#upgrading">アップグレード</a>を参照）。</> },
	{ id: "allowProfilesNotRun", option: <code>allowProfilesNotRun</code>, def: <code>false</code>, effect: <><a href="/configuration/engine-options/#several-profiles">複数のプロファイル</a>でのスキャンが、求めたより少ないプロファイルしか実行しなかった場合（<code>engine.profilesNotRun</code>）、求められたより少なく数えたことになります。実行されなかった各プロファイルは<code>error</code>の通知になり、その呼び出しは<code>executionSuccessful</code>になりません。<code>true</code>にすると警告になります。<code>true</code>と<code>false</code>以外の値を指定すると<code>TypeError</code>が投げられます。core 1.15.0以降。</> },
	{ id: "category", option: <code>category</code>, def: "なし", effect: <><code>runs[0].automationDetails.id</code>です。<a href="#scanning-at-several-viewport-widths">複数のビューポート幅でのスキャン</a>を参照してください。</> },
	{ id: "leanFailAs", option: <code>leanFailAs</code>, def: <code>'warning'</code>, effect: <><code>'error'</code>にすると、傾きが不適合を指す<code>cantTell</code>の検出結果を<code>error</code>で報告するため、errorでゲートするビルドは不適合の可能性が高いものでも失敗します。大文字と小文字は区別しません。ほかの値を指定すると<code>TypeError</code>が投げられます。ベストプラクティスのルールも対象です。そうしたルールはどのWCAG達成基準にも対応せず、<code>fail</code>になることはありませんが、示す事実は無条件で不適合に傾くため、見出しレベルの飛び（<code>heading-order</code>）は<code>error</code>になります。対応するすべての達成基準がスキャンの目標の外にあるルールの検出結果は<code>note</code>のままです。不適合に傾き、<code>baselineEntries</code>に<code>lean: 'fail'</code>と示されたエントリーがある検出結果は<code>warning</code>のままです。</> },
	{ id: "leanFailWcagOnly", option: <code>leanFailWcagOnly</code>, def: <code>false</code>, effect: <><code>leanFailAs: 'error'</code>と組み合わせて<code>true</code>にすると、スキャンの目標内のWCAG達成基準に対応するルールの検出結果だけを引き上げ、ベストプラクティスのルールの傾きは<code>warning</code>のままにします。<code>true</code>と<code>false</code>以外の値を指定すると<code>TypeError</code>が投げられます。<code>@surea11y/core</code>の<code>leaningFailures(result, {"{ wcagOnly }"})</code>は、この2つのオプションが引き上げる検出結果を、ベースラインを適用する前の状態で列挙します。</> },
	{ id: "packs", option: <code>packs</code>, def: "なし", effect: <>スキャンが実行したパック（<code>engineOptions.packs</code>）です。Nodeでは、パックのルールの未判定の検出結果が、そのルール自身の<code>meta.review</code>の手順（<code>properties.howToCheck</code>）を持ちます。</> },
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
				<strong>そのため、resultのないログが示すのは、実行されたチェックの中に不合格やレビューが必要なものがなかったということだけです</strong>
				。何がチェックされたかは示さず、適合の表明でもありません。それにはJSONの結果を保存してください。
			</p>
			<p>
				<code>notApplicable</code>
				のチェックが常に空とは限りません。ルールは、判定する対象がなかった理由を説明する検出箇所を1つ付けることがあり、コントラストのルールは、背景を計算できるテキストが1つもなかったときにそうします。これらがresultになることはありません（利用側はすべてのresultをアラートとして扱いますが、「評価されなかった」はアラートではないからです）。ただし、捨てられもしません。
				<code>runs[0].invocations[0].toolExecutionNotifications</code>
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
					'    "toolExecutionNotifications": [',
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
				キー自体がありません。合格したルールは通知を書き出しません。
			</p>
			<p>
				完了しなかったルール（例外を投げたもの。検出箇所がなく
				<code>error</code>
				を持つ
				<code>cantTell</code>
				）は何も判定していないので、これもresultにはなりません。同じリストの
				<code>error</code>
				レベルの通知
				<code>"The rule &lt;id&gt; did not complete: &lt;error&gt;"</code>
				になり、
				<code>associatedRule.id</code>
				でルールを示します。そのため、カバレッジの抜けが合格と読まれることはありません。
			</p>
			<DataTable
				label="エンジンの判定結果とSARIFのレベル"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "エンジンの判定結果", width: "22%" },
					{ key: "level", label: "SARIFのlevel", width: "18%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={sarifLevelRows}
			/>
			<p>
				傾きのある未判定の検出結果は、どのlevelで報告されても、それを
				<code>properties.lean</code>
				に持ちます：
				<code>{'{ "toward": "fail", "why": "The heading skips a level after the one before it." }'}</code>
				。傾きにあれば、誤りになりうる要因である
				<code>caution</code>
				（
				<code>"A layout table can also hold numbers."</code>
				）と、これまでどれだけ正しかったかを示す
				<code>measured</code>
				（
				<code>{'{ "agreed": 47, "cases": 50, "corpus": "…", "coreVersion": "…" }'}</code>
				。5件のケースで数えられた傾きにだけ付きますが、まだそうした傾きはありません）も持つので、アラートは
				<a href="/results-reports/html-report/">HTMLレポート</a>
				が傾きと並べて示すものを示します。
				<code>signals</code>
				と
				<code>i18n</code>
				のキーはスキャン結果に残ります。
			</p>
			<p id="outside-the-target">
				WCAGの達成基準がすべてスキャンの目標の外にあるルール（
				<code>engineOptions.wcagLevel: 'AA'</code>
				のもとでのAAAのルールや、WCAG 2.2のもとでの
				<code>duplicate-id</code>
				。後述の
				<code>wcag-&lt;SC&gt;</code>
				タグと同じく、スキャンが
				<code>rulesResults</code>
				から外した達成基準です）も実行されており、その
				<code>fail</code>
				と
				<code>cantTell</code>
				の検出結果はresultとして残ります。レベルは
				<code>note</code>
				で、目標に合わせたビルドを不合格にせずに目に入るようにしています。それぞれ
				<code>properties.outsideTarget</code>
				で理由を示します：
				<code>{'{ "criteria": ["1.4.6"], "target": "WCAG 2.2 AA" }'}</code>
				。
			</p>
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
				<code>fail</code>
				にはならない）なら
				<code>warning</code>
				です。保存された結果で文字列でないルールIDは、そのテキストとして書き出されます。ルールIDのないチェックはどのルールも示さないため、JUnitやEARLと同じく省かれます。
			</p>

			<h2 id="field-mapping">フィールドの対応</h2>
			<DataTable
				label="SARIFのフィールドの対応"
				rowKey="id"
				columns={[
					{ key: "field", label: "SARIFのフィールド", width: "36%", wrap: true },
					{ key: "source", label: "元の値", wrap: true },
				]}
				rows={sarifFieldRows}
			/>
			<p>
				コンパクトな結果（
				<code>engineOptions.output.detail: 'findings'</code>
				。
				<a href="/results-reports/output-schema/#top-level-result">出力スキーマ</a>
				を参照）は、それが表す完全な結果として読まれるので、同じように報告されます。
				<code>standards</code>
				の一覧がないか壊れている結果でも、ルールが指定するすべての規格がタグ付けされます。
			</p>

			<h2 id="sarif-locations">位置情報</h2>
			<p>
				DOMベースのスキャンには報告できる行／列がないので、
				<code>physicalLocation.artifactLocation.uri</code>
				はソースファイル上の位置ではなく、スキャン対象そのものになります。
			</p>
			<ul>
				<li>
					<strong>ローカルファイルのスキャン</strong>
					：現在の作業ディレクトリ内のファイルは、そこからの相対パス（区切りはスラッシュ）になり、各セグメントはパーセントエンコードされます（<code>build%20out/index.html</code>）。これがリポジトリ内の実在するファイルと一致すれば、<span lang="en">GitHub Code Scanning</span>は検出結果をインラインの注釈として表示できます。作業ディレクトリの外にあるファイルは、<code>../</code>でリポジトリの外へ出る相対パスではなく、絶対<code>file:</code> URLになります。そのような相対パスは、受け取る側が解決できないためです。
				</li>
				<li>
					<strong>URLのスキャン</strong>
					：スキャンしたURLそのものです。<span lang="en">GitHub Code Scanning</span>は検出結果を一覧には表示しますが、リポジトリ内のファイルではないURLにインラインの注釈を付けることはできません。これはSARIF／<span lang="en">Code Scanning</span>が検出結果とソースを結び付ける仕組みによるもので、surea11yの制限ではありません。インラインの注釈が必要なら、公開中のURLではなく、レンダリング済みのHTMLファイル（ビルド成果物など）をスキャンしてください。URLはURLパーサーがシリアライズするとおりに書き出されるため、URIに入れられない文字はパーセントエンコードされます（<code>https://example.test/a%20b</code>）。
				</li>
				<li>
					<strong>その他の対象</strong>
					：<code>url</code>がURLでない結果、たとえばページをスキャンしたときのパス（<code>runDomRulesInPage('dist/my page.html', …)</code>）は、相対パス（区切りはスラッシュ）になり、各セグメントはパーセントエンコードされます（<code>dist/my%20page.html</code>）。Windowsのパスは絶対<code>file:</code> URLになります。<code>url</code>がない結果や、文字列でない結果の位置は<code>about:blank</code>です。
				</li>
			</ul>
			<p>
				要素の位置（そのセレクター。シャドウツリー内にある場合は、シャドウホストのセレクターと
				<code>{" >>> "}</code>
				を前に付けたもの）は
				<code>logicalLocations[].fullyQualifiedName</code>
				としても記録されるので、論理的な位置を読む利用側なら、使える物理的な位置がなくても「どの要素か」という情報を得られます。
			</p>

			<h2 id="cross-frame-results">フレーム横断の結果</h2>
			<p>
				<code>runa11yCoreAcrossFrames</code>
				、またはバインディングの
				<code>.frames(true)</code>
				によるスキャンの結果（
				<a href="/results-reports/output-schema/#cross-frame-result">出力スキーマ</a>
				を参照）は1つの実行になり、すべてのフレームの検出結果がその中のresultになります。フレーム内の検出結果の位置はそのフレームのドキュメントで（
				<code>artifactLocation.uri</code>
				はフレームのURL）、
				<code>properties.frame</code>
				にフレームのパスを持ちます。
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"properties": {',
					'  "severity": "serious",',
					'  "confidence": "high",',
					'  "reasonCode": "DEFAULT",',
					'  "html": "<img src=\\"card.png\\">",',
					'  "frame": ["#checkout"]',
					"}",
				]}
			/>
			<p>
				パスは検出結果の識別（
				<code>partialFingerprints</code>
				）にも含まれるため、ページとフレーム、あるいは2つのフレームにある同じ欠陥は、2つのアラートになります。応答しなかったフレーム（応答側がない、またはタイムアウトした）は、その中の何も検査されていないため、
				<code>warning</code>
				レベルの通知
				<code>"The frame #ads (https://ads.example/) was not scanned: &lt;error&gt;"</code>
				になります。
			</p>

			<h2 id="scanning-at-several-viewport-widths">複数のビューポート幅でのスキャン</h2>
			<p>
				レイアウトに依存するルールは、あるビューポート幅では<code>fail</code>になり、別の幅では<code>pass</code>になることがあります（<a href="/help/known-limitations/">既知の制限事項</a>を参照）。そのため、2つの幅でスキャンしたページは、1つの分析ではなく2つの分析です。それぞれに独自のカテゴリーを指定してください。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderSarifReport } = require('@surea11y/core/sarif');",
					"",
					"for (const width of [390, 1280]) {",
					"  // ...scan the page at this width into `result`...",
					"  fs.writeFileSync(`a11y-${width}.sarif`, renderSarifReport(result, { category: `a11y-${width}` }));",
					"}",
				]}
			/>
			<p>
				そのうえで、各ファイルを別々にアップロードします。<span lang="en">GitHub Code Scanning</span>は、カテゴリーごとに独立した分析として扱います。1つのカテゴリー内では、後のアップロードが前のものを置き換え、そこに含まれないアラートは閉じられます。そのため、2つの幅を同じカテゴリーでアップロードすると、幅に固有のアラートが実行のたびに開いたり閉じたりします。また、GitHubは、同じツールとカテゴリーの実行を2つ含む1つのSARIFファイルを拒否します。<code>github/codeql-action/upload-sarif</code>には<code>category</code>入力があり、ファイルにカテゴリーがない場合は同じ役割を果たします。
			</p>
			<p>
				検出結果の識別にはビューポートは含まれず、含める必要もありません。同じ要素の同じ欠陥は、どの幅でも同じ検出結果であり、分析を分けておくのはカテゴリーの役割です。<code>runs[0].properties.environment</code>には、各実行が使ったビューポートが記録されます。
			</p>

			<h2 id="options">オプション</h2>
			<p>
				<code>@surea11y/core/sarif</code>
				の
				<code>renderSarifReport(result, options)</code>
				は、ログをJSONのテキストとして返します。次のオプションを取ります。
			</p>
			<DataTable
				label="renderSarifReportのオプション"
				rowKey="id"
				columns={[
					{ key: "option", label: "オプション", width: "22%" },
					{ key: "def", label: "デフォルト", width: "30%", wrap: true },
					{ key: "effect", label: "効果", wrap: true },
				]}
				rows={sarifOptionRows}
			/>

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
				の検出箇所がベースラインで除外されることはありません。
				<code>{"buildBaselineEntries(result, { leanFail: true })"}</code>
				で書いたベースラインは、不適合に傾く検出結果も
				<code>lean: 'fail'</code>
				と示したエントリーとして記録します（
				<a href="/conformance/baseline/#findings-that-lean-fail">ベースライン／許可リスト</a>
				を参照）。
				<code>leanFailAs: 'error'</code>
				のもとでは、そうした検出結果は
				<code>error</code>
				に引き上げられず
				<code>warning</code>
				のままなので、チームはすでにある不適合の可能性が高いものを受け入れつつ、新しいものでゲートできます。
				<code>--write-baseline</code>
				が記録するのは
				<code>fail</code>
				の検出箇所だけです。
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
