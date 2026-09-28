import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const topLevelRows = [
	{ id: "engine.tag", field: <code>engine.tag</code>, meaning: <>エンジン自身の識別タグで、現在は<code>"a11ycore"</code>です。すべてのルール（組み込みもカスタムも）は<code>meta.tags</code>にこのタグを持ちます。ルールの<code>ruleId</code>自体にはプレフィックスが付きません。</> },
	{
		id: "engine.schemaVersion",
		field: <code>engine.schemaVersion</code>,
		meaning: (
			<>
				結果スキーマのバージョン（<code>"1.0.0"</code>）です。このドキュメントで示す形に互換性のない変更が入れば上がるので、出力をプログラムで解析する場合はこの値に固定してください。安定・不安定なフィールドの一覧と、バージョンを上げる方針については<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a>を参照してください。
			</>
		),
	},
	{
		id: "engine.locale",
		field: <code>engine.locale</code>,
		meaning: (
			<>
				スキャンで実際に使われた辞書です。<code>requested</code>はトリム後の<code>engineOptions.locale</code>（何も渡さなかった場合や文字列以外を渡した場合は<code>"en"</code>）、<code>resolved</code>は実際に辞書が使われたロケール、<code>reason</code>はその組み合わせになった理由です。ロケールのフォールバックはエラーにならず文字列単位で行われるため、<strong>ビルドに含まれていない言語を指定すると、エラーではなく英語のテキストになります</strong>。このフィールドを見れば、文字列を読まなくてもそれが分かります。1回のスキャンでは全体を通して1つの辞書を使うので、結果ごとに1回だけ報告されます。
			</>
		),
	},
	{
		id: "engine.locale.reason",
		field: <code>engine.locale.reason</code>,
		meaning: (
			<>
				<code>"ok"</code>：指定した辞書が使われ、すべてのキーがそろっています。<code>"primary-subtag"</code>：コードにサブタグが付いていて、それ専用の辞書がないため、ベース言語が使われました。<code>"de-DE"</code>は<code>"de"</code>に解決されます。<code>"dictionary-not-loaded"</code>：プロジェクトとしてはその言語を提供していますが、このビルドには含まれておらず、辞書も渡されませんでした（ロケールの別ファイルなしでスタンドアロンのブラウザー用バンドルを使った場合）。<code>"unknown-locale"</code>：プロジェクトにその言語の翻訳がそもそもありません。<code>"partial-dictionary"</code>：辞書は使われましたが、英語にあるキーの一部が欠けているため、それらの文字列は英語にフォールバックしました。この値の集合は今後も増えうるものとして扱ってください。後のリリースで追加されることがあります。
			</>
		),
	},
	{
		id: "engine.wcagVersion",
		field: <code>engine.wcagVersion</code>,
		meaning: (
			<>
				このスキャンがどのバージョンのWCAGへの適合を検証したかを示します。<code>engineOptions.wcagVersion</code>の値、導入バージョンタグから推定された値、またはデフォルトの<code>"2.2"</code>のいずれかです。現在影響するのは1点だけで、<strong>SC 4.1.1（構文解析）だけに対応するルールは、2.2を対象にすると<code>fail</code>になりません</strong>（後述の<code>checksResults[i].wcagVersionScope</code>を参照）。1回のスキャンでは全体を通して対象は1つなので、結果ごとに1回だけ報告されます。
			</>
		),
	},
	{ id: "url", field: <code>url</code>, meaning: <>渡した<code>pageUrl</code>引数です。<code>null</code>を渡したか省略した場合は<code>document.location.href</code>、どちらも得られない場合は<code>null</code>になります。</> },
	{ id: "title", field: <code>title</code>, meaning: <>スキャン時点の<code>document.title</code>、または<code>null</code>です。</> },
	{
		id: "timestamp",
		field: <code>timestamp</code>,
		meaning: (
			<>
				<strong>自動では生成されません。</strong><code>engineOptions.timestamp</code>に空でない文字列を渡した場合にだけ設定されます。エンジンは組み込みの時計を持ちません（決定論的であるための設計です）。結果にスキャンのタイムスタンプを入れたい場合は、自分で渡してください。
			</>
		),
	},
	{
		id: "perfStats",
		field: <code>perfStats</code>,
		meaning: <><code>engineOptions.perfStats: true</code>でない限り<code>null</code>です。内部の所要時間やカウンターで、その形はこのドキュメントの対象外です。デバッグ専用として扱ってください。</>,
	},
	{
		id: "contextSelector",
		field: <code>contextSelector</code>,
		meaning: (
			<>
				渡した<code>contextSelector</code>引数（トリム済み）です。文字列、文字列の配列（複数領域のスキャン。<a href="/configuration/engine-options/">エンジンオプション</a>を参照）、または未指定・空の場合は<code>null</code>になります。
			</>
		),
	},
	{
		id: "checksResults",
		field: <code>checksResults</code>,
		meaning: (
			<>
				実行された<strong>アトミックルール</strong>ごとに1件のエントリです（<code>runOnly</code>で除外されなかったすべてのルール。<a href="/configuration/engine-options/">エンジンオプション</a>を参照）。<strong>読み込まれたルールはすべてエントリを生成し、判定結果が<code>notApplicable</code>のものも含まれます</strong>。「違反だけ」のリストではありません。
			</>
		),
	},
	{
		id: "rulesResults",
		field: <code>rulesResults</code>,
		meaning: (
			<>
				実行された<strong>複合ルール（WCAG達成基準の集約ルール）</strong>ごとに1件のエントリです。<a href="#composite-result">複合ルールの結果</a>と<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。現在の<code>runOnly</code>やタグのフィルターに一致する複合ルールがなければ空の配列です。
			</>
		),
	},
	{
		id: "overriddenBuiltinIds",
		field: <code>overriddenBuiltinIds</code>,
		meaning: (
			<>
				<code>engineOptions.customRules</code>のエントリが組み込みルールと同じ<code>id</code>を持っていたため、このスキャンで組み込みの実装がカスタムの実装に置き換えられたルールのIDです（<a href="/configuration/engine-options/">エンジンオプション</a>を参照）。常に配列で、衝突がなければ空です。同名のカスタムルールは、意図した上書きであるのと同じくらい偶然の衝突である可能性もあるため、スキャン時に<code>console.warn</code>でも記録されます。
			</>
		),
	},
];

const occurrenceRows = [
	{
		id: "selector",
		field: <code>selector</code>,
		meaning: (
			<>
				フラグが立った要素を指し戻せるように組み立てた、ベストエフォートのCSSセレクターです（<code>RULE_AUTHORING.md</code>の<code>helpers.buildSelector</code>を参照）。意図的に崩したDOM構造では一意であることは保証されませんが、エンジンは使う前に、それが報告対象の要素に解決されることを実際に確認しています。例外は、要素が存在しないこと<em>そのもの</em>が検出結果であるルールです。<code>page-title-present</code>は<code>head &gt; title</code>と、<code>html</code>として<code>&lt;title&gt;(missing)&lt;/title&gt;</code>を報告しますが、どちらもページ上には存在しません。どちらも定数なので、これらから作られるフィンガープリントは安定しています。ただし、<strong>ルールが実在するものを報告したことを確かめずに、<code>selector</code>を解決可能なもの、<code>html</code>を実際のマークアップとして扱わないでください</strong>。
			</>
		),
	},
	{
		id: "html",
		field: <code>html</code>,
		meaning: (
			<>
				フラグが立った要素のouter HTMLのスニペットです。<code>includeShadowDom: true</code>のときは、「どの要素か」を示す主な手がかりとしてこれを使ってください（セレクターはシャドウ境界を越えられません）。
			</>
		),
	},
	{
		id: "structuralPath",
		field: <code>structuralPath</code>,
		meaning: (
			<>
				<code>documentElement</code>からフラグが立った要素までを、兄弟要素の中でのインデックスでたどったパスです（例：<code>[1, 0, 2]</code>）。要素が<code>documentElement</code><em>そのもの</em>であれば<code>[]</code>、特定できなかった場合は<code>null</code>になります。<code>selector</code>だけに頼るより頑健に要素を特定でき、セレクター文字列なら壊れてしまうDOMの変更（IDやクラス名の変更など）にも耐えます。その代わり、<strong>実際のCSSセレクターとしては使えません</strong>。
			</>
		),
	},
	{ id: "summary", field: <code>summary</code>, meaning: <>人が読むための文で、解決されたロケールの言語でローカライズ済みです（「<span lang="en">This button has no accessible name.</span>」）。</> },
	{ id: "hint", field: <code>hint</code>, meaning: "人が読むための修正ガイダンスで、summaryと同じくローカライズ済みです。" },
	{
		id: "i18n",
		field: <code>i18n</code>,
		meaning: (
			<>
				<code>summary</code>/<code>hint</code>の元になった翻訳キーです。スキャンをやり直さずに、別のロケールで自分で表示し直したい場合に使えます。検出箇所がキーによるi18nを使っていない場合は<code>null</code>です。
			</>
		),
	},
	{
		id: "data.visibilityFilter",
		field: <code>data.visibilityFilter</code>,
		meaning: (
			<>
				ほとんどの検出箇所に含まれます。ルールが使った対象判定のモデルのもとで、エンジンがこの要素を対象とみなした（またはみなさなかった）理由です。<code>eligible</code>がその結果で、<code>targetSet</code>はどのモデルによる判定かを示します（<code>'dom'</code>：DOM/CSS上の可視性そのもの。ほとんどのルールはこちら。<code>'acc'</code>：アクセシビリティツリー上で対象となるかどうか）。<code>accEligible</code>は<code>targetSet</code>が<code>'acc'</code>のときだけ<code>eligible</code>と同じ値になり、それ以外は<code>null</code>です。<code>reasons</code>は、<code>eligible: false</code>のときの機械可読な除外コードのリストです。
			</>
		),
	},
	{
		id: "data.details",
		field: <code>data.details</code>,
		meaning: (
			<>
				ルール固有の構造化データ（計算した指標、解決済みの参照など）です。<strong>規範的なものではありません</strong>。より詳しいUIの構築やデバッグには役立ちますが、<code>outcome</code>/<code>severity</code>の意味を変えることはありません。形はルールごとに異なるので、安定した契約ではなく、ベストエフォートの補足情報として扱ってください。唯一の例外が<code>data.details.reasonCode</code>で、これは安定して<strong>います</strong>。ルールの検出結果のうち<em>どれ</em>であるかを識別し、<code>ruleId</code>、<code>html</code>とともに、ベースラインとSARIFのキーになるフィンガープリントを構成します。<a href={`${core}/docs/API_STABILITY.md#finding-identity`}><code>API_STABILITY.md</code></a>を参照してください。
			</>
		),
	},
	{
		id: "occurrenceOutcome",
		field: <code>occurrenceOutcome</code>,
		meaning: (
			<>
				検出結果を確実な<code>fail</code>の層と、レビューが必要な<code>cantTell</code>の層に分けて評価するルールで、この検出箇所がどちらの層に属するかを示します。1つの層しか報告しないルールでは省略され、その場合は結果自体の<code>outcome</code>が検出箇所の層になります。
			</>
		),
	},
	{ id: "uncertainty", field: <code>uncertainty</code>, meaning: <>この検出結果を判定できなかった理由です。後述の<a href="#uncertainty-codes">不確実性コード</a>を参照してください。</> },
];

const uncertaintyRows = [
	{ id: "not-computable", code: <code>not-computable</code>, meaning: "ルールが必要とする証拠を、この環境では読み取れませんでした。", shape: "クロスオリジンのスタイルシート、値に解決されない背景色、解決できないsrc。" },
	{ id: "runtime-dependent", code: <code>runtime-dependent</code>, meaning: "実行時にスクリプトが決めるため、マークアップからは判断できません。", shape: "ウィジェットが開いたときに生成する要素を指すaria-controls。" },
	{ id: "spec-only", code: <code>spec-only</code>, meaning: "仕様違反ではあるものの、公開される名前、役割、値はその影響を受けないため、どの達成基準も不合格とは確定できません。", shape: "省略時のデフォルト値が仕様で定められているARIA属性。" },
	{ id: "equivalence-unknown", code: <code>equivalence-unknown</code>, meaning: "2つのものが同じ目的を果たしているかどうかが、マークアップからも内容からも判断できません。", shape: "アクセシブルな名前は同じなのに、異なるリソースを埋め込んでいる2つのフレーム。" },
	{ id: "judgement-required", code: <code>judgement-required</code>, meaning: "問いそのものが、本質的に人間の判断を必要とします。", shape: "サイズの小さいターゲットが必須かどうか。type: \"manual\"のルールはすべてこれに当たります。" },
	{ id: "out-of-scope", code: <code>out-of-scope</code>, meaning: "検出結果自体は本物ですが、このスキャンが対象とする規格の範囲外です。", shape: "対象のWCAGバージョンで削除された達成基準だけに対応するルール。" },
];

const outcomeRows = [
	{ id: "fail", outcome: <code>fail</code>, meaning: "決定論的で規範的な違反です。判定の手順に推測は一切含まれません。", manual: "いいえ（cantTellに強制変換）" },
	{ id: "pass", outcome: <code>pass</code>, meaning: "ルールの適用対象が存在し、どれにもフラグが立ちませんでした。", manual: "はい" },
	{ id: "cantTell", outcome: <code>cantTell</code>, meaning: "人間の判断が必要です。本当にあいまいな場合か、手動ルールによる参考情報の検出結果のどちらかです。", manual: "はい" },
	{ id: "notApplicable", outcome: <code>notApplicable</code>, meaning: "このページ／範囲には、ルールが適用される要素がありませんでした。", manual: "はい" },
];

export function OutputSchemaContent() {
	return (
		<>
			<p>
				これは<code>runDomRulesInPage(...)</code> / <code>runa11yCoreInPage(...)</code>が返すオブジェクトの正確な形です（どちらを呼ぶべきかは<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>を参照）。このページの例はすべて現在のエンジンの実際の出力（<code>schemaVersion: "1.0.0"</code>）で、手書きしたものではありません。<code>runa11yCoreAcrossFrames</code>は、これを包む別の再帰的な形を返します。後述の<a href="#cross-frame-result">フレームをまたぐ結果</a>を参照してください。
			</p>

			<h2 id="top-level-result">トップレベルの結果</h2>
			<CodeBlock
				lines={[
					"{",
					"  engine: {",
					"    tag: string,",
					"    schemaVersion: string,",
					"    locale: { requested: string, resolved: string, reason: string },",
					'    wcagVersion: "2.0" | "2.1" | "2.2"',
					"  },",
					"  url: string | null,",
					"  title: string | null,",
					"  timestamp: string | null,",
					"  perfStats: object | null,",
					"  contextSelector: string | string[] | null,",
					"  checksResults: CheckResult[],",
					"  rulesResults: CompositeResult[],",
					"  overriddenBuiltinIds: string[]",
					"}",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "フィールド", width: "22%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={topLevelRows}
			/>

			<h2 id="cross-frame-result">フレームをまたぐ結果（<code>runa11yCoreAcrossFrames</code>）</h2>
			<p>
				<code>runa11yCoreAcrossFrames</code>（<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}><code>INTEGRATION.md</code></a>を参照）は、通常のトップレベルの結果ではなく、別の再帰的な形を返します。
			</p>
			<CodeBlock
				lines={[
					"{",
					"  topFrame: <the normal top-level result shape above>,",
					"  frames: Array<",
					"    | { url: string | null, topFrame: <top-level result>, frames: [...same shape, recursively] }",
					"    | { url: string | null, error: string }",
					"  >",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>topFrame</code>は、関数が呼び出されたフレームについての、<a href="#top-level-result">トップレベルの結果</a>とまったく同じ形です。
				</li>
				<li>
					<code>frames</code>には、スキャン範囲内の直接の子である<code>&lt;iframe&gt;</code>/<code>&lt;frame&gt;</code>ごとに1件のエントリが入ります。到達できる子（<code>a11yCoreEnableFrameResponder()</code>を呼び出したもの）は、<em>それ自身の</em>入れ子の<code>frames</code>まで再帰的に含む、完全な<code>{"{ url, topFrame, frames }"}</code>を返します。さらに深い孫フレームには、直接の親を経由してしか到達できないためです。到達できない子（ほとんどのサードパーティの埋め込みがこれに当たります。協力するレスポンダーがないか、タイムアウトした場合）は代わりに<code>{"{ url, error }"}</code>を返し、スキャンの残りは中断されません。
				</li>
				<li>
					これは<strong>フラットなリストではなくツリー</strong>です。<code>@surea11y/playwright</code>バインディングの<code>.frames(true)</code>とは意図的に異なります。そちらはPlaywrightの<code>page.frames()</code>が入れ子の深さに関係なくすべてのフレームを返すので、フラットに<em>できます</em>。<code>postMessage</code>による中継にはそのような全体の視点がないため、入れ子を構造で表しています。
				</li>
			</ul>

			<h2>チェック結果（<code>checksResults[i]</code>）</h2>
			<CodeBlock
				lines={[
					"{",
					"  ruleId: string,",
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					'  outcomeNormalized: "pass" | "fail" | "cantTell" | "inapplicable",',
					'  severity: "minor" | "moderate" | "serious" | "critical",',
					'  confidence: "high" | "medium" | "low",',
					'  type: "automatic" | "manual",',
					"  occurrences: Occurrence[],",
					"  title: string,",
					"  description: string,",
					"  i18n: { titleKey: string, descriptionKey: string } | null,",
					"  meta: {",
					"    ruleId: string,",
					"    ruleInterfaceVersion: string,",
					"    ruleVersion: string,",
					"    normative: boolean,",
					"    atomic: boolean,",
					"    deprecated: boolean,",
					"    deprecation: object | null,",
					'    category: "perceivable" | "operable" | "understandable" | "robust" | null,',
					"    normativeMappings: Array<{ standard: string, version: string, requirement: string, title: string, conformanceLevel: string }>,",
					"    standard: string | null,",
					"    applicability: string,",
					"    expectation: string,",
					"    references: string[],",
					"    requirements: object | null,",
					"    mappings: object | null",
					"  },",
					"  engineOptions: object,   // the resolved engineOptions this rule actually ran under",
					"  schemaVersion: string,",
					"  wcagVersionScope?: {     // present only when the target WCAG version changed this outcome",
					'    target: "2.0" | "2.1" | "2.2",',
					"    removedSc: string[],",
					'    coercedFrom: "fail"',
					"  },",
					"  error?: string           // present only if the rule threw — see below",
					"}",
				]}
			/>
			<p>注意点：</p>
			<ul>
				<li>
					<strong><code>outcome</code>と<code>outcomeNormalized</code></strong>：<code>outcomeNormalized</code>では<code>notApplicable</code>が<code>"inapplicable"</code>になる点を除いて同一です。自分の用語とエンジン内部の用語のどちらにも合わせられるよう、両方を提供しています。
				</li>
				<li>
					<strong><code>type: "manual"</code>のルールが<code>outcome: "fail"</code>を報告することはありません。</strong>手動ルール自身のロジックが<code>fail</code>と判断した場合、エンジンはそれを<code>cantTell</code>に強制変換し、<code>error</code>に説明を追記します。これは一元的に適用される仕組み（<code>policy.coerceManualFailToCantTell</code>。<code>a11y</code>ポリシー契約ではデフォルトで有効です。<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>を参照）で、各ルールが気にかける必要はありません。<code>fail</code>は、決定論的な<code>type: "automatic"</code>の検出結果だけのためにあります。
				</li>
				<li>
					<strong><code>meta.normativeMappings</code></strong>は、チェック結果をWCAGの達成基準に結び付けるものです。WCAGとの正式な対応がないルールでは<code>[]</code>になります（このエンジンでは、そのほとんどが参考情報の<code>type: "manual"</code>ルールです）。これらがどう集約されるかは<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。
				</li>
				<li>
					<strong><code>wcagVersionScope</code></strong>：スキャンの対象WCAGバージョンによって、このルールの<code>fail</code>が<code>cantTell</code>に変わった場合にだけ含まれます。現時点では、デフォルトの2.2を対象としたときの、SC 4.1.1（構文解析）に対応するルール（<code>duplicate-id</code>）がこれに当たります。2.2でその達成基準が削除されたためです。<code>removedSc</code>は存在しなくなった達成基準、<code>target</code>はそれを削除したバージョン、<code>coercedFrom</code>はルール自身が報告した判定結果です。検出箇所はルール自身のもので、手を加えていません。捨てられたものは何もなく、変わったのは適合の判定だけです。それ以外の結果には含まれず、<code>error</code>で報告されることも<strong>ありません</strong>。何も問題は起きていないからです。<a href="/configuration/engine-options/#filtering-by-wcag-version">WCAGバージョンによる絞り込み</a>を参照してください。
				</li>
				<li>
					<strong><code>error</code></strong>：次の3つの場合にだけ含まれます。ルールの実装が捕捉されない例外を投げた場合、上記の手動ルールの強制変換が行われた場合、そして<code>fail</code>の結果のすべての検出箇所で祖先をたどる処理が内部の深さ制限に達し（フラグが立った内容が実際に公開されているかをエンジンが確認できず）、結果全体が同じように<code>cantTell</code>に強制変換された場合です。例外を投げたルールは、必ず<code>outcome: "cantTell"</code>、<code>occurrences: []</code>、例外メッセージを設定した<code>error</code>として現れます。エンジンは、壊れたルール1つでスキャン全体をクラッシュさせることはありません。
				</li>
				<li>
					各結果の<strong><code>engineOptions</code></strong>は、渡したものそのままではなく、<em>解決済みの</em>オプションオブジェクト（ロケールやコントラストのデフォルトを適用した後のもの）です。あるルールが実際に何を受け取ったか、特に解決された<code>locale</code>と<code>contrast.mode</code>/<code>contrast.rootCanvasFallback</code>を確認するのに役立ちます。
				</li>
			</ul>

			<h2>検出箇所（<code>occurrences[i]</code>）</h2>
			<p>
				通常は<code>outcome</code>が<code>fail</code>または<code>cantTell</code>のときにだけ含まれます。このエンジンは合格した要素を列挙せず、フラグを立てた要素だけを報告するため、<code>pass</code>の結果は<code>occurrences: []</code>になります。
			</p>
			<p>
				唯一の例外が<code>notApplicable</code>です。判定対象が何もなかったルールは、その理由を示す検出箇所を1つ付けることがあり、コントラストのルールは、背景を計算できるテキストが1つもなかった場合に実際にそうします。「チェックしたが、フラグを立てるものはなかった」と「チェックできなかった」の違いを、このエンジンは隠さずに報告します。このような検出箇所は要素ではなくスキャンについて述べるものなので、<code>selector</code>は空です。<strong><code>outcome</code>を先に確認せずに、<code>occurrences.length</code>を違反の件数として読まないでください。</strong>
			</p>
			<CodeBlock
				lines={[
					"{",
					"  selector: string,",
					"  html: string,",
					"  structuralPath: number[] | null,",
					"  summary: string,",
					"  hint: string,",
					"  i18n: { summaryKey: string, hintKey: string, params: object } | null,",
					'  occurrenceOutcome?: "fail" | "cantTell",   // present when the rule graded its findings into tiers',
					"  uncertainty?: {          // present only on a cantTell-tier occurrence",
					'    code: "not-computable" | "runtime-dependent" | "spec-only"',
					'        | "equivalence-unknown" | "judgement-required" | "out-of-scope",',
					"    needed?: string,       // what would settle the question",
					"    evidence?: object      // what the rule did establish, rule-specific",
					"  },",
					"  data: {",
					"    visibilityFilter?: { eligible: boolean, targetSet: string, accEligible: boolean | null, reasons: string[] },",
					"    details?: object   // rule-specific, non-normative — see below",
					"  }",
					"}",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "フィールド", width: "22%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={occurrenceRows}
			/>

			<h3 id="uncertainty-codes">不確実性コード</h3>
			<p>
				<code>cantTell</code>は、エンジンが判定しなかったことを示します。<code>uncertainty</code>は<strong>その理由</strong>を閉じた語彙で示すので、利用側は要約の文字列を解析しなくても、理由に応じて処理を分けられます。含まれるのは<code>cantTell</code>の層の検出箇所だけです。<code>fail</code>の層の検出箇所に付いていれば、ルールが判定したと同時に判定しなかったと主張することになるため、エンジンはそれを取り除きます。
			</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "code", label: "code", width: "20%" },
					{ key: "meaning", label: "意味", wrap: true, width: "40%" },
					{ key: "shape", label: "典型的な例", wrap: true },
				]}
				rows={uncertaintyRows}
			/>
			<p>
				<code>needed</code>は、問いに決着をつけるには何が必要か、つまりレビュー担当者が実際に確認しに行くべきことを1文で述べます。<code>evidence</code>にはルールが<em>確定できた</em>ことが入るので、レビュー担当者はエンジンの作業を繰り返さず、その続きから始められます。その形はルール固有で、<code>data.details</code>と同様に安定した契約ではありません。一方、<code>code</code>は安定した契約です。新しいコードがマイナーリリースで追加されることはありますが、既存のコードの意味は変わりません。知っているコードに応じて処理を分け、<strong>知らないコードはエラーではなく「レビューが必要」として扱ってください</strong>。
			</p>
			<p>
				<code>cantTell</code>を報告しうる自動ルールはすべてこれを持ち、テストでそれを担保しているので、これを持たない新しいルールが入り込むことはありません。<code>out-of-scope</code>コードはルールではなくエンジンが付けるもので、結果レベルの<code>wcagVersionScope</code>を生じさせるのと同じ検出箇所に付きます。手動ルールはこれを持ちません。<code>judgement-required</code>は<code>type: "manual"</code>がすでに意味していることなので、検出箇所ごとに繰り返しても、結果が示している以上のことは何も伝わらないからです。
			</p>

			<h2 id="composite-result">複合ルールの結果（<code>rulesResults[i]</code>）</h2>
			<p>
				複合ルールは、複数のアトミックルールを1つのWCAG達成基準に集約します（例：<code>wcag-1.1.1-non-text-content</code>は21件のアトミックルールを集約します）。形はチェック結果と同じ外枠で、<code>data.details</code>が複合ルール固有の内容になります。
			</p>
			<CodeBlock
				lines={[
					"{",
					'  ruleId: string,              // e.g. "wcag-1.1.1-non-text-content"',
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					"  severity, confidence, type, title, description, meta, engineOptions, schemaVersion,  // same as a check result",
					"  occurrences: [],              // always empty — composites are rollups, not element-level findings",
					"  data: {",
					"    details: {",
					'      reasonCode: string,       // e.g. "composite.rollup.fail.anyFail"',
					"      checksIds: string[],      // every atomic ruleId this composite rolls up",
					"      contributors: Array<{ testId: string, outcome: string, severity: string | null }>,",
					"      metrics: { failCount, cantTellCount, notApplicableCount, passCount, missingCount }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				集約の優先順位（決定論的で、この順に適用されます）：<strong>構成ルールに<code>fail</code>が1つでもあれば、複合ルールは<code>fail</code></strong>。そうでなく<strong><code>cantTell</code>が1つでもある（または構成ルールのいずれかがまったく実行されなかった、つまり<code>missingCount &gt; 0</code>）なら、複合ルールは<code>cantTell</code></strong>。そうでなく<strong>構成ルールがすべて<code>notApplicable</code>なら、複合ルールは<code>notApplicable</code></strong>。それ以外は<strong><code>pass</code></strong>です。これが全体としての適合表明にとって何を意味するかは<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。
			</p>

			<h2>判定結果の値</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "outcome", label: "判定結果", width: "16%" },
					{ key: "meaning", label: "意味", wrap: true },
					{ key: "manual", label: 'type: "manual"で現れるか', width: "22%" },
				]}
				rows={outcomeRows}
			/>
			<p>
				<code>fail</code>は、このエンジンで意図的に最も範囲が狭く、最も基準の高い判定結果にしてあります。決定論的で規範的な違反のためだけにあり、<strong>ルールのカバー範囲を広げるためにこれを薄めてはなりません</strong>。
			</p>

			<h2>重大度と確度の値</h2>
			<ul>
				<li>
					<code>severity</code>：<code>minor</code> &lt; <code>moderate</code> &lt; <code>serious</code> &lt; <code>critical</code>。ユーザーへの影響についてのルール作成者の評価で、<code>confidence</code>とは独立しています。
				</li>
				<li>
					<code>confidence</code>：<code>low</code> &lt; <code>medium</code> &lt; <code>high</code>。<code>fail</code>/<code>cantTell</code>の判定が正しいことに、エンジンがどれだけ確信を持っているかを示します。どちらも優先順位付けのための情報としてのメタデータで、<code>outcome</code>の意味を変えることはありません。
				</li>
			</ul>
			<p>
				<strong><code>fail</code>が常に<code>confidence: "high"</code>とは限りませんが、それは矛盾ではありません。</strong>判定結果が表すのは判定の手順（推測せずに問いを解決したこと）であり、<code>confidence</code>が表すのは、その判定の拠り所となったモデルです。いくつかの自動ルールは、それ自体が近似であるもの（厳選したWAI-ARIAのロールの表、ネイティブ要素のロールの対応、静的なマークアップから推定したアクセシビリティツリー）に対して決定論的に判定し、<code>medium</code>を報告します。<code>aria-required-children</code>、<code>aria-prohibited-children</code>、<code>aria-required-parent</code>、<code>aria-allowed-attr</code>、<code>form-control-programmatic-label-present</code>、<code>identical-iframes-same-purpose</code>、<code>svg-image-text-alternative-present</code>、<code>video-poster-text-alternative-present</code>、<code>target-size-minimum</code>です。<code>confidence</code>はすべての結果に含まれるので、最も確実な不合格だけが欲しい利用側はこれで直接ゲートできます。<code>policy.allowedConfidence</code>ではこれはできません。許可されていない値は、判定結果を変えるのではなく、ルール自身の<code>defaultConfidence</code>に置き換えられるからです（<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>を参照）。
			</p>

			<h2>実例</h2>
			<p>
				<code>&lt;img src="logo.png"&gt;</code>（<code>alt</code>なし）と<code>&lt;button&gt;&lt;/button&gt;</code>（アクセシブルな名前なし）を、<code>runOnly: {"{ includeRuleIds: [...] }"}</code>でこの2つのルールだけに絞ってスキャンします（<a href="/configuration/engine-options/">エンジンオプション</a>を参照。配列そのものでは<strong>ありません</strong>）。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(",
					"  'https://example.test/',",
					"  null,",
					"  {},",
					"  { includeRuleIds: ['img-alt-present', 'button-name-present'] }",
					");",
				]}
			/>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "engine": {',
					'    "tag": "a11ycore",',
					'    "schemaVersion": "1.0.0",',
					'    "locale": { "requested": "en", "resolved": "en", "reason": "ok" }',
					"  },",
					'  "url": "https://example.test/",',
					'  "title": "Example",',
					'  "timestamp": null,',
					'  "perfStats": null,',
					'  "contextSelector": null,',
					'  "checksResults": [',
					"    {",
					'      "ruleId": "button-name-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > button",',
					'          "html": "<button></button>",',
					'          "structuralPath": [1, 1],',
					'          "summary": "This button has no accessible name.",',
					'          "hint": "Provide visible button text or a programmatic accessible-name mechanism (for example aria-label) so assistive technologies can identify the button.",',
					'          "data": {',
					'            "visibilityFilter": { "eligible": true, "reasons": [], "targetSet": "acc", "accEligible": true },',
					'            "details": { "reasonCode": "name_missing" }',
					"          }",
					"        }",
					"      ]",
					"    },",
					"    {",
					'      "ruleId": "img-alt-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > img",',
					'          "html": "<img src=\\"logo.png\\">",',
					'          "structuralPath": [1, 0],',
					'          "summary": "Missing alt attribute on <img>.",',
					'          "hint": "Add an alt attribute (use alt=\\"\\" only for decorative images)."',
					"        }",
					"      ]",
					"    }",
					"  ],",
					'  "rulesResults": [],',
					'  "overriddenBuiltinIds": []',
					"}",
				]}
			/>
			<p>
				（読みやすさのために省略しています。実際の結果では、上に示した完全な形のとおり、すべてのエントリに<code>title</code>/<code>description</code>/<code>i18n</code>/<code>meta</code>/<code>engineOptions</code>/<code>schemaVersion</code>も含まれます。<code>runOnly.includeRuleIds</code>でスキャンを2つのアトミックルールに絞り、複合ルール自体のIDは含めていないため、ここでは<code>rulesResults</code>が空になっています。）
			</p>
		</>
	);
}
