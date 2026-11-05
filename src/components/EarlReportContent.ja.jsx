import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import engine from "../data/engine.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const earlOutcomeRows = [
	{ id: "pass", engine: <code>pass</code>, earl: <code>earl:passed</code> },
	{ id: "fail", engine: <code>fail</code>, earl: <code>earl:failed</code> },
	{ id: "cantTell", engine: <code>cantTell</code>, earl: <code>earl:cantTell</code> },
	{ id: "notApplicable", engine: <code>notApplicable</code>, earl: <code>earl:inapplicable</code> },
];

export function EarlReportContent() {
	return (
		<>
			<p>
				<code>@surea11y/core/earl</code>
				は、スキャン結果をJSON-LD形式の
				<a href="https://www.w3.org/TR/EARL10-Schema/">EARL 1.0</a>
				として出力します。EARLは「このツールがこの対象をテストし、この結果を得た」ことを表すためにW3Cが公開している語彙で、
				<a href="https://act-rules.github.io/"><span lang="en">ACT Rules</span></a>
				コミュニティグループが実装レポートとして受け付ける形式でもあります。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderEarlReport } = require('@surea11y/core/earl');",
					"",
					"const report = renderEarlReport(result, {",
					`  assertor: { name: 'surea11y', version: '${engine.version}' },`,
					"  mode: 'earl:automatic'",
					"});",
					"",
					"fs.writeFileSync('earl.jsonld', JSON.stringify(report, null, 2));",
				]}
			/>

			<h2>用途</h2>
			<p>読み手は2種類いて、同じドキュメントを別々の理由で必要としています。</p>
			<p>
				<strong>実装レポート</strong>
				は、<span lang="en">ACT Rules</span>コミュニティグループのテストケースに対してこのエンジンがどう振る舞うかを伝えるものです。これによって、エンジンがほかの実装と並んで掲載されます。掲載は推奨を意味せず、W3Cがデータを検証するわけでもありません。正確な言い方は
				<em>「ACT実装として掲載されている」</em>
				であり、
				<em>「W3C認定」</em>
				ではありません。このエンジンは2つのレポートを公開しており、どちらも最新のリリースから<code>scripts/act-report.js</code>で再生成しています。1つはCLIとtest-matchersがエンジンを実行するのと同じjsdomでのスキャンによる<a href="https://surea11y.github.io/act-report/act-report.jsonld">jsdomでのレポート</a>で、アサーターの名前は「<span lang="en">SureA11y</span>」です。もう1つはブラウザーのバインディングが実行するのと同じChromiumでのスキャンによる<a href="https://surea11y.github.io/act-report/act-report-browser.jsonld">Chromiumでのレポート</a>（<code>--runner=chromium</code>）で、アサーターの名前は「<span lang="en">SureA11y in a browser</span>」、レポートの説明にはChromiumのバージョンが入ります。<a href="https://github.com/SureA11y/act-report"><span lang="en">SureA11y/act-report</span></a>のワークフローが毎週月曜日に両方を公開し直し、各リリースの後には手動でも実行されます。
			</p>
			<p>
				<strong>利用者</strong>
				にとっては、データ交換用の形式になります。自動スキャンと手動の監査、あるいは複数のエンジンのように、複数の情報源の結果を組み合わせる必要があるとき、アクセシビリティ関連のツールが読み込むのがEARLです。どのアサーションにも、誰がどのように判定したかが記録されているからです。どこかに提出するかどうかにかかわらず、持っておく価値があります。
			</p>

			<h2>ほかのレポーターとの違い</h2>
			<p>
				<a href="/results-reports/sarif-report/">SARIFレポート</a>
				と
				<a href="/results-reports/html-report/">HTMLレポート</a>
				はどちらも
				<strong>違反だけ</strong>
				を扱います。
				<code>fail</code>
				と
				<code>cantTell</code>
				の検出箇所を報告し、それ以外は捨てます。EARLはその逆です。
				<strong>
					実行されたすべてのルールがアサーションになり、
					<code>pass</code>
					も
					<code>inapplicable</code>
					も含まれます
				</strong>
				。実装レポートは、エンジンが
				<em>あらゆる箇所</em>
				で何を判定したかについての主張だからです。適用対象が見つからずに何も報告しなかったルールも、ノイズではなく証拠です。それによって読み手は、「このエンジンはチェックしたが、チェック対象がなかった」のか「このエンジンはそのルールをそもそも実装していない」のかを区別できます。
				<strong>各アサーションは、1つの対象に対する1つのルールについてのものです</strong>
				。ルールの
				<code>passed</code>
				は、そのルールが対応するWCAGの達成基準についての判定ではありません。ほとんどの達成基準には、どのルールも扱わない部分があります（
				<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>
				を参照）。
			</p>

			<h2>構造</h2>
			<p>グラフはアサーションを平らに並べたリストではなく、対象（subject）ごとにまとめられています。</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "@context": "https://www.w3.org/WAI/content-assets/wcag-act-rules/earl-context.json",',
					'  "@graph": [',
					"    {",
					'      "@type": "TestSubject",',
					'      "source": "https://example.test/",',
					'      "assertions": [',
					"        {",
					'          "@type": "Assertion",',
					'          "test": { "title": "img-alt-present", "isPartOf": ["WCAG2:non-text-content"] },',
					'          "result": { "outcome": "earl:failed" },',
					'          "assertedBy": {',
					'            "@type": "Assertor",',
					'            "name": "surea11y",',
					`            "release": { "@type": "Version", "revision": "${engine.version}" }`,
					"          },",
					'          "mode": "earl:automatic"',
					"        }",
					"      ]",
					"    }",
					"  ]",
					"}",
				]}
			/>
			<ul>
				<li>
					<strong><code>source</code></strong>
					はスキャンしたURLです。結果にURLがない場合は
					<code>about:blank</code>
					になります。URLのない結果が複数ある場合は、すべてを1つにまとめるのではなく、それぞれをリスト内の位置（1から数えます）による
					<code>about:blank#result-&lt;n&gt;</code>
					という独立した対象にします。
				</li>
				<li>
					<strong><code>test.title</code></strong>
					はエンジン自身のルールIDです。ACTの用語では、ルールとは実装が実行した
					<em>手順</em>
					のことで、ルールIDが指すのはまさにそれです。
				</li>
				<li>
					<strong><code>test.isPartOf</code></strong>
					は、そのルールが対応する達成基準を
					<code>WCAG2:&lt;criterion-id&gt;</code>
					の形で列挙します。対象は、
					<code>standard</code>
					が
					<code>WCAG</code>
					であるか存在せず（SARIFと同じ）、
					<code>type</code>
					を持たない
					<code>normativeMappings</code>
					の各エントリーです。どの達成基準にも対応しないルールでは、このフィールド自体を省略します。空のリストを出すと、「意図的にどれにも対応させていない」ではなく「対応するものが見つからなかった」と読めてしまうためです。エンジンの自動ルールでこれに当たるのは
					<code>aria-allowed-role</code>
					、
					<code>empty-heading</code>
					、
					<code>landmark-role-name-present</code>
					です。そうしたルールも
					<code>fail</code>
					になることはあります（
					<code>empty-heading</code>
					は名前のない見出しを
					<code>fail</code>
					にします）。その場合のアサーションは
					<code>isPartOf</code>
					のない
					<code>earl:failed</code>
					で、どのWCAG達成基準も主張しないルールが不合格になったことを示します。
				</li>
				<li>
					<strong><code>isPartOf</code>はスキャンのWCAGのレベルとバージョンに従います。</strong>
					それらによってスキャンが
					<code>rulesResults</code>
					から外した達成基準は列挙されません。たとえば、
					<code>engineOptions.wcagLevel: 'AA'</code>
					のもとでの1.4.6（AAA）や、WCAG 2.2で
					<code>{"includeRuleIds: ['duplicate-id']"}</code>
					を実行したときの、2.2で削除された4.1.1です。すべての達成基準が外されたルールには
					<code>isPartOf</code>
					がありません。アサーション自体はルールについてのものなので残ります。スキャンが報告する達成基準は列挙されます。レベルより上でもIDで指定された集約や、4.1.1を選んだ2.2のスキャンでの4.1.1です。
					<code>engine.wcagLevel</code>
					も
					<code>engine.wcagVersion</code>
					も記録していない結果では、すべての達成基準が列挙されます。
				</li>
				<li>
					<strong><code>assertedBy</code></strong>
					は、
					<code>assertor: null</code>
					を渡さない限り常に出力されます。デフォルトは
					<code>surea11y</code>
					と、結果が持つエンジンのバージョンです。
					<strong><code>mode</code></strong>
					は、指定した場合にだけ出力されます。
				</li>
			</ul>
			<p>
				達成基準のIDは、その達成基準自身のタイトルから導き出します（
				<code>Non-text Content</code>
				→
				<code>non-text-content</code>
				）。
				<code>normativeMappings</code>
				には、
				<code>type</code>
				を持つ<span lang="en">Understanding</span>文書への参照と、自身の
				<code>standard</code>
				を名乗るほかの規格のエントリー（EN 301 549の条項、パックの要件やチェックリスト項目）も含まれます。どちらも達成基準と同じ
				<code>requirement</code>
				の番号を持つことがあります。達成基準として読み取るのは、
				<code>standard</code>
				が
				<code>WCAG</code>
				であるか存在せず、
				<code>type</code>
				を持たないエントリーだけです。適合レベルは必要ありません。
				<code>isPartOf</code>
				はWCAGの達成基準だけを列挙し、ほかの規格のエントリーは含めません。
			</p>
			<p>
				コンパクトな結果（
				<code>engineOptions.output.detail: 'findings'</code>
				。
				<a href="/results-reports/output-schema/#top-level-result">出力スキーマ</a>
				を参照）は、それが表す完全な結果として読まれるので、同じように報告されます。
			</p>

			<h2>判定結果</h2>
			<DataTable
				label="EARLでのエンジンの判定結果"
				rowKey="id"
				columns={[
					{ key: "engine", label: "エンジン", width: "30%" },
					{ key: "earl", label: "EARL", wrap: true },
				]}
				rows={earlOutcomeRows}
			/>
			<p>
				<code>earl:untested</code>
				に対応するものはありません。実行されなかったルールにはアサーションの元になる結果がないため、untestedのアサーションを出すのではなく、アサーション自体を出しません。
			</p>
			<p>
				<strong>
					<code>cantTell</code>
					を報告しても、ACT実装としての評価が下がることはありません。
				</strong>
				ACT自身の一貫性のルールでは、自動化された実装が一部の例（すべてではありません）で「判断できない」と報告しても、一貫性があるものとして扱われます。部分的に一貫した実装に
				<em>許されない</em>
				のは誤検出です。つまり、ルール上passになるべき例や適用対象外の例をfailにすることです。注視すべきはこの点で、これはこのレポーターではなくルールの性質です。直近のフル実行の時点で、エンジンは対応する60件のルールについてW3Cが公開している957件の例で
				<strong>誤検出ゼロ</strong>
				です。詳しくは
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>
				を参照してください。この数字をいつまでも鵜呑みにせず、最新の値は
				<code>scripts/act-testcase-check.js</code>
				を再実行して確認してください。
			</p>

			<h2>複数の結果を1つのレポートに</h2>
			<p>
				多数のページを対象にしたレポートがごく普通なので、
				<code>renderEarlReport</code>
				は単一の結果と同じように配列も受け取ります。
			</p>
			<CodeBlock lang="js" lines={["renderEarlReport([homeResult, checkoutResult, searchResult], { assertor });"]} />
			<p>
				<a href="/results-reports/output-schema/#cross-frame-result"><code>runa11yCoreAcrossFrames</code></a>
				によるフレームをまたぐ結果は、単独でも配列の中でも、そのまま受け取ります。応答した各フレームが1つの結果として加わり、それぞれのURLを持つ対象になります。最上位より下のフレームで、URLから区別できないもの（
				<code>about:srcdoc</code>
				や
				<code>about:blank</code>
				である場合や、結果の別のフレームが同じURLを持つ場合）は、そのURLとパス（SARIFとJUnitがそのフレームを示すのに使うセレクター）で名前が付けられます。パスの各セレクターはエンコードされ、
				<code>/</code>
				でつながれます：
				<code>about:srcdoc#frame=%23pay</code>
				、
				<code>about:srcdoc#frame=%23widget/%23inner</code>
				。セレクターを持たないバインディングのフレームのように、パスまで同じ場合は、結果のフレームの中での順番（1から）が加わります：
				<code>about:srcdoc#frame=iframe&amp;n=3</code>
				。
				<code>null</code>
				や文字列など、スキャン結果ではないものを渡すと
				<code>TypeError</code>
				を投げます。
			</p>
			<p>
				URLが同じ結果は1つの対象にまとめられます。同じページを異なる
				<code>engineOptions</code>
				でスキャンしても、表しているのは1つのリソースであり、コンテキスト上も同じsourceを持つ2つの対象を表現する手段がないからです。
				<strong>同じURLの同じルールについて2つの結果がアサーションを持つ場合は、悪いほうの判定結果が残ります。</strong>
				順に
				<code>earl:failed</code>
				、
				<code>earl:cantTell</code>
				、
				<code>earl:passed</code>
				、
				<code>earl:inapplicable</code>
				で、入力をどの順序にしても不合格が隠れることはありません。同じページを2つのビューポート幅でスキャンした場合も同じです。EARLにはページがレンダリングされた条件を表す語彙がないため、複数の幅から作ったレポートには、各ルールについて、いずれかの幅での不合格が残ります。幅そのものが重要なら、幅ごとに1つのレポートを生成してください。
			</p>
			<p>
				出力は決定論的です。対象はsource順、アサーションはルールID順に並び、同じ入力であれば順序を問わずバイト単位で同一の出力になります。唯一の例外はURLのない結果で、リスト内の位置（
				<code>about:blank#result-2</code>
				）で区別されます。順序に左右されたくない場合は、各結果にURLを持たせてください。だからこそ、2つのエンジンバージョン間の差分に意味が生まれます。
			</p>

			<h2 id="several-profiles">複数のプロファイルでのスキャン</h2>
			<p>
				<a href="/configuration/engine-options/#several-profiles">複数のプロファイル</a>での結果（core 1.15.0以降）では、チェックの<code>outcome</code>はそのプロファイルが与える最も悪い判定結果で、WCAGが確認を求めるだけの検出結果を、ある規格が不合格にしたものになることがあります。そのため、各アサーションには代わりにルール自身の判定結果である<code>checkOutcome</code>を使います。ロールがサポートしない属性は、WAI-ARIAでは不合格、WCAG 4.1.2では確認を求めるものですが、<code>WCAG2:name-role-value</code>に対して<code>earl:cantTell</code>としてアサートされます。このように、規格の不合格がWCAGの不合格としてアサートされることはありません。
			</p>

			<h2>オプション</h2>
			<DataTable
				label="EARLレポートのオプション"
				rowKey="id"
				columns={[
					{ key: "option", label: "オプション", width: "22%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={[
					{ id: "assertor", option: <code>assertor</code>, meaning: <><code>{"{ name, version }"}</code>。nameのデフォルトは<code>surea11y</code>です。versionはassertorの<code>release</code>として出力され、すべての結果が同じ<code>engine.version</code>を持つ場合はその値がデフォルトになります。異なるリリースの結果が混在する場合は、指定しない限り<code>release</code>は付きません。<code>assertedBy</code>を丸ごと省くには<code>null</code>を渡します。</> },
					{ id: "mode", option: <code>mode</code>, meaning: <><code>'earl:automatic'</code>などのEARLのテストモードです。指定しない場合は省略されます。</> },
				]}
			/>

			<h2>関連情報</h2>
			<ul>
				<li>
					<a href="/results-reports/output-schema/">出力スキーマ</a>
					：このレポーターが読み込む結果
				</li>
				<li>
					<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>
					：エンジンのルールがどのACTルールに対応するか
				</li>
				<li>
					<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a>
					：semverの対象となる範囲
				</li>
			</ul>
		</>
	);
}
