import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const optionRows = [
	{
		id: "locale",
		option: <code>locale</code>,
		meaning: (
			<>
				任意の文字列を指定できます。サブタグ付きのコードはまずベース言語にフォールバックするので、<code>de-DE</code>は<code>de</code>を使い、それもなければ英語になります。個々の文字列も同じ順にフォールバックする（指定したロケール → <code>en</code> → ルールに書かれた英語の原文）ため、翻訳が一部しかないロケールでも文字列が欠けることはありません。こうしたフォールバックは文字列そのものからは分からないので、実際に何が起きたかは結果の<code>engine.locale</code>に記録されます。指定した言語が使われたかを確かめたいときはここを確認してください。詳しくは<a href="/configuration/locales/">ロケール</a>を参照してください。
			</>
		),
	},
	{
		id: "wcagVersion",
		option: <code>wcagVersion</code>,
		meaning: (
			<>
				<code>'2.0'</code>、<code>'2.1'</code>、<code>'2.2'</code>のいずれかで、そのスキャンがどのバージョンのWCAGへの適合を検証するかを指定します。省略すると導入バージョンタグから推定されるバージョンになり、タグから何も推定できなければ<code>'2.2'</code>になります。<strong>現時点でこのオプションが影響するのは、2.2で削除されたSC 4.1.1（構文解析）だけです</strong>。2.2を対象にすると、<code>wcag22-removed</code>タグの付いたルールは引き続き実行され、検出箇所も報告しますが、<code>fail</code>にはなりません。前述の<a href="#filtering-by-wcag-version">「WCAGバージョンによる絞り込み」</a>を参照してください。それ以外の値は無視され、デフォルトが適用されます。
			</>
		),
	},
	{
		id: "messages",
		option: <code>messages</code>,
		meaning: (
			<>
				省略可能な<code>{"{ [locale]: { key: text } }"}</code>です。エンジン組み込みの辞書より先に参照されるため、個々の文字列を上書きしたり、ビルドに含まれていない言語を補ったりできます。指定しなかったキーは通常どおりフォールバックするので、一部だけの上書きでも問題ありません。スタンドアロンのブラウザー用バンドルはこの仕組みでロケールの別ファイルを受け取ります。ページ内ランナーはシリアライズされていてファイルを読めないため、ページのコンテキストに辞書を渡す方法はこれしかありません。詳しくは<a href="/configuration/locales/">ロケール</a>を参照してください。
			</>
		),
	},
	{
		id: "includeHiddenElements",
		option: <code>includeHiddenElements</code>,
		meaning: (
			<>
				デフォルトは<code>false</code>です。ヘルパーのクエリは、<code>display:none</code>、<code>[hidden]</code>、閉じた<code>&lt;details&gt;</code>、非表示のレンダリング専用ホスト要素など、構造やCSSの仕組みで隠された要素を除外します（その子孫も除外されます）。<code>true</code>にすると、こうした非表示・折りたたみ状態のサブツリーも評価の対象になります（旧来の、静的マークアップ向けの動作）。
			</>
		),
	},
	{
		id: "includeShadowDom",
		option: <code>includeShadowDom</code>,
		meaning: (
			<>
				デフォルトは<code>true</code>で、<code>helpers.queryAllSmart</code>を使うルールはオープンなシャドウルートの中まで走査します。<code>false</code>にするとライトDOMだけをスキャンします。<strong>クローズドなシャドウルートには、どちらの設定でも到達できません</strong>。それを公開するDOM APIが存在しないためです。
			</>
		),
	},
	{
		id: "fragment",
		option: <code>fragment</code>,
		meaning: (
			<>
				デフォルトは<code>false</code>です。いくつかのルール（<code>page-title-present</code>、<code>html-lang-attr-present</code>、<code>html-xml-lang-mismatch</code>、<code>aria-hidden-body</code>、<code>css-orientation-lock</code>、<code>meta-refresh-no-exceptions</code>、<code>meta-refresh-timing-absent</code>、<code>meta-viewport-zoom-enabled</code>、<code>meta-viewport-large</code>、<code>page-title-patterns</code>、<code>region</code>、<code>bypass-blocks-present</code>、<code>landmark-one-main</code>、<code>page-has-heading-one</code>）は、実際のページなら1つだけ存在するはずのプロパティの有無を確認します。<code>contextSelector</code>でスキャン範囲をドキュメント全体より狭くした場合（解決されたルートに<code>document.documentElement</code>が含まれない場合）、これらのルールは正しく<code>notApplicable</code>を報告します。範囲を絞ったサブツリーが独自の<code>&lt;title&gt;</code>や<code>&lt;html lang&gt;</code>などを持つことは、そもそも想定されていないからです。<code>fragment: true</code>は、範囲の指定だけでは判別できないケースのためのものです。スキャン対象は渡されたドキュメントの<em>全体</em>だが、もともと実際のページを表すものではない場合（単独でパースしたコンポーネントの断片など）がこれに当たります。この設定により、範囲を絞っていなくても同じように<code>notApplicable</code>になります。
			</>
		),
	},
	{
		id: "excludeSelectors",
		option: <code>excludeSelectors</code>,
		meaning: (
			<>
				これらのセレクターのいずれかに一致する要素（とその子孫）は、<strong>すべての</strong>ルールで完全にスキップされます。Cookieバナーやサードパーティの埋め込み、自分では管理できない、ノイズが多いと分かっているウィジェットに便利です。特定のルール1つだけから除外したい場合は、後述の<code>rules[ruleId].excludeSelectors</code>を使ってください。
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				結果のトップレベルの<code>timestamp</code>フィールドにそのまま渡されます。エンジン自身はタイムスタンプを生成しません（決定論的であるための設計です）。
			</>
		),
	},
	{
		id: "contrast-mode",
		option: <code>contrast.mode</code>,
		meaning: (
			<>
				<code>strictConformance</code>（デフォルト）：実際に描画される背景色を確実に計算できない場合、コントラストのルールは何も報告しません（<code>notApplicable</code>またはスキップ）。誤った<code>fail</code>を防ぐためです。<code>auditorAssist</code>：その安全マージンを一部手放して、より多くの検出結果を返します。フラグが立ったケースを人間の監査担当者が再確認することを前提としたモードで、無人で動かすCIのゲートには向きません。
			</>
		),
	},
	{
		id: "contrast-fallback",
		option: <code>contrast.rootCanvasFallback</code>,
		meaning: (
			<>
				背景色がまったく計算できない場合に想定するページの背景色です。意味を持つのは<code>auditorAssist</code>モードのときだけです。
			</>
		),
	},
	{
		id: "visibilityMode",
		option: <code>visibilityMode</code>,
		meaning: (
			<>
				3つのコントラストルール（<code>contrast-minimum</code>、<code>contrast-enhanced</code>、<code>contrast-computable</code>）が、テキストノードを実際にチェック対象とするかどうかをどれだけ厳密に判断するかを制御します。<strong>他のルールはこのオプションを読みません。</strong><code>'styleOnly'</code>（デフォルト）：対象かどうかをCSSだけで判断します（<code>display</code>、<code>visibility</code>、<code>opacity</code>、祖先による非表示など）。<code>'styleAndGeometry'</code>：それに加えて実際のレイアウトをチェックします（<code>getClientRects()</code>/<code>getBoundingClientRect()</code>）。クライアント矩形を持たないテキストや、幅または高さがゼロのテキストも除外されます。実際のブラウザーやPlaywright/Puppeteer（<code>runa11yCoreInPage</code>）で実行していて、計算済みスタイルだけでなく実際に描画されたレイアウトをコントラストの検出結果に反映させたい場合は<code>'styleAndGeometry'</code>を選んでください。素のjsdom（<code>runDomRulesInPage</code>）には本物のレイアウトエンジンがないため、<code>'styleAndGeometry'</code>で加わるのは主に<code>getBoundingClientRect()</code>によるサイズゼロのチェックで、本当の意味でのクリッピングやオーバーフローの検出にはなりません。<a href="/help/known-limitations/">既知の制限事項</a>を参照してください。
			</>
		),
	},
	{
		id: "policyContract",
		option: <code>policyContract</code>,
		meaning: (
			<>
				<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>を参照してください。許可される判定結果と確度の値、そして手動ルールが<code>fail</code>になるはずだった場合に<code>cantTell</code>へ強制変換するかどうかを制御します。
			</>
		),
	},
	{
		id: "output",
		option: (
			<>
				<code>output.includeSelector</code> / <code>.includeHtml</code>
			</>
		),
		meaning: (
			<>
				エンジンによる<code>selector</code>/<code>html</code>の自動補完を抑制します。すべてのルールが検出箇所を自前で組み立てるのをやめ、要素を報告する方式に移行して以降（1.5.0）、エンジンの132件のルールのほぼすべてがこの自動補完を通ります。そのため<code>includeSelector: false</code> / <code>includeHtml: false</code>を指定すると、大多数のルールからセレクターとHTMLスニペットが取り除かれます。ただし、いくつかのルールは今も<code>runInPage</code>の中でこれらのフィールドを自分で組み立てており、影響を受けません。<code>contrast-minimum</code>/<code>contrast-enhanced</code>（検出結果が要素ではなくテキストの連なりであるため）、<code>page-title-present</code>、<code>identical-links-same-purpose</code>などがそうです。<strong>つまり出力は大幅に絞られますが、結果のどこにもセレクターやHTMLが<em>含まれない</em>ことまでは保証されません。</strong>
			</>
		),
	},
	{
		id: "rules-ruleId",
		option: <code>rules[ruleId]</code>,
		meaning: (
			<>
				そのルールに<code>ctx.config</code>として渡されます。また<code>excludeSelectors</code>に限っては、ルールが実行される前にエンジン自身が読み取ります。後述の<a href="#rule-scoped-excludeselectors">「ルール単位のexcludeSelectors」</a>を参照してください。それ以外のキーは受け渡されるだけです。<strong>現在同梱されているルールで、<code>excludeSelectors</code>以外の目的で<code>ctx.config</code>を読むものはありません</strong>。
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				ホストアプリケーションから渡せる、JSONとして安全な省略可能の証拠オブジェクトです（ルールに渡る前にエンジンが深さとサイズを制限し、ルールからは<code>ctx.inputs.probes</code>として参照します）。外部から与えられるシグナル（静的なDOMスキャンでは計算できない、実際のレイアウトの計測値など）を受け付ける将来のルールのためのものです。<strong>現在のルールはどれもこれを使用しません。</strong>
			</>
		),
	},
	{
		id: "perfStats",
		option: (
			<>
				<code>perfStats</code> / <code>profileRules</code>
			</>
		),
		meaning: (
			<>
				デバッグ専用です。<code>perfStats: true</code>を指定すると、結果の<code>perfStats</code>フィールドに内部カウンターが返されます。<code>profileRules: true</code>を指定すると、そこに<strong>さらに</strong>ルールごとの所要時間の内訳が加わります。<code>profileRules</code>だけを指定しても何も起きません。内訳を格納するオブジェクトを作るのは<code>perfStats</code>です。<strong>この形は安定した出力契約に含まれないため、これに依存しないでください。</strong>また、<code>profileRules</code>は出力を非決定論的にする唯一のオプションです。カウンターは同一の実行間で変わりませんが、実時間の計測値は変わります。実行間で結果の差分を取る場合はオフにしておいてください。
			</>
		),
	},
	{
		id: "frameWaitTime",
		option: (
			<>
				<code>pingWaitTime</code> / <code>frameWaitTime</code>
			</>
		),
		meaning: (
			<>
				<code>runa11yCoreAcrossFrames</code>だけが読み取ります（<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}><code>INTEGRATION.md</code></a>を参照）。子フレームを到達不能とみなすまでに、pingへの応答（デフォルト<code>500</code>ms）とスキャン全体の要求への応答（デフォルト<code>60000</code>ms）をそれぞれどれだけ待つかを指定します。<code>runDomRulesInPage</code>/<code>runa11yCoreInPage</code>では無視されます。
			</>
		),
	},
];

export function EngineOptionsContent() {
	return (
		<>
			<p>
				どのランナー（<code>runDomRulesInPage</code>、<code>runa11yCoreInPage</code>）も、同じ4つの引数<code>(pageUrl, contextSelector, engineOptions, runOnly)</code>を取ります。このページでは<code>engineOptions</code>と<code>runOnly</code>のすべてを説明します。
			</p>

			<h2>実行するルールの選択</h2>
			<p>
				ルールを選ぶ方法は<strong>互いに独立して2つ</strong>あります。第4引数（<code>runOnly</code>）と、<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>/<code>.includeMode</code>です。<code>runOnly</code>にフィルターが1つでも含まれていればそちらが無条件に優先され、そうでなければエンジンは<code>engineOptions</code>を使います。<strong>両方が適用されると期待して混在させないでください。どちらか一方を選びます。</strong>
			</p>

			<h3><code>runOnly</code>（第4引数）で指定する</h3>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {}, {",
					"  includeRuleIds: ['img-alt-present', 'button-name-present'],",
					"  excludeRuleIds: ['region'],",
					"  tags: ['wcag412'],",
					"  excludeTags: ['best-practice'],",
					"  includeMode: 'and'   // 'and' (default) | 'or' — see below",
					"});",
				]}
			/>
			<p>
				<strong><code>runOnly</code>は、配列そのものではなく、このオブジェクト形式で渡す必要があります。</strong><code>runOnly: ['img-alt-present']</code>（単なる配列）は<strong>何の通知もなく無視され</strong>、エンジンはすべてのルールを実行します。統合時に最もよくある間違いです。<a href="/help/faq/">よくある質問</a>を参照してください。
			</p>
			<DataTable
				rowKey="field"
				columns={[
					{ key: "field", label: "フィールド", width: "22%" },
					{ key: "type", label: "型", width: "16%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={[
					{ field: <code>includeRuleIds</code>, type: <code>string[]</code>, meaning: "これらのルールIDだけを実行します（複合ルールのIDの場合は、その子であるアトミックルールも実行します）。" },
					{ field: <code>excludeRuleIds</code>, type: <code>string[]</code>, meaning: "これらは実行しません。includeの後に適用されます。" },
					{
						field: (
							<>
								<code>includeTestIds</code> / <code>excludeTestIds</code>
							</>
						),
						type: <code>string[]</code>,
						meaning: "照合の仕方は上と同じです。ルールは内部で「テスト」（実行可能な最小単位）と呼ばれているため別のフィールドとして残されていますが、現在の機能はincludeRuleIds/excludeRuleIdsとまったく同じです。",
					},
					{ field: <code>tags</code>, type: <code>string[]</code>, meaning: "これらのタグを少なくとも1つ持つルールだけを実行します（例：wcag412、wcag2aa、best-practice）。" },
					{ field: <code>excludeTags</code>, type: <code>string[]</code>, meaning: "これらのタグのいずれかを持つルールは実行しません。includeの後に適用されます。" },
					{
						field: <code>includeMode</code>,
						type: (
							<>
								<code>'and'</code> | <code>'or'</code>
							</>
						),
						meaning: "IDによるincludeとタグによるincludeを両方指定した場合の扱いです。'and'（デフォルト）ではルールが両方を満たす必要があり、'or'ではどちらかを満たせば実行されます。一方の軸しか使わない場合は関係ありません。",
					},
				]}
			/>
			<p>
				いずれも配列とカンマ区切りの文字列のどちらでも指定でき、後述の<code>engineOptions</code>の形式と揃えてあります。<code>includeRuleIds: 'img-alt-present, button-name-present'</code>と<code>includeRuleIds: ['img-alt-present', 'button-name-present']</code>は同じ意味です。
			</p>
			<p>
				ルールIDにはエンジンのプレフィックスを付けません（例：<code>'img-alt-present'</code>）。後方互換性のため、同じIDに旧来の<code>a11ycore-</code>プレフィックスを付けた形式（<code>'a11ycore-img-alt-present'</code>）も照合できます。
			</p>
			<p>
				<code>runOnly</code>の値全体として、<strong>旧来のタグフィルター形式</strong>も受け付けます。<code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code>は<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>と同じ意味になります。
			</p>

			<h3 id="filtering-by-wcag-version">WCAGバージョンによる絞り込み（2.0、2.1、2.2）</h3>
			<p>
				すべてのルールと複合ルールには、そのレベルとWCAGの導入バージョンを示すタグがちょうど1つ付いています。WCAG 2.0からある達成基準には<code>wcag2a</code>/<code>wcag2aa</code>/<code>wcag2aaa</code>、WCAG 2.1で新たに導入されたもの（例：<code>1.3.5</code>入力目的の特定）には<code>wcag21a</code>/<code>wcag21aa</code>/<code>wcag21aaa</code>、WCAG 2.2で新たに導入されたもの（例：<code>2.5.8</code>ターゲットのサイズ（最低限））には<code>wcag22a</code>/<code>wcag22aa</code>/<code>wcag22aaa</code>が付きます。ルールに付くのは、その達成基準が実際に導入されたバージョンのタグ<strong>だけ</strong>です。2.1で導入された達成基準に<code>wcag2aa</code>が併せて付くことはありません。WCAG 2.0を対象とする適合では、その達成基準は存在しないからです。
			</p>
			<p>
				バージョンは累積的です（2.1 = 2.0 + 新規、2.2 = 2.0 + 2.1 + 新規）。そのため、WCAGのバージョンを対象に適合を検証するには、タグの集合を組み合わせて指定します。あとは<code>tags</code>に対するエンジンのOR照合（どれか1つに一致すればルールが含まれる）が処理します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 AA only (excludes every 2.1/2.2-introduced SC, even at level AA):",
					"{ tags: ['wcag2a', 'wcag2aa'] }",
					"",
					"// WCAG 2.1 AA conformance (2.0 baseline + everything 2.1 added, both at A and AA):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }",
					"",
					"// WCAG 2.2 AA conformance (2.0 baseline + 2.1 additions + 2.2 additions):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'] }",
					"",
					"// Just the SCs 2.2 introduced, nothing else:",
					"{ tags: ['wcag22a', 'wcag22aa', 'wcag22aaa'] }",
				]}
			/>
			<p>
				<strong>1つだけ逆向きの達成基準があります。</strong>WCAG 2.2ではSC 4.1.1（構文解析）が削除されました。追加ではなく削除された唯一の達成基準です。これに対応するルールは、他の2.0由来のルールと同じく2.0の導入バージョンタグ（<code>wcag2a</code>）を持ち、さらに<code>wcag22-removed</code>も持ちます。そのため上のバージョン別のタグの集合では、本来含まれるべきでない2.2対象のスキャンにもこのルールが含まれてしまいます。
			</p>
			<p>
				これについて何かする必要はありません。エンジンはスキャンごとに<strong>対象のWCAGバージョン</strong>を決定し、対象が2.2の場合、<code>wcag22-removed</code>のルールは<code>fail</code>を報告できません。ルールは実行され、見つけた検出箇所もすべて報告しますが、判定結果は<code>cantTell</code>に強制変換され、結果にはその理由を示す<code>wcagVersionScope</code>フィールドが付きます（<a href="/results-reports/output-schema/">出力スキーマ</a>を参照）。黙って捨てられるものは何もなく、2.2のスキャンが2.2に存在しない達成基準によってゲートされることもありません。
			</p>
			<p>対象バージョンは次の順で決まります。</p>
			<ol>
				<li>
					<code>engineOptions.wcagVersion</code>：指定されていれば<code>'2.0'</code>、<code>'2.1'</code>、<code>'2.2'</code>のいずれか。
				</li>
				<li>
					自分で指定したフィルター内の導入バージョンタグ：<code>wcag21a</code>/<code>wcag21aa</code>までの集合なら2.1、<code>wcag22*</code>タグを1つでも含めば2.2、<code>wcag2*</code>タグだけなら2.0とみなします。数えるのはこの9つのタグだけです。達成基準のタグ（<code>wcag411</code>）や<code>best-practice</code>からはバージョンは分かりません。
				</li>
				<li>
					それ以外の場合は、このエンジンのデフォルトの対象である<code>'2.2'</code>。
				</li>
			</ol>
			<CodeBlock
				lang="js"
				lines={[
					"// Nothing to declare: a plain run already targets 2.2, so a duplicate id",
					"// comes back cantTell rather than fail.",
					"runDomRulesInPage(url, null, {}, null);",
					"",
					"// Conformance-testing against 2.1, where SC 4.1.1 still exists:",
					"runDomRulesInPage(url, null, { wcagVersion: '2.1' }, null);",
					"",
					"// Same thing, implied by the tag set — no extra option needed:",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });",
				]}
			/>
			<p>
				決定された対象バージョンはすべての結果に<code>engine.wcagVersion</code>として返されるので、スキャンで実際にどれが使われたかを確認できます。
			</p>
			<p>
				2.2ではこのルールを一切表示したくない場合は、明示的に除外してください。タグはまさにそのために残してあります。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 AA conformance, with the removed criterion left out entirely:",
					"{",
					"  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'],",
					"  excludeTags: ['wcag22-removed']",
					"}",
				]}
			/>
			<p>
				現在このタグを持つルールは<code>duplicate-id</code>だけです。除外しなければ、実際にある問題を報告します。IDの重複は、規格の定めにかかわらず<code>&lt;label for&gt;</code>、フラグメントリンク、<code>getElementById</code>を壊します。ただ、2.2の適合性の違反にはならないというだけです。
			</p>

			<h3><code>engineOptions</code>で指定する（<code>runOnly</code>なし）</h3>
			<p>同じ絞り込みを、<code>engineOptions</code>内にネストしたカンマ区切りの文字列（または配列）で表します。</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  rules: { include: 'img-alt-present, button-name-present', exclude: 'region' },",
					"  tags: { include: 'wcag412', exclude: 'best-practice' },",
					"  includeMode: 'and'",
					"}, null);",
				]}
			/>
			<p>
				<code>rules.include</code>/<code>.exclude</code>、<code>tags.include</code>/<code>.exclude</code>、<code>tests.include</code>/<code>.exclude</code>（<code>rules</code>の別名）、およびトップレベルの<code>includeMode</code>は、上記の<code>runOnly</code>のフィールドとまったく同じように動作します。カンマ区切りの文字列は自動的にトリムと重複除去が行われ、空のトークンは捨てられます。
			</p>

			<h2><code>engineOptions</code>：その他のオプション</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
					"  messages: { de: { /* key: text */ } },  // optional caller-supplied dictionaries; win over built-in ones",
					"  includeHiddenElements: false,    // default false — set true to evaluate hidden/collapsed subtrees too",
					"  includeShadowDom: true,          // default true — opt OUT with false to skip open shadow roots",
					"  fragment: false,                 // default false — set true when the scan target isn't a real page",
					"  excludeSelectors: ['#cookie-banner', '.third-party-widget'],  // array or comma-separated string",
					"  timestamp: '2026-07-20T12:00:00Z',  // optional — engine has no built-in clock",
					"  perfStats: false,                // default false — internal timing counters, debug-only shape",
					"  profileRules: false,             // default false — per-rule timings; needs perfStats",
					"",
					"  contrast: {",
					"    mode: 'strictConformance',     // 'strictConformance' (default) | 'auditorAssist'",
					"    rootCanvasFallback: '#ffffff'  // background assumed when the true root background isn't computable",
					"  },",
					"  visibilityMode: 'styleOnly',     // 'styleOnly' (default) | 'styleAndGeometry' — scoped to the contrast rules only",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true",
					"  },",
					"",
					"  rules: {",
					"    'some-rule-id': {",
					"      excludeSelectors: ['.some-noisy-widget']  // narrows candidates for THIS rule only",
					"    }",
					"  },",
					"",
					"  probes: { /* optional host-supplied evidence */ },",
					"",
					"  customRules: [ /* runtime-registered rules, see below */ ],",
					"",
					"  // Only read by runa11yCoreAcrossFrames. Ignored by runDomRulesInPage/runa11yCoreInPage.",
					"  pingWaitTime: 500,               // ms to wait for a child frame to answer a ping",
					"  frameWaitTime: 60000             // ms to wait for a child frame's full scan result",
					"};",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "option", label: "オプション", width: "22%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={optionRows}
			/>

			<h3 id="rule-scoped-excludeselectors">ルール単位の<code>excludeSelectors</code></h3>
			<p>
				トップレベルの<code>excludeSelectors</code>は<em>すべての</em>ルールに適用されます。ある要素を1つのルールからだけ除外し、他のルールでは引き続きチェックする、ということはできません。<code>rules[ruleId].excludeSelectors</code>はこの隙間を埋めるもので、<strong>そのルールだけ</strong>の対象候補を絞り込みます。グローバルなリストを置き換えるのではなく、常にそれに追加する形で働きます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  excludeSelectors: ['#cookie-banner'],   // applies to every rule, as always",
					"  rules: {",
					"    'aria-required-children': {",
					"      excludeSelectors: ['mat-select', 'mat-stepper', 'mat-horizontal-stepper', 'mat-vertical-stepper']",
					"    },",
					"    'aria-allowed-attr': {",
					"      excludeSelectors: ['mat-progress-spinner']",
					"    }",
					"  }",
					"};",
				]}
			/>
			<p>
				これが必要になる理由：<span lang="en">Angular Material</span>の<code>&lt;mat-select&gt;</code>は、内部のARIA構造の組み立て方が原因で、コンポーネント自体には問題がないのに<code>aria-required-children</code>でだけ誤検出を起こします。グローバルな<code>excludeSelectors</code>しかなければ、この誤検出を消す方法は<code>excludeSelectors: ['mat-select']</code>だけです。しかしそうすると<code>mat-select</code>は<code>contrast-minimum</code>や<code>aria-allowed-attr</code>を含む<em>他のすべてのルール</em>からも見えなくなり、何の問題もなかったチェックのカバレッジまで黙って失われます。上の例なら、誤判定する1つのルールを除くすべてのルールから<code>mat-select</code>が引き続き完全に見えます。
			</p>
			<p>
				あるルールに実際に適用される除外は、グローバルなリストとそのルール独自のリストの<strong>和集合</strong>です。どちらかに一致する要素は、そのルールの対象候補から外れます。不合格になりうる要素がすべてこの方法で除外されたルールは、<code>occurrences: []</code>とともに<code>outcome: 'pass'</code>または<code>'notApplicable'</code>（対象がない場合のそのルール自身の慣例に従います）を報告します。空の<code>occurrences</code>配列を伴う<code>outcome: 'fail'</code>になることはありません。その形はスキーマの別の箇所で「このルールが例外を投げた」ことを表すために予約されているからです（<a href="/results-reports/output-schema/">出力スキーマ</a>を参照）。
			</p>
			<p>
				グローバルなオプションと同じ形式を受け付けます。配列（<code>['mat-select', 'mat-stepper']</code>）またはカンマ区切りの文字列（<code>'mat-select, mat-stepper'</code>）です。
			</p>
			<p>
				バインディングパッケージ（<code>@surea11y/binding-base</code>と、それをラップするPlaywright/Puppeteer用のパッケージ）を使っている場合は、<code>.exclude()</code>ビルダーメソッドにルール単位の形式がすでにあるかどうかを、そのバインディング自身のREADMEで確認してください。ここで説明しているのはエンジンレベルの<code>engineOptions</code>の形式で、すべてのバインディングが対応しているわけではありません。
			</p>

			<h2>レシピ：実際のシナリオに合わせたオプションの組み合わせ</h2>
			<p>
				<strong>CIゲート：WCAG 2.2 AAのみ、自分では管理できないサードパーティのウィジェットは無視する</strong>
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  excludeSelectors: ['#cookie-banner', '.intercom-launcher'],",
					"  tags: { include: 'wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22a,wcag22aa' }",
					"}, null);",
				]}
			/>
			<p>
				<strong>人間の監査担当者が実際のブラウザーでコントラストを詳しく確認する</strong>：誤検出への備えを一部手放してより多くの検出結果を得るとともに、実際のページを操作しているので、計算済みスタイルだけでなく実際のレイアウトもチェックします。例ではPuppeteerの<code>page.evaluate</code>（複数の引数を受け付けます）を使っています。Playwrightの場合は、先に4つの位置引数を1つのオブジェクトにまとめてください。<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>を参照してください。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' },",
					"  visibilityMode: 'styleAndGeometry'",
					"}, null);",
				]}
			/>
			<p>
				<strong>UIの変更後に1つの領域だけを再スキャンし、シャドウDOMはスキップする</strong>：変更したウィジェットだけを確認したいコンポーネント単位のテストで役立ちます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, '#checkout-form', {",
					"  includeShadowDom: false",
					"}, { includeRuleIds: ['form-control-programmatic-label-present', 'button-name-present'] });",
				]}
			/>
			<p>
				<strong>スナップショットテスト用の再現可能な出力</strong>：<code>timestamp</code>を固定して、同じHTMLを2回スキャンしたときにバイト単位で同一のJSONが得られるようにし、あわせてデバッグ用の所要時間の内訳を要求します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z',",
					"  perfStats: true,",
					"  profileRules: true",
					"}, null);",
				]}
			/>
			<p>
				<strong>組み込みルールと並べて組織独自のカスタムルールを使う</strong>（この呼び出しに限る）：
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  customRules: [{",
					"    id: 'org-no-inline-onclick',",
					"    meta: { title: 'No inline onclick handlers', defaultSeverity: 'moderate' },",
					"    runInPage(ctx) {",
					"      const els = ctx.helpers.queryAll('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: el.outerHTML,",
					"        summary: 'Inline onclick handler found.',",
					"        hint: 'Move event handling into an external script.'",
					"      }));",
					"",
					"      return { ruleId: ctx.rule.ruleId, outcome: occurrences.length ? 'fail' : 'pass', severity: 'moderate', occurrences };",
					"    }",
					"  }]",
					"}, null);",
				]}
			/>

			<h2><code>customRules</code>：実行時に登録するルール</h2>
			<p>
				同梱のルールはすべて、ビルド時に<code>src/core.js</code>に組み込まれます。<code>engineOptions.customRules</code>は実行時のための抜け道で、その呼び出しに限って登録されるルール記述子の配列です。静的なカタログには何も追加されず、呼び出しをまたいで残るものもありません。これは回避すべき制限ではなく、意図した設計です。surea11yはもともと呼び出しごとに新しい<code>engineOptions</code>を受け取り、変更可能なグローバル設定を持ちません（共有ランタイムに対して<code>configure()</code>/<code>reset()</code>の手順が必要な他のエンジンとは異なります）。カスタムルールもこの呼び出し単位のモデルに従います。
			</p>
			<p>
				ライブラリーを直接呼び出すのが1つの方法ですが、CLIでも<code>--custom-rules &lt;path&gt;</code>（ローカルファイル。スキャンごとに1回読み込まれます）で利用できます。<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#custom-rules">CLIのドキュメント</a>を参照してください。
			</p>
			<p>
				記述子は<em>内部のルールモジュールがexportするものと同じ形</em>です。このエンジンのルールファイルの書き方を知っていれば、このAPIもすでに知っていることになります。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"{",
					"  id: 'my-org-custom-rule',          // required",
					"  meta: { title, description, tags, defaultSeverity, defaultConfidence, /* same fields as a rule module's meta */ },",
					"  runInPage(ctx) { /* same ctx shape and same return contract as any built-in rule */ },",
					"  applicability(ctx) { return true; }, // optional, same contract as a built-in rule's applicability",
					"  data: { /* optional, JSON-serializable */ }",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>runInPage</code>/<code>applicability</code>には、<strong>実際の関数</strong>と<strong>関数のソース文字列</strong>（つまり<code>fn.toString()</code>）のどちらも渡せます。<code>engineOptions</code>が現在のJSレルムの外に出ない場合（素のNode/jsdomでの利用）は実際の関数を渡してください。外に出る場合は文字列を渡します。たとえばPlaywrightの<code>page.evaluate(runa11yCoreInPage, {"{ engineOptions }"})</code>呼び出しでは、<code>engineOptions</code>がJSON/構造化クローンの境界を越えるため、生きた<code>Function</code>参照は渡せませんが、文字列なら渡せます。エンジンは文字列を<code>new Function</code>で関数に戻します。ビルド時にすべての組み込みルールのソースをページ内ランナーに埋め込むのと同じ仕組みです。
				</li>
				<li>
					<code>meta</code>には、ビルド時のルールとまったく同じデフォルト値の補完と検証が行われます。不要なものは省略してかまいません。<code>severity</code>のデフォルトは<code>moderate</code>、<code>confidence</code>は<code>medium</code>、<code>type</code>は<code>automatic</code>などです。
				</li>
				<li>
					カスタムルールの<code>id</code>が組み込みルールと重複した場合は、両方を実行するのではなく、<strong>そのスキャンでは組み込みルールを上書きします</strong>。同名のカスタムルールは、意図した上書きであるのと同じくらい偶然の衝突である可能性もあるため、衝突は必ず2つの方法で知らされます。該当するIDを示す<code>console.warn</code>と、結果のトップレベルにある<code>overriddenBuiltinIds</code>配列（衝突がなければ空）です。<a href="/results-reports/output-schema/">出力スキーマ</a>を参照してください。
				</li>
				<li>
					無効な記述子（<code>id</code>がない、または文字列でない、あるいは<code>runInPage</code>が関数でも関数に戻せるソース文字列でもない）は何の通知もなくスキップされ、組み込みルールを含むスキャンの残りは通常どおり実行されます。これは直すべき検証の抜けではありません。カスタムルールは呼び出し側が渡す任意のコードなので、「そのエントリだけを失敗として閉じ、スキャンは中断しない」ほうが安全なデフォルトです。例外を投げた<em>組み込み</em>ルールが、スキャン全体をクラッシュさせずにそのルールの<code>cantTell</code>にとどめられるのと同じ考え方です。
				</li>
				<li>
					結果は他のルールとまったく同じように<code>checksResults</code>に現れます。<code>{"{ __node }"}</code>だけを付けた<code>fail</code>/<code>cantTell</code>の検出箇所に対して<code>selector</code>/<code>html</code>/<code>structuralPath</code>が自動補完される点も同じです（<a href="/results-reports/output-schema/">出力スキーマ</a>を参照）。
				</li>
			</ul>

			<h2><code>contextSelector</code>（ランナーの第2引数。<code>engineOptions</code>のフィールドではありません）</h2>
			<p>
				スキャン範囲を1つ以上のサブツリーに絞るCSSセレクター（またはセレクターの配列）です。<code>document.querySelectorAll</code>で解決され（最初の一致だけでなく、すべての一致が対象）、何も一致しなければ<code>document.documentElement</code>/<code>document.body</code>にフォールバックします。ドキュメント全体をスキャンするには<code>null</code>を渡します。
			</p>
			<ul>
				<li>
					<strong>単一の文字列</strong>自体をカンマ区切りのセレクターリストにできます（通常のCSSと同じく和集合として扱われます）。<code>'#a, #b'</code>は<code>#a</code>と<code>#b</code>の両方をスキャンします。
				</li>
				<li>
					<strong>文字列の配列</strong>を渡すと、各セレクターに一致したものの和集合をスキャンします。<code>['#a', '.card']</code>は<code>'#a, .card'</code>と同じ動作です。配列形式は、リストをプログラムで組み立てる呼び出し側のためにあります。
				</li>
				<li>
					重なり合う領域や入れ子になった領域は自動的に重複除去されます。一致した複数のルートから到達できる要素も、領域ごとではなく1回だけ報告されます。
				</li>
			</ul>
		</>
	);
}
