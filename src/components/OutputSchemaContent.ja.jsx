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
このスキャンがどのバージョンのWCAGに照らしてチェックしたかを示します。<code>engineOptions.wcagVersion</code>の値、実行に適用されたパックのプロファイルの<code>wcagVersion</code>、導入バージョンタグから推定された値、またはデフォルトの<code>"2.2"</code>のいずれかです。SC 4.1.1（構文解析）については、<strong>それだけに対応するルールが<code>fail</code>にならない</strong>理由を示します。2.2ではこの達成基準が削除され、2.0と2.1の2023年の正誤表では常に満たされているものとして扱われるためです（後述の<code>checksResults[i].wcagVersionScope</code>を参照）。1回のスキャンでは全体を通して対象は1つなので、結果ごとに1回だけ報告されます。
			</>
		),
	},
	{
		id: "engine.wcagLevel",
		field: <code>engine.wcagLevel</code>,
		meaning: (
			<>
				報告される達成基準を絞り込んだWCAGのレベルで、<code>"A"</code>、<code>"AA"</code>、<code>"AAA"</code>のいずれかです。指定されていて有効なら<code>engineOptions.wcagLevel</code>、そうでなければ選択が示すレベル（<code>runOnly.wcag.level</code>、またはプロファイルのタグも含め、選択のバージョン／レベルのタグが示す最も高いレベル）です。それより上のWCAGの集約は<code>rulesResults</code>に含まれませんが、そのルールは実行されており、<code>checksResults</code>に含まれます。選択がIDで指定した集約は、<code>engineOptions.wcagLevel</code>にかかわらず報告されます。全体のスキャンやルールだけを指定したスキャンのようにレベルがない場合は含まれず、その場合はすべてのレベルが報告されます。レポーターは、示す達成基準をこれで絞り込みます。<a href="/configuration/engine-options/#giving-the-level-of-a-scan-that-names-checks-wcaglevel">チェックを指定するスキャンのレベルを示す</a>を参照してください。
			</>
		),
	},
	{
		id: "engine.profile",
		field: <code>engine.profile</code>,
		meaning: (
			<>
				<code>engineOptions.profile</code>がこの実行のルールを選んだ場合にだけ含まれ、プロファイル名を小文字で示します（複数のプロファイルでのスキャンでは、実行された最初のもの）。プロファイルを要求しなかった場合はなく、要求しても適用されなかった場合（不明な名前、または<code>runOnly</code>や<code>engineOptions</code>のincludeが代わりにルールを選んだ場合）もありません。そのため、これがあることで、実行が本当にそのプロファイルを対象にしたことを確認できます。<a href="/configuration/engine-options/#conformance-profiles">適合性プロファイル</a>を参照してください。
			</>
		),
	},
	{
		id: "engine.profiles",
		field: <code>engine.profiles</code>,
		meaning: (
			<>
				複数のプロファイルでのスキャン（<code>engineOptions.profile</code>をリストで指定）のみ。実行されたプロファイルを、求められた順に示します。そのとき<code>engine.profile</code>はその最初のものです。<a href="#several-profiles">複数のプロファイル</a>を参照してください。
			</>
		),
	},
	{
		id: "engine.profilesNotRun",
		field: <code>engine.profilesNotRun</code>,
		meaning: (
			<>
				複数のプロファイルでのスキャンで、そのうちのどれかが実行されなかった場合のみ：<code>{"[{ profile, reason }]"}</code>。<code>reason</code>は<code>unknown-profile</code>（そのようなプロファイルがない）、<code>pack-skipped</code>（そのパックがスキップされた。<code>skippedPacks</code>を参照）、<code>overridden-by-selection</code>（<code>runOnly</code>の含める指定、または<code>engineOptions</code>のルールIDやタグが、1つのプロファイルの場合と同じく代わりにルールを選ぶ。これはすべてのプロファイルのスキャンで起こります）のいずれかです。理由の種類は今後増えることがあります。
			</>
		),
	},
	{
		id: "engine.profileExcludes",
		field: <code>engine.profileExcludes</code>,
		meaning: (
			<>
				適用されたプロファイルがルールを除外する場合にだけ含まれます。<code>{"{ rules, criteria }"}</code>で、指定されたルールと、除外されるWCAGの達成基準です。指定されたルール、すべての達成基準が除外されるルール、除外される達成基準のWCAGの集約は実行されていません。プロファイルが残す達成基準もチェックするルールは実行され、その達成基準に数えられます。これはスキャンの範囲を狭めるもので、WCAGが求めることは変わりません。組み込みのプロファイルで何かを除外するものはありません。
			</>
		),
	},
	{
		id: "engine.law",
		field: <code>engine.law</code>,
		meaning: (
			<>
				実験的（core 1.16.0から1.18.0まで）。適用されたプロファイルが法律、つまりパックの規格の評価の根拠となる法律を示す場合にだけ含まれます（<a href="/configuration/packs/#laws">パック</a>を参照）。<code>{"{ id, name, jurisdiction, lang }"}</code>で、<code>lang</code>は<code>name</code>の言語です。coreは法律を示すだけで、その法律が誰に適用されるかを決めることはありません。
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
				<code>engineOptions.output.detail</code>が<code>'findings'</code>の場合にだけ、<code>"findings"</code>として含まれます。検出箇所を1つも持たない<code>pass</code>または<code>notApplicable</code>のチェック結果はそれぞれコンパクトになり、<code>{"{ ruleId, outcome, type }"}</code>と、ある場合はその<code>margin</code>または<code>error</code>だけになります。タイトル、説明、<code>meta</code>はカタログのものでどのページでも同じなので、含まれません。<code>fail</code>と<code>cantTell</code>の結果、集約、<code>engine</code>は完全なままなので、判定は何も変わりません。レポーター（SARIF、JUnit、HTMLレポート、EARL、ベースラインの関数）は、コンパクトな結果をコアのカタログで補って完全な結果として読みます。カタログで補えない結果は完全なまま残ります。<code>packs</code>付きのスキャンのすべてのチェック結果、カスタムルールの結果、スキャンの<code>messages</code>がタイトルや説明を変えた結果です。空のページの結果は、約263 KBから90 KBになります。
			</>
		),
	},
	{
		id: "engine.environment",
		field: <code>engine.environment</code>,
		meaning: (
			<>
				ページがレンダリングされた条件です。スキャンの開始時、どのルールも実行される前にページから読み取ります。<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a>のようにレイアウトを計測するルールは、同じマークアップでも、ビューポートの幅が違ったり、Webフォントがまだ読み込み中だったりすると別の判定結果になることがあるため、実行を再現するにはこの情報が必要です。<code>layout</code>はページにレイアウトがあったかどうかです。jsdomなどのDOMエミュレーターでは<code>false</code>になり、その場合、ビューポートなどのレンダリングのフィールドは、計測されたものを何も表さないため省略されます。並びうるのは、ページがフックを実行している場合の<code>internalsHook</code>、<code>listenerHook</code>、<code>liveRegionHook</code>だけです。ブラウザーでは、<code>viewport</code>はCSSピクセル単位の<code>innerWidth</code>／<code>innerHeight</code>、<code>devicePixelRatio</code>はページのデバイスピクセル比（ブラウザーのズームもここに表れます）、<code>colorScheme</code>は<code>prefers-color-scheme</code>が一致する値、<code>forcedColors</code>は<code>forced-colors: active</code>が一致するかどうか（Windowsのハイコントラストや、Chromiumでエミュレートした強制カラーのもとでは<code>"active"</code>、それ以外は<code>"none"</code>。どちらの場合もルールはページ自身の色を計測します。<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#forced-colors`}><code>LAYOUT_MEASUREMENT.md</code></a>を参照）、<code>forcedColorsCss</code>は、強制カラーのもとでページ自身のCSSがスキャンでは抑えられない形でそれに反応する場合（なお一致する<code>forced-colors</code>メディアクエリや、なお強制パレットの色を取る<code>GrayText</code>などのシステムカラー）に<code>true</code>で、その場合コントラストの結果は強制カラーをオフにしたスキャンと異なることがあります。<code>fonts</code>はページのフォントフェイスのいずれかがまだ読み込み中なら<code>"loading"</code>、それ以外は<code>"loaded"</code>です。ページが報告できないフィールドは省略されます。これらを読み取っても非決定性は加わりません。DOMと同じく、入力だからです。実行間で比較できる結果が必要なら、スキャンの前に<code>document.fonts.ready</code>を待ってください。<code>images</code>は、いずれかの画像がまだ読み込み中なら<code>"loading"</code>、それ以外は<code>"loaded"</code>です。後から届いた画像は、レイアウトのルールが計測したものを動かすことがあるため、比較できる結果が必要なら、ページの<code>load</code>イベントの後にスキャンしてください。<code>loading="lazy"</code>の画像は、読む人がスクロールするまで読み込まれないため除外されます。<code>animationsSettled</code>は、スキャンが静止させた実行中のアニメーションとトランジションの数です。スキャンの間、有限のもの（フェードインなど）は終了時点の状態で、無限に繰り返すもの（マーキーやスピナーなど）は開始時点の状態で読み取り、その後それぞれを元の位置に正確に戻します。そのため、フェードインの途中でスキャンしたページも、その後にスキャンしたページと同じ結果になります。スキャンは1つの同期タスクなので、静止させた状態がブラウザーに描画されることはありません。<code>contentVisibilitySkipped</code>は、<code>content-visibility: auto</code>を持つ要素のうち、画面外にあるときのようにブラウザーが内容のレイアウトを省略していた要素の数です。スキャンはその内容をビューポートの近くにあるときと同じようにレイアウトし、その後ふたたびブラウザーが省略できる状態に戻します（GitHubの<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#skipped-content`}><code>LAYOUT_MEASUREMENT.md</code></a>を参照）。該当する要素がない場合は含まれません。<code>internalsHook</code>は、スキャンしたドキュメントでページがオプトインの内部フック（<code>internalsHookScript()</code>。<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}><code>INTEGRATION.md</code></a>を参照）を実行している場合にだけ、レイアウトの有無にかかわらず含まれます。ページのスクリプトより前にインストールされ、今もページの<code>attachInternals</code>であれば<code>"early"</code>で、スキャンはすべてのカスタム要素の<code>ElementInternals</code>を読み取っており、それを持たない要素について問いは生じません。ページのスクリプトより後にインストールされた場合、またはその後でページが<code>attachInternals</code>を置き換えた場合は<code>"late"</code>で、フックより後に関連付けられた内部状態だけが読み取られています。フックがなければこのフィールドはなく、結果はこれまでと同じです。<code>listenerHook</code>は、オプトインのリスナーフック（<code>listenerHookScript()</code>。<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}><code>INTEGRATION.md</code></a>を参照）について同じことを示します。ページのスクリプトより前にインストールされ、今もページの<code>addEventListener</code>であれば<code>"early"</code>で、キーボードのルールはページがスクリプトから追加したすべてのリスナーを見ており、リスナーがなければ本当にないことが証明されます。ページのスクリプトより後にインストールされた場合、またはその後でページが<code>addEventListener</code>を置き換えた場合は<code>"late"</code>です。<code>liveRegionHook</code>は、ページがオプトインのライブリージョンフック（<code>liveRegionHookScript()</code>。<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}><code>INTEGRATION.md</code></a>を参照）を実行している場合にだけ含まれます。ドキュメントの読み込みが終わる前にインストールされていれば<code>"early"</code>で、それ以降のページのライブリージョンへの変更をすべて見ています。それ以外は<code>"late"</code>です。<a href="#cross-frame-result">フレームをまたぐ結果</a>では、各フレームがそれぞれ独自の値を持ちます。
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
				実行された<strong>複合ルール（集約ルール）</strong>ごとに1件のエントリです。<a href="#composite-result">複合ルールの結果</a>と<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。通常はWCAGの達成基準ごとに1件ですが、独自の集約を持つ規格のプロファイルで実行した場合は、それらも含まれます（<code>meta.standard</code>が設定されます）。選択が選んだ集約と、選択が単独で（IDなどで）指定したルールがチェックする達成基準の集約を含み、後者は<a href="#partly-checked">一部だけチェックされた</a>ものでありえます（<a href="/configuration/engine-options/#which-criteria-a-scan-reports">スキャンが報告する達成基準</a>を参照）。どちらもなければ空の配列です。
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
				実行されなかった<code>engineOptions.customRules</code>のエントリで、それぞれ<code>{"{ id, reason }"}</code>の形です（エントリにIDがなければ<code>id</code>は<code>null</code>）。理由は、IDがない、<code>runInPage</code>が関数でないかソースから再構築できない、<code>meta</code>が検証に通らない、別のカスタムルールがすでにそのIDを持っている、複合ルールのIDである、のいずれかです。あるいは、妥当なルールでも実行の選択に含まれない場合（プロファイルやWCAGの目標のもとで、<code>best-practice</code>のタグを持つか、WCAGのタグを持たないルール）で、その場合の<code>reason</code>はルールを選択する方法を示します。あるいは、選択の除外（<code>excludeRuleIds</code>、<code>excludeTestIds</code>、<code>excludeTags</code>、<code>rules.exclude</code>など）が外したルールで、その場合の<code>reason</code>は<code>excluded by the selection.</code>になり、<code>excluded: true</code>も付きます。そのため、ツールは理由を読まなくても、呼び出し側の選択と抜けを区別できます。常に配列で、すべてのカスタムルールが実行されれば空です。それぞれ<code>console.warn</code>でも記録されますが、呼び出し側が外すよう求めた除外ルールは記録されません。ここに挙がったルールはどの結果にも含まれないため、ルールを除外したスキャンと、そのルールが<code>pass</code>になったスキャンを区別できます。
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
				フラグが立った要素を指し戻せるように組み立てた、ベストエフォートのCSSセレクターです（<code>RULE_AUTHORING.md</code>の<code>helpers.buildSelector</code>を参照）。ID、テストID、<code>name</code>、<code>aria-label</code>を起点にするのは、非表示の要素、除外された要素、範囲外の要素も含めて、ドキュメント内のほかのどの要素もそれを持っていない場合だけです。<code>querySelector</code>はそれをドキュメント全体に対して解決するためです。それ以外の場合、セレクターはパスになります。どのDOM構造でも一意であるとは保証されません。シャドウルート内の要素はそれ自身のツリーの中で名前が付けられ（その位置は<code>structuralPath</code>が示します）、非常に深い要素のパスは上から短縮されます。テスト用と実際のページ255件で、39,857個のセレクターのうち15個が自身の要素をちょうど指していませんでしたが、すべてこうした種類のものでした。256文字を超える値も起点にならないので、ページが属性に何を入れてもセレクターは短く保たれます。値の中の制御文字は、CSSが読むとおりにエスケープされます（改行は<code>\a </code>）。例外は、要素が存在しないこと<em>そのもの</em>が検出結果であるルールです。<code>page-title-present</code>は、存在しない<code>&lt;title&gt;</code>を、それが属するはずの<code>&lt;head&gt;</code>のセレクター（<code>&lt;head&gt;</code>がなければ<code>&lt;html&gt;</code>）と、ページ上には存在しない<code>&lt;title&gt;(missing)&lt;/title&gt;</code>という<code>html</code>で報告します。その<code>html</code>は定数なので、それから作られるフィンガープリントは安定しています。ただし、<strong>ルールが実在するものを報告したことを確かめずに、それを実際のマークアップとして扱わないでください</strong>。シャドウツリー内の要素では、<code>selector</code>はそのシャドウルートの中で解決され、そこまでのたどり方は<code>shadowHostSelectors</code>が示します。
			</>
		),
	},
	{
		id: "shadowHostSelectors",
		field: <code>shadowHostSelectors</code>,
		meaning: (
			<>
				シャドウツリー内の要素にだけ含まれます。その要素に至るシャドウホストのセレクターを外側から順に並べたもので、それぞれ自分を含むツリーの中で解決されます。そのため、<code>document.querySelector(s[0]).shadowRoot.querySelector(s[1])…shadowRoot.querySelector(selector)</code>で要素が見つかります。同じ内容を持つ2つのコンポーネントは<code>selector</code>が同じになり、ここで区別されます。<code>selector</code>と同じく、検出結果の識別には含まれません。<a href="/results-reports/html-report/">HTMLレポート</a>、<a href="/results-reports/sarif-report/">SARIF</a>（<code>logicalLocations</code>）、<a href="/results-reports/junit-report/">JUnit</a>、ベースラインのエントリーは、この2つを1つの位置として、ホスト、続いてセレクターを<code>{" >>> "}</code>でつないで示します（<code>{"#card >>> img"}</code>）。
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
				ルール固有の構造化データ（計算した指標、解決済みの参照など）です。<strong>規範的なものではありません</strong>。より詳しいUIの構築やデバッグには役立ちますが、<code>outcome</code>/<code>severity</code>の意味を変えることはありません。形はルールごとに異なるので、安定した契約ではなく、ベストエフォートの補足情報として扱ってください。唯一の例外が<code>data.details.reasonCode</code>で、これは安定して<strong>います</strong>。ルールの検出結果のうち<em>どれ</em>であるかを識別し、<code>ruleId</code>、<code>html</code>とともに、ベースラインとSARIFのキーになるフィンガープリントを構成します。ルールはマイナーリリースで新しい理由コードを得たり、既存のコードを原因ごとに分けたりすることがあります。<a href={`${core}/docs/API_STABILITY.md#finding-identity`}><code>API_STABILITY.md</code></a>を参照してください。コントラストの失敗のサイズと比のフィールド（<code>metrics.ratio</code>、<code>metrics.threshold</code>、<code>typography</code>の<code>fontSizePx</code>、<code>fontSizePt</code>、<code>fontWeight</code>、<code>isBold</code>、<code>isLargeText</code>）も安定しているので、レポートやパックはどの種類のテキストが失敗したかを判別できます。<code>list-children-valid</code>の検出結果の<code>element</code>、<code>listitem-parent-valid</code>の検出結果の<code>parentElement</code>、<code>aria-role-name-present</code>の検出結果の<code>role</code>も同様に安定しており、どの種類のリストやウィジェットが失敗したかを示します。core 1.16.0以降は、<code>contrast-computable</code>の検出結果の同じ<code>typography</code>のフィールド（コントラストを計算できなかったテキスト。<code>isLargeText</code>はcoreの定義で24px、または14ptかつ太字）、<code>link-name-quality</code>と<code>identical-links-same-purpose</code>の検出結果の<code>linkKind</code>（リンクが何でできているか：<code>text</code>、<code>image</code>、<code>composite</code>、<code>svg</code>）、<code>live-region-announcements</code>の検出結果の<code>messageKind</code>（領域が伝えると宣言しているメッセージの種類。テキストからではなく、ロールとライブリージョンの属性から読みます：<code>status</code>、<code>alert</code>、<code>log</code>、<code>progress</code>、<code>unknown</code>）も同様です。<code>linkKind</code>と<code>messageKind</code>は、マイナーリリースで値が増えることがあります。<code>data.details.evidenceState</code>（core 1.15.0以降）も同様です。ルールがページをある状態にし、ブラウザーが描画する前にその状態から戻した場合に、その状態でだけ現れる検出結果で、その状態の名前を示します（<code>text-spacing</code>。切れた、重なった、またはスクロールが固定されたテキストについての<code>text-spacing-content-loss</code>の検出結果に付きます）。そのため、ツールは<code>evidenceState()</code>でページを再びその状態にし、バインディングの<code>.screenshots()</code>と同じように検出結果を撮影できます。各ルールのページには、その検出結果が持つフィールドが「検出結果が報告する内容」の下に記載されています。
			</>
		),
	},
	{
		id: "occurrenceOutcome",
		field: <code>occurrenceOutcome</code>,
		meaning: (
			<>
				検出結果を確実な<code>fail</code>の層と、レビューが必要な<code>cantTell</code>の層に分けて評価するルールで、この検出箇所がどちらの層に属するかを示します。1つの層しか報告しないルールでは省略され、その場合は結果自体の<code>outcome</code>が検出箇所の層になります。<code>@surea11y/core</code>の<code>occurrenceOutcome(check, occurrence)</code>は、どちらの場合でも、すべてのレポーターが読むとおりの層を返します。core 1.16.0以降、合格したチェックの検出箇所には、<code>null</code>ではなく<code>'pass'</code>を返します。判定結果は常に層と一致します。<code>fail</code>の層の検出箇所が1つでもあれば<code>fail</code>になり、検出箇所がすべて<code>cantTell</code>の層である<code>fail</code>は<code>cantTell</code>になるため、SARIF、JUnit、EARL、ベースラインは同じ答えを返します。カスタムルールやパックのルールが食い違うものを返した場合はエンジンが整合させます。デフォルトのポリシーでは、手動ルールが<code>fail</code>になることはありません。レポーターは、エンジンがこれを行う前に保存された結果も、その<code>engineOptions</code>が記録するポリシーのもとで同じ規則で読み、読んだものからWCAGの集約をまとめ直します。
</>
		),
	},
	{ id: "uncertainty", field: <code>uncertainty</code>, meaning: <>この検出結果を判定できなかった理由です。後述の<a href="#uncertainty-codes">不確実性コード</a>を参照してください。</> },
	{ id: "lean", field: <code>lean</code>, meaning: <>ページがどちらかの根拠を示している場合に、この未判定の検出結果がどちらに傾いているかです。後述の<a href="#leans">傾き</a>を参照してください。</> },
	{ id: "howToCheck", field: <code>howToCheck</code>, meaning: <>この未判定の検出結果に人がどう答えるかです。後述の<a href="#how-to-check">確認方法</a>を参照してください。</> },
];

const uncertaintyRows = [
	{ id: "not-computable", code: <code>not-computable</code>, meaning: "ルールが必要とする証拠を、この環境では読み取れませんでした。", shape: "クロスオリジンのスタイルシート、値に解決されない背景色、解決できないsrc。" },
	{ id: "runtime-dependent", code: <code>runtime-dependent</code>, meaning: "実行時にスクリプトが決めるため、マークアップからは判断できません。", shape: "ウィジェットが開いたときに生成する要素を指すaria-controls。" },
	{ id: "spec-only", code: <code>spec-only</code>, meaning: "仕様違反ではあるものの、公開される名前、役割、値はその影響を受けないため、どの達成基準も不合格とは確定できません。", shape: "省略時のデフォルト値が仕様で定められているARIA属性。" },
	{ id: "equivalence-unknown", code: <code>equivalence-unknown</code>, meaning: "2つのものが同じ目的を果たしているかどうかが、マークアップからも内容からも判断できません。", shape: "アクセシブルな名前は同じなのに、異なるリソースを埋め込んでいる2つのフレーム。" },
	{ id: "judgement-required", code: <code>judgement-required</code>, meaning: "問いそのものが、本質的に人間の判断を必要とします。", shape: "サイズの小さいターゲットが必須かどうか。type: \"manual\"のルールはすべてこれに当たります。" },
	{ id: "out-of-scope", code: <code>out-of-scope</code>, meaning: "検出結果自体は本物ですが、このスキャンが対象とする規格の範囲外です。", shape: "対象のWCAGバージョンで削除された達成基準だけに対応するルール。" },
];

const rollupReasonRows = [
	{ id: "anyFail", code: <code>composite.rollup.fail.anyFail</code>, outcome: <code>fail</code>, when: <>構成ルールのいずれかが<code>fail</code>です。</> },
	{ id: "anyCantTell", code: <code>composite.rollup.cantTell.anyCantTell</code>, outcome: <code>cantTell</code>, when: <><code>fail</code>のものはなく、<code>cantTell</code>のものがあります。</> },
	{ id: "notSelectedChild", code: <code>composite.rollup.cantTell.notSelectedChild</code>, outcome: <code>cantTell</code>, when: <><code>fail</code>や<code>cantTell</code>のものはなく、スキャンが選ばなかったために実行されなかったものがあります。一部だけチェックされた状態です。</> },
	{ id: "missingChild", code: <code>composite.rollup.cantTell.missingChild</code>, outcome: <code>cantTell</code>, when: <><code>fail</code>や<code>cantTell</code>のものはなく、別の理由で実行されなかったものがあります。</> },
	{ id: "allInapplicable", code: <code>composite.rollup.notApplicable.allInapplicable</code>, outcome: <code>notApplicable</code>, when: <>すべての構成ルールが<code>notApplicable</code>で、ルールが達成基準の当てはまるすべてのケースを見つけます。</> },
	{ id: "partialCoverage", code: <code>composite.rollup.cantTell.partialCoverage</code>, outcome: <code>cantTell</code>, when: <>すべての構成ルールが<code>notApplicable</code>ですが、達成基準（または<code>partial</code>と示された規格の要件）は、ルールが探さないコンテンツにも当てはまりうるため、該当するものがないとは示されていません。</> },
	{ id: "emptyComposite", code: <code>composite.rollup.cantTell.emptyComposite</code>, outcome: <code>cantTell</code>, when: "集約にルールがありません。" },
	{ id: "partialCheck", code: <code>composite.rollup.cantTell.partialCheck</code>, outcome: <code>cantTell</code>, when: <><code>fail</code>も<code>cantTell</code>もなく、すべてが<code>notApplicable</code>でもありませんが、ルールは達成基準（または<code>partial</code>と示された規格の要件）の求めることの一部しかチェックしません。残りは人が確認します。</> },
	{ id: "otherwise", code: <code>composite.rollup.pass.otherwise</code>, outcome: <code>pass</code>, when: "上記以外の場合。" },
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
					'    wcagLevel?: "A" | "AA" | "AAA",',
'    profile?: string,      // "wcag20-a" … "wcag22-aaa" (wcag<version>-<level>), the deprecated "en301549-v4.1.1", "en301549-v3.2.1" and "section508", or a pack\'s own',
					"    profiles?: string[],   // a scan of several profiles only: the profiles that ran",
					"    profilesNotRun?: { profile: string, reason: string }[],  // a scan of several profiles only",
					'    mappings?: string[],   // e.g. ["en301549"] or ["en301549:V3.2.1"]',
					"    profileExcludes?: { rules: string[], criteria: string[] },",
					"    law?: { id: string, name: string, jurisdiction: string, lang: string },  // experimental",
					"    optInRules?: string[],",
					'    outputDetail?: "findings",',
					"    packs?: string[],      // name@version",
					"    environment: {",
					"      layout: boolean,",
					"      viewport?: { width: number, height: number },  // CSS px",
					"      devicePixelRatio?: number,",
					'      colorScheme?: "light" | "dark",',
					'      forcedColors?: "active" | "none",',
					"      forcedColorsCss?: true,          // under forced colors, when the page's own CSS reacts to them",
					'      fonts?: "loaded" | "loading",',
					'      images?: "loaded" | "loading",',
					"      animationsSettled?: number,",
					"      contentVisibilitySkipped?: number, // elements whose content-visibility: auto content was skipped",
					'      internalsHook?: "early" | "late",  // only where the page runs the internals hook',
					'      listenerHook?: "early" | "late",   // only where the page runs the listener hook',
					'      liveRegionHook?: "early" | "late"  // only where the page runs the live-region hook',
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
"  skippedCustomRules: Array<{ id: string | null, reason: string, excluded?: true }>,",
					"  skippedPacks?: Array<{ name: string | null, reason: string }>,",
					"  profiles?: { [profile: string]: { wcagVersion, wcagLevel?, standards, rulesResults } }  // a scan of several profiles only",
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

			<h2 id="several-profiles">複数のプロファイル</h2>
			<p>
				<code>engineOptions.profile</code>を2つ以上のリスト（<code>['wcag22-aa', 'wai-aria-1.2']</code>。<a href="/configuration/engine-options/#several-profiles">エンジンオプション</a>を参照）にすると、各プロファイルはそれだけをスキャンしたときと同じようにページを判定し、結果はすべてのルールを持つ1つのプロファイルのスキャンのように読めます。1つの名前、または要素が1つのリストでは、これまでとまったく同じ結果になり、以下のフィールドは含まれません。core 1.15.0以降。
			</p>
			<ul>
				<li>
					<strong><code>checksResults</code></strong>
					：各ルールは1回だけ含まれます。<code>verdicts</code>は、そのルールを実行したプロファイルについて、それぞれのプロファイルでの判定結果をプロファイルをキーにして示します（<code>{"{ 'wcag22-aa': 'cantTell', 'wai-aria-1.2': 'fail' }"}</code>）。<code>outcome</code>はそのうち最も悪いもので、<code>fail</code>、<code>cantTell</code>、<code>pass</code>、<code>notApplicable</code>の順です。<code>outcome</code>を読むレポーターは、スキャンをその1つのプロファイルとして数えます。<code>checkOutcome</code>は、規格が理由コードによってその検出結果を判定する前の、ルール自身の判定結果です。WCAGが確認を求めるだけの検出結果を規格が不合格にしても、それはWCAGの不合格ではないので、そのWCAGの達成基準はこちらを読みます。
				</li>
				<li>
					<strong>各検出箇所</strong>
					は1回だけ挙げられ、<code>verdicts</code>にそれぞれのプロファイルがその検出箇所をどう判定するかが入ります。それは検出箇所の層ですが、規格の集約がルールをその検出結果の理由コードで判定する場合は、その集約による判定になり（WCAGでは<code>cantTell</code>でも、規格が確信を持つものはそこでは<code>fail</code>です）、規格がそれを数えない場合は<code>notApplicable</code>になります。あるプロファイルでは不合格で、別のプロファイルでは問いになる検出結果は、その両方を示します。<code>occurrenceOutcome</code>は、チェックの判定結果と異なる場合、そのうち最も悪いものです。
				</li>
				<li>
					<strong><code>rulesResults</code></strong>
					：すべてのプロファイルの集約を、それぞれ1回ずつ、それを与えるプロファイルを示す<code>profiles</code>とともに含みます。2つのプロファイルが異なる判定結果で与える集約（たとえばWCAGの2つのバージョン）は、そのうち最も悪いものになります。
				</li>
				<li>
					<strong><code>profiles</code></strong>
					：実行されたプロファイルごとに<code>{"{ wcagVersion, wcagLevel, standards, rulesResults }"}</code>（<code>wcagLevel</code>はWCAGのレベルを対象にするプロファイルのみ）。<code>rulesResults</code>は、その各集約の判定結果をIDごとに示したもので、そのプロファイルだけをスキャンした場合に報告されたはずのものです。法律を示すプロファイルには、<code>engine.law</code>と同じ<code>law</code>もあります（実験的）。
				</li>
				<li>
					<strong><code>severity</code></strong>
					：プロファイルの列挙順にかかわらず、そのルールを不合格にするか問いにするプロファイルが与える重大度のうち最も高いものです。
				</li>
			</ul>
			<DataTable
				label="複数のプロファイルの結果を読むもの"
				rowKey="id"
				columns={[
					{ key: "reader", label: "読むもの", width: "22%" },
					{ key: "does", label: "複数のプロファイルで行うこと", wrap: true },
				]}
				rows={[
					{
						id: "gates",
						reader: "SARIF、JUnit",
						does: (
							<>
								<code>outcome</code>でゲートします。どれかのプロファイルが不合格ならビルドは失敗します。求めたのに実行されなかったプロファイルは、<code>allowProfilesNotRun</code>を指定しない限りエラーです（<a href="/results-reports/sarif-report/#options">SARIF</a>、<a href="/results-reports/junit-report/#options">JUnit</a>）。
							</>
						),
					},
					{
						id: "earl",
						reader: "EARL",
						does: (
							<>
								各ルールを、そのWCAGの達成基準に対して<code>checkOutcome</code>でアサートするので、規格の不合格がWCAGの不合格としてアサートされることはありません（<a href="/results-reports/earl-report/#several-profiles">EARLレポート</a>）。
							</>
						),
					},
					{
						id: "html",
						reader: "HTMLレポート",
						does: (
							<>
								見出しですべてのプロファイルの名前を挙げ、検出結果のカードに、そのWCAGの達成基準と並べて各プロファイルの判定を示します（<code>wai-aria-1.2: Fail</code>。<a href="/results-reports/html-report/">HTMLレポート</a>）。
							</>
						),
					},
					{
						id: "baselines",
						reader: "ベースライン",
						does: (
							<>
								ほかの結果と同じく、ルール、理由コード、マークアップで検出結果を照合します。検出結果は、その判定がどうであれ1つのエントリーです（<a href="/conformance/baseline/#several-profiles">ベースライン</a>）。
							</>
						),
					},
					{
						id: "bindings",
						reader: "バインディング",
						does: (
							<>
								<code>engineOptions</code>をそのまま渡します。フレームがある場合、各フレームの結果は統合されたものです。実行されなかったプロファイルは、<code>profile-not-run</code>のスキャンの抜けになります。
							</>
						),
					},
				]}
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
					"  verdicts?: { [profile: string]: string },  // a scan of several profiles only: each profile's outcome",
					"  checkOutcome?: string,   // a scan of several profiles only: the rule's own outcome, which its WCAG criteria read",
					'  policyOutcome?: "pass" | "fail" | "cantTell" | "notApplicable", // what the rule found, when the policy made it cantTell',
					'  confidence: "high" | "medium" | "low",',
					'  type: "automatic" | "manual",',
					"  occurrences: Occurrence[],",
					"  title: string,",
					"  description: string,",
					"  i18n: { titleKey: string, descriptionKey: string, variantOfTitleKey?: string } | null,",
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
					"  variantOf?: string,      // a pack's variant only: the id of the rule it runs at other settings; i18n.variantOfTitleKey is that rule's titleKey",
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
					'    coercedFrom: "fail",',
					'    by?: "errata"         // 2.0 or 2.1: their errata count the criterion as always satisfied',
					"  },",
					"  ancestorWalkLimit?: {    // present only when a failed element is nested deeper than the engine walks up from it",
					"    limit: number,         // 10000: the ancestors read, the element included",
					"    occurrences: number,   // the fail-tier occurrences made cantTell-tier",
					'    coercedFrom?: "fail"   // no fail-tier occurrence was left, so the outcome went from fail to cantTell',
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
					<strong><code>rollupIds</code></strong>は、この実行でこのルールをまとめている<code>rulesResults</code>内の複合ルールを列挙します。選択がそのルールを単独で指定したために報告された複合ルールも含みます。空のリストは、そのルールの検出結果がどの集約にも現れないことを意味するため、<code>rulesResults</code>だけを読む利用者には決して見えません。例えば<code>heading-order</code>はどのWCAGの集約にも属していません。
				</li>
				<li>
					<strong><code>wcagVersionScope</code></strong>：スキャンの対象WCAGバージョンによって、このルールの<code>fail</code>が<code>cantTell</code>に変わった場合にだけ含まれます。現時点では、SC 4.1.1（構文解析）に対応するルール（<code>duplicate-id</code>）がこれに当たります。2.2ではその達成基準が削除されたため、2.0と2.1では2023年の正誤表がHTMLとXMLについて常に満たされているものとして扱うためです（<code>by: "errata"</code>）。4.1.1の文言を残す規格のプロファイル（<code>en301549-v3.2.1</code>、または<code>keepsParsing</code>を持つパックのプロファイル）では変更されません。<code>removedSc</code>は該当する達成基準、<code>target</code>はスキャンのバージョン、<code>coercedFrom</code>はルール自身が報告した判定結果です。検出箇所はルール自身のもので、手を加えていません。捨てられたものは何もなく、変わったのは適合の判定だけです。それ以外の結果には含まれず、<code>error</code>で報告されることも<strong>ありません</strong>。何も問題は起きていないからです。<a href="/configuration/engine-options/#filtering-by-wcag-version">WCAGバージョンによる絞り込み</a>を参照してください。
				</li>
				<li>
					<strong><code>ancestorWalkLimit</code></strong>（core 1.16.0以降）：エンジンは、周囲の何かが要素を隠しているかどうかを判断するために、シャドウルートやスロットを通じて要素のすべての祖先を、10,000個まで読みます。これはどのブラウザーが描画するよりもはるかに深い階層です。それより深くネストした要素での不合格は確かではありません。エンジンが読まなかった要素がそれを隠しているかもしれないからです。そのため、その検出箇所は理由コードを保ったまま<code>cantTell</code>の層になり、<code>uncertainty.code: "not-computable"</code>と、要素が公開されているかどうかを問うエンジン独自の手順が付きます。ほかのすべての要素についてのルールの判定はそのままなので、<code>fail</code>の層の検出箇所が1つでも残っていれば判定結果は<code>fail</code>のままで、残っていなければ<code>cantTell</code>になります（<code>coercedFrom: "fail"</code>）。<code>wcagVersionScope</code>と同じく、<code>error</code>では報告されません。ルールは完了しているからです。
				</li>
				<li>
					<strong><code>data</code></strong>：判定結果にかかわらずページ全体について何かを報告するルールにだけ含まれます。現在、コアのルールでこれを使うものはありません。検出箇所の<code>data.details</code>と同じく、安定した契約ではありません。
				</li>
				<li id="margin">
					<strong><code>margin</code></strong>：カタログでmarginを宣言しているルール（<code>getChecksCatalog()[i].margin</code>、<code>{"{ measure, unit, limit, band? }"}</code>）で、少なくとも1つの要素がルールのしきい値を満たし、宣言に<code>band</code>があればその範囲内に入った場合にだけ含まれます。<code>band.relative</code>はしきい値に対する割合です。<code>contrast-minimum</code>、<code>contrast-enhanced</code>、<code>link-in-text-block</code>は<code>0.1</code>で、必要な比の10%以内の比についてだけmarginを報告します（4.5:1に対して4.5〜4.95、3:1に対して3〜3.3）。<code>band.absolute</code>は<code>unit</code>での量です。<code>target-size-minimum</code>は<code>6</code>で30 pxまでのターゲットだけを、<code>text-spacing-content-loss</code>は<code>8</code>でボックスの端から6 px以内の行だけを報告します。21:1のテキストや48 pxのボタンは何にも近くないので、それを示すmarginはありません。しきい値を満たしつつ最もしきい値に近づいた要素を示すので、4.5:1に対して4.52:1での<code>pass</code>や、テキストが切れるまであと0.4 pxでの<code>pass</code>を、余裕のある<code>pass</code>と区別できます。判定結果に添えられる情報で、検出結果ではありません。検出箇所を追加、削除、変更することはなく、ベースライン、SARIF、JUnit、EARLはこれを無視します。一部の要素が合格していれば、<code>fail</code>や<code>cantTell</code>の結果にも含まれます。<code>limit</code>は、値がしきい値に達する必要がある場合（コントラスト、サイズ）は<code>min</code>、しきい値を下回る必要がある場合（はみ出し）は<code>max</code>です。<code>headroom</code>はしきい値の内側にどれだけ余裕があるかを<code>unit</code>で表したもので、<code>min</code>なら<code>value - threshold</code>、<code>max</code>なら<code>threshold - value</code>となり、負になることはありません。<code>threshold</code>はその要素の判定に使われたしきい値で、要素ごとに異なることがあります（大きな文字なら3:1）。ピクセルは小数点以下1桁で示されます。CSSピクセルや、15pxのフォントの半分といったしきい値は小数になり、表示する側が人のために丸めるからです。比は丸めません。WCAGはコントラストを丸めないためです。同じ値の要素が複数あれば文書順で最初の要素が選ばれるので、同じページでは常に同じmarginになります。<code>measure</code>と<code>unit</code>はオープンな集合で、マイナーリリースで増えることがあります。<code>context</code>はルール固有で、<code>data.details</code>と同じく安定した契約ではありません。<code>getMargins(result)</code>は、結果に含まれるすべてのmarginを<code>ruleId</code>順に並べた<code>{"[{ ruleId, ...margin }]"}</code>として返します。フレームをまたぐ結果ではすべてのフレームのmarginを返し、子フレームのものには、そのフレームへのパスである<code>frame</code>が付きます。
				</li>
				<li>
					<strong><code>error</code></strong>：ルールが完了しなかった場合、またはルールが返したものの一部をエンジンが変更したり無視したりした場合に含まれます。例外を投げた（または結果でないものを返した）ルールは、必ず<code>outcome: "cantTell"</code>、<code>occurrences: []</code>、例外メッセージを設定した<code>error</code>として現れます。そのため、検出箇所がなく<code>error</code>を持つ<code>cantTell</code>が、完了しなかったルールの見分け方です。エンジンは、壊れたルール1つでスキャン全体をクラッシュさせることはありません。それ以外の場合、<code>error</code>はエンジンの注記を保持し、ルール自身が返した<code>error</code>があればその後に<code>|</code>でつなげます。注記の対象は、上記の手動ルールの強制変換、集合の外にある<code>outcome</code>や<code>severity</code>、metaと異なる<code>type</code>、オブジェクトでない検出箇所（除外されます）、ルールが返した<code>policyOutcome</code>や<code>ruleSeverity</code>（どちらもエンジンが設定するため採用されません）、閉じた集合の外にある<code>uncertainty.code</code>です。これらの結果は検出箇所を保持します。ルールは完了しているからです。（1.16.0より前は、200段階の祖先をたどる処理が届かずに止まった<code>fail</code>もここに記録されていました。前述の<code>ancestorWalkLimit</code>を参照してください。）
				</li>
				<li>
					<strong><code>policyOutcome</code></strong>：ポリシーの<code>allowedOutcomes</code>が、ルールの見つけた判定結果を許可しない場合に含まれます。その場合、結果は<code>cantTell</code>になり、ルール自身の判定結果がここに入り、<code>error</code>は付きません。そのため、レポーターがこれを完了しなかったルールとして読むことはありません。
				</li>
				<li>
					各結果の<strong><code>engineOptions</code></strong>は、渡したものそのままではなく、<em>解決済みの</em>オプションオブジェクト（ロケールやコントラストのデフォルトを適用した後のもの）です。あるルールが実際に何を受け取ったか、特に解決された<code>locale</code>と<code>contrast.mode</code>/<code>contrast.rootCanvasFallback</code>を確認するのに役立ちます。呼び出し側が指定しなければ<code>contrast.rootCanvasFallback</code>は白で、<code>contrast.rootCanvasFallbackSet</code>がどちらかを示します。呼び出し側が指定した色なら<code>true</code>、デフォルトなら<code>false</code>です。スキャンが翻訳に使った辞書である<code>messages</code>（ブラウザー用バンドルのロケール用の別ファイル、または独自の文字列）は含まれません。これらは設定ではなくデータで、結果ごとにコピーを持たせるとスキャンが数十メガバイトになっていたためです。どの辞書が使われたかは<code>engine.locale</code>で分かります。さらに3つのオプションは、ルールが見たとおりの形で含まれます。結果を<code>JSON.stringify</code>や<code>structuredClone</code>（<code>postMessage</code>）で運べる単純なデータに保つためです。<code>probes</code>はルールが読む上限付きのコピーとして、<code>customRules</code>は関数を除いた<code>{"[{ id }]"}</code>（IDを持つカスタムルールごとに1件）として、<code>styleSheetTexts</code>はテキストを除いた<code>{"[{ href }]"}</code>（渡したシートごとに1件）として含まれます。ページのCSSを結果ごとに繰り返すと、ルールの数だけ増えていたためです。
				</li>
			</ul>

			<h2 id="occurrence">検出箇所（<code>occurrences[i]</code>）</h2>
			<p>
				<code>fail</code>には必ず1つ以上あります。要素を示さないカスタムルールの<code>fail</code>には、ドキュメント要素に1つ付きます（<code>selector: "html"</code>、理由コード<code>FAIL_WITHOUT_OCCURRENCE</code>）。通常は<code>outcome</code>が<code>fail</code>または<code>cantTell</code>のときにだけ含まれます。このエンジンは合格した要素を列挙せず、フラグを立てた要素だけを報告するため、<code>pass</code>の結果は<code>occurrences: []</code>になります。例外はコントラストのルールで、その<code>pass</code>には、スキャンについて述べる検出箇所（対象となり計算できたテキストの量）が<code>selector</code>を空にして1つ付きます。テキストがまったくない<code>pass</code>と、テキストの多いページでの<code>pass</code>を区別できるようにするためです。
			</p>
			<p>
				coreの<code>notApplicable</code>は検出箇所を挙げません。背景を計算できるテキストが1つもなかったためにコントラストのルールが<code>notApplicable</code>になる場合は、見たテキストの量を結果自体の<code>data.details</code>（<code>eligibleTextCount</code>、<code>computableTextCount</code>）で示し、<code>contrast-computable</code>は計測できなかったテキストをそれぞれ<code>cantTell</code>として報告します。「チェックしたが、フラグを立てるものはなかった」と「チェックできなかった」の違いを、このエンジンは隠さずに報告します。判定対象が何もなかったパックのルールやカスタムルールは、今でもその理由を示す検出箇所を1つ付けることがあります。このような検出箇所は要素ではなくスキャンについて述べるものなので、<code>selector</code>は空です。<strong><code>outcome</code>を先に確認せずに、<code>occurrences.length</code>を違反の件数として読まないでください。</strong>
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
					"  verdicts?: { [profile: string]: string },  // a scan of several profiles only",
					"  uncertainty?: {          // present only on a cantTell-tier occurrence",
					'    code: "not-computable" | "runtime-dependent" | "spec-only"',
					'        | "equivalence-unknown" | "judgement-required" | "out-of-scope",',
					"    needed?: string,       // what would settle the question",
					"    evidence?: object      // what the rule did establish, rule-specific",
					"  },",
					"  lean?: {                 // present only on a cantTell-tier occurrence, and only with evidence",
					'    toward: "pass" | "fail",',
					"    why: string,           // localized: what in the page points that way",
					"    signals: { signal: string, value: string | number | boolean | null }[],",
					"    caution?: string,      // localized: what could make it wrong",
					"    measured?: { agreed: number, cases: number, corpus?: string, coreVersion?: string },",
					"    i18n?: { whyKey?: string, cautionKey?: string, params?: object }",
					"  },",
					"  howToCheck?: {           // present only on a cantTell-tier occurrence, when the rule says",
					"    steps: string[],       // localized: what a person does, in order",
					"    passWhen: string,      // localized: what they see if it passes",
					"    failWhen: string       // localized: what they see if it fails",
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

			<h3 id="leans">傾き</h3>
			<p>
				<code>cantTell</code>でも、どちらか一方を指していることがあります。ページがその根拠を示している場合、<code>lean</code>がどちらかを示します。<code>toward</code>はその根拠から可能性が高い答え、<code>why</code>は根拠が何か、<code>signals</code>はルールが読み取った事実の一覧で、それぞれケバブケースの名前と単純な値からなるため、ツールはそれを表示したり重み付けしたりできます。<code>caution</code>は、<code>uncertainty.needed</code>から明らかでない場合に、傾きが誤りになりうる要因を述べます。<strong>判定結果は<code>cantTell</code>のままです</strong>。傾きは助言であって判定ではなく、判定結果や層を読むものは何も変わりません。<a href={`${core}/docs/LEANS.md`}><code>LEANS.md</code></a>は、レポートを読む人やツールを作る人のためのガイドで、どの検出結果がなぜ傾くのか、傾きをどう測定するのか、どこまで信頼できるのかを説明しています。
			</p>
			<p>
				<code>lean</code>は、ルールに根拠がある場合にだけ含まれます。<strong>ないこと自体も情報です</strong>。これは人にしか判断できないということです。<code>uncertainty</code>と同じく<code>cantTell</code>の層の検出箇所にだけ含まれます。エンジンは判定済みの検出箇所に付いたものを取り除き、形の正しくないもの（<code>pass</code>と<code>fail</code>以外の<code>toward</code>、または<code>why</code>がないもの）も検出結果には手を付けずに取り除きます。<code>measured</code>は、答えの分かっている5件以上のケースで傾きが数えられると現れます。正しかった回数（<code>agreed</code>）、ケースの数（<code>cases</code>）、ケースの出典となったコーパス（<code>corpus</code>、読み取った日付付き）、数えたコアのバージョン（<code>coreVersion</code>）です。数はW3C ACT Rulesのテストケースから、ルール、理由コード、方向ごとに数えたもので、エンジンが持っているため、どの入口から得た結果にも含まれます。数えられていない傾きや、ケースが5件に満たない傾きには含まれません。信頼度の数値はありません。現時点ではまだどの傾きにもありません。jsdomでの最初の集計では9件の傾きが見つかりましたが、5件のケースに達したものはありませんでした。
			</p>
			<p>
				<code>why</code>と<code>caution</code>はスキャンのロケールで書かれています。<code>i18n</code>には、検出箇所の<code>i18n</code>が<code>summary</code>と<code>hint</code>について持つのと同じように、それらのキーとパラメーターが入ります。エンジン自身が傾きを付ける検出結果が1つあります。対象のWCAGバージョンで削除された達成基準、または2023年の正誤表で満たされているとされる達成基準だけに対応するルールは、<code>out-of-scope</code>の不確実性とともに<code>pass</code>に傾きます。
			</p>
			<p>
				<code>@surea11y/core</code>の<code>reviewGroupOf(check, occurrence)</code>は、レビューで検出箇所がどこに入るかを示します。<code>'fail'</code>、<code>'leanFail'</code>、<code>'leanPass'</code>、<code>'open'</code>（人にしか判断できない）のいずれかで、<a href="/results-reports/html-report/">HTMLレポート</a>のグループと同じです。<code>leaningFailures(result, {"{ wcagOnly }"})</code>は、不適合に傾く検出結果、つまり<code>leanFailAs</code>によるゲートが数える検出結果を列挙します（<a href="/results-reports/junit-report/#options">JUnit</a>、<a href="/results-reports/sarif-report/#options">SARIF</a>）。
			</p>
			<p>
				新しい傾きはマイナーリリースでルールごとに追加され、測定で誤りが多すぎると分かった傾きは削除されることがあります。傾きは、あるかないかが変わりうる助言として扱い、<strong>検出結果の同一性の一部として扱わないでください</strong>。フィンガープリントには含まれません。
			</p>
			<p>
				規格の対応付けは検出結果をその<code>data.details</code>で振り分けますが（<a href="/configuration/packs/#sending-findings-to-requirements">パック</a>を参照）、傾きはその外にあります。そのため、<code>skip-link</code>は傾きの向きをそこにも写します（core 1.16.0、1.18.0まで実験的）。<code>data.details.lean</code>は<code>fail</code>または<code>pass</code>で、<code>lean.toward</code>と同じです。検出結果に傾きがない場合は含まれません。
			</p>

			<h3 id="how-to-check">確認方法</h3>
			<p>
				<code>cantTell</code>は問いを人に渡します。<code>howToCheck</code>は、それにどう答えるかを示します。<code>steps</code>は、検出結果が示す要素から始まる、順番に行う少数の操作（「Tab to the element.」「Watch whether the focus indicator stays on it.」）で、<code>passWhen</code>と<code>failWhen</code>は、合格の場合と不合格の場合に何が見えるかを、不合格となる達成基準の名前とともに示します。コアは、<code>cantTell</code>を報告しうるすべてのコアのルールの各理由コードについてこれを持っており、<a href="/conformance/procedures/">各達成基準を手作業で評価するためのテスト手順</a>と一緒に管理しています（確認手順の辞書<code>{"@surea11y/core/review/<locale>"}</code>として公開）。<code>cantTell</code>の層の各検出箇所には、そのコードのものがスキャンのロケールで付きます。バリアントの検出結果（<code>variantOf</code>）は、自身のものがなければベースのルールのものを受け取ります。パックのルールも英語で書くことができ、そのパックの辞書がそれを翻訳することもできます（<a href="/configuration/packs/#review-steps">パック</a>を参照）。その検出結果は、パックが分かっている場合、つまり<code>engineOptions.packs</code>付きの<code>runDomRulesInPage</code>と<code>addHowToCheck(result, {"{ packs }"})</code>で受け取ります。判定済みの検出箇所、カスタムルールの検出結果、オーバーライド（<code>overriddenBuiltinIds</code>にあるカスタムルールまたはパックのルール）の検出結果、何も書いていないパックのルールの検出結果には含まれません。
			</p>
			<p>
				<strong>手順は、ページ内のエンジンではなく、スキャンの後にNodeで追加されます</strong>。エンジンはスキャンが開くすべてのページとフレームに注入されるため、どのルールも読まない何千もの文を持つ必要がないからです。<code>runDomRulesInPage</code>は自分の結果に追加します。ページ内で実行した<code>runa11yCoreInPage</code>の結果（バインディングや拡張機能のもの）には含まれません。<code>addHowToCheck(result)</code>は手順を加えたコピーを返し、<code>howToCheckFor(ruleId, reasonCode, locale)</code>は1つの検出結果の手順を返します。どちらもコアのレビュー用辞書をディスクから読むため、Nodeが必要です。コードがブラウザーで動くバインディング（Cypress）は、<code>{"@surea11y/core/review/<locale>"}</code>からインポートした辞書を使って<code>@surea11y/core/how-to-check</code>の<code>applyHowToCheck(result, {"{ en, fr }"})</code>を呼び、同じ手順を得ます（バインディングでの方法は<a href={`${core}/docs/BINDING_AUTHORS_GUIDE.md`}><code>BINDING_AUTHORS_GUIDE.md</code></a>にあります）。<a href="/results-reports/html-report/">HTMLレポート</a>（<code>renderHtmlReport</code>）は、手順を持たない結果にNodeで追加します。ブラウザー（<code>surea11y.report.js</code>）では、結果が持っている手順を表示します。スキャンとは別の言語で結果を表示するツールは、<code>addHowToCheck</code>または<code>applyHowToCheck</code>に<code>{"{ locale }"}</code>を渡します（<code>{"addHowToCheck(result, { locale: 'de' })"}</code>、または優先度の高い順のロケールのリスト。<code>renderHtmlReport</code>は受け取りません）。手順は、すでにあるものも含めてその言語で示され、そのロケールにない手順は英語になります。
			</p>
			<p>
				手順は、ブラウザー、その開発者ツール（アクセシビリティツリー）、キーボード、場合によってはスクリーンリーダーを前提としています。問いに決着をつけるには何が必要かを1文で述べる<code>uncertainty.needed</code>と違い、どう決着をつけるかを述べます。傾きと同じく助言であって検出結果の同一性の一部ではなく、文言はどのリリースでも改善されることがあります。
			</p>
			<p id="steps-that-name-the-case">
				<strong>ケースを名指しする手順。</strong>core 1.15.0以降、手順、<code>passWhen</code>、<code>failWhen</code>は、その検出結果が見つけたものを名指しできます。<code>{"{{name|text}}"}</code>は、検出結果の<code>i18n.params</code>または<code>data.details</code>にある<code>name</code>の値として読まれ、値がない場合は<code>text</code>として読まれます。そのため、「Open the popup, which aria-haspopup says is a {"{{expectedRole|menu}}"}」という手順は、詳細が<code>expectedRole: 'listbox'</code>を示す検出結果では「…is a listbox」と読まれ、検出結果のない<code>howToCheckFor</code>やテスト手順のページでは「…is a menu」と読まれます。値は最大120文字の1行で、ページから取られたものなので、HTMLレポートと同じくテキストとして表示してください。<code>howToCheckFor(ruleId, code, locale, {"{ values }"})</code>は、与えられた値でそれらを埋めます。
			</p>
			<p>
				<strong>規格自身の言葉。</strong>パックの規格は、コアのルールのコードに対して独自の手順を与えることができます（<code>standard.review</code>）。その規格のプロファイルだけが問いにする検出結果は、コアの手順の代わりにそれを英語で読むので、WAI-ARIAのスキャンの問いはWCAG 4.1.2ではなくWAI-ARIAを名指しします。複数のプロファイルでのスキャンでWCAGのプロファイルも問いにする場合、その検出結果はコアの手順を読みます。
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
					"      restatesWcag?: string[],  // a standard's rollup that restates WCAG criteria (applicability: 'wcag'): those criteria",
					"      partial?: true,           // a standard's requirement its rules don't check in full (partial: true)",
					"      contributors: Array<{ testId: string, outcome: string, severity?: string | null, custom?: true, notSelected?: true,",
					"                            byReasonCode?: true, checkOutcome?: string, requirements?: string[] }>,",
					"      metrics: { failCount, cantTellCount, notApplicableCount, passCount, missingCount }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				集約の優先順位（決定論的で、この順に適用されます）：<strong>構成ルールに<code>fail</code>が1つでもあれば、複合ルールは<code>fail</code></strong>。そうでなく<strong><code>cantTell</code>が1つでもある（または構成ルールのいずれかがまったく実行されなかった、つまり<code>missingCount &gt; 0</code>）なら、複合ルールは<code>cantTell</code></strong>。そうでなく<strong>構成ルールがすべて<code>notApplicable</code>なら、複合ルールは<code>notApplicable</code></strong>。ただし、ルールが達成基準の当てはまるすべてのケースを見つける場合に限り、それ以外は<code>cantTell</code>（<code>partialCoverage</code>）です。それ以外は<strong><code>pass</code></strong>です。ただし、ルールが達成基準の求めることをすべてチェックする場合に限り、それ以外は<code>cantTell</code>（<code>partialCheck</code>）です。<strong>すべてをチェックするとされたWCAGの達成基準はまだないため、現時点でWCAGの集約が<code>pass</code>になることはありません。</strong>これが全体としての適合表明にとって何を意味するかは<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。
			</p>
			<p>
				規格独自の集約は、ルールを全体としてではなく検出結果ごとに判断することがあります（<a href="/configuration/packs/">パック</a>を参照）。その場合、構成ルールは<code>byReasonCode: true</code>を示し、<code>outcome</code>はこの集約でのルールの判定結果（検出結果がすべて別の集約に属する<code>fail</code>は、ここでは<code>pass</code>）、<code>checkOutcome</code>はルール自身の判定結果です。集約に数えられる検出結果が、その集約のどの要件に属するかを示している場合、<code>requirements</code>がそれらを列挙し、集約の<code>meta.normativeMappings</code>は、そのルールがチェックするすべての要件ではなく、それらの要件を示します。
			</p>
			<p>
				WCAGの集約のルールは、それ自身のリストに加えて、実行されて（<code>meta.wcagSc</code>または<code>meta.normativeMappings</code>のWCAGのエントリーを通じて）その達成基準のいずれかに対応する<code>engineOptions.customRules</code>のすべてのルールです。それらは貢献したルールの中で<code>custom: true</code>が付き、<code>customChecksIds</code>に列挙されるため、カスタムルールが判定結果を決めたことが読み手に分かります。規格独自の集約は、それ自身のリストを保ちます。
			</p>
			<p id="partly-checked">
				<strong>一部だけチェックされた達成基準。</strong>達成基準ではなくルールを指定するスキャン（<code>{"includeRuleIds: ['link-name-present']"}</code>）は、選択がその達成基準自体を選んでいない場合でも、それらのルールがチェックする達成基準の集約を受け取ります（<a href="/configuration/engine-options/#which-criteria-a-scan-reports">スキャンが報告する達成基準</a>を参照）。上の優先順位はほかと同じようにこれを決めるため、<code>fail</code>のルールがあれば達成基準も<code>fail</code>になり、スキャンが選ばなかったルールがあると<code>pass</code>にはなりません。そうしたルールはそれぞれ<code>outcome: "missing"</code>と<code>notSelected: true</code>を持つ構成ルールで、これまでどおり<code>missingCount</code>に数えられます。それらが原因で集約が<code>cantTell</code>になる場合、その<code>reasonCode</code>は<code>composite.rollup.cantTell.notSelectedChild</code>で、<a href="/results-reports/html-report/">HTMLレポート</a>には「一部のみ確認」と、選択されなかったチェックの数が表示されます。<code>composite.rollup.cantTell.missingChild</code>は引き続き、プロファイルが除外したルール（<code>engine.profileExcludes</code>）のように、別の理由で実行されなかったルールを意味し、それに<code>notSelected</code>が付くことはありません。
			</p>
			<DataTable
				label="集約の理由コード"
				rowKey="id"
				columns={[
					{ key: "code", label: "reasonCode", width: "40%" },
					{ key: "outcome", label: "判定結果", width: "16%" },
					{ key: "when", label: "条件", wrap: true },
				]}
				rows={rollupReasonRows}
			/>

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
					<code>severity</code>：<code>minor</code> &lt; <code>moderate</code> &lt; <code>serious</code> &lt; <code>critical</code>。ユーザーへの影響についてのルール作成者の評価で、<code>confidence</code>とは独立しています。プロファイルはルールに別の重大度を与えることができます（規格やパックのチェックリストにあるプロファイルの<code>severity</code>）。その場合、結果にはプロファイルの重大度が表示され、ルール自身の重大度は<code>ruleSeverity</code>として保持され（このときだけ含まれます）、集約はプロファイルの重大度を使います。複数のプロファイルでのスキャンでは、プロファイルの列挙順にかかわらず、そのルールを不合格にするか問いにするプロファイルが与える重大度のうち最も高いもの（どれもそうしない場合はすべてのうち最も高いもの）になります。
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
					'    "version": "1.14.0",',
					'    "schemaVersion": "1.0.0",',
					'    "locale": { "requested": "en", "resolved": "en", "reason": "ok" },',
					'    "wcagVersion": "2.2",',
					'    "environment": { "layout": false }',
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
					'          "hint": "Add an alt attribute that says what the image shows, or alt=\\"\\" if the image is purely decorative.",',
					'          "data": {',
					'            "details": { "reasonCode": "TEXT_ALTERNATIVE_MISSING" },',
					'            "visibilityFilter": { "eligible": true, "reasons": [], "targetSet": "acc", "accEligible": true }',
					"          }",
					"        }",
					"      ]",
					"    }",
					"  ],",
					'  "rulesResults": [',
					"    {",
					'      "ruleId": "wcag-1.1.1-non-text-content",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "title": "Non-text content: text alternatives",',
					'      "occurrences": [],',
					'      "data": {',
					'        "details": {',
					'          "reasonCode": "composite.rollup.fail.anyFail",',
					'          "checksIds": ["area-alt-present", "img-alt-decorative", "img-alt-quality", "..."],',
					'          "contributors": [',
					'            { "testId": "area-alt-present", "outcome": "missing", "notSelected": true },',
					'            "...",',
					'            { "testId": "img-alt-present", "outcome": "fail", "severity": "serious" },',
					'            "..."',
					"          ],",
					'          "metrics": { "failCount": 1, "cantTellCount": 0, "notApplicableCount": 0, "passCount": 0, "missingCount": 20 }',
					"        }",
					"      }",
					"    },",
					"    {",
					'      "ruleId": "wcag-4.1.2-name",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "title": "Name, role, value: accessible name",',
					'      "occurrences": [],',
					'      "data": {',
					'        "details": {',
					'          "reasonCode": "composite.rollup.fail.anyFail",',
					'          "metrics": { "failCount": 1, "cantTellCount": 0, "notApplicableCount": 0, "passCount": 0, "missingCount": 23 }',
					"        }",
					"      }",
					"    }",
					"  ],",
'  "overriddenBuiltinIds": [],',
					'  "skippedCustomRules": []',
					"}",
				]}
			/>
			<p>
				（読みやすさのために省略しています。実際の結果では、上に示した完全な形のとおり、すべてのエントリに<code>title</code>/<code>description</code>/<code>i18n</code>/<code>meta</code>/<code>engineOptions</code>/<code>schemaVersion</code>も含まれ、各集約のすべての構成ルールも含まれます。<code>rulesResults</code>には、指定した2つのルールがチェックする達成基準が入ります。<code>img-alt-present</code>の1.1.1と<code>button-name-present</code>の4.1.2で、どちらもそのルールが<code>fail</code>なので<code>fail</code>です。それらの達成基準のほかのルールは選ばれていないため、<code>notSelected: true</code>付きの<code>missing</code>になります。<code>fail</code>のルールがなければ、その達成基準は<code>cantTell</code>（<code>notSelectedChild</code>）、つまり<a href="#partly-checked">一部だけチェックされた</a>状態になります。各チェック結果の<code>rollupIds</code>は、その集約を示します。）
			</p>
		</>
	);
}
