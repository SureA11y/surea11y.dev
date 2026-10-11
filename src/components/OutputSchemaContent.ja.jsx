import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const topLevelRows = [
	{ id: "engine.tag", field: <code>engine.tag</code>, meaning: <>エンジン自身の識別タグで、現在は<code>"a11ycore"</code>です。すべてのルール（組み込みもカスタムも）は<code>meta.tags</code>にこのタグを持ちます。ルールの<code>ruleId</code>自体にはプレフィックスが付きません。</> },
	{
		id: "engine.version",
		field: <code>engine.version</code>,
		meaning: (
			<>
				結果を生成した<code>@surea11y/core</code>のリリースで、<code>"1.11.1"</code>のような値です。バグ報告で示すのはこの値で、2つのリリースの結果を見分けるのにも使えます。結果は形が変わらないままリリース間で変わることがあるため、これは<code>schemaVersion</code>とは別のものです。<a href="/results-reports/sarif-report/">SARIF</a>と<a href="/results-reports/earl-report/">EARL</a>のレポーターは、ツールのバージョンが指定されていなければこの値を使います。
			</>
		),
	},
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
	{
		id: "engine.profile",
		field: <code>engine.profile</code>,
		meaning: (
			<>
				<code>engineOptions.profile</code>がこの実行のルールを選んだ場合にだけ含まれ、プロファイル名を小文字で示します。プロファイルを要求しなかった場合はなく、要求しても適用されなかった場合（不明な名前、または<code>runOnly</code>や<code>engineOptions</code>のincludeが代わりにルールを選んだ場合）もありません。そのため、これがあることで、実行が本当にそのプロファイルを対象にしたことを確認できます。<a href="/configuration/engine-options/#conformance-profiles">適合性プロファイル</a>を参照してください。
			</>
		),
	},
	{
		id: "engine.profileExcludes",
		field: <code>engine.profileExcludes</code>,
		meaning: (
			<>
				適用されたプロファイルがルールを除外する場合にだけ含まれます。<code>{"{ rules, criteria }"}</code>で、指定されたルールと、除外されるWCAGの達成基準です。それらのルールとWCAGの集約は実行されていません。これはスキャンの範囲を狭めるもので、WCAGが求めることは変わりません。組み込みのプロファイルで何かを除外するものはありません。
			</>
		),
	},
	{
		id: "engine.optInRules",
		field: <code>engine.optInRules</code>,
		meaning: (
			<>
				<code>engineOptions.optInRules</code>が、ほかの選択では実行されなかったオプトインルールを少なくとも1つ実行した場合にだけ含まれ、そのタグを列挙します。これがある場合、結果には対象の規格を超える要件のルールが含まれるため、不合格がWCAGの不合格とは限りません。<a href="/configuration/engine-options/#running-every-rule-optinrules">すべてのルールを実行する</a>を参照してください。
			</>
		),
	},
	{
		id: "engine.mappings",
		field: <code>engine.mappings</code>,
		meaning: (
			<>
				実行が<code>meta.normativeMappings</code>でWCAG以外の規格を示す場合（<code>engineOptions.mappings</code>または規格のプロファイルによる）にだけ含まれます。正規の表記で列挙し、すべてのバージョンなら<code>"en301549"</code>、1つなら<code>"en301549:V3.2.1"</code>です。ない場合、どの結果もWCAGだけを示します。<a href="/configuration/engine-options/#other-standards-mappings">ほかの規格</a>を参照してください。
			</>
		),
	},
	{
		id: "engine.packs",
		field: <code>engine.packs</code>,
		meaning: (
			<>
				スキャンを<code>engineOptions.packs</code>付きで実行した場合にだけ含まれます。実行された各パックを<code>name@version</code>の形で、名前順に並べたものです。<a href="/configuration/packs/">パック</a>を参照してください。
			</>
		),
	},
	{
		id: "engine.outputDetail",
		field: <code>engine.outputDetail</code>,
		meaning: (
			<>
				<code>engineOptions.output.detail</code>が<code>'findings'</code>の場合にだけ、<code>"findings"</code>として含まれます。検出箇所を1つも持たない<code>pass</code>または<code>notApplicable</code>のチェック結果はそれぞれコンパクトになり、<code>{"{ ruleId, outcome, type }"}</code>と、ある場合はその<code>margin</code>または<code>error</code>だけになります。タイトル、説明、<code>meta</code>はカタログのものでどのページでも同じなので、含まれません。<code>fail</code>と<code>cantTell</code>の結果、集約、<code>engine</code>は完全なままなので、判定は何も変わりません。レポーター（SARIF、JUnit、HTMLレポート、EARL、ベースラインの関数）は、コンパクトな結果をコアのカタログで補って完全な結果として読みます。カタログで補えない結果は完全なまま残ります。<code>packs</code>付きのスキャンのすべてのチェック結果、カスタムルールの結果、スキャンの<code>messages</code>がタイトルや説明を変えた結果です。空のページの結果は、約236 KBから80 KBになります。
			</>
		),
	},
	{
		id: "engine.environment",
		field: <code>engine.environment</code>,
		meaning: (
			<>
				ページがレンダリングされた条件です。スキャンの開始時、どのルールも実行される前にページから読み取ります。<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a>のようにレイアウトを計測するルールは、同じマークアップでも、ビューポートの幅が違ったり、Webフォントがまだ読み込み中だったりすると別の判定結果になることがあるため、実行を再現するにはこの情報が必要です。<code>layout</code>はページにレイアウトがあったかどうかです。jsdomなどのDOMエミュレーターでは<code>false</code>になり、その場合はこれが唯一のフィールドです。ブラウザーでは、<code>viewport</code>はCSSピクセル単位の<code>innerWidth</code>／<code>innerHeight</code>、<code>devicePixelRatio</code>はページのデバイスピクセル比（ブラウザーのズームもここに表れます）、<code>colorScheme</code>は<code>prefers-color-scheme</code>が一致する値、<code>fonts</code>はページのフォントフェイスのいずれかがまだ読み込み中なら<code>"loading"</code>、それ以外は<code>"loaded"</code>です。ページが報告できないフィールドは省略されます。これらを読み取っても非決定性は加わりません。DOMと同じく、入力だからです。実行間で比較できる結果が必要なら、スキャンの前に<code>document.fonts.ready</code>を待ってください。<code>images</code>は、いずれかの画像がまだ読み込み中なら<code>"loading"</code>、それ以外は<code>"loaded"</code>です。後から届いた画像は、レイアウトのルールが計測したものを動かすことがあるため、比較できる結果が必要なら、ページの<code>load</code>イベントの後にスキャンしてください。<code>loading="lazy"</code>の画像は、読む人がスクロールするまで読み込まれないため除外されます。<code>animationsSettled</code>は、スキャンが静止させた実行中のアニメーションとトランジションの数です。スキャンの間、有限のもの（フェードインなど）は終了時点の状態で、無限に繰り返すもの（マーキーやスピナーなど）は開始時点の状態で読み取り、その後それぞれを元の位置に正確に戻します。そのため、フェードインの途中でスキャンしたページも、その後にスキャンしたページと同じ結果になります。スキャンは1つの同期タスクなので、静止させた状態がブラウザーに描画されることはありません。<a href="#cross-frame-result">フレームをまたぐ結果</a>では、各フレームがそれぞれ独自の値を持ちます。
			</>
		),
	},
	{ id: "url", field: <code>url</code>, meaning: <>渡した<code>pageUrl</code>引数です。<code>null</code>を渡したか省略した場合（または文字列以外を渡した場合。このときは<code>console.warn</code>も記録されます）は<code>document.location.href</code>、どちらも得られない場合は<code>null</code>になります。</> },
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
		id: "contextMatch",
		field: <code>contextMatch</code>,
		meaning: (
			<>
				<code>contextSelector</code>がどう解決されたかを示します。指定がなかった場合は<code>null</code>です。<code>elementCount</code>は一致した異なる要素の数で、これがスキャンの起点になります。<code>unmatchedSelectors</code>は、どの要素にも一致しなかったセレクターを、渡したとおりの形で列挙します。カンマ区切りの文字列は、1回の<code>querySelectorAll</code>呼び出しであるのと同じく、ここでも1つのセレクターとして扱われます。<strong><code>elementCount</code>が0なら、何もスキャンされていません</strong>。ページにその範囲がなく、<code>checksResults</code>と<code>rulesResults</code>のエントリはすべて<code>notApplicable</code>で、結果はページについて何も述べていません。検出結果のないスキャンとしてではなく、範囲が見つからなかったものとして報告してください。ブラウザーが解析できないセレクターは結果まで届かず、スキャンが<code>code: 'INVALID_CONTEXT_SELECTOR'</code>付きのエラーを投げます（<a href="/configuration/engine-options/">エンジンオプション</a>を参照）。
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
				実行された<strong>複合ルール（集約ルール）</strong>ごとに1件のエントリです。<a href="#composite-result">複合ルールの結果</a>と<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。通常はWCAGの達成基準ごとに1件ですが、独自の集約を持つ規格のプロファイルで実行した場合は、それらも含まれます（<code>meta.standard</code>が設定されます）。現在の<code>runOnly</code>やタグのフィルターに一致する複合ルールがなければ空の配列です。
			</>
		),
	},
	{
		id: "standards",
		field: <code>standards</code>,
		meaning: (
			<>
				結果が<code>meta.normativeMappings</code>のエントリーや集約の<code>meta.standard</code>でWCAG以外の規格を示す場合にだけ含まれます。示している登録済みの規格（パックのものを含む）ごとに1つの<code>{"{ key, standard, titleLang?, note? }"}</code>を、登録簿の順に並べたものです。<code>key</code>は規格のキー（<code>"en301549"</code>）、<code>standard</code>はそのエントリーが持つ名前（<code>"EN 301 549"</code>）、<code>titleLang</code>は、規格独自の集約のタイトルがスキャンの言語以外で書かれている場合のその言語、<code>note</code>はHTMLレポートで規格独自の集約の上に表示される、スキャンの言語のテキストです。レポーターは登録簿の代わりにこれを読むため、保存した結果は、その環境がその規格を知っているかどうかにかかわらず、どこでレンダリングしても同じになります。カスタムルールだけが示す規格は列挙されません。
			</>
		),
	},
	{
		id: "skippedPacks",
		field: <code>skippedPacks</code>,
		meaning: (
			<>
				<code>engineOptions.packs</code>のパックが実行されなかった場合にだけ含まれます。それぞれ<code>{"{ name, reason }"}</code>の形で、パックに名前がなければ<code>name</code>は<code>null</code>です。ページ内（<code>runa11yCoreInPage</code>）では、<code>name</code>は指定された<code>name@version</code>で、理由はページがそのパックを実行しなかった訳を示します。指定されたセットとまったく同じものを登録した<code>packScript</code>の呼び出しがない、またはスクリプトが別のバージョンのコアで用意された、のどちらかです。それぞれ<code>console.warn</code>でも記録されます。
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
	{
		id: "skippedCustomRules",
		field: <code>skippedCustomRules</code>,
		meaning: (
			<>
				実行されなかった<code>engineOptions.customRules</code>のエントリで、それぞれ<code>{"{ id, reason }"}</code>の形です（エントリにIDがなければ<code>id</code>は<code>null</code>）。理由は、IDがない、<code>runInPage</code>が関数でないかソースから再構築できない、<code>meta</code>が検証に通らない、別のカスタムルールがすでにそのIDを持っている、複合ルールのIDである、のいずれかです。あるいは、妥当なルールでも実行の選択に含まれない場合（プロファイルやWCAGの目標のもとで、<code>best-practice</code>のタグを持つか、WCAGのタグを持たないルール）で、その場合の<code>reason</code>はルールを選択する方法を示します。常に配列で、すべてのカスタムルールが実行されれば空です。それぞれ<code>console.warn</code>でも記録されます。ここに挙がったルールはどの結果にも含まれないため、ルールを除外したスキャンと、そのルールが<code>pass</code>になったスキャンを区別できます。
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
				フラグが立った要素を指し戻せるように組み立てた、ベストエフォートのCSSセレクターです（<code>RULE_AUTHORING.md</code>の<code>helpers.buildSelector</code>を参照）。ID、テストID、<code>name</code>、<code>aria-label</code>を起点にするのは、非表示の要素、除外された要素、範囲外の要素も含めて、ドキュメント内のほかのどの要素もそれを持っていない場合だけです。<code>querySelector</code>はそれをドキュメント全体に対して解決するためです。それ以外の場合、セレクターはパスになります。どのDOM構造でも一意であるとは保証されません。シャドウルート内の要素はそれ自身のツリーの中で名前が付けられ（その位置は<code>structuralPath</code>が示します）、非常に深い要素のパスは上から短縮されます。テスト用と実際のページ255件で、39,857個のセレクターのうち15個が自身の要素をちょうど指していませんでしたが、すべてこうした種類のものでした。例外は、要素が存在しないこと<em>そのもの</em>が検出結果であるルールです。<code>page-title-present</code>は<code>head &gt; title</code>と、<code>html</code>として<code>&lt;title&gt;(missing)&lt;/title&gt;</code>を報告しますが、どちらもページ上には存在しません。どちらも定数なので、これらから作られるフィンガープリントは安定しています。ただし、<strong>ルールが実在するものを報告したことを確かめずに、<code>selector</code>を解決可能なもの、<code>html</code>を実際のマークアップとして扱わないでください</strong>。シャドウツリー内の要素では、<code>selector</code>はそのシャドウルートの中で解決され、そこまでのたどり方は<code>shadowHostSelectors</code>が示します。
			</>
		),
	},
	{
		id: "shadowHostSelectors",
		field: <code>shadowHostSelectors</code>,
		meaning: (
			<>
				シャドウツリー内の要素にだけ含まれます。その要素に至るシャドウホストのセレクターを外側から順に並べたもので、それぞれ自分を含むツリーの中で解決されます。そのため、<code>document.querySelector(s[0]).shadowRoot.querySelector(s[1])…shadowRoot.querySelector(selector)</code>で要素が見つかります。同じ内容を持つ2つのコンポーネントは<code>selector</code>が同じになり、ここで区別されます。<code>selector</code>と同じく、検出結果の識別には含まれません。
			</>
		),
	},
	{
		id: "html",
		field: <code>html</code>,
		meaning: (
			<>
				フラグが立った要素のouter HTMLのスニペットで、2,000文字で切り詰められます。要素を表示するのに役立ち、シャドウツリー内の要素では<code>shadowHostSelectors</code>と合わせて読みます。ページ全体を含む<code>&lt;html&gt;</code>、<code>&lt;head&gt;</code>、<code>&lt;body&gt;</code>では開始タグだけ（<code>&lt;html class="x"&gt;</code>）になるため、ページ単位の検出結果は、ほかの内容が変わっても識別が保たれます。
			</>
		),
	},
	{
		id: "structuralPath",
		field: <code>structuralPath</code>,
		meaning: (
			<>
				<code>documentElement</code>からフラグが立った要素までを、兄弟要素の中でのインデックスでたどったパスです（例：<code>[1, 0, 2]</code>）。要素が<code>documentElement</code><em>そのもの</em>であれば<code>[]</code>、特定できなかった場合は<code>null</code>になります。シャドウツリー内の要素はすべて<code>null</code>です（その場合は<code>shadowHostSelectors</code>と<code>selector</code>を使ってください）。<code>selector</code>だけに頼るより頑健に要素を特定でき、セレクター文字列なら壊れてしまうDOMの変更（IDやクラス名の変更など）にも耐えます。その代わり、<strong>実際のCSSセレクターとしては使えません</strong>。
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
				ほとんどの検出箇所に含まれます。ルールが使った対象判定のモデルのもとで、エンジンがこの要素を対象とみなした（またはみなさなかった）理由です。<code>eligible</code>がその結果で（<code>bypass-blocks-present</code>、<code>html-lang-attr-present</code>、<code>page-title-present</code>のページ単位の検出結果には含まれません）、<code>targetSet</code>はどのモデルによる判定かを示します（<code>'dom'</code>：DOM/CSS上の可視性そのもの。ほとんどのルールはこちら。<code>'acc'</code>：アクセシビリティツリー上で対象となるかどうか）。<code>accEligible</code>は<code>targetSet</code>が<code>'acc'</code>のときだけ<code>eligible</code>と同じ値になり、それ以外は<code>null</code>です。<code>reasons</code>は、<code>eligible: false</code>のときの機械可読な除外コードのリストです。
			</>
		),
	},
	{
		id: "data.details",
		field: <code>data.details</code>,
		meaning: (
			<>
				ルール固有の構造化データ（計算した指標、解決済みの参照など）です。<strong>規範的なものではありません</strong>。より詳しいUIの構築やデバッグには役立ちますが、<code>outcome</code>/<code>severity</code>の意味を変えることはありません。形はルールごとに異なるので、安定した契約ではなく、ベストエフォートの補足情報として扱ってください。唯一の例外が<code>data.details.reasonCode</code>で、これは安定して<strong>います</strong>。ルールの検出結果のうち<em>どれ</em>であるかを識別し、<code>ruleId</code>、<code>html</code>とともに、ベースラインとSARIFのキーになるフィンガープリントを構成します。<a href={`${core}/docs/API_STABILITY.md#finding-identity`}><code>API_STABILITY.md</code></a>を参照してください。各ルールのページには、その検出結果が持つフィールドが「検出結果が報告する内容」の下に記載されています。
			</>
		),
	},
	{
		id: "occurrenceOutcome",
		field: <code>occurrenceOutcome</code>,
		meaning: (
			<>
				検出結果を確実な<code>fail</code>の層と、レビューが必要な<code>cantTell</code>の層に分けて評価するルールで、この検出箇所がどちらの層に属するかを示します。1つの層しか報告しないルールでは省略され、その場合は結果自体の<code>outcome</code>が検出箇所の層になります。判定結果は常に層と一致します。<code>fail</code>の層の検出箇所が1つでもあれば<code>fail</code>になり、検出箇所がすべて<code>cantTell</code>の層である<code>fail</code>は<code>cantTell</code>になるため、SARIF、JUnit、EARL、ベースラインは同じ答えを返します。カスタムルールやパックのルールが食い違うものを返した場合はエンジンが整合させます。デフォルトのポリシーでは、手動ルールが<code>fail</code>になることはありません。
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
	{ id: "fail", outcome: <code>fail</code>, meaning: "ルールが、チェックする要件を満たしていないと報告しています。検出結果を解釈するには、その対応、確度、検出箇所を読んでください。", manual: "デフォルトのポリシーでは、いいえ（cantTellに強制変換）" },
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
					"    version: string,       // the @surea11y/core release that produced the result",
					"    schemaVersion: string,",
					"    locale: { requested: string, resolved: string, reason: string },",
					'    wcagVersion: "2.0" | "2.1" | "2.2",',
					'    profile?: string,      // "wcag22-aa", "en301549-v4.1.1", "en301549-v3.2.1", "section508", or a registered standard\'s own',
					'    mappings?: string[],   // e.g. ["en301549"] or ["en301549:V3.2.1"]',
					"    profileExcludes?: { rules: string[], criteria: string[] },",
					"    optInRules?: string[],",
					'    outputDetail?: "findings",',
					"    packs?: string[],      // name@version",
					"    environment: {",
					"      layout: boolean,",
					"      viewport?: { width: number, height: number },  // CSS px",
					"      devicePixelRatio?: number,",
					'      colorScheme?: "light" | "dark",',
					'      fonts?: "loaded" | "loading",',
					'      images?: "loaded" | "loading",',
					"      animationsSettled?: number",
					"    }",
					"  },",
					"  url: string | null,",
					"  title: string | null,",
					"  timestamp: string | null,",
					"  perfStats: object | null,",
					"  contextSelector: string | string[] | null,",
					"  contextMatch: { elementCount: number, unmatchedSelectors: string[] } | null,",
					"  checksResults: CheckResult[],",
					"  rulesResults: CompositeResult[],",
					"  standards?: Array<{ key: string, standard: string, titleLang?: string, note?: string }>,",
					"  overriddenBuiltinIds: string[],",
					"  skippedCustomRules: Array<{ id: string | null, reason: string }>,",
					"  skippedPacks?: Array<{ name: string | null, reason: string }>",
					"}",
				]}
			/>
			<DataTable
				label="トップレベルの結果のフィールド"
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
					"    | { url: string | null, selector: string | null, title: string | null,",
					"        topFrame: <top-level result>, frames: [...same shape, recursively] }",
					"    | { url: string | null, selector: string | null, title: string | null, error: string }",
					"  >",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>topFrame</code>は、関数が呼び出されたフレームについての、<a href="#top-level-result">トップレベルの結果</a>とまったく同じ形です。
				</li>
				<li>
					<code>frames</code>には、スキャン範囲内（開いたシャドウルートを含み、範囲自体がフレームであればそれも含む）の直接の子である<code>&lt;iframe&gt;</code>/<code>&lt;frame&gt;</code>ごとに1件のエントリが入ります。ただし、ページが表示していないフレームと、<code>excludeSelectors</code>が除外するフレームは、そのドキュメント全体とともに除かれます。各エントリはそのフレーム要素を示します。<code>selector</code>は親のドキュメントにおける<code>&lt;iframe&gt;</code>/<code>&lt;frame&gt;</code>のCSSセレクター、<code>title</code>はその要素の<code>title</code>属性または<code>null</code>で、同じドキュメントを読み込むフレームを見分けられます。<code>url</code>はフレームが表示しているドキュメントで、まだ遷移していないフレームではその<code>src</code>です。到達できる子（<code>a11yCoreEnableFrameResponder()</code>を呼び出したもの）は、<em>それ自身の</em>入れ子の<code>frames</code>まで再帰的に含む、完全な<code>{"{ url, topFrame, frames }"}</code>を返します。さらに深い孫フレームには、直接の親を経由してしか到達できないためです。到達できない子（ほとんどのサードパーティの埋め込みがこれに当たります。協力するレスポンダーがないか、タイムアウトした場合）は代わりに<code>{"{ url, error }"}</code>を返し、スキャンの残りは中断されません。
				</li>
				<li>
					これは<strong>フラットなリストではなくツリー</strong>です。<code>@surea11y/playwright</code>バインディングの<code>.frames(true)</code>とは意図的に異なります。そちらはPlaywrightの<code>page.frames()</code>が入れ子の深さに関係なくすべてのフレームを返すので、フラットに<em>できます</em>。<code>postMessage</code>による中継にはそのような全体の視点がないため、入れ子を構造で表しています。
				</li>
				<li>
					<strong>レポーターはツリーをそのまま受け取ります。</strong><code>renderHtmlReport</code>、<code>renderSarifReport</code>、<code>renderJunitReport</code>、<code>buildBaselineEntries</code>、<code>matchBaseline</code>、<code>renderEarlReport</code>は、ツリーのすべてのフレームを報告します。応答した各フレームはそれ自身の検出結果を、それ自身のドキュメントに位置付けて報告し、応答しなかった各フレームは未スキャンとして報告するため、カバレッジの抜けが合格と読まれることはありません。フレームは<strong>パス</strong>で示されます。ページからそのフレームに至るフレーム要素の<code>selector</code>を、外側から順に並べたものです（<code>#checkout → iframe:nth-of-type(2)</code>）。スキャン結果でもフレームをまたぐ結果でもないもの（配列、失敗したスキャンの<code>null</code>や<code>undefined</code>）を渡されると、何も見つからなかったスキャンとして描画するのではなく<code>TypeError</code>を投げます。
				</li>
				<li>
					<strong>バインディングのフレームのスキャンも受け取ります。</strong>ブラウザー用バインディングの<code>.frames(true)</code>は、各フレームが入れ子のエントリではなく単純な結果（または<code>{"{ url, error }"}</code>）である<code>{"{ topFrame, frames }"}</code>を返します。レポーター、<code>getMargins</code>、<code>flattenCrossFrameResult</code>は、そうしたフレームをスキャン済みとして読み、<code>selector</code>を持たないため<code>['iframe']</code>というパスで示します。
				</li>
				<li>
					<code>@surea11y/core</code>の<code>flattenCrossFrameResult(result)</code>は、レポーターが読むとおりにフレームを列挙します。<code>{"[{ frame: { path, title, url }, result }]"}</code>の形で、応答しなかったフレームでは<code>result</code>の代わりに<code>error</code>が入り、ページが先頭で、各フレームはその中のフレームより前に並びます。ページの<code>path</code>は<code>[]</code>です。単純なスキャン結果は1件のエントリになります。
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
					'  ruleSeverity?: "minor" | "moderate" | "serious" | "critical", // the rule\'s own, when a profile gave it another',
					'  policyOutcome?: "pass" | "fail" | "cantTell" | "notApplicable", // what the rule found, when the policy made it cantTell',
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
					"    helpUrl: string,       // where to read how to fix it; \"\" when there is none",
					"    tags: string[],        // the rule's tags, its own and the engine's",
					"    normativeMappings: Array<{ standard: string, version: string, requirement: string, title: string,",
					"      conformanceLevel?: string, wcagSc?: string[], url?: string, understandingUrl?: string }>,",
					"    standard: string | null,",
					"    applicability: string,",
					"    expectation: string,",
					"    references: string[],",
					"    requirements: object | null,",
					"    mappings: object | null",
					"  },",
					"  engineOptions: object,   // the resolved engineOptions this rule actually ran under",
					"  schemaVersion: string,",
					"  rollupIds: string[],     // the rulesResults entries that group this rule in this run; [] if none",
					"  data?: object,           // page-level data a rule reports whatever its outcome; see below",
					"  margin?: {               // the closest a measurement came to its threshold while meeting it; see below",
					'    measure: string,       // "contrast-ratio" | "overflow-px" | "target-size-px" | ... (open set)',
					'    unit: "px" | "ratio",  // open set',
					'    limit: "min" | "max",',
					"    threshold: number,",
					"    value: number,",
					"    headroom: number,      // >= 0",
					"    measuredCount: number,",
					"    selector?: string,",
					"    shadowHostSelectors?: string[],  // as on an occurrence",
					"    structuralPath?: number[],",
					"    context?: object       // rule-specific; not a stable contract",
					"  },",
					"  wcagVersionScope?: {     // present only when the target WCAG version changed this outcome",
					'    target: "2.0" | "2.1" | "2.2",',
					"    removedSc: string[],",
					'    coercedFrom: "fail"',
					"  },",
					"  error?: string           // present when the rule did not complete, or the engine noted a change — see below",
					"}",
				]}
			/>
			<p>注意点：</p>
			<ul>
				<li>
					<strong><code>outcome</code>と<code>outcomeNormalized</code></strong>：<code>outcomeNormalized</code>では<code>notApplicable</code>が<code>"inapplicable"</code>になる点を除いて同一です。自分の用語とエンジン内部の用語のどちらにも合わせられるよう、両方を提供しています。
				</li>
				<li>
					<strong>デフォルトの<code>a11y</code>ポリシーでは、<code>type: "manual"</code>のルールは<code>fail</code>ではなく<code>cantTell</code>を報告します。</strong>手動ルール自身のロジックが<code>fail</code>と判断した場合、エンジンはそれを<code>cantTell</code>に強制変換し、<code>error</code>に説明を追記します。これは一元的に適用される仕組み（<code>policy.coerceManualFailToCantTell</code>。<code>a11y</code>ポリシー契約ではデフォルトで有効です。<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>を参照）で、各ルールが気にかける必要はありません。このポリシーのもとでは、<code>fail</code>は決定論的な<code>type: "automatic"</code>の検出結果だけのためにあります。
				</li>
				<li>
					<strong><code>meta.normativeMappings</code></strong>は、チェック結果をWCAGの達成基準に結び付けるものです。空のリストは、この結果ではそのルールに正式な対応がないことを意味します。それはルールが自動か手動かを示すものではありません。それには<code>type</code>を読んでください（例えば<code>aria-allowed-role</code>は自動ルールで、WCAGとの対応がありません）。これらがどう集約されるかは<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。<strong>このリストはWCAGだけのものではありません。</strong>スキャンが別の規格を要求した場合（<code>engineOptions.mappings</code>、または規格のプロファイル）、WCAGの各達成基準の後に、その規格で対応する要件が続きます。例えば、その達成基準を再掲するEN 301 549の条項です（<code>{'{ standard: "EN 301 549", version: "V3.2.1" | "V4.1.1", requirement: "9.1.1.1", title, wcagSc: ["1.1.1"] }'}</code>。その達成基準を含むバージョンごとに1件）。また、ルールがWCAGのUnderstanding文書を引用することもあります（<code>type: "Understanding"</code>）。<code>requirement</code>を達成基準として読む前に、<code>standard</code>（と<code>type</code>がないこと）で絞り込んでください。複合ルールのWCAGのエントリーは常に先頭です。<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>を参照してください。
				</li>
				<li>
					<strong><code>rollupIds</code></strong>は、この実行でこのルールをまとめている<code>rulesResults</code>内の複合ルールを列挙します。空のリストは、そのルールの検出結果がどの集約にも現れないことを意味するため、<code>rulesResults</code>だけを読む利用者には決して見えません。例えば<code>heading-order</code>はどのWCAGの集約にも属していません。
				</li>
				<li>
					<strong><code>wcagVersionScope</code></strong>：スキャンの対象WCAGバージョンによって、このルールの<code>fail</code>が<code>cantTell</code>に変わった場合にだけ含まれます。現時点では、デフォルトの2.2を対象としたときの、SC 4.1.1（構文解析）に対応するルール（<code>duplicate-id</code>）がこれに当たります。2.2でその達成基準が削除されたためです。<code>removedSc</code>は存在しなくなった達成基準、<code>target</code>はそれを削除したバージョン、<code>coercedFrom</code>はルール自身が報告した判定結果です。検出箇所はルール自身のもので、手を加えていません。捨てられたものは何もなく、変わったのは適合の判定だけです。それ以外の結果には含まれず、<code>error</code>で報告されることも<strong>ありません</strong>。何も問題は起きていないからです。<a href="/configuration/engine-options/#filtering-by-wcag-version">WCAGバージョンによる絞り込み</a>を参照してください。
				</li>
				<li>
					<strong><code>data</code></strong>：判定結果にかかわらずページ全体について何かを報告するルールにだけ含まれます。現在、コアのルールでこれを使うものはありません。検出箇所の<code>data.details</code>と同じく、安定した契約ではありません。
				</li>
				<li id="margin">
					<strong><code>margin</code></strong>：カタログでmarginを宣言しているルール（<code>getChecksCatalog()[i].margin</code>、<code>{"{ measure, unit, limit }"}</code>）で、少なくとも1つの要素がルールのしきい値を満たした場合にだけ含まれます。しきい値を満たしつつ最もしきい値に近づいた要素を示すので、4.5:1に対して4.52:1での<code>pass</code>や、テキストが切れるまであと0.4 pxでの<code>pass</code>を、余裕のある<code>pass</code>と区別できます。判定結果に添えられる情報で、検出結果ではありません。検出箇所を追加、削除、変更することはなく、ベースライン、SARIF、JUnit、EARLはこれを無視します。一部の要素が合格していれば、<code>fail</code>や<code>cantTell</code>の結果にも含まれます。<code>limit</code>は、値がしきい値に達する必要がある場合（コントラスト、サイズ）は<code>min</code>、しきい値を下回る必要がある場合（はみ出し）は<code>max</code>です。<code>headroom</code>はしきい値の内側にどれだけ余裕があるかを<code>unit</code>で表したもので、<code>min</code>なら<code>value - threshold</code>、<code>max</code>なら<code>threshold - value</code>となり、負になることはありません。<code>threshold</code>はその要素の判定に使われたしきい値で、要素ごとに異なることがあります（大きな文字なら3:1）。ピクセルは小数点以下1桁で示されます。CSSピクセルや、15pxのフォントの半分といったしきい値は小数になり、表示する側が人のために丸めるからです。比は丸めません。WCAGはコントラストを丸めないためです。同じ値の要素が複数あれば文書順で最初の要素が選ばれるので、同じページでは常に同じmarginになります。<code>measure</code>と<code>unit</code>はオープンな集合で、マイナーリリースで増えることがあります。<code>context</code>はルール固有で、<code>data.details</code>と同じく安定した契約ではありません。<code>getMargins(result)</code>は、結果に含まれるすべてのmarginを<code>ruleId</code>順に並べた<code>{"[{ ruleId, ...margin }]"}</code>として返します。フレームをまたぐ結果ではすべてのフレームのmarginを返し、子フレームのものには、そのフレームへのパスである<code>frame</code>が付きます。
				</li>
				<li>
					<strong><code>error</code></strong>：ルールが完了しなかった場合、またはルールが返したものの一部をエンジンが変更したり無視したりした場合に含まれます。例外を投げた（または結果でないものを返した）ルールは、必ず<code>outcome: "cantTell"</code>、<code>occurrences: []</code>、例外メッセージを設定した<code>error</code>として現れます。そのため、検出箇所がなく<code>error</code>を持つ<code>cantTell</code>が、完了しなかったルールの見分け方です。エンジンは、壊れたルール1つでスキャン全体をクラッシュさせることはありません。それ以外の場合、<code>error</code>はエンジンの注記を保持し、ルール自身が返した<code>error</code>があればその後に<code>|</code>でつなげます。注記の対象は、上記の手動ルールの強制変換、集合の外にある<code>outcome</code>や<code>severity</code>、metaと異なる<code>type</code>、オブジェクトでない検出箇所（除外されます）、ルールが返した<code>policyOutcome</code>や<code>ruleSeverity</code>（どちらもエンジンが設定するため採用されません）、閉じた集合の外にある<code>uncertainty.code</code>、そして200段階の祖先をたどる処理が報告されたすべての要素に届かずに止まったために<code>cantTell</code>に格下げされた<code>fail</code>です。これらの結果は検出箇所を保持します。ルールは完了しているからです。
				</li>
				<li>
					<strong><code>policyOutcome</code></strong>：ポリシーの<code>allowedOutcomes</code>が、ルールの見つけた判定結果を許可しない場合に含まれます。その場合、結果は<code>cantTell</code>になり、ルール自身の判定結果がここに入り、<code>error</code>は付きません。そのため、レポーターがこれを完了しなかったルールとして読むことはありません。
				</li>
				<li>
					各結果の<strong><code>engineOptions</code></strong>は、渡したものそのままではなく、<em>解決済みの</em>オプションオブジェクト（ロケールやコントラストのデフォルトを適用した後のもの）です。あるルールが実際に何を受け取ったか、特に解決された<code>locale</code>と<code>contrast.mode</code>/<code>contrast.rootCanvasFallback</code>を確認するのに役立ちます。スキャンが翻訳に使った辞書である<code>messages</code>（ブラウザー用バンドルのロケール用の別ファイル、または独自の文字列）は含まれません。これらは設定ではなくデータで、結果ごとにコピーを持たせるとスキャンが数十メガバイトになっていたためです。どの辞書が使われたかは<code>engine.locale</code>で分かります。さらに2つのオプションは、ルールが見たとおりの形で含まれます。結果を<code>JSON.stringify</code>や<code>structuredClone</code>（<code>postMessage</code>）で運べる単純なデータに保つためです。<code>probes</code>はルールが読む上限付きのコピーとして、<code>customRules</code>は関数を除いた<code>{"[{ id }]"}</code>（IDを持つカスタムルールごとに1件）として含まれます。
				</li>
			</ul>

			<h2 id="occurrence">検出箇所（<code>occurrences[i]</code>）</h2>
			<p>
				<code>fail</code>には必ず1つ以上あります。要素を示さないカスタムルールの<code>fail</code>には、ドキュメント要素に1つ付きます（<code>selector: "html"</code>、理由コード<code>FAIL_WITHOUT_OCCURRENCE</code>）。通常は<code>outcome</code>が<code>fail</code>または<code>cantTell</code>のときにだけ含まれます。このエンジンは合格した要素を列挙せず、フラグを立てた要素だけを報告するため、<code>pass</code>の結果は<code>occurrences: []</code>になります。例外はコントラストのルールで、その<code>pass</code>には、スキャンについて述べる検出箇所（対象となり計算できたテキストの量）が<code>selector</code>を空にして1つ付きます。テキストがまったくない<code>pass</code>と、テキストの多いページでの<code>pass</code>を区別できるようにするためです。
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
					"  shadowHostSelectors?: string[],",
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
					"  data?: {               // absent on manual-review's page-level finding",
					"    visibilityFilter?: { eligible?: boolean, targetSet: string, accEligible: boolean | null, reasons: string[] },",
					"    details?: object   // rule-specific, non-normative — see below",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="検出箇所のフィールド"
				rowKey="id"
				columns={[
					{ key: "field", label: "フィールド", width: "22%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={occurrenceRows}
			/>

			<h3 id="uncertainty-codes">不確実性コード</h3>
			<p>
				<code>cantTell</code>は、エンジンが判定しなかったことを示します。<code>uncertainty</code>は<strong>その理由</strong>を閉じた語彙で示すので、利用側は要約の文字列を解析しなくても、理由に応じて処理を分けられます。含まれるのは<code>cantTell</code>の層の検出箇所だけです。<code>fail</code>の層の検出箇所に付いていれば、ルールが判定したと同時に判定しなかったと主張することになるため、エンジンはそれを取り除きます。<code>code</code>が下記のコードのいずれでもない不確実性も除かれ、ルールの<code>error</code>がそのコードを示します。
			</p>
			<DataTable
				label="不確実性コード"
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
				複合ルールは、複数のアトミックルールを1つのWCAG達成基準に集約します（例：<code>wcag-1.1.1-non-text-content</code>は21件のアトミックルールを集約します）。独自の集約を持つ規格のプロファイルでは、それらの集約もあり、規格の文言が<code>title</code>に、規格の名前が<code>meta.standard</code>に入ります。形はチェック結果と同じ外枠で、<code>data.details</code>が複合ルール固有の内容になります。
			</p>
			<CodeBlock
				lines={[
					"{",
					'  ruleId: string,              // e.g. "wcag-1.1.1-non-text-content"',
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					"  severity, confidence, type, title, description, meta, engineOptions, schemaVersion,  // as on a check result, except that",
					"                                // meta.normativeMappings names the criterion in a shorter form:",
					"                                // { standard, requirement, level }",
					"  occurrences: [],              // always empty — composites are rollups, not element-level findings",
					"  data: {",
					"    details: {",
					'      reasonCode: string,       // e.g. "composite.rollup.fail.anyFail"',
					"      standard?: string,        // a standard's own rollup only, with version and criterion",
					"      version?: string,",
					"      criterion?: string,",
					"      checksIds: string[],      // every atomic ruleId it rolls up, custom rules mapped to its criteria included",
					"      customChecksIds?: string[], // the custom rules among them; absent when none",
					"      contributors: Array<{ testId: string, outcome: string, severity?: string | null, custom?: true }>,",
					"      metrics: { failCount, cantTellCount, notApplicableCount, passCount, missingCount }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				集約の優先順位（決定論的で、この順に適用されます）：<strong>構成ルールに<code>fail</code>が1つでもあれば、複合ルールは<code>fail</code></strong>。そうでなく<strong><code>cantTell</code>が1つでもある（または構成ルールのいずれかがまったく実行されなかった、つまり<code>missingCount &gt; 0</code>）なら、複合ルールは<code>cantTell</code></strong>。そうでなく<strong>構成ルールがすべて<code>notApplicable</code>なら、複合ルールは<code>notApplicable</code></strong>。それ以外は<strong><code>pass</code></strong>です。これが全体としての適合表明にとって何を意味するかは<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。
			</p>
			<p>
				WCAGの集約のルールは、それ自身のリストに加えて、実行されて（<code>meta.wcagSc</code>または<code>meta.normativeMappings</code>のWCAGのエントリーを通じて）その達成基準のいずれかに対応する<code>engineOptions.customRules</code>のすべてのルールです。それらは貢献したルールの中で<code>custom: true</code>が付き、<code>customChecksIds</code>に列挙されるため、カスタムルールが判定結果を決めたことが読み手に分かります。規格独自の集約は、それ自身のリストを保ちます。
			</p>

			<h2>判定結果の値</h2>
			<DataTable
				label="判定結果の値"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "判定結果", width: "16%" },
					{ key: "meaning", label: "意味", wrap: true },
					{ key: "manual", label: 'type: "manual"で現れるか', width: "22%" },
				]}
				rows={outcomeRows}
			/>
			<p>
				コアの組み込みルールでは、<code>fail</code>は意図的に最も範囲が狭く、最も基準の高い判定結果にしてあります。決定論的で規範的な違反のためだけにあり、<strong>ルールのカバー範囲を広げるためにこれを薄めてはなりません</strong>。
			</p>

			<h2>重大度と確度の値</h2>
			<ul>
				<li>
					<code>severity</code>：<code>minor</code> &lt; <code>moderate</code> &lt; <code>serious</code> &lt; <code>critical</code>。ユーザーへの影響についてのルール作成者の評価で、<code>confidence</code>とは独立しています。プロファイルはルールに別の重大度を与えることができます（規格やパックのチェックリストにあるプロファイルの<code>severity</code>）。その場合、結果にはプロファイルの重大度が表示され、ルール自身の重大度は<code>ruleSeverity</code>として保持され（このときだけ含まれます）、集約はプロファイルの重大度を使います。
				</li>
				<li>
					<code>confidence</code>：<code>low</code> &lt; <code>medium</code> &lt; <code>high</code>。<code>fail</code>/<code>cantTell</code>の判定が正しいことに、エンジンがどれだけ確信を持っているかを示します。どちらも優先順位付けのための情報としてのメタデータで、<code>outcome</code>の意味を変えることはありません。
				</li>
			</ul>
			<p>
				<strong><code>fail</code>が常に<code>confidence: "high"</code>とは限りませんが、それは矛盾ではありません。</strong>判定結果が表すのは判定の手順（推測せずに問いを解決したこと）であり、<code>confidence</code>が表すのは、その判定の拠り所となったモデルです。いくつかの自動ルールは、それ自体が近似であるもの（厳選したWAI-ARIAのロールの表、ネイティブ要素のロールの対応、静的なマークアップから推定したアクセシビリティツリー）に対して決定論的に判定し、<code>medium</code>を報告します。<code>aria-required-children</code>、<code>aria-prohibited-children</code>、<code>aria-required-parent</code>、<code>aria-allowed-attr</code>、<code>form-control-programmatic-label-present</code>、<code>identical-iframes-same-purpose</code>、<code>svg-image-text-alternative-present</code>、<code>video-poster-text-alternative-present</code>、<code>target-size-minimum</code>、<code>text-spacing-content-loss</code>です。<code>confidence</code>はすべての結果に含まれるので、最も確実な不合格だけが欲しい利用側はこれで直接ゲートできます。<code>policy.allowedConfidence</code>ではこれはできません。許可されていない値は、判定結果を変えるのではなく、ルール自身の<code>defaultConfidence</code>に置き換えられるからです（<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>を参照）。
			</p>

			<h2>実例</h2>
			<p>
				<code>&lt;img src="logo.png"&gt;</code>（<code>alt</code>なし）と<code>&lt;button&gt;&lt;/button&gt;</code>（アクセシブルな名前なし）を、<code>runOnly: {"{ includeRuleIds: [...] }"}</code>でこの2つのルールだけに絞ってスキャンします（<a href="/configuration/engine-options/">エンジンオプション</a>を参照。1.10.0以降は、ルールIDの配列をそのまま渡しても同じです）。
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
					'  "contextMatch": null,',
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
					'          "hint": "Give the button visible text, or name it with aria-label, so screen reader users know what it does.",',
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
					'          "summary": "This <img> has no alt attribute.",',
					'          "hint": "Add an alt attribute (use alt=\\"\\" only for decorative images)."',
					"        }",
					"      ]",
					"    }",
					"  ],",
					'  "rulesResults": [],',
					'  "overriddenBuiltinIds": [],',
					'  "skippedCustomRules": []',
					"}",
				]}
			/>
			<p>
				（読みやすさのために省略しています。実際の結果では、上に示した完全な形のとおり、すべてのエントリに<code>title</code>/<code>description</code>/<code>i18n</code>/<code>meta</code>/<code>engineOptions</code>/<code>schemaVersion</code>も含まれます。<code>runOnly.includeRuleIds</code>でスキャンを2つのアトミックルールに絞り、複合ルール自体のIDは含めていないため、ここでは<code>rulesResults</code>が空になっています。）
			</p>
		</>
	);
}
