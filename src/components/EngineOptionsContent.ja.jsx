import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "/configuration/packs/#en-301-549-pack";

const optionRows = [
	{
		id: "strictOptions",
		option: <code>strictOptions</code>,
		meaning: (
			<>
				デフォルトは<code>false</code>です。<code>true</code>にすると、スキャンの前にすべてのオプションを確認し、エンジンが読まないキーや、型が誤っているか集合の外にある値があれば<code>INVALID_ENGINE_OPTIONS</code>を投げます。後述の<a href="#catching-mistakes-in-the-options-strictoptions">「オプションの誤りを見つける」</a>を参照してください。
			</>
		),
	},
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
				<code>'2.0'</code>、<code>'2.1'</code>、<code>'2.2'</code>のいずれかで、そのスキャンがどのバージョンのWCAGへの適合を検証するかを指定します。省略すると、実行が適用するパックのプロファイルが示すバージョン（その<code>wcagVersion</code>）になり、それがなければ導入バージョンタグから推定されるバージョン、タグから何も推定できなければ<code>'2.2'</code>になります。このオプションが変えるのは、スキャンが報告する達成基準と、SC 4.1.1（構文解析）について<code>wcag22-removed</code>タグの付いたルールが<code>fail</code>にならない理由です。4.1.1は2.2で削除され、2.0と2.1ではそれぞれの正誤表により常に満たされているものとされます。ただし、<code>en301549-v3.2.1</code>のように、規格が4.1.1を維持しているプロファイルのもとでは例外です。前述の<a href="#filtering-by-wcag-version">「WCAGバージョンによる絞り込み」</a>を参照してください。それ以外の値は、型を問わず（数値の<code>2.1</code>、<code>'3.0'</code>）、代わりに実行が対象とするバージョンを示す<code>console.warn</code>を出して無視されます。
			</>
		),
	},
	{
		id: "wcagLevel",
		option: <code>wcagLevel</code>,
		meaning: (
			<>
				省略可：<code>'A'</code>、<code>'AA'</code>、<code>'AAA'</code>のいずれか（大文字小文字は問いません）で、実行が報告する達成基準のWCAGレベルを指定します。それより上のWCAGの集約は、ルールは実行されたまま<code>rulesResults</code>から除かれます。何を実行するかは決して変えません。選択が示すレベルより優先されます。IDで指定した集約は指定どおり報告されます。<code>engine.wcagLevel</code>として返し、オプションがない場合は選択が示すレベルがあればそれを保持します。それ以外の値は<code>console.warn</code>を出して無視され、<code>strictOptions</code>のもとではエラーを投げます。前述の<a href="#giving-the-level-of-a-scan-that-names-checks-wcaglevel">「チェックを指定するスキャンのレベルを示す」</a>を参照してください。
			</>
		),
	},
	{
		id: "profile",
		option: <code>profile</code>,
		meaning: (
			<>
				名前付きの適合性の目標（省略可）：<code>'wcag22-aa'</code>、<code>'en301549-v4.1.1'</code>、<code>'en301549-v3.2.1'</code>、<code>'section508'</code>、またはパック独自のもの。ほかに含める指定がない場合に、対応するタグセットでルールを選び、WCAGの対象バージョンはそのタグから決まります。効果があった場合は<code>engine.profile</code>として返し、なかった場合はコンソールに警告を出して無視します。前述の<a href="#conformance-profiles">「適合性プロファイル」</a>を参照してください。
			</>
		),
	},
	{
		id: "mappings",
		option: <code>mappings</code>,
		meaning: (
			<>
				<code>meta.normativeMappings</code>が要件を示す、WCAG以外の規格（省略可）：<code>'en301549'</code>、<code>'en301549:V3.2.1'</code>、<code>'en301549:V4.1.1'</code>、またはパックの規格のキーを、配列またはカンマ区切りの文字列で指定します。デフォルトはなしで、結果はWCAGだけを示します。EN 301 549のプロファイルは自身のバージョンを追加します。いずれかが適用された場合は<code>engine.mappings</code>として返します。前述の<a href="#other-standards-mappings">「ほかの規格」</a>を参照してください。
			</>
		),
	},
	{
		id: "logUntestedWcag",
		option: <code>logUntestedWcag</code>,
		meaning: (
			<>
				デフォルトは<code>true</code>です。<code>false</code>にすると、含めるリストでほかの値と並んでいる、どのルールも持たないWCAGのバージョンとレベルのタグ（<code>wcag22a</code>）についての<code>console.info</code>の注記を出力しません。前述の<a href="#via-runonly-4th-argument">「runOnlyで指定する」</a>を参照してください。
			</>
		),
	},
	{
		id: "optInRules",
		option: <code>optInRules</code>,
		meaning: (
			<>
				省略可：<code>'all'</code>、またはオプトインルールのタグのリストを、配列またはカンマ区切りの文字列で指定します。それらのルールを規格のプロファイルの外で解除し、何を実行するかは引き続きほかの選択が決めます。ほかの選択では実行されなかったルールを実行した場合は<code>engine.optInRules</code>として返し、不明なタグはコンソールに警告を出して無視します。前述の<a href="#running-every-rule-optinrules">「すべてのルールを実行する」</a>を参照してください。
			</>
		),
	},
	{
		id: "messages",
		option: <code>messages</code>,
		meaning: (
			<>
				省略可能な<code>{"{ [locale]: { key: text } }"}</code>です。エンジン組み込みの辞書より先に参照されるため、個々の文字列を上書きしたり、ビルドに含まれていない言語を補ったりできます。指定しなかったキーは通常どおりフォールバックするので、一部だけの上書きでも問題ありません。スタンドアロンのブラウザー用バンドルはこの仕組みでロケールの別ファイルを受け取ります。ページ内ランナーはシリアライズされていてファイルを読めないため、ページのコンテキストに辞書を渡す方法はこれしかありません。ほかのオプションと違い、各結果の<code>engineOptions</code>には返されません。使われた辞書は<code>engine.locale</code>が示します。詳しくは<a href="/configuration/locales/">ロケール</a>を参照してください。
			</>
		),
	},
	{
		id: "includeHiddenElements",
		option: <code>includeHiddenElements</code>,
		meaning: (
			<>
				デフォルトは<code>false</code>です。ヘルパーのクエリは、<code>display:none</code>、<code>[hidden]</code>、閉じた<code>&lt;details&gt;</code>（最初の<code>&lt;summary&gt;</code>を除くすべて。深さを問いません）、<code>content-visibility:hidden</code>と<code>hidden="until-found"</code>のコンテンツ、<code>[inert]</code>のサブツリー内のコンテンツ（描画はされるため、コントラストやテキストの間隔など見た目に関するルールは引き続き判定します）、非表示のレンダリング専用ホスト要素など、構造やCSSの仕組みで隠された要素を除外します（その子孫も除外されます）。<code>runa11yCoreAcrossFrames</code>は、このように隠されたフレームをスキャンしません。<code>true</code>にすると、こうした非表示・折りたたみ状態のサブツリーも評価の対象になります（旧来の、静的マークアップ向けの動作）。これは共通のクエリが返す範囲を広げるものです。それでもほとんどのルールはアクセシビリティツリーにあるものだけを判定します。非表示の要素にはチェックすべき名前もロールもないため、そうしたルールでは何も変わりません。意味があるのは、壊れたID参照など、マークアップそのものを扱うルールです。
			</>
		),
	},
	{
		id: "includeShadowDom",
		option: <code>includeShadowDom</code>,
		meaning: (
			<>
				デフォルトは<code>true</code>で、<code>helpers.queryAllSmart</code>を使うルールはオープンなシャドウルートの中まで走査します。<code>false</code>にするとライトDOMだけをスキャンします。<strong>クローズドなシャドウルートには、どちらの設定でも到達できません</strong>。それを公開するDOM APIが存在しないためです。エンジンが読めるコンテンツを持たないカスタム要素から名前が来ている可能性がある要素（ボタン、リンク、メニュー項目、オプション、タブ、ツリー項目、summary、ツールチップ）は、不合格にせず確認を求めます（<code>cantTell</code>、<code>name_closedContent</code>）。
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
				これらのセレクターのいずれかに一致する要素（とその子孫。シャドウルートの中にあるものや、その中にあるフレームのドキュメントも含みます）は、<strong>すべての</strong>ルールで完全にスキップされます。Cookieバナーやサードパーティの埋め込み、自分では管理できない、ノイズが多いと分かっているウィジェットに便利です。特定のルール1つだけから除外したい場合は、後述の<code>rules[ruleId].excludeSelectors</code>を使ってください。セレクターの配列か、セレクターリストを持つ文字列を指定します。文字列はセレクターの間のカンマでだけ区切られるので、<code>'#cookie-banner, img:not(.a, .b)'</code>は<code>['#cookie-banner', 'img:not(.a, .b)']</code>と同じです。各セレクターは個別に適用されます。有効なCSSでないセレクターは<code>console.warn</code>を出して何も除外せず、ほかのセレクターは引き続き適用されます。
			</>
		),
	},
	{
		id: "styleSheetTexts",
		option: <code>styleSheetTexts</code>,
		meaning: (
			<>
				ページが読み取れないスタイルシートのテキストです。<code>{"[{ href, text }]"}</code>の形で、別オリジンのスタイルシートをURLで示し、そのCSSを渡します。CSSを読むルール（<code>css-orientation-lock</code>、<code>css-hidden-focus</code>、<code>css-focus-indicator-suppressed</code>）は、スタイルシートの代わりにこれを読みます。各結果の<code>engineOptions</code>は、テキストを除いたスタイルシートのhref（<code>{"[{ href }]"}</code>）としてこれを返します。<code>preloadStyleSheets()</code>はサーバーが共有しているものをページの中から取得し、<code>runa11yCoreInPageAsync</code>はスキャンの前にそれらを取得します。ブラウザーを操作するツールは、それ以外のものをページの外から取得できます。GitHubにあるcoreの統合ガイドの<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>「Style sheets from another origin」</a>を参照してください。core 1.14.0以降です。
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				結果のトップレベルの<code>timestamp</code>フィールドにそのまま渡されます。エンジン自身はタイムスタンプを生成しません（決定論的であるための設計です）。文字列でない値（<code>Date</code>、数値）は<code>console.warn</code>を出して無視されます。<code>new Date().toISOString()</code>を渡してください。
			</>
		),
	},
	{
		id: "contrast-mode",
		option: <code>contrast.mode</code>,
		meaning: (
			<>
				<code>strictConformance</code>（デフォルト）：実際に描画される背景色を確実に計算できない場合、コントラストのルールは何も報告しません（<code>notApplicable</code>またはスキップ）。誤った<code>fail</code>を防ぐためです。<code>auditorAssist</code>：その安全マージンを一部手放して、より多くの検出結果を返します。フラグが立ったケースを人間の監査担当者が再確認することを前提としたモードで、無人で動かすCIのゲートには向きません。不透明な背景を描画しないページは、このケースには当たりません。その背後のキャンバスはページ自身のカラースキームから決まるため、そのテキストはどちらのモードでも推測なしに計測されます。ページのキャンバスが分からない場所（フレームの中、強制カラーのもと）では、<code>auditorAssist</code>はテキストを<code>contrast.rootCanvasFallback</code>の上で計測し、<code>ROOT_CANVAS_FALLBACK</code>として記録します。
			</>
		),
	},
	{
		id: "contrast-fallback",
		option: <code>contrast.rootCanvasFallback</code>,
		meaning: (
			<>
				不透明な背景を描画しないページのためのキャンバスの色です。指定しない場合、コントラストのルールはどちらのモードでも、そのようなページのテキストをブラウザーがその背後に描画するキャンバスの上で計測します。ページが描画されるカラースキームのキャンバスで、それはページ自身の<code>color-scheme</code>（ルート、または<code>&lt;meta&gt;</code>の形式）が決めます。何も宣言しないページは、ユーザーの好みにかかわらずライトで、白の上に描画されます。<code>light dark</code>はライトのユーザーには白の上、ダークのユーザーにはダークなキャンバスの上に描画され、そのテキストは両方のスキームで計測され、どちらかで不合格なら不合格になります（<code>data.details.colorScheme</code>がどちらかを示します）。システムカラーを解決しないjsdomのもとでは、エンジンはChromiumの色を使い、そこで色を割り出せないテキストは確認が必要なものとして扱います（<code>COLOR_SCHEME_NOT_RENDERED</code>）。指定すると、白を含め、その色がすべてのスキームでページのキャンバスの代わりになります。テキストはその上で1回計測され、想定として記録されます（<code>ROOT_CANVAS_FALLBACK</code>）。ページのキャンバスが分からないのは、親ページが透けて見えることがあるキャンバスを持つフレームの中と、強制カラーのもとです。そこでは<code>contrast-computable</code>が確認を求め、コントラスト比のルールはテキストを対象外にします。ただし<code>auditorAssist</code>はこの色の上で計測します。各結果の<code>engineOptions.contrast</code>は、使った色を返します。指定がなければ白です。
			</>
		),
	},
	{
		id: "contrast-fallback-set",
		option: <code>contrast.rootCanvasFallbackSet</code>,
		meaning: (
			<>
				各結果に返される値です。<code>contrast.rootCanvasFallback</code>が呼び出し側の指定なら<code>true</code>、デフォルトの白なら<code>false</code>です（指定した値が使える色でなかった場合も<code>false</code>）。入力として指定する必要はありません。結果に返されたオプションをそのまま渡し直すと元のとおりに読まれるので、<code>false</code>なら返された白はデフォルトのままです。<code>true</code>でも<code>false</code>でもない値は警告を出し、指定がなかったものとして読まれます。core 1.14.0以降です。
			</>
		),
	},
	{
		id: "visibilityMode",
		option: <code>visibilityMode</code>,
		meaning: (
			<>
				3つのコントラストルール（<code>contrast-minimum</code>、<code>contrast-enhanced</code>、<code>contrast-computable</code>）が、テキストノードを実際にチェック対象とするかどうかをどれだけ厳密に判断するかを制御します。<strong>他のルールはこのオプションを読みません。</strong>指定しない場合（デフォルト）、ページにレイアウトがあれば（ブラウザーでのスキャンはすべてそうです）<code>'styleAndGeometry'</code>、ない場合（jsdom）は<code>'styleOnly'</code>になります。読み手に見えるのは見える場所に描画されたテキストだけで、それを判断できるのはレイアウトだけだからです。<code>'styleOnly'</code>：対象かどうかをCSSだけで判断します（<code>display</code>、<code>visibility</code>、<code>opacity</code>、祖先による非表示など）。<code>'styleAndGeometry'</code>：それに加えて実際のレイアウトをチェックします（<code>getClientRects()</code>/<code>getBoundingClientRect()</code>）。クライアント矩形を持たないテキストや、幅または高さがゼロのテキストも除外されます。ページの完全に上側や左側にあり、スクロールしても届かないテキスト（<code>left: -9999px</code>の手法）や、<code>overflow: hidden</code>または<code>clip</code>の祖先に完全に切り取られたテキスト（<code>height: 0; overflow: hidden</code>、表示範囲外のカルーセルのスライド）も同様です。スクロールするボックス（<code>auto</code>、<code>scroll</code>）は、読み手がそのテキストまでたどり着けるため、除外の理由になりません。<code>&lt;select&gt;</code>の選択肢は、その<code>&lt;select&gt;</code>がページ上にある位置で判断されます。どちらのモードでも、フォントサイズが0のテキストや完全に透明な色のテキストは、何も描画されないため除外されます。ただし、グリフを通して背景を見せる透明なテキスト（そのテキストか祖先の<code>background-clip: text</code>）は除外されません。背景が単色ならその色で計測され、グラデーションや画像なら確認が必要なものとして扱われます。ブラウザーで、以前のリリースと同じように計算済みスタイルだけからテキストをチェックするには<code>'styleOnly'</code>を指定してください。素のjsdom（<code>runDomRulesInPage</code>）には本物のレイアウトエンジンがないため、<code>'styleAndGeometry'</code>で加わるのは主に<code>getBoundingClientRect()</code>によるサイズゼロのチェックで、本当の意味でのクリッピングやオーバーフローの検出にはなりません。<a href="/help/known-limitations/">既知の制限事項</a>を参照してください。
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
				エンジンによる<code>selector</code>/<code>html</code>の自動補完を抑制します。すべてのルールが検出箇所を自前で組み立てるのをやめ、要素を報告する方式に移行して以降（1.5.0）、ほぼすべてのルールがこの自動補完を通ります。そのため<code>includeSelector: false</code> / <code>includeHtml: false</code>を指定すると、ほぼすべてのルールからセレクターとHTMLスニペットが取り除かれます。ただし、いくつかのルールは今も<code>runInPage</code>の中でこれらのフィールドを自分で組み立てており、影響を受けません。<code>contrast-minimum</code>/<code>contrast-enhanced</code>（検出結果が要素ではなくテキストの連なりであるため）、<code>page-title-present</code>、<code>identical-links-same-purpose</code>などがそうです。<strong>つまり出力は大幅に絞られますが、結果のどこにもセレクターやHTMLが<em>含まれない</em>ことまでは保証されません。</strong>
			</>
		),
	},
	{
		id: "output-detail",
		option: <code>output.detail</code>,
		meaning: (
			<>
				<code>'full'</code>（デフォルト）または<code>'findings'</code>：より小さな結果です。何かを報告するチェック結果（<code>fail</code>、<code>cantTell</code>、検出箇所を列挙するもの）だけを完全なまま残し、それ以外の<code>pass</code>と<code>notApplicable</code>は、<code>ruleId</code>、<code>outcome</code>、<code>type</code>と、ある場合はその<code>margin</code>または<code>error</code>だけを保持します。集約と判定は変わらず、レポーターはこれを完全な結果として読みます。コアのカタログで補えないルールは完全なまま残ります。<code>packs</code>付きのスキャンのすべてのルール、カスタムルール、スキャンの<code>messages</code>が文言を変えるルールです。<a href="/results-reports/output-schema/#top-level-result"><code>engine.outputDetail</code></a>を参照してください。TypeScriptでは、このような結果は<code>CompactScanResult</code>です。
			</>
		),
	},
	{
		id: "rules-ruleId",
		option: <code>rules[ruleId]</code>,
		meaning: (
			<>
				そのルールに<code>ctx.config</code>として渡されます。また<code>excludeSelectors</code>に限っては、ルールが実行される前にエンジン自身が読み取ります。後述の<a href="#rule-scoped-excludeselectors">「ルール単位のexcludeSelectors」</a>を参照してください。それ以外のキーは受け渡されるだけです。<strong>同梱されているルールで、ここからほかに何かを受け取るものはありません。</strong>ルールが宣言する設定（<code>contrast-minimum</code>のしきい値など）はその規格のものなので、呼び出し側が渡した値は破棄されます。WCAG 1.4.3を示す結果は、常に4.5:1で判定されます。別のしきい値を持つ規格には、独自のルールであるバリアントがあり、<a href="/configuration/packs/">パック</a>がそれを提供できます。キーはルールIDと同じように、大文字小文字を問わず、また旧来の<code>a11ycore-</code>プレフィックス付きでも照合されます。スキャンのどのルールも示さないキーには、最も近いIDとともに警告が出ます。
			</>
		),
	},
	{
		id: "packs",
		option: <code>packs</code>,
		meaning: (
			<>
				<code>@surea11y/core/pack</code>によるパック（省略可）：コアの外から来るルール、コアのルールのバリアント、規格やチェックリスト、メッセージで、スキャンに加わります。リストで指定します。Nodeの<code>runDomRulesInPage</code>とカタログ関数ではパックのオブジェクト、<code>runa11yCoreInPage</code>では<code>packScript</code>がページに登録したパックの<code>name@version</code>です。それ以外の値ではパックは実行されず、警告が出ます。<code>strictOptions</code>のもとでは<code>code: 'INVALID_ENGINE_OPTIONS'</code>付きのエラーを投げます。<code>engine.packs</code>として返します。<a href="/configuration/packs/">パック</a>を参照してください。
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				サイトのほかのページなど、1ページのスキャンでは見えないもののために、ホストアプリケーションが渡す、JSONとして安全な省略可能の証拠オブジェクトです。ルールが読む前にエンジンが制限します（<code>ctx.inputs.probes</code>）。深さは6階層、配列は200項目、オブジェクトは50キー、文字列は2,000文字までです。<code>page-title-patterns</code>は<code>crawl.pageTitles</code>（<code>{"{ pages: [{ url, title }] }"}</code>）を読み、サイト全体で汎用的なタイトルやテンプレートのままのタイトルを探します。パックのルールは独自のprobesを読むことがあり、それはパックが説明します。
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
				デバッグ専用です。<code>perfStats: true</code>を指定すると、結果の<code>perfStats</code>フィールドに内部カウンターが返されます。<code>profileRules: true</code>を指定すると、そこに<strong>さらに</strong>ルールごとの所要時間の内訳が加わります。<code>profileRules</code>だけを指定しても何も起きません。内訳を格納するオブジェクトを作るのは<code>perfStats</code>です。<strong>この形は安定した出力契約に含まれないため、これに依存しないでください。</strong>また、<code>profileRules</code>は出力を非決定論的にする唯一のオプションです。カウンターは同一の実行間で変わりませんが、実時間の計測値は変わります。実行間で結果の差分を取る場合はオフにしておいてください。<code>profileRules</code>を指定すると、共有のキャッシュ（計算済みスタイルとアクセシビリティツリー上の対象判定）は最初のルールの前に満たされ、<code>perfStats.warmUpMs</code>として別に計測されます。そのため、そのコストが最初にページをたどるルールに計上されることはありません。
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
				どのランナー（<code>runDomRulesInPage</code>、<code>runa11yCoreInPage</code>）も、同じ4つの引数<code>(pageUrl, contextSelector, engineOptions, runOnly)</code>を取ります。このページでは<code>engineOptions</code>と<code>runOnly</code>のすべてを説明します。ページをWCAGのバージョンとレベルに照らしてチェックするには、まず<a href="#selecting-by-wcag-target-runonlywcag"><code>runOnly.wcag</code></a>から始めてください。
			</p>

			<h2 id="selecting-which-rules-run">実行するルールの選択</h2>
			<p>
				何に照らしてテストするかを指定すれば、エンジンがルールを選びます。何も選択しなければ、既定のルールが実行されます。既定のルールとは、規格やパックのオプトインルールを除くすべてのルールです。オプトインルールは有効にしたときにだけ実行されます（<a href="#opt-in-rules">オプトインルール</a>を参照）。
			</p>
			<DataTable
				label="実行するものの選び方"
				rowKey="id"
				columns={[
					{ key: "run", label: "実行するもの", wrap: true },
					{ key: "pass", label: "渡すもの", wrap: true },
				]}
				rows={[
					{ id: "all", run: "既定のルール：有効にしていないオプトインルールを除くすべてのルール", pass: <>何も渡さない：<code>runOnly</code>は<code>null</code></> },
					{
						id: "wcag",
						run: "WCAGの適合性の目標：あるバージョンの、あるレベル以下の達成基準のルール",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code>,
					},
					{
						id: "wcag-bp",
						run: "同じものと、WCAGの達成基準を検査しないベストプラクティスのルール",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' }, bestPractices: true }"}</code>,
					},
					{ id: "bp", run: "ベストプラクティスのルールだけ", pass: <code>{"runOnly: { bestPractices: true }"}</code> },
					{
						id: "profile",
						run: "WCAGを基にした規格（EN 301 549、Section 508）",
						pass: <code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>,
					},
					{
						id: "profile-bp",
						run: "同じものと、ベストプラクティスのルール",
						pass: (
							<>
								<code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>、<code>{"runOnly: { bestPractices: true }"}</code>
							</>
						),
					},
				]}
			/>
			<CodeBlock lang="js" lines={[
					"// WCAG 2.2 AA, with the best practices:",
					"runDomRulesInPage(url, null, {}, {",
					"  wcag: { version: '2.2', level: 'AA' },",
					"  bestPractices: true",
					"});",
				]} />
			<p>
				どのルールもWCAGの達成基準を検査するか、ベストプラクティスであるかのどちらかです。そのため<code>{"{ wcag: { version: '2.2', level: 'AAA' }, bestPractices: true }"}</code>は、WCAG 2.2で削除された4.1.1「構文解析」のルールを除くすべてのルールを実行します。1つの達成基準、ルールのリスト、除外など、より細かい指定は<a href="#advanced-selection-tags-and-rule-ids">「高度な選択：タグとルールID」</a>を参照してください。それらのフィールドは上のものと組み合わせられます。ルールを指定するスキャンは、それらが検査する達成基準も報告します（<a href="#which-criteria-a-scan-reports">「スキャンが報告する達成基準」</a>）。
			</p>

			<h3 id="selecting-by-wcag-target-runonlywcag">WCAGの目標で選ぶ（<code>runOnly.wcag</code>）</h3>
			<p>
				<code>runOnly.wcag</code>はWCAGのバージョンと適合レベルを指定し、その目標の達成基準のルールを選択します。
			</p>
			<CodeBlock lang="js" lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
				]} />
			<ul>
				<li>
					<code>version</code>は<code>'2.0'</code>、<code>'2.1'</code>、<code>'2.2'</code>のいずれか、<code>level</code>は<code>'A'</code>、<code>'AA'</code>、<code>'AAA'</code>のいずれかです（大文字小文字は問いません）。
				</li>
				<li>
					ルールが選択されるのは、それが示す達成基準のいずれかが目標に含まれる場合です。つまり、そのバージョンで有効であり（そのバージョンまでに導入され、そのバージョンまでに削除されていない）、達成基準が<strong>そのバージョンで</strong>持つレベルで、目標のレベル以下である場合です。レベルは<code>@surea11y/core/wcag</code>の<code>WCAG_CRITERIA</code>から取得され、バージョンごとのレベルを持ちます。
				</li>
				<li>
					そのため、2.2で削除された4.1.1「構文解析」は、<code>{"{ version: '2.1' }"}</code>の目標には含まれ、<code>{"{ version: '2.2' }"}</code>の目標には含まれません。<code>duplicate-id</code>は前者では実行され、後者では実行されません。バージョンのタグでは後者でも実行されます。
				</li>
				<li>
					どの達成基準も示さないルール（ベストプラクティスのルール）は、どの目標にも含まれません。それらは<code>bestPractices: true</code>（次の節）で、個別のルールは<code>tags</code>か<code>includeRuleIds</code>で追加してください。<code>wcag</code>と併用すると、これらはすべてルールを<strong>追加で</strong>選択し、目標のルールとそれらが選択するものの和集合になります。<code>excludeTags</code>、<code>excludeRuleIds</code>、<code>excludeTestIds</code>は、いつもどおりその後に適用されます。
				</li>
				<li>
					<code>engineOptions.wcagVersion</code>が設定されていない限り、目標のバージョンが実行のWCAGの対象（<code>engine.wcagVersion</code>）になります。目標のレベルは、レベルのタグと同じように、報告されるWCAGの集約を決めます。ただし<code>engineOptions.wcagLevel</code>が設定されている場合は別です（<a href="#giving-the-level-of-a-scan-that-names-checks-wcaglevel">「チェックを指定するスキャンのレベルを示す」</a>）。
				</li>
				<li>
					目標はルールを含めるものなので、<code>tags</code>と同じく<code>engineOptions.profile</code>の代わりにルールを選択します。<code>getProfileWcagTarget(profile)</code>はプロファイルが相当する目標を返し（<a href="#conformance-profiles">「適合性プロファイル」</a>を参照）、<code>getChecksForRunOnly(runOnly, engineOptions)</code>は<code>wcag</code>を持つ<code>runOnly</code>が実行するルールを、<code>getRulesForRunOnly(runOnly, engineOptions)</code>はそれが報告する集約を列挙します。
				</li>
				<li>
					それ以外の値は、何が誤っているかを示して<code>INVALID_RUN_ONLY</code>を投げます。<code>runOnly.wcag.version must be "2.0", "2.1" or "2.2", not "3.0".</code>
				</li>
			</ul>
			<CodeBlock lang="js" lines={[
					"// WCAG 2.1 AA, plus the best-practice rules, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, tags: ['best-practice'], excludeRuleIds: ['region'] }",
				]} />

			<h3 id="adding-the-best-practices-runonlybestpractices">ベストプラクティスを追加する（<code>runOnly.bestPractices</code>）</h3>
			<p>
				<code>bestPractices: true</code>はベストプラクティスのルールを選択します。<code>region</code>、<code>landmark-one-main</code>、<code>heading-order</code>、<code>page-has-heading-one</code>、<code>skip-link</code>、<code>tabindex</code>、<code>image-redundant-alt</code>など、WCAGの達成基準を示さないルールです。これらは<code>best-practice</code>のタグを持つルールなので、そのタグを追加するのと同じです。これらのルールの検出結果は望ましい実践についてのもので、WCAGの不合格ではありません。どのWCAGの集約もそれを算入しません。ほとんどは<code>cantTell</code>を報告しますが、検出結果そのものがバリアであるものは<code>fail</code>を報告します。名前のない見出しに対する<code>empty-heading</code>がそうです。
			</p>
			<ul>
				<li>
					<code>wcag</code>、<code>tags</code>、ルールIDと併用すると、それらが選択するものにこれらのルールを追加します。除外はその後に適用されるため、<code>excludeRuleIds: ['region']</code>は引き続き<code>region</code>を除きます。
				</li>
				<li>単独で使うと、ベストプラクティスのルールだけを選択します。</li>
				<li>
					<code>false</code>または省略した場合は何も追加しません。単独の<code>{"{ bestPractices: false }"}</code>は空の選択なので、<code>{"{}"}</code>と同じく既定のルールが実行されます。
				</li>
				<li>
					それ以外の値は<code>INVALID_RUN_ONLY</code>を投げます。<code>runOnly.bestPractices must be true or false, not "yes".</code>
				</li>
				<li>
					<code>engineOptions.profile</code>と併用すると、プロファイルのルールにベストプラクティスのルールを追加し、プロファイルも引き続き適用されます。そのルール、集約、対応付け、<code>engine.profile</code>は、併用しない場合と同じです。<code>profile: 'en301549-v4.1.1'</code>と<code>{"{ bestPractices: true }"}</code>を指定すると、その規格とベストプラクティスが実行されます。ベストプラクティスのルールはWCAGの達成基準を検査しないため、プロファイルのどの集約にも算入されません。
				</li>
			</ul>
			<CodeBlock lang="js" lines={[
					"// WCAG 2.1 AA and the best practices, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, bestPractices: true, excludeRuleIds: ['region'] }",
				]} />

			<h3 id="conformance-profiles">適合性プロファイル</h3>
			<p>
				<code>engineOptions.profile</code>は、タグセットを書き出す代わりに適合性の目標を名前で指定します。
			</p>
			<DataTable
				label="適合性のプロファイル"
				rowKey="profile"
				columns={[
					{ key: "profile", label: "プロファイル", width: "20%" },
					{ key: "tags", label: "実行するルールのタグ", wrap: true },
					{ key: "target", label: "WCAGの対象", width: "12%" },
					{ key: "wcagTarget", label: "getProfileWcagTarget", wrap: true },
					{ key: "why", label: "理由", wrap: true },
				]}
				rows={[
					{
						profile: <code>wcag22-aa</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>,{" "}
								<code>wcag22a</code>, <code>wcag22aa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
						why: "WCAG 2.2のレベルAとAA",
					},
					{
						profile: <code>en301549-v4.1.1</code>,
						tags: (
							<>
								<code>wcag22-aa</code>と同じ
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
						why: "EN 301 549 V4.1.1の第9章はWCAG 2.2のAとAAを再掲しています",
					},
					{
						profile: <code>en301549-v3.2.1</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>
							</>
						),
						target: "2.1",
						wcagTarget: <code>{"{ version: '2.1', level: 'AA' }"}</code>,
						why: "EN 301 549 V3.2.1の第9章はWCAG 2.1のAとAAを再掲しています（4.1.1構文解析を含む）",
					},
					{
						profile: <code>section508</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>
							</>
						),
						target: "2.0",
						wcagTarget: <code>{"{ version: '2.0', level: 'AA' }"}</code>,
						why: "改訂版のSection 508基準はWCAG 2.0のAとAAを取り込んでいます",
					},
				]}
			/>
			<p>
				<code>getProfileWcagTarget(profile)</code>は、プロファイルのタグセットが相当する<code>runOnly.wcag</code>の目標を返し、プロファイルでない名前には<code>null</code>を返します。プロファイルは引き続き表のとおりタグで選択します。<code>wcag22-aa</code>では<code>duplicate-id</code>（4.1.1）が実行されて<code>fail</code>にはならず、<code>{"{ wcag: getProfileWcagTarget('wcag22-aa') }"}</code>ではそれが除かれます。
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { profile: 'en301549-v3.2.1' }, null);"]} />
			<Callout tone="note" title="非推奨">
				<p>
					<code>en301549-v4.1.1</code>と<code>en301549-v3.2.1</code>はEN 301 549のパック<a href={pack}><code>@surea11y/pack-en301549</code></a>に移り、core 2.0.0で削除されます。それまでは従来どおり動作し、プロセスごとに1回<code>console.warn</code>を出します。パックを渡すと（<code>{"packs: [en301549]"}</code>）、スキャンは同じ名前をパックから取り、通知は出しません。パックのプロファイルは、WCAGの集約の代わりに条項ごとに結果を1つ報告します。<a href={`${core}/docs/API_STABILITY.md#deprecating-a-standard-a-profile-or-an-entry-point`}>coreが規格を非推奨にする手順</a>を参照してください。
				</p>
			</Callout>
			<p>
				<a href="/configuration/packs/">パック</a>の規格やチェックリストは、独自のプロファイルをこの一覧に加えます。
			</p>
			<p>
				WCAGの対象バージョンは、手書きのタグセットと同じようにタグから決まります（後述の<a href="#filtering-by-wcag-version">「WCAGバージョンによる絞り込み」</a>を参照）。そのため<code>en301549-v3.2.1</code>では重複したidが<code>fail</code>になりえますが、<code>en301549-v4.1.1</code>ではなりません。V3.2.1のプロファイルは4.1.1を維持するためです（<a href="#parsing-errata">後述</a>）。パックのプロファイルは、代わりに<code>wcagVersion</code>で自身のバージョンを示せます（<a href="/configuration/packs/#profiles">パック</a>）。規格が対応付けたルールだけを実行するプロファイルには、バージョンを示すWCAGのタグがないためです。名前の大文字と小文字は区別しません。プロファイルを使った実行は、それを<code>engine.profile</code>として返します。
			</p>
			<p>
				優先順位：ルールを<em>含める</em>指定はすべて、プロファイルの代わりにルールを選びます。<code>wcag</code>、<code>tags</code>、<code>includeRuleIds</code>、<code>includeTestIds</code>を持つ<code>runOnly</code>、または<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>の<code>include</code>です。除外はプロファイルの上に引き続き適用されます。<code>runOnly</code>の除外（<code>excludeTags</code>、<code>excludeRuleIds</code>、<code>excludeTestIds</code>。そのためバインディングの<code>disableTags()</code>はプロファイルを置き換えるのではなく絞り込みます）でも、<code>runOnly</code>のフィルターがない場合の<code>engineOptions</code>の除外（<code>tags.exclude</code>、<code>rules.exclude</code>、<code>tests.exclude</code>）でも同じです。また、明示的な<code>engineOptions.wcagVersion</code>は、プロファイルが示す、または指定するバージョンより常に優先されます。効果のないプロファイル（不明な名前や、上記のように上書きされたもの）はエラーではありません。実行は指定がなかったものとして続き、理由を示す<code>console.warn</code>を出力し、<code>engine.profile</code>は含まれません。<code>runOnly.bestPractices: true</code>はこの種の「含める」指定ではありません。プロファイルのルールにベストプラクティスのルールを追加し、プロファイルは適用されます（<a href="#adding-the-best-practices-runonlybestpractices">「ベストプラクティスを追加する」</a>）。
			</p>
			<p>
				規格のプロファイルは、その規格がWCAGの達成基準を免除したり、WCAGのチェックを独自のものに置き換えたりする場合に、ルールを除外することもあります。プロファイルが指定するルール、すべての達成基準が免除されるルール、免除された達成基準のWCAGの集約は実行されず、ルールカタログからも除かれます。プロファイルが残す達成基準も検査するルールは引き続き実行され（2.4.4を免除するプロファイルのもとで、2.4.4と4.1.2を検査する<code>link-name-present</code>）、<code>engine.profileExcludes</code>が除外したものを示します。現在、何かを除外する組み込みのプロファイルはありません。
			</p>
			<p>
				<strong>プロファイルが選ぶのは、実行するルールだけです。</strong>それらに合格すれば名前の由来となった規格を満たすかどうかについては何も示しません。ほとんどの達成基準には、自動化されたルールでは扱えない人の判断が必要です（<a href="/conformance/wcag-mapping/#what-this-engine-cannot-tell-you">このエンジンにはわからないこと</a>を参照）。
			</p>
			<p>
				EN 301 549のプロファイルは、<code>mappings: ['en301549:V4.1.1']</code>（または<code>V3.2.1</code>）を渡したのと同じように、対象バージョンのEN 301 549の条項も有効にします。後述の<a href="#other-standards-mappings">「ほかの規格」</a>を参照してください。どの規格のプロファイルも、同じように自身のバージョンを有効にします。<code>mappedRules</code>を持つプロファイルは、タグにかかわらず、その規格が対応付けられているルールも実行します。<code>heading-order</code>や<code>skip-link</code>のようにWCAGとの対応付けがないルールには、選択に使えるWCAGのタグがないためです。独自の要件を持つ規格や組織のチェックリストは、<a href="/configuration/packs/">パック</a>としてエンジンに加わり、独自のプロファイル名、ルール、集約を持ち込みます。エンジン自体にそのような規格は同梱されていません。
			</p>

			<h3 id="opt-in-rules">オプトインルール</h3>
			<p>
				一部のルールは、WCAGが求めていない、規格独自の要件を確認します。例えば国内規格がdoctypeを求めたり、<code>bgcolor</code>のような表示用の属性を禁止したりする場合です。そのようなルールの<code>fail</code>はその規格の不合格であってWCAGの不合格ではないため、これらのルールは<strong>デフォルトでは無効</strong>です。各ルールは規格のルールタグを持ち、選択がそれを求めたときだけ実行されます。
			</p>
			<ul>
				<li>そのタグを含む、規格のプロファイルによって</li>
				<li>
					そのタグによって（<code>{"tags: { include: '<tag>' }"}</code>。単独でもほかと組み合わせても）
				</li>
				<li>
					そのidによって（<code>{"rules: { include: '<rule id>' }"}</code>、または<code>runOnly.includeRuleIds</code>）
				</li>
				<li>
					そのルールをまとめる、規格独自の集約のidによって（<code>{"rules: { include: '<rollup id>' }"}</code>は、オプトインかどうかにかかわらず、その集約のルールを実行します）
				</li>
				<li>
					後述の<code>engineOptions.optInRules</code>で解除することによって
				</li>
			</ul>
			<p>
				それ以外ではオプトインルールは選ばれません。デフォルトの実行、WCAGのタグセット、WCAGやEN 301 549のプロファイル、WCAGの集約のidのどれでもありません。除外はほかのルールと同じように適用されます。タグだけを選ぶと、その規格独自のルールは実行されますが、その規格が対応付けられているWCAGのルールは実行されません。つまり「その規格がWCAGを超えて何を求めるか」には答えますが、その規格に対する監査にはなりません。監査には規格のプロファイルを使ってください。タグだけの場合、規格独自の集約は、ルールが実行されなかった要件について<code>cantTell</code>を報告します。そのタグを持つ、<code>customRules</code>で追加したルールも同じ制限に従います。現在、エンジンに組み込まれた規格にオプトインルールを持つものはありません。パックの名前空間のタグはこのように働きます。
			</p>

			<h3 id="running-every-rule-optinrules">すべてのルールを実行する（<code>optInRules</code>）</h3>
			<p>
				どの規格に属するかにかかわらずエンジンのすべてのルールを実行するには、プロファイルを省き、オプトインルールを解除します。
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { optInRules: 'all' }, null);"]} />
			<p>
				<code>'all'</code>はすべての規格のオプトインルールを解除し、タグのリストを渡すとそのタグのルールだけを解除します。解除するのは制限だけで、どのルールを実行するかは引き続きほかの選択が決めます。そのため、上のようにフィルターもプロファイルもなければ、すべてのルールとすべての規格の集約が実行されます。<code>profile: 'wcag22-aa'</code>の下では、オプトインルールはWCAGのタグを持たないため、実行されるのは引き続きWCAGのルールだけです。除外は通常どおり適用されます。オプトインのタグでないタグは<code>console.warn</code>を出して無視します。解除できるのはこのエンジンオプションだけです。<code>runOnly</code>には<code>optInTags</code>キーがないため、そこに渡すと未知のキーとなり、単独なら<code>INVALID_RUN_ONLY</code>を投げ、<code>runOnly</code>が読むキーと並んでいれば警告を出して無視されます。メッセージは<code>engineOptions.optInRules</code>を案内します。
			</p>
			<p>
				これは、開発中やサイトを調べるときに、エンジンが報告できるものをすべて見るためのものです。<strong>適合性の目標ではありません。</strong>このような実行は、WCAGが認めていてほかの規格だけが禁じていることでもページを不合格にします。結果はそれを示します。<code>engine.optInRules</code>は実行されたルールのタグを列挙し、HTMLレポート、SARIF、JUnitはそれをプロファイルの横に表示します。結果にほかの規格の番号は追加しません。そのためには<code>mappings</code>を渡してください。例えば<code>{"{ optInRules: 'all', mappings: ['<key>'] }"}</code>です。
			</p>

			<h3 id="other-standards-mappings">ほかの規格（<code>mappings</code>）</h3>
			<p>
				各結果の<code>meta.normativeMappings</code>は、それが確認するWCAGの達成基準を示します。<code>engineOptions.mappings</code>は、それぞれに対応するほかの規格の要件を追加します。デフォルトでは何も追加しません。監査の対象でない規格の条項は、SARIFのタグ、JUnitのプロパティ、レポートのすべてでノイズになるからです。
			</p>
			<DataTable
				label="mappingsの値"
				rowKey="value"
				columns={[
					{ key: "value", label: "値", width: "34%" },
					{ key: "adds", label: "追加されるもの", wrap: true },
				]}
				rows={[
					{
						value: <code>'en301549'</code>,
						adds: "各達成基準に対応するEN 301 549第9章の条項（それを含むすべてのバージョン：V3.2.1とV4.1.1）",
					},
					{
						value: (
							<>
								<code>'en301549:V3.2.1'</code>, <code>'en301549:V4.1.1'</code>
							</>
						),
						adds: "同じものを、そのバージョンだけについて",
					},
				]}
			/>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { mappings: ['en301549:V3.2.1'] }, null);"]} />
			<Callout tone="note" title="非推奨">
				<p>
					<code>en301549</code>の対応付けはEN 301 549のパック<a href={pack}><code>@surea11y/pack-en301549</code></a>に移り、core 2.0.0で削除されます。それまでは従来どおり動作し、プロセスごとに1回<code>console.warn</code>を出します。パックを渡すと、<code>mappings: ['en301549']</code>は同じ名前で、すべての結果に同じエントリーを付け、通知は出しません。
				</p>
			</Callout>
			<p>
				配列またはカンマ区切りの文字列を受け付け、名前とバージョンの大文字と小文字は区別しません。<code>profile: 'en301549-v4.1.1'</code>の下ではV4.1.1の条項は指定しなくても含まれ、<code>mappings</code>でさらに追加できます。エンジンに表がない名前やバージョンは<code>console.warn</code>を出して無視します。ほかの規格を含む実行は、それを正規の表記で<code>engine.mappings</code>に示します（<code>["en301549:V3.2.1"]</code>、すべてのバージョンなら<code>["en301549"]</code>）。
			</p>
			<p>
				変わるのは結果が示す内容だけで、実行されるルールやその判定結果は変わりません。ルールカタログも同じオプションに従います。<code>getChecksCatalog(engineOptions)</code>、<code>getCheckDefById(ruleId, engineOptions)</code>、<code>getChecksForRunOnly(runOnly, engineOptions)</code>、<code>getRulesCatalog(engineOptions)</code>、<code>getRulesForRunOnly(runOnly, engineOptions)</code>、<code>getCompositeRuleById(id, engineOptions)</code>は、そのオプションでスキャンした場合と同じ規格を（適用される場合はプロファイルも含めて）示すため、カタログのエントリーと結果は常に一致します。オプションがなければ、WCAGだけを示します。<code>customRules</code>で追加したルールは、宣言した対応付けをそのまま保ちます。条項の内容と2つのバージョンの違いは<a href="/conformance/wcag-mapping/#en-301-549">WCAG適合性との対応</a>を参照してください。
			</p>

			<h2 id="advanced-selection-tags-and-rule-ids">高度な選択：タグとルールID</h2>
			<p>
				以下のフィールドは、ルールが持つタグとルールIDで選択します。1つの達成基準（<code>tags: ['wcag1412']</code>）、ルールのリスト、除外、独自のタグセットなど、WCAGの目標と<code>bestPractices</code>では表せないものに使ってください。これらは<code>wcag</code>や<code>bestPractices</code>と組み合わせられます。含めるものはそれらが選択するものに追加され、除外するものはその後に取り除かれます。
			</p>
			<p>
				指定する方法は<strong>互いに独立して2つ</strong>あります。第4引数（<code>runOnly</code>）と、<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>/<code>.includeMode</code>です。<code>runOnly</code>にフィルターが1つでも含まれていればそちらが無条件に優先され、そうでなければエンジンは<code>engineOptions</code>を使います。<strong>両方が適用されると期待して混在させないでください。どちらか一方を選びます。</strong><code>engineOptions.rules</code>、<code>.tags</code>、<code>.tests</code>は<code>{"{ include, exclude }"}</code>を受け取ります。リストや文字列をそのまま渡すと、含めるリストになります。
			</p>

			<h3 id="via-runonly-4th-argument"><code>runOnly</code>（第4引数）で指定する</h3>
			<CodeBlock lang="js" lines={[
					"runDomRulesInPage(url, null, {}, {",
					"  includeRuleIds: ['img-alt-present', 'button-name-present'],",
					"  excludeRuleIds: ['region'],",
					"  tags: ['wcag412'],",
					"  excludeTags: ['best-practice'],",
					"  includeMode: 'and'   // 'and' (default) | 'or' — see below",
					"});",
				]} />
			<p>
				単なる配列や文字列も省略形として使えます。<code>runOnly: ['img-alt-present', 'button-name-present']</code>はそれらのルールを実行し（複合ルールのIDはその構成ルールを含みます）、<code>runOnly: ['wcag2a', 'wcag2aa']</code>は<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>と同じ意味になります。1つの配列にルールIDとタグを混ぜることはできません。また、どの値もルール（組み込み、複合、または<code>engineOptions.customRules</code>のいずれか）かタグを指している必要があります。それ以外の値があると例外を投げるので、タイプミスのせいですべてのルールが、あるいはどのルールも、気づかれないまま実行されることはありません。IDとタグを組み合わせたり除外したりするには、オブジェクト形式を使ってください。1.10.0より前は、単なる配列は無視され、すべてのルールが実行されていました。
			</p>
			<DataTable
				label="runOnlyのフィールド"
				rowKey="field"
				columns={[
					{ key: "field", label: "フィールド", width: "22%" },
					{ key: "type", label: "型", width: "16%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={[
					{
						field: <code>wcag</code>,
						type: <code>{"{ version, level }"}</code>,
						meaning: "WCAGの適合性の目標です。そのバージョンの、そのレベル以下の達成基準のルールを実行します。前述の「WCAGの目標で選ぶ」を参照してください。",
					},
					{
						field: <code>bestPractices</code>,
						type: <code>boolean</code>,
						meaning: "trueにするとベストプラクティスのルールを追加します。前述の「ベストプラクティスを追加する」を参照してください。",
					},
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
				名前は、ここでも後述の<code>engineOptions.rules</code>/<code>.tags</code>でも検証されます。含めるリスト（<code>includeRuleIds</code>、<code>includeTestIds</code>、<code>tags</code>、旧来の<code>values</code>、<code>rules.include</code>、<code>tags.include</code>）のどの値もルールやタグ（ルールか集約が持つもの。そのため、集約だけが持つ規格のタグも既知です）を指していない場合は、<code>code: 'INVALID_RUN_ONLY'</code>と、フィールドと値を示すメッセージを伴う例外を投げます。そのままでは何も選ばれず、ルールを1つも実行しない実行は問題のないスキャンのように見えてしまうからです。名前はすべて存在するのに、部分どうしが打ち消し合う選択（含めると同時に除外されたルールや、<code>includeMode: 'and'</code>のもとで共通するルールのないルールとタグ）も、ルールを1つも実行しません。スキャンはその部分を示して警告し、<code>strictOptions</code>のもとでは<code>INVALID_RUN_ONLY</code>を投げます。<code>includeMode</code>は<code>'and'</code>か<code>'or'</code>です。それ以外の値は警告を出して<code>'and'</code>として読まれ、<code>strictOptions</code>のもとではエラーを投げます。ブラウザーのバインディングでは<code>.includeMode('or')</code>で設定します。何も指していない値でも、ほかに有効な値と並んでいる場合や除外リストにある場合は、<code>console.warn</code>を出したうえで無視されます。1.10.0より前は、こうした値はすべて何の通知もなく無視されていました。
			</p>
			<p>
				WCAGのバージョンとレベルを表す9つのタグ（<code>wcag2a</code>から<code>wcag22aaa</code>まで）は、ルールが持っているかどうかにかかわらず常に既知です。現在、ルールを1つも持たないものがあります（<code>wcag21aaa</code>、<code>wcag22a</code>、<code>wcag22aaa</code>）。それらの達成基準には自動化されたルールがないためで、タイプミスではありません。含めるリストでほかの値と並んでいる場合、このようなタグは警告ではなく<code>console.info</code>で注記されます。
			</p>
			<CodeBlock lines={['[surea11y] runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a"); its criteria need manual review.']} />
			<p>
				<code>engineOptions.logUntestedWcag: false</code>にすると、この行は出力されません。含めるリストのすべての値がこのようなタグの場合は何も実行されないため、理由を示して引き続き<code>INVALID_RUN_ONLY</code>を投げます。独自にルールを選択する<code>runOnly.wcag</code>の目標や<code>bestPractices: true</code>と併用した場合は、注記だけになります。除外リストでは何もしません。
			</p>
			<p>
				ルールIDにはエンジンのプレフィックスを付けません（例：<code>'img-alt-present'</code>）。後方互換性のため、同じIDに旧来の<code>a11ycore-</code>プレフィックスを付けた形式（<code>'a11ycore-img-alt-present'</code>）も照合できます。IDはタグと同じく大文字小文字を問わずに照合されます。<code>'IMG-ALT-PRESENT'</code>は<code>img-alt-present</code>を選択し、これはルールを指定するすべてのリスト（各形式の<code>runOnly</code>、<code>engineOptions.rules</code>と<code>engineOptions.tests</code>、含めるものと除外するもの）で同じです。大文字小文字だけが違うIDを持つルールはないため、誤ったルールが選ばれることはありません。
			</p>
			<p>
				<code>runOnly</code>の値全体として、<strong><code>{"{ type, values }"}</code>形式</strong>も受け付けます。<code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code>は<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>と、<code>{"{ type: 'rule', values: ['img-alt-present'] }"}</code>は<code>{"{ includeRuleIds: ['img-alt-present'] }"}</code>と同じ意味です（<code>'tags'</code>と<code>'rules'</code>も使えます）。<code>values</code>はカンマ区切りの文字列でもよく、その名前はほかのルールIDやタグと同じように検証され、並べて指定したほかのキー（<code>excludeTags</code>、<code>excludeRuleIds</code>など）も引き続き適用されます。名前の<code>Set</code>は、それが持つリストとして読まれます。オブジェクト形式が読むキーと並んでいる、読まないキーは、警告を出して無視されます。それ以外の<code>type</code>は<code>INVALID_RUN_ONLY</code>を投げます。数値や真偽値の<code>runOnly</code>や、エンジンが読むキーを1つも持たないオブジェクト（<code>{"{ includeRuleId: [...] }"}</code>）も同様です。これらはいずれも、以前はすべてのルールを実行していました。空の配列、文字列、オブジェクトは、これまでどおり既定の選択を意味します。
			</p>

			<h3 id="which-criteria-a-scan-reports">スキャンが報告する達成基準</h3>
			<p>
				スキャンは、選択がその達成基準の集約（<code>rulesResults</code>）を選択する場合に、それを報告します。WCAGの目標やバージョンとレベルのタグ、プロファイル、集約自身のID、または選択なしがそうです。さらに、選択が<strong>単独で指定した</strong>ルールが実行された場合は、そのルールが検査する各達成基準の集約も報告します。単独で指定するとは、次のいずれかです。
			</p>
			<ul>
				<li>
					IDによって（<code>includeRuleIds</code>、<code>includeTestIds</code>、<code>rules.include</code>、またはプロファイル自身のルールのリスト）
				</li>
				<li>
					WCAGのタグでないタグによって（カスタムルール、パック、規格のタグ。WCAGのタグとは、バージョンとレベルのタグ、<code>wcag244</code>のような達成基準のタグ、<code>wcag22-removed</code>なので、<code>wcagteam</code>のような独自のタグはWCAGのタグではありません）
				</li>
				<li>
					<code>optInRules</code>によって
				</li>
				<li>
					ベストプラクティスのルールとして（<code>bestPractices</code>）
				</li>
			</ul>
			<p>
				規格のプロファイルが、その規格が対応付けているという理由だけで実行するルール（<code>mappedRules</code>）は、単独ではなくその規格のために指定されたものです。規格の要件は追加しますが、WCAGの達成基準は追加しません。そのため、規格が求めるものだけを実行するプロファイルは、その規格だけを報告します（<a href="/configuration/packs/#profiles">パック</a>）。プロファイルの<code>rules</code>リストが指定するルールは、そのWCAGの達成基準も追加します。1.12.0より前は、達成基準ではなくルールを指定したスキャンの<code>rulesResults</code>は空でした。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// The unnamed link fails link-name-present, and with it 2.4.4 and 4.1.2:",
					"runDomRulesInPage(url, null, {}, { includeRuleIds: ['link-name-present'] });",
					"// rulesResults: wcag-2.4.4-link-purpose-in-context: fail, wcag-4.1.2-name: fail",
				]}
			/>
			<ul>
				<li>
					<strong>判定は集約自身のものです。</strong>不合格のルールは達成基準を不合格にします。スキャンがその達成基準のほかのルールを除いた場合、合格したルールがあっても達成基準は合格になりません。<code>reasonCode</code>が<code>composite.rollup.cantTell.notSelectedChild</code>の<code>cantTell</code>になり、スキャンが選択しなかった各ルールは、貢献したルールの中に<code>notSelected: true</code>付きの<code>missing</code>として列挙されます。すべてが選択されて合格しても、WCAGの達成基準は<code>cantTell</code>（<code>composite.rollup.cantTell.partialCheck</code>）のままです。どの達成基準についても、そのルールはまだ求められることのすべてをチェックしていないためです（<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照）。HTMLレポートはその下に「一部のみ確認」と、選択されなかったチェックの件数を表示します。<a href="/results-reports/output-schema/#partly-checked">出力スキーマ</a>を参照してください。
				</li>
				<li>
					<strong>達成基準のタグは、その達成基準自身を指定します。</strong><code>tags: ['wcag244']</code>は2.4.4を報告し、そのルールが検査するほかの達成基準（<code>link-name-present</code>なら4.1.2）は報告しません。集約のID、WCAGの目標、バージョンやレベルのタグ、WCAGのプロファイルによって加わったルールは、達成基準を追加しません。そこでは選択自体が達成基準を指定しているからです。そのため、達成基準を選択するスキャンの報告は以前と変わりません。
				</li>
				<li>
					<strong>実行のWCAGのバージョンとレベルが適用されます。</strong>達成基準が追加されるのは、<code>engine.wcagVersion</code>で有効な場合（<code>duplicate-id</code>だけでは2.2で4.1.1は追加されず、<code>wcagVersion: '2.1'</code>なら追加されます）、かつ目標と同じように実行のレベル以下の場合だけです。レベルは、指定されていれば<code>engineOptions.wcagLevel</code>（次の節）、なければ選択が与えるレベル（<code>runOnly.wcag.level</code>、またはルールIDと並べたバージョンとレベルのタグ）です。どちらもなければ、すべてのレベルが報告されます。
				</li>
				<li>
					<strong>除外が適用されます。</strong>選択が除外する集約（<code>{"excludeRuleIds: ['wcag-4.1.2-name']"}</code>、またはタグ）は追加されません。呼び出し側が除外したルールは選択されなかったものとして扱われます。プロファイルが除外するルールは達成基準を狭めます。そのルールは<code>notSelected</code>なしの<code>missing</code>になり、プロファイルが免除する達成基準は決して追加されません。
				</li>
				<li>
					<strong>規格独自の集約</strong>（要件ごとに1つ）も同じように追加されますが、その規格が対象になっている場合だけです。適用されたプロファイルがその規格を対象とするか、選択がそのタグを指定するか、<code>optInRules</code>がそれを解除している場合です。WCAGのスキャンに、誰も求めていない規格の要件が表示されることはありません。適用されなかったプロファイルや、<code>mappings</code>だけでは、規格は対象になりません。その規格のプロファイルのもとではプロファイルのバージョンだけが追加され、プロファイルなしで解除した場合は、タグで選択したスキャンと同じくすべてのバージョンが追加されます。これは組み込みの規格やチェックリストと同じく、パックのものにも当てはまります。ルールを指定するチェックリストのプロファイル（<code>tags: []</code>、<code>{"rules: [...]"}</code>）は、それらのWCAGの達成基準と自身の項目を得ます。
				</li>
				<li>
					<strong>スキャン前の一覧。</strong><code>getRulesForRunOnly(runOnly, engineOptions)</code>は、その選択とオプションでのスキャンが報告する集約を、追加されるものも含めて<code>getRulesCatalog</code>のエントリーとして列挙します。スキャン自身の集約の処理で求めるため、両者は一致します。ルールを列挙するのは<code>getChecksForRunOnly</code>です。<code>getRulesCatalog(engineOptions)</code>は、選択にかかわらず、そのオプションで利用できるすべての集約を列挙します。ツールは、スキャンを実行する前に何を検査するかを記録できます。ブラウザーのバインディングのビルダーは、同じ一覧を<code>plannedChecks()</code>と<code>plannedCriteria()</code>として提供します。
				</li>
			</ul>

			<h3 id="giving-the-level-of-a-scan-that-names-checks-wcaglevel">チェックを指定するスキャンのレベルを示す（<code>wcagLevel</code>）</h3>
			<p>
				WCAG 2.2 AAを意図し、一部のチェックだけを実行するスキャンは、それらのチェックを指定し、バージョンを<code>engineOptions.wcagVersion</code>で示します。これではレベルが示されないため、それらのチェックの達成基準はすべてのレベルで報告されます。<code>contrast-computable</code>は1.4.3（AA）と1.4.6（AAA）を検査するので、両方が報告されます。<code>engineOptions.wcagLevel</code>はレベルを示します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only the contrast checks of a WCAG 2.2 AA scan: 1.4.3 is reported, 1.4.6 is not.",
					"runDomRulesInPage(url, null,",
					"  { wcagVersion: '2.2', wcagLevel: 'AA' },",
					"  { includeRuleIds: ['contrast-computable'] });",
				]}
			/>
			<ul>
				<li>
					<strong>値。</strong><code>'A'</code>、<code>'AA'</code>、<code>'AAA'</code>のいずれかで、大文字小文字は問いません。それ以外の値は<code>console.warn</code>（<code>engineOptions.wcagLevel: ignoring "AA+"; use "A", "AA" or "AAA". ...</code>）を出して無視され、<code>strictOptions</code>のもとでは<code>INVALID_ENGINE_OPTIONS</code>を投げます。実行は有効なレベルを<code>'A'</code>、<code>'AA'</code>、<code>'AAA'</code>の表記で<code>engine.wcagLevel</code>として報告します。オプションがない場合、<code>engine.wcagLevel</code>は選択が示すレベルで、何も示さなければ含まれません。
				</li>
				<li>
					<strong>決めるのは何を報告するかで、何を実行するかは決して決めません。</strong>何を実行するかは、オプションがない場合と同じく選択が決めます。選択が指定した、そのレベルより上のチェックも実行され、自身の結果を報告します。<code>rulesResults</code>から除かれるのは、そのレベルより上の達成基準だけです。
				</li>
				<li>
					<strong>指定したチェックのために追加された達成基準だけでなく、すべてのWCAGの集約に適用されます。</strong>全体のスキャン、プロファイル、タグによる選択で<code>wcagLevel: 'AA'</code>を指定すると、AAAの達成基準は<code>rulesResults</code>から除かれますが、それらのチェックは引き続き実行され、<code>checksResults</code>で報告されます。これは<code>wcagVersion</code>とは異なります。<code>wcagVersion</code>は選択が選んだ集約を決して除きません。2.2のスキャンは引き続き4.1.1を報告し、そのルールは<code>cantTell</code>に強制変換されます。オプションのないスキャンの報告は以前と変わりません。
				</li>
				<li>
					<strong>選択が示すレベルより優先されます</strong>（<code>runOnly.wcag.level</code>、またはバージョンとレベルのタグが示す最も高いレベル）。明示的な<code>wcagVersion</code>がタグの示すバージョンより優先されるのと同じです。両者の食い違いは、<code>wcagVersion</code>と目標のバージョンの食い違いと同じく警告されません。<code>engine.wcagLevel</code>が、達成基準の絞り込みに使われたレベルを示します。
				</li>
				<li>
					<strong>IDで指定した集約は指定どおり報告されます。</strong><code>wcagLevel: 'AA'</code>とともに<code>{"includeRuleIds: ['wcag-1.4.6-contrast-enhanced']"}</code>を指定すると、1.4.6が報告されます。このオプションが示すのはどの達成基準を報告するかであって、呼び出し側が求めたものを除くことではありません。選択自身のタグが示すレベルは、オプションがない場合と同じく、指定した集約にも引き続き適用されます。
				</li>
				<li>
					<strong>規格独自の集約</strong>にはWCAGのレベルがなく、このオプションの影響を受けません。パックのプロファイルはレベルを示せません（そのタグがレベルを示します）。呼び出し側が<code>wcagLevel</code>を渡せます。
				</li>
				<li>
					<code>getRulesForRunOnly(runOnly, engineOptions)</code>もこれに従うため、スキャンが報告するものを列挙します。無効な値にはスキャンと同じように警告し、<code>strictOptions</code>のもとではエラーを投げます。
				</li>
			</ul>
			<p>
				オプションがなくても、ルールIDと並べたバージョンとレベルのタグはレベルを示します。デフォルトの<code>includeMode: 'and'</code>は、指定したルールのうちそれらのタグのいずれかを持つものを残すからです。<code>{"{ includeRuleIds: ['contrast-computable'], tags: wcagTags('2.2') }"}</code>は<code>contrast-computable</code>を実行し、1.4.3だけを報告します。ただし、タグは何を実行するかも決めます。WCAGのタグを持たない指定したルール（<code>region</code>のようなベストプラクティスのルールや、WCAGのタグのないカスタムルール）や、AAAの達成基準だけを検査するルールは実行から除かれ、どのルールも持たないバージョンとレベルのタグ（<code>wcag22a</code>）は<code>console.info</code>で注記されます。<code>wcagLevel</code>は、何を実行するかを変えずにレベルを示します。ブラウザーのバインディングでは、ビルダーの<code>.wcagLevel('AA')</code>で設定します。
			</p>

			<h3 id="filtering-by-wcag-version">WCAGバージョンによる絞り込み（2.0、2.1、2.2）</h3>
			<p>
				すべてのルールと複合ルールには、そのレベルとWCAGの導入バージョンを示すタグがちょうど1つ付いています。WCAG 2.0からある達成基準には<code>wcag2a</code>/<code>wcag2aa</code>/<code>wcag2aaa</code>、WCAG 2.1で新たに導入されたもの（例：<code>1.3.5</code>入力目的の特定）には<code>wcag21a</code>/<code>wcag21aa</code>/<code>wcag21aaa</code>、WCAG 2.2で新たに導入されたもの（例：<code>2.5.8</code>ターゲットのサイズ（最低限））には<code>wcag22a</code>/<code>wcag22aa</code>/<code>wcag22aaa</code>が付きます。ルールに付くのは、その達成基準が実際に導入されたバージョンのタグ<strong>だけ</strong>です。2.1で導入された達成基準に<code>wcag2aa</code>が併せて付くことはありません。WCAG 2.0を対象とする適合では、その達成基準は存在しないからです。
			</p>
			<p>
				<code>runOnly.wcag</code>は1つのフィールドで適合性の目標を選択し（<a href="#selecting-by-wcag-target-runonlywcag">前述</a>）、2.2では4.1.1を除きます。タグの場合、バージョンは累積的です（2.1 = 2.0 + 新規、2.2 = 2.0 + 2.1 + 新規）。そのため、WCAGのバージョンを対象に適合を検証するには、タグの集合を組み合わせて指定します。あとは<code>tags</code>に対するエンジンのOR照合（どれか1つに一致すればルールが含まれる）が処理します。
			</p>
			<CodeBlock lang="js" lines={[
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
				]} />
			<p>
				<strong>1つだけ逆向きの達成基準があります。</strong>WCAG 2.2ではSC 4.1.1（構文解析）が削除されました。追加ではなく削除された唯一の達成基準です。これに対応するルールは、他の2.0由来のルールと同じく2.0の導入バージョンタグ（<code>wcag2a</code>）を持ち、さらに<code>wcag22-removed</code>も持ちます。そのため上のバージョン別のタグの集合では、本来含まれるべきでない2.2対象のスキャンにもこのルールが含まれてしまいます。
			</p>
			<p>
				これについて何かする必要はありません。エンジンはスキャンごとに<strong>対象のWCAGバージョン</strong>を決定し、対象が2.2の場合、<code>wcag22-removed</code>のルールは<code>fail</code>を報告できません。ルールは実行され、見つけた検出箇所もすべて報告しますが、判定結果は<code>cantTell</code>に強制変換され、結果にはその理由を示す<code>wcagVersionScope</code>フィールドが付きます（<a href="/results-reports/output-schema/">出力スキーマ</a>を参照）。黙って捨てられるものは何もなく、2.2のスキャンが2.2に存在しない達成基準によってゲートされることもありません。
			</p>
			<p id="parsing-errata">
				2.0または2.1を対象にした場合も同じです。WCAG 2.0と2.1に対する2023年の正誤表は、HTMLやXMLのコンテンツについて4.1.1を常に満たされているものとするため、ルールは不合格にせず確認を求め、<code>wcagVersionScope.by</code>は<code>"errata"</code>になります。唯一の例外は、<code>en301549-v3.2.1</code>のように規格が4.1.1の文言を維持しているプロファイルです（規格のプロファイルの<code>keepsParsing</code>。<a href="/configuration/packs/#profiles">パック</a>を参照）。そこでは重複したidが今も<code>fail</code>になりえます。core 1.14.0以降の動作で、それ以前は2.0や2.1を対象にすると不合格になりました。
			</p>
			<p>対象バージョンは次の順で決まります。</p>
			<ol>
				<li>
					<code>engineOptions.wcagVersion</code>：指定されていれば<code>'2.0'</code>、<code>'2.1'</code>、<code>'2.2'</code>のいずれか。
				</li>
				<li>
					実行が適用するパックのプロファイルの<code>wcagVersion</code>（指定されている場合）。対応付けたルールだけを実行するプロファイルを持つ、WCAG 2.1に基づく規格はWCAGのタグを選択しないため、バージョンを自ら示します。プロファイル自身のタグが示すバージョンより優先されます。効果のないプロファイル（自分で指定した選択に上書きされたもの）はバージョンを持ち込みません。
				</li>
				<li><code>runOnly.wcag</code>の目標のバージョン。</li>
				<li>
					自分で指定したフィルター内の導入バージョンタグ：<code>wcag21a</code>/<code>wcag21aa</code>までの集合なら2.1、<code>wcag22*</code>タグを1つでも含めば2.2、<code>wcag2*</code>タグだけなら2.0とみなします。数えるのはこの9つのタグだけです。達成基準のタグ（<code>wcag411</code>）や<code>best-practice</code>からはバージョンは分かりません。
				</li>
				<li>
					それ以外の場合は、このエンジンのデフォルトの対象である<code>'2.2'</code>。
				</li>
			</ol>
			<CodeBlock lang="js" lines={[
					"// Nothing to declare: a plain run already targets 2.2, so a duplicate id",
					"// comes back cantTell rather than fail.",
					"runDomRulesInPage(url, null, {}, null);",
					"",
					"// Conformance-testing against 2.1, where SC 4.1.1 still exists:",
					"runDomRulesInPage(url, null, { wcagVersion: '2.1' }, null);",
					"",
					"// Same thing, implied by the tag set — no extra option needed:",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });",
				]} />
			<p>
				決定された対象バージョンはすべての結果に<code>engine.wcagVersion</code>として返されるので、スキャンで実際にどれが使われたかを確認できます。
			</p>
			<p>
				2.2ではこのルールを一切表示したくない場合は、明示的に除外してください。タグはまさにそのために残してあります。
			</p>
			<CodeBlock lang="js" lines={[
					"// WCAG 2.2 AA conformance, with the removed criterion left out entirely:",
					"{",
					"  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'],",
					"  excludeTags: ['wcag22-removed']",
					"}",
				]} />
			<p>
				現在このタグを持つルールは<code>duplicate-id</code>だけです。除外しなければ、実際にある問題を報告します。IDの重複は、規格の定めにかかわらず<code>&lt;label for&gt;</code>、フラグメントリンク、<code>getElementById</code>を壊します。ただ、2.2の適合性の違反にはならないというだけです。
			</p>

			<h3><code>engineOptions</code>で指定する（<code>runOnly</code>なし）</h3>
			<p>同じ絞り込みを、<code>engineOptions</code>内にネストしたカンマ区切りの文字列（または配列）で表します。</p>
			<CodeBlock lang="js" lines={[
					"runDomRulesInPage(url, null, {",
					"  rules: { include: 'img-alt-present, button-name-present', exclude: 'region' },",
					"  tags: { include: 'wcag412', exclude: 'best-practice' },",
					"  includeMode: 'and'",
					"}, null);",
				]} />
			<p>
				<code>rules.include</code>/<code>.exclude</code>、<code>tags.include</code>/<code>.exclude</code>、<code>tests.include</code>/<code>.exclude</code>（<code>rules</code>の別名）、およびトップレベルの<code>includeMode</code>は、上記の<code>runOnly</code>のフィールドとまったく同じように動作します。カンマ区切りの文字列は自動的にトリムと重複除去が行われ、空のトークンは捨てられます。<code>rules: ['img-alt-present']</code>のように、リストや文字列をそのまま渡すと、含めるリストとして読まれます。
			</p>

			<h2><code>engineOptions</code>：その他のオプション</h2>
			<CodeBlock lang="js" lines={[
					"const engineOptions = {",
					"  strictOptions: false,            // default false — true throws on an unknown option or a value of the wrong type",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
					"  wcagLevel: 'AA',                 // optional — the level of the criteria reported",
					"  profile: 'wcag22-aa',            // optional — a named conformance target",
					"  mappings: ['en301549'],          // optional — standards besides WCAG to name on each result",
					"  optInRules: 'all',               // optional — also run rules other standards add beyond WCAG",
					"  messages: { de: { /* key: text */ } },  // optional caller-supplied dictionaries; win over built-in ones",
					"  includeHiddenElements: false,    // default false — set true to evaluate hidden/collapsed subtrees too",
					"  includeShadowDom: true,          // default true — opt OUT with false to skip open shadow roots",
					"  fragment: false,                 // default false — set true when the scan target isn't a real page",
					"  excludeSelectors: ['#cookie-banner', '.third-party-widget'],  // array or comma-separated string",
					"  styleSheetTexts: [{ href: 'https://cdn.example/site.css', text: '/* its CSS */' }],  // sheets the page can't read",
					"  timestamp: '2026-07-20T12:00:00Z',  // optional — engine has no built-in clock",
					"  perfStats: false,                // default false — internal timing counters, debug-only shape",
					"  profileRules: false,             // default false — per-rule timings; needs perfStats",
					"",
					"  contrast: {",
					"    mode: 'strictConformance',     // 'strictConformance' (default) | 'auditorAssist'",
					"    rootCanvasFallback: '#ffffff', // a canvas to measure on in place of the page's own; unset, the page's color scheme gives it",
					"    rootCanvasFallbackSet: true    // echoed on each result: whether rootCanvasFallback was given; read back, false means the default",
					"  },",
					"  visibilityMode: undefined,       // 'styleOnly' | 'styleAndGeometry'; unset: geometry with a layout, else styles",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true,",
					"    detail: 'full'                 // 'findings': pass/notApplicable results keep only rule, outcome, type",
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
					"  packs: [ /* rules and standards from outside core, see Packs */ ],",
					"",
					"  // Only read by runa11yCoreAcrossFrames. Ignored by runDomRulesInPage/runa11yCoreInPage.",
					"  pingWaitTime: 500,               // ms to wait for a child frame to answer a ping",
					"  frameWaitTime: 60000             // ms to wait for a child frame's full scan result",
					"};",
				]} />
			<DataTable
				label="その他のengineOptions"
				rowKey="id"
				columns={[
					{ key: "option", label: "オプション", width: "22%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={optionRows}
			/>

			<h3 id="catching-mistakes-in-the-options-strictoptions">オプションの誤りを見つける（<code>strictOptions</code>）</h3>
			<p>
				エンジンが読まないオプションは、そのまま受け渡されます。カスタムルールは<code>ctx.engineOptions</code>から独自の設定を読めますし、後のリリースで削除されたオプションがスキャンを壊すこともありません。そのため、デフォルトでは綴りを誤ったオプションは無視され、スキャンはそれがないものとして実行されます。それを知らせるものが2つあります。
			</p>
			<ul>
				<li>
					<strong>常に</strong>、既知のキーと1文字か2文字だけ違う（大文字小文字は問いません）キーは、入れ子のキーも含めて警告されます。<code>lcoale</code>には<code>[surea11y] engineOptions: unknown option "lcoale" (did you mean "locale"?); ignored.</code>が出ます。
				</li>
				<li>
					<strong>常に</strong>、型が誤っている値は警告されたうえで指定がなかったものとして読まれます。オブジェクトでない<code>engineOptions</code>も同様です。オン／オフのオプション（<code>includeShadowDom</code>、<code>includeHiddenElements</code>、<code>fragment</code>、<code>perfStats</code>、<code>profileRules</code>、<code>output.includeHtml</code>、<code>output.includeSelector</code>）は<code>true</code>か<code>false</code>を受け取り、コマンドラインでの表記である<code>'true'</code>、<code>'false'</code>、<code>'1'</code>、<code>'0'</code>、<code>1</code>、<code>0</code>も受け取ります。<code>perfStats: 'false'</code>はオフです。
				</li>
				<li>
					<strong><code>strictOptions: true</code>を指定すると</strong>（または<code>'true'</code>、<code>'1'</code>、<code>1</code>）、スキャンの前にすべてのオプションが確認され、誤りがあれば<code>code: 'INVALID_ENGINE_OPTIONS'</code>付きのエラーを投げてそれぞれを示します。<code>problems</code>はそれらを<code>{"{ path, kind, message, suggestion }"}</code>として列挙します。対象は、<code>engineOptions</code>やそのオブジェクトのいずれかにある未知のキー（<code>kind: 'unknown'</code>）と、<code>includeHiddenElements: 'yes'</code>や<code>contrast.mode: 'strict'</code>のように型が誤っているか集合の外にある値（<code>kind: 'invalid'</code>）です。
				</li>
			</ul>
			<CodeBlock lang="js" lines={[
					"runDomRulesInPage(url, null, { strictOptions: true, lcoale: 'de' }, null);",
					"// Error: engineOptions: unknown option \"lcoale\" (did you mean \"locale\"?). (strictOptions)",
				]} />
			<p>
				<code>engineOptions</code>を受け取るカタログ関数（<code>getChecksCatalog</code>、<code>getRulesCatalog</code>、<code>getCheckDefById</code>、<code>getCompositeRuleById</code>、<code>getChecksForRunOnly</code>、<code>getRulesForRunOnly</code>、<code>getTestsForRunOnly</code>）も、同じ方法、同じ文言でそれを確認します。<code>{"getRulesForRunOnly(runOnly, { wcagLevel: 'AA+' })"}</code>は警告を出し、レベルを指定がなかったものとして読み、そのオプションでのスキャンが報告するものを列挙します。<code>strictOptions: true</code>を指定すると、スキャンと同じように<code>INVALID_ENGINE_OPTIONS</code>を投げます。自分自身を打ち消す選択（同じルールを含めると同時に除外する、共通するルールのない部分を組み合わせる）も、スキャンと同じように知らされます。警告が出て、<code>strictOptions</code>のもとでは<code>INVALID_RUN_ONLY</code>になります。
			</p>
			<p>
				確認しないもの：ルール自身の設定（<code>rules[ruleId]</code>）、<code>messages</code>のキー、エンジンが読まずに受け渡す<code>probes</code>、そして独自の確認を持つカスタムルール（<code>skippedCustomRules</code>）です。TypeScriptでは、<code>StrictEngineOptions</code>は、任意のキーをコンパイルできるようにするインデックスシグネチャを持たない同じオプションの集合なので、綴りを誤ったオプションはそこでもエラーになります。
			</p>

			<h3 id="rule-scoped-excludeselectors">ルール単位の<code>excludeSelectors</code></h3>
			<p>
				トップレベルの<code>excludeSelectors</code>は<em>すべての</em>ルールに適用されます。ある要素を1つのルールからだけ除外し、他のルールでは引き続きチェックする、ということはできません。<code>rules[ruleId].excludeSelectors</code>はこの隙間を埋めるもので、<strong>そのルールだけ</strong>の対象候補を絞り込みます。グローバルなリストを置き換えるのではなく、常にそれに追加する形で働きます。
			</p>
			<CodeBlock lang="js" lines={[
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
				]} />
			<p>
				これが必要になる理由：<span lang="en">Angular Material</span>の<code>&lt;mat-select&gt;</code>は、内部のARIA構造の組み立て方が原因で、コンポーネント自体には問題がないのに<code>aria-required-children</code>でだけ誤検出を起こします。グローバルな<code>excludeSelectors</code>しかなければ、この誤検出を消す方法は<code>excludeSelectors: ['mat-select']</code>だけです。しかしそうすると<code>mat-select</code>は<code>contrast-minimum</code>や<code>aria-allowed-attr</code>を含む<em>他のすべてのルール</em>からも見えなくなり、何の問題もなかったチェックのカバレッジまで黙って失われます。上の例なら、誤判定する1つのルールを除くすべてのルールから<code>mat-select</code>が引き続き完全に見えます。
			</p>
			<p>
				あるルールに実際に適用される除外は、グローバルなリストとそのルール独自のリストの<strong>和集合</strong>です。どちらかに一致する要素は、そのルールの対象候補から外れます。不合格になりうる要素がすべてこの方法で除外されたルールは、<code>occurrences: []</code>とともに<code>outcome: 'pass'</code>または<code>'notApplicable'</code>（対象がない場合のそのルール自身の慣例に従います）を報告します。空の<code>occurrences</code>配列を伴う<code>outcome: 'fail'</code>になることはありません。組み込みルールの<code>fail</code>は、必ず何が不合格だったかを示すからです（例外を投げたルールは別のケースで、<code>error</code>を設定した<code>cantTell</code>を報告します。<a href="/results-reports/output-schema/">出力スキーマ</a>を参照）。
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
			<CodeBlock lang="js" lines={[
					"runDomRulesInPage(url, null, {",
						"  excludeSelectors: ['#cookie-banner', '.intercom-launcher']",
						"}, { wcag: { version: '2.2', level: 'AA' } });",
					]} />
			<p>
				ベストプラクティスのルールも実行するには、<code>wcag</code>と並べて<code>bestPractices: true</code>を追加してください。WCAGのゲートでは通常、それらは失敗させずに報告します。ただし一部は<code>fail</code>になりうる（<code>empty-heading</code>）ため、<code>fail</code>が1つでもあれば失敗させるゲートは、それらでも失敗します。
			</p>
			<p>
				<strong>人間の監査担当者が実際のブラウザーでコントラストを詳しく確認する</strong>：誤検出への備えを一部手放して、より多くの検出結果を得ます。実際のブラウザーでは、コントラストのルールはすでに計算済みスタイルだけでなくレイアウトもチェックするので、設定が必要なのはコントラストのモードだけです。例ではPuppeteerの<code>page.evaluate</code>（複数の引数を受け付けます）を使っています。Playwrightの場合は、先に4つの位置引数を1つのオブジェクトにまとめてください。<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>を参照してください。
			</p>
			<CodeBlock lang="js" lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' }",
					"}, null);",
				]} />
			<p>
				<strong>UIの変更後に1つの領域だけを再スキャンし、シャドウDOMはスキップする</strong>：変更したウィジェットだけを確認したいコンポーネント単位のテストで役立ちます。
			</p>
			<CodeBlock lang="js" lines={[
					"runDomRulesInPage(url, '#checkout-form', {",
					"  includeShadowDom: false",
					"}, { includeRuleIds: ['form-control-programmatic-label-present', 'button-name-present'] });",
				]} />
			<p>
				<strong>スナップショットテスト用の出力</strong>：<code>timestamp</code>を固定して、結果自体のタイムスタンプが実行ごとに変わらないようにし、<code>perfStats</code>と<code>profileRules</code>はオフのままにします。これらの所要時間は実行ごとに変わり、その形は安定した出力に含まれません。スナップショットには、毎回同じDOM、同じオプション、同じ描画条件（ブラウザー、ビューポート、フォント）も必要です。タイムスタンプを固定するだけでは、2つの結果は同一になりません。
			</p>
			<CodeBlock lang="js" lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z'",
					"}, null);",
				]} />
			<p>
				<strong>組み込みルールと並べて組織独自のカスタムルールを使う</strong>（この呼び出しに限る）：
			</p>
			<CodeBlock lang="js" lines={[
					"runDomRulesInPage(url, null, {",
					"  customRules: [{",
					"    id: 'org-no-inline-onclick',",
					"    meta: { title: 'No inline onclick handlers', defaultSeverity: 'moderate' },",
					"    runInPage(ctx) {",
					"      // queryAllSmart applies excludeSelectors, the scope's shadow roots and",
					"      // the hidden-content filter; queryAll is the plain light-DOM query.",
						"      // ctx.helpers.dom reads the DOM so the page's markup can't redirect it.",
						"      const dom = ctx.helpers.dom;",
						"      const els = ctx.helpers.queryAllSmart('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: dom.outerHTML(el),",
					"        summary: 'Inline onclick handler found.',",
					"        hint: 'Move event handling into an external script.'",
					"      }));",
					"",
					"      return { ruleId: ctx.rule.ruleId, outcome: occurrences.length ? 'fail' : 'pass', severity: 'moderate', occurrences };",
					"    }",
					"  }]",
					"}, null);",
				]} />

			<h2><code>customRules</code>：実行時に登録するルール</h2>
			<p>
				同梱のルールはすべて、ビルド時に<code>src/core.js</code>に組み込まれます。<code>engineOptions.customRules</code>は実行時のための抜け道で、その呼び出しに限って登録されるルール記述子の配列です。静的なカタログには何も追加されず、呼び出しをまたいで残るものもありません。カタログ関数も同じ<code>engineOptions</code>を受け取り、それを使ったスキャンが持つものを列挙します。<code>getChecksCatalog(engineOptions)</code>は有効なカスタムルールを、各上書きを組み込みルールの位置に置いて列挙し、<code>getCheckDefById(id, engineOptions)</code>はそれらを見つけ、<code>getChecksForRunOnly(runOnly, engineOptions)</code>はスキャンと同じようにそれらを選択し、<code>getRulesForRunOnly(runOnly, engineOptions)</code>はそれらが追加する集約を列挙します。これは回避すべき制限ではなく、意図した設計です。surea11yはもともと呼び出しごとに新しい<code>engineOptions</code>を受け取り、変更可能なグローバル設定を持ちません。カスタムルールもこの呼び出し単位のモデルに従います。
			</p>
			<p>
				ライブラリーを直接呼び出すのが1つの方法ですが、CLIでも<code>--custom-rules &lt;path&gt;</code>（ローカルファイル。スキャンごとに1回読み込まれます）で利用できます。<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#custom-rules">CLIのドキュメント</a>を参照してください。
			</p>
			<p>
				カスタムルールは、パックのルールと同じく組み込みルールの後に実行され、渡される<code>ctx.helpers</code>、<code>ctx.engineOptions</code>、<code>ctx.inputs.probes</code>は読み取り専用です。それらに何かを設定したり削除したりすると例外が投げられる（そのルールはそのエラーとともに<code>cantTell</code>として報告されます）ため、ほかのルールが見るものを変えることはできません。ページを変更してはいけません。変更したルールは<code>console.warn</code>で示されます。結果はカタログの順序を保ちます。ルールが何を投げても何を返しても、スキャンは結果を返し、ルールの結果は単純なデータに変換されるため、スキャンの結果はJSONとして書き出したり複製したりできます。
			</p>
			<p>
				記述子は<em>内部のルールモジュールがexportするものと同じ形</em>です。このエンジンのルールファイルの書き方を知っていれば、このAPIもすでに知っていることになります。
			</p>
			<CodeBlock lang="js" lines={[
					"{",
					"  id: 'my-org-custom-rule',          // required",
					"  meta: { title, description, tags, defaultSeverity, defaultConfidence, /* same fields as a rule module's meta */ },",
					"  runInPage(ctx) { /* same ctx shape and same return contract as any built-in rule */ },",
					"  applicability(ctx) { return true; }, // optional, same contract as a built-in rule's applicability",
					"  data: { /* optional, JSON-serializable */ }",
					"}",
				]} />
			<ul>
				<li>
					<code>runInPage</code>/<code>applicability</code>には、<strong>実際の関数</strong>と<strong>関数のソース文字列</strong>（つまり<code>fn.toString()</code>）のどちらも渡せます。<code>engineOptions</code>が現在のJSレルムの外に出ない場合（素のNode/jsdomでの利用）は実際の関数を渡してください。外に出る場合は文字列を渡します。たとえばPlaywrightの<code>page.evaluate(runa11yCoreInPage, {"{ engineOptions }"})</code>呼び出しでは、<code>engineOptions</code>がJSON/構造化クローンの境界を越えるため、生きた<code>Function</code>参照は渡せませんが、文字列なら渡せます。エンジンは文字列を<code>new Function</code>で関数に戻します。ビルド時にすべての組み込みルールのソースをページ内ランナーに埋め込むのと同じ仕組みです。どの関数のソースでも使えます。アロー関数、<code>function</code>宣言、上の例のような省略記法のメソッド（<code>{"runInPage(ctx) {…}"}</code>、<code>async</code>も可）のいずれでもかまいません。省略記法のメソッドの<code>toString()</code>は、それだけでは式になりませんが、それでも扱えます。関数に戻すには<code>eval</code>が許可されている必要があるため、Content Security Policyで<code>'unsafe-eval'</code>を禁止しているページでは、文字列で渡したルールはスキップされ、その<code>skippedCustomRules</code>の理由はポリシーが原因であることを示します。その場合は実際の関数を渡してください。
				</li>
				<li>
					<code>meta</code>には、ビルド時のルールとまったく同じデフォルト値の補完と検証が行われます。不要なものは省略してかまいません。<code>defaultSeverity</code>のデフォルトは<code>moderate</code>、<code>defaultConfidence</code>は<code>medium</code>、<code>type</code>は<code>automatic</code>などです。値が決められた範囲（<code>minor</code>/<code>moderate</code>/<code>serious</code>/<code>critical</code>、<code>high</code>/<code>medium</code>/<code>low</code>、<code>automatic</code>/<code>manual</code>。大文字小文字は区別しません）から外れている<code>meta</code>は検証に失敗し、そのルールはスキップされます。ルールが範囲外の<code>severity</code>を返した場合は、そのルールのデフォルトに置き換えられ、<code>error</code>に注記が付きます。
				</li>
				<li>
					カスタムルールの<code>id</code>が組み込みルールと重複した場合は、両方を実行するのではなく、<strong>そのスキャンでは組み込みルールを上書きします</strong>。同名のカスタムルールは、意図した上書きであるのと同じくらい偶然の衝突である可能性もあるため、衝突は必ず2つの方法で知らされます。該当するIDを示す<code>console.warn</code>と、結果のトップレベルにある<code>overriddenBuiltinIds</code>配列（衝突がなければ空）です。<a href="/results-reports/output-schema/">出力スキーマ</a>を参照してください。IDは大文字小文字を問わずに照合されます。カスタムルール<code>IMG-ALT-PRESENT</code>は<code>img-alt-present</code>を上書きしてそのIDを引き継ぎ、2つ目の警告が両方の綴りを示します。
				</li>
				<li>
					実行されたカスタムルールは、<code>meta.wcagSc</code>または<code>meta.normativeMappings</code>のWCAGのエントリーを通じて、組み込みルールと同じように、対応する各達成基準のWCAGの集約（<code>rulesResults</code>）に算入されます。不合格になったものは集約を不合格にします。集約は貢献したルールの中でそれに<code>custom: true</code>を付け、<code>data.details.customChecksIds</code>に列挙します。選択が単独で（そのIDやタグのいずれかで）指定し、実行されたカスタムルールは、選択がその達成基準を1つも指定していなくても、その達成基準の集約を報告します（<a href="#which-criteria-a-scan-reports">「スキャンが報告する達成基準」</a>）。上書きは、それ自身の対応付けが示す場所に算入されます。その達成基準に対応していれば組み込みルールの代わりに算入され、どれにも対応していなければどの集約にも算入されず、外れた集約を示す警告が出ます。
				</li>
				<li>
					カスタムルールは、組み込みルールと同じように、IDと<code>meta.tags</code>で選択されます。スキャンがスキップしたカスタムルールを指定する<code>runOnly</code>は、スキップされた理由とともに<code>INVALID_RUN_ONLY</code>を投げます。<code>customRules</code>はリストです。単独で渡したルールは実行されず、<code>skippedCustomRules</code>に列挙されます。プロファイルやWCAGの目標のもとでは、<code>best-practice</code>のタグを持つルールや、WCAGのタグを持たないルールは実行に含まれません。それらは<code>console.warn</code>とともに<code>skippedCustomRules</code>に列挙され、検査する達成基準のタグ（<code>'wcag111'</code>）を付けるか、<code>runOnly.bestPractices: true</code>を追加すると実行されます。選択が除外したカスタムルール（<code>{"excludeRuleIds: ['org-b']"}</code>、<code>rules.exclude</code>など）もそこに列挙されます。理由は<code>excluded by the selection.</code>で、<code>excluded: true</code>が付き、警告は出ません。上書きは、組み込みルールが実行されたはずの場所ではどこでも実行されます。
				</li>
				<li>
					カスタムルールも組み込みルールと同じようにマージンを報告できます。<code>meta.margin</code>（<code>{"{ measure, unit, limit }"}</code>）を宣言し、<code>marginCandidates</code>を返してください（GitHub上のルール作成ガイド<a href={`${core}/docs/RULE_AUTHORING.md#metamargin`}><code>RULE_AUTHORING.md</code>の<code>meta.margin</code></a>を参照）。形式が正しくない<code>meta.margin</code>は無視され、そのルールはマージンを報告しませんが、スキャンは続行します。
				</li>
				<li>
					無効な記述子（<code>id</code>がない、または文字列でない、<code>runInPage</code>が関数でも関数に戻せるソース文字列でもない、<code>applicability</code>を関数に変換できない、<code>deprecation</code>のない<code>deprecated: true</code>など<code>meta</code>が検証に失敗する、リスト内の別のカスタムルールと同じIDを持つ、複合ルールのIDを使っている）は、ルール名と理由を示す<code>console.warn</code>を出してスキップされ、結果の<code>skippedCustomRules</code>に記録されます。組み込みルールを含むスキャンの残りは通常どおり実行されます。これは直すべき検証の抜けではありません。カスタムルールは呼び出し側が渡す任意のコードなので、「問題のあるエントリだけを安全側に倒して除外し、スキャンは中断しない」ほうが安全なデフォルトです。例外を投げた<em>組み込み</em>ルールが、スキャン全体をクラッシュさせずにそのルールの<code>cantTell</code>にとどめられるのと同じ考え方です。
				</li>
				<li>
					ルールは同期的に実行されます。Promiseを返す<code>runInPage</code>や<code>applicability</code>（<code>async</code>関数）は、その旨を示す<code>error</code>付きの<code>cantTell</code>として報告されます。結果オブジェクト以外を返す<code>runInPage</code>も同様です。<code>pass</code>、<code>fail</code>、<code>cantTell</code>、<code>notApplicable</code>以外の<code>outcome</code>（<code>'failed'</code>など）は<code>cantTell</code>になり、<code>error</code>に返された値が示されます。ルールの<code>type</code>はその<code>meta</code>から決まります。戻り値の<code>type</code>は無視され、<code>error</code>に注記が付きます。
				</li>
				<li>
					結果は他のルールとまったく同じように<code>checksResults</code>に現れます。<code>{"{ __node }"}</code>だけを付けた<code>fail</code>/<code>cantTell</code>の検出箇所に対して<code>selector</code>/<code>html</code>/<code>structuralPath</code>が自動補完される点も同じです（<a href="/results-reports/output-schema/">出力スキーマ</a>を参照）。
				</li>
				<li>
					<code>fail</code>は何が不合格だったかを示します。検出箇所のないカスタムルールの<code>fail</code>（ページ全体の不合格）は、ドキュメント要素に1つの検出箇所を付けて報告されます（<code>selector: 'html'</code>、理由コード<code>FAIL_WITHOUT_OCCURRENCE</code>）。そのため、JUnit、SARIF、ベースライン、HTMLレポートはそれを本来の不合格として表示します。
				</li>
			</ul>

			<h2 id="packs">パック：コアの外にあるルールと規格</h2>
			<p>
				パックは、ルール、コアのルールのバリアント、規格やチェックリストと、それらが使うメッセージを、コアをビルドせずに、それ自身のパッケージとして提供します。パックは<code>engineOptions.packs</code>でスキャンに渡します。スキャンは、ビルドがコア自身のルールに使うのと同じ手順でパックを組み込んで用意したエンジンで実行されるため、パックの規格、プロファイル、集約、オプトインルールは、組み込みのものと同じように動作します。エンジンは同じパックのオブジェクトでの次のスキャンのために保持されるため、すべてのページに同じパックを渡すクロールでは、パックの準備は1回で済みます。
			</p>
			<CodeBlock lang="js" lines={[
						"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
						"const acmePolicy = require('./acme-policy-pack');",
						"",
						"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' });",
						"result.engine.packs; // ['@acme/a11y-policy@1.0.0']",
						"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
					]} />
			<p>
				コアと両立しないパック（その<code>core</code>の範囲がこのバージョンを含まない、名前空間のないルールID、コアが持つ辞書のキー）は、<code>console.warn</code>を出してスキップされ、結果の<code>skippedPacks</code>に<code>{"{ name, reason }"}</code>として列挙され、スキャンはそのパックなしで実行されます。<code>strictOptions</code>のもとでは<code>code: 'INVALID_ENGINE_OPTIONS'</code>付きのエラーを投げます。互いに衝突するパックはエラーを投げます。ページ内では、まず<code>packScript(packs)</code>でパックを登録し、<code>engineOptions.packs</code>で<code>name@version</code>として指定します。パックが持つもの、各バインディング、test-matchers、CLIからの使い方、パックの書き方は<a href="/configuration/packs/">パック</a>にあります。
			</p>

			<h2><code>contextSelector</code>（ランナーの第2引数。<code>engineOptions</code>のフィールドではありません）</h2>
			<p>
				スキャン範囲を1つ以上のサブツリーに絞るCSSセレクター（またはセレクターの配列）です。<code>document.querySelectorAll</code>で解決され（最初の一致だけでなく、すべての一致が対象）。ドキュメント全体をスキャンするには<code>null</code>を渡します。
			</p>
			<ul>
				<li>
					<strong>何にも一致しないセレクターは、何もスキャンしません。</strong>ページ単位のルールも含め、すべてのルールが<code>notApplicable</code>を報告し、結果の<code>contextMatch</code>がそのことを示します。<code>{"{ elementCount: 0, unmatchedSelectors: ['#mian'] }"}</code>（<a href="/results-reports/output-schema/#top-level-result">出力スキーマ</a>を参照）。実行時には<code>console.warn</code>も出力されます。ページにない範囲を、ページ全体に広げることはしません。求めていないコンテンツについての結果、しかもページ全体の<code>pass</code>を含む結果は、求めた部分についての結果のように読めてしまうからです。配列の場合、何にも一致しないセレクターは<code>unmatchedSelectors</code>に記録され、ほかのセレクターは通常どおりスキャンされます。そのため、Cookieバナーのように、ページにあるときとないときがあるコンテンツもリストに含めておけます。1.10.0より前は、何にも一致しない範囲はドキュメント全体にフォールバックし、結果にはそのことが何も示されませんでした。
				</li>
				<li>
					<strong>ブラウザーが解析できないセレクターは、例外を投げます。</strong>単独でも配列内でも、どのルールも実行される前に<code>contextSelector: "#main[" is not a valid CSS selector.</code>というエラーになります。このエラーは<code>code: 'INVALID_CONTEXT_SELECTOR'</code>と、失敗したセレクターである<code>selector</code>を持ちます。何にも一致しないセレクターと違い、これは常に呼び出し側の誤りです。<code>runa11yCoreAcrossFrames</code>も同じエラーでrejectします。<code>page.evaluate</code>（Playwright、Puppeteer）を越えたエラーにはメッセージしか残らないため、メッセージにオプション名とセレクターが含まれています。1.10.0より前は、無効なセレクターはスキップされ、単独で指定した場合はドキュメント全体がスキャンされていました。
				</li>
				<li>
					<strong>セレクター、セレクターの配列、<code>null</code>以外のものは、同じエラーを投げます。</strong>エラーは渡されたものを示します。要素、NodeList、<code>{"{ include, exclude }"}</code>オブジェクト、数値、文字列でない配列の項目（<code>contextSelector[1] must be a CSS selector, not the number 5.</code>）がこれに当たります。代わりにその要素に一致するセレクターを渡し、<code>exclude</code>で除くはずだったものは<code>engineOptions.excludeSelectors</code>に指定してください。
				</li>
				<li>
					<strong>単一の文字列</strong>自体をカンマ区切りのセレクターリストにできます（通常のCSSと同じく和集合として扱われます）。<code>'#a, #b'</code>は<code>#a</code>と<code>#b</code>の両方をスキャンします。
				</li>
				<li>
					<strong>文字列の配列</strong>を渡すと、各セレクターに一致したものの和集合をスキャンします。<code>['#a', '.card']</code>は<code>'#a, .card'</code>と同じ動作です。配列形式は、リストをプログラムで組み立てる呼び出し側のためにあります。
				</li>
				<li>
					<strong>シャドウDOM</strong>：<code>includeShadowDom</code>（デフォルト）が有効なら、範囲にはその中のシャドウルートが含まれ、範囲自体がシャドウホストであればそのシャドウルートも含まれます。セレクターはドキュメントに対して照合されるため、シャドウルートの<em>内側</em>の要素は選択できません。代わりにそのホストを範囲に指定してください。
				</li>
				<li>
					重なり合う領域や入れ子になった領域は自動的に重複除去されます。一致した複数のルートから到達できる要素も、領域ごとではなく1回だけ報告されます。
				</li>
				<li>
					<strong>範囲を絞った結果の意味</strong>：ほとんどのルールは要素を1つずつ判定し、範囲内の要素をページ全体のスキャンとまったく同じように判定します。周囲のページに依存するルールは2種類あります。ページ全体を対象とするルール（<code>page-title-present</code>、<code>landmark-one-main</code>、そのほか前述の<code>fragment</code>に挙げたもの）は<code>notApplicable</code>を報告します。ページ全体で要素どうしを比較するルール（<code>landmark-unique</code>、<code>landmark-no-duplicate-banner</code>、同<code>-contentinfo</code>と<code>-main</code>、<code>landmark-banner-is-top-level</code>、同<code>-complementary-</code>、<code>-contentinfo-</code>、<code>-main-is-top-level</code>、<code>accesskeys</code>、<code>heading-order</code>、<code>identical-links-same-purpose</code>、<code>identical-iframes-same-purpose</code>）は、範囲内で見つけたものは報告します。範囲内で名前が重複している2つのランドマークは、どのページでも重複しているからです。ただし<code>pass</code>の代わりに<code>notApplicable</code>を報告します。スキャンが見たのはページの一部だけなので、ページに問題がないとは言えないからです。<code>duplicate-id</code>と<code>duplicate-id-aria</code>は、重複相手が範囲外にあることもあるため、範囲内の各要素をドキュメント全体と比較し、IDがほかのどこかにも現れる範囲内の要素を報告します。これらの<code>pass</code>は、範囲内のどの要素もページ上のほかの要素とIDを共有していないという意味です。範囲外だけにある重複のペアは、ほかのルールと同じく報告されないため、ページ全体に重複がないという意味にはなりません。<code>target-size-minimum</code>は、間隔に関する例外がターゲットの隣に何があるかで決まるため、範囲内のターゲットをドキュメント内のどこにある隣接要素とも比べて判定します。<code>text-spacing-content-loss</code>は範囲内のテキストを判定し、それがページ上のどこかのテキストと重なるようになるかを確認します。
				</li>
			</ul>
		</>
	);
}
