import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const remedyRows = [
	{
		id: "interaction",
		situation: "クリック、ホバー、データの読み込みの後にしか現れないコンテンツがある",
		remedy: "自分でページをその状態にしてからスキャンします。重要な状態ごとにスキャンしてください。",
	},
	{
		id: "layout",
		situation: "チェックにレイアウトが必要（ターゲットサイズ、テキスト間隔、テキストの下に描画されているものに対するコントラスト）",
		remedy: (
			<>
				本物のブラウザーでスキャンします。jsdomにはレイアウトがないため（結果の<code>engine.environment.layout</code>は<code>false</code>）、これらのルールはそこでは計測できる範囲が狭まるか、<code>notApplicable</code>を報告します。詳しくは以下の各節のとおりです。
			</>
		),
	},
	{
		id: "keyboard",
		situation: "キーボードトラップのような、キーボード操作に関する要件がある",
		remedy: "キーボードでテストします。どのスキャンもこれをカバーしません。",
	},
	{
		id: "canttell",
		situation: (
			<>
				結果が<code>cantTell</code>である
			</>
		),
		remedy: (
			<>
				出現箇所の<code>howToCheck</code>の手順に従って、人が判断します。<code>uncertainty</code>は何が足りなかったかを、<code>lean</code>はページの手がかりがどちらを示しているかを表します（<a href="/results-reports/output-schema/#how-to-check">出力スキーマ</a>を参照）。
			</>
		),
	},
	{
		id: "responsive",
		situation: "ページがレスポンシブである",
		remedy: "必要な幅ごとにスキャンします。",
	},
	{
		id: "differ",
		situation: "同じページの2回の実行結果が異なる",
		remedy: (
			<>
				<code>engine.version</code>と<code>engine.environment</code>（ビューポート、まだ読み込み中のフォントや画像）を比べ、スキャンの間にページを再読み込みします。
			</>
		),
	},
	{
		id: "no-failures",
		situation: "スキャンで不合格が報告されない",
		remedy: (
			<>
				それは適合性の主張ではありません。<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。
			</>
		),
	},
];

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				エンジンが評価しないもの、スキャンを実行する場所（jsdom、ブラウザー、ページ自身のスクリプト）に左右されるもの、人によるレビューが必要なものをまとめています。設計上の判断である項目には、それぞれ理由を添えています。どの項目も、スキャンで確定できないことと、対処法があればその対処法を示します。問題のない結果を信頼する前にお読みください。
			</p>

			<h2>対処法</h2>
			<DataTable
				label="制限ごとの対処法"
				rowKey="id"
				columns={[
					{ key: "situation", label: "こういうとき", width: "40%" },
					{ key: "remedy", label: "こうします" },
				]}
				rows={remedyRows}
			/>
			<p>理由は以下の各節で説明します。</p>

			<h2 id="outside-what-one-scan-can-see">1回のスキャンで見えないもの</h2>
			<p>
				スキャンは、ページを1つの時点、1つの状態、1つのビューポートで読みます。読むのはDOM、その計算済みスタイル、そして本物のブラウザーではレイアウトです。人がするようにページを使うことはありません。キーボードで移動したり、メニューを開いたり、データを待ったり、サイズを変えたりはしません（ブラウザーでは、いくつかのルールが確認の間だけ要素にフォーカスを当てたりスタイルシートを追加したりして、元に戻します。次の節を参照してください）。ここに挙げる項目には、そうした時間をかけた操作が必要なので、ルールを追加しても解決できません。操作のテストか人が必要です。
			</p>
			<ul>
				<li>
					<strong>キーボードトラップの検出</strong>
					（WCAG 2.1.2）：ページ内でフォーカスを動かし、どこに移るかを観察する必要があり、DOMを1度読むだけではできません。実現できそうな手法は検討済みですが（
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#keyboard-trap-detection-scoping-notes`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					のキーボードトラップの節を参照）、実装はしていません。スキャンはユーザー操作や、それによって生じる状態をたどらず、ページを一時的に変更するチェックのどれも、トラップの検出のようにページ内でフォーカスを動かしていくことはないからです。それまでの間、静的なマークアップで代わりになるものはありません。
				</li>
				<li>
					<strong>拡大時のリフロー／切り取り</strong>
					（WCAG 1.4.10）：320px相当のビューポートをシミュレートしたうえで、実際のレイアウト計測（
					<code>clientWidth</code>
					／
					<code>scrollWidth</code>
					）が必要です。このエンジンのほかの箇所にあるCSS宣言ベースのヒューリスティックとは違い、「400%に拡大したときにコンテンツが切れるか」を静的なマークアップから推し量る手がかりはまったくありません。
				</li>
				<li>
					<strong>動的な状態／操作後の状態</strong>
					：クリック、ホバー、非同期のデータ読み込みの後にしか存在しないもの（モーダルの中身、ドロップダウンの選択肢、フォームのバリデーションエラーのメッセージ）は、ページの
					<em>現在の</em>
					DOMをスキャンしても見えません。フレームワークがそれを最初からレンダリングしていれば（画面外や
					<code>hidden</code>
					でも）スキャンできます。操作後にしか存在しない場合は、スキャン前に自分でその操作を行わない限りスキャンできません（例：ボタンをクリックし、
					<em>その後で</em>
					スキャンする）。開いた状態をスキャンして確認できるのはその中身であって、キーボードやスクリーンリーダーの利用者がそれを開き、使い、閉じられるかどうかではありません。
				</li>
			</ul>

			<h2>環境による制限：実行方法によって変わるもの</h2>
			<ul>
				<li>
					<strong>jsdom（Node上で動き、本物のブラウザーを使わない）にはCSSのレイアウトエンジンがありません。</strong>
					実際のジオメトリが必要なルール、特に
					<code>target-size-minimum</code>
					（WCAG 2.5.8。実際の
					<code>getBoundingClientRect()</code>
					が必要）は、素のjsdomでは推測せずに
					<code>notApplicable</code>
					を報告します。これらのルールで実際の結果を得るには、本物のブラウザー上で実行してください（Puppeteer／Playwright。
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
					のパターン2を参照）。
				</li>
				<li>
					<strong>
						テキストが折り返すかどうかはレイアウトが必要なので、折り返さないテキストに対するテキスト間隔の検出結果はレビュー対象として報告されます。
					</strong>
					WCAG 1.4.12とその元になっているACTルールは、ソフトな折り返し位置を含むテキストにだけ適用されますが、静的なスキャンではそれを確定できません。
					<code>avoid-inline-spacing</code>
					はデフォルトでテキストが折り返すものとして扱うので、基準値を下回る値を強制するふつうのケースは引き続きfailになります。レイアウトなしでも
					<em>見て取れる</em>
					理由で折り返しがありえない場合（テキストの折り返しが禁止されている、横スクロールする祖先の中にある固定幅の要素など）は、代わりに
					<code>cantTell</code>
					を報告します。それ以外の理由で折り返さないテキストは、引き続き失敗として報告されます。
				</li>
				<li>
					<strong>エンジンはページ自身のJavaScriptの組み込みオブジェクトの上で動作します。</strong>
					ページのスクリプトが、エンジンが依存する組み込みオブジェクト（<code>Array.prototype.filter</code>、<code>Map</code>、<code>JSON.stringify</code>、<code>String.prototype.toLowerCase</code>など）を壊している場合、もっともらしく見えて誤っている結果を返すのではなく、それぞれを示す<code>PAGE_BUILTINS_BROKEN</code>というコードのエラーでスキャンを止めます。バンドルを注入する前に壊されたもの（<code>Object.keys</code>）は、バンドルの読み込みを止めます。<code>Object.prototype</code>に<code>then</code>を追加するページは、ほかのページと同じようにスキャンされます。ページが置き換えたDOMのメソッド（<code>getComputedStyle</code>、<code>querySelectorAll</code>、<code>getBoundingClientRect</code>）は確認しません。ルールはそれらが返すものを読みます。
				</li>
				<li>
					<strong>256階層より深く入れ子になったコンテンツからは、名前を求めません。</strong>
					たどる処理はそこで止まります（Chromeは100階層下のコンテンツから名前を与えません）。そのため、名前がそれより深い場所にしかない要素については、<a href="/rules/button-name-present/"><code>button-name-present</code></a>、<a href="/rules/link-name-present/"><code>link-name-present</code></a>、メニュー項目、オプション、summary、タブ、ツールチップ、ツリー項目の名前のルール、そして<a href="/rules/empty-heading/"><code>empty-heading</code></a>が確認を求めます（<code>name_contentTooDeep</code>）。コンテンツから名前を求めるほかのルールは、そうしたコンテンツを空として読みます。
				</li>
				<li>
					<strong>閉じたシャドウルート内のコンテンツは読み取れません。</strong>
					<code>{"attachShadow({ mode: 'closed' })"}</code>や宣言的な<code>shadowrootmode="closed"</code>の内側にはどのスクリプトも届かないため、ブラウザーがそこから求める名前をエンジンは見られません。<code>button-name-present</code>と<code>link-name-present</code>、そしてメニュー項目、オプション、タブ、ツリー項目、summary、ツールチップの名前のルールは、描画はされるが読み取れるコンテンツを示さないカスタム要素から名前が来ている可能性がある要素について、不合格にする代わりに確認を求めます。組み込み要素（<code>&lt;span&gt;</code>）上の閉じたルートは、CSSで描いたアイコンのような空のものと見分けがつかないため、その上にあるボタンは引き続き不合格になります。そうしたコンポーネントが何を公開しているかは、スクリーンリーダーなどを使って人が確認してください。
				</li>
				<li>
					<strong>カスタム要素が<code>ElementInternals</code>を通じて設定した名前や状態は読み取れません。</strong>
					<code>{"this.attachInternals().ariaLabel = 'Save'"}</code>はどのブラウザーでも要素に名前を付けますが、どのスクリプトもそれを読み戻せません。コンポーネントがinternalsをプロパティ（<code>_internals</code>、<code>internals</code>、<code>internals_</code>、<code>__internals</code>）に保持している場合、エンジンはそこから読み取り、その内容に従って要素を合格または不合格にします。名前（または必須の状態）のないほかの定義済みカスタム要素については、名前のルールと<a href="/rules/aria-required-attr/"><code>aria-required-attr</code></a>が、不合格にする代わりに確認を求めます（<code>name_internals</code>、<code>state_internals</code>）。それらはブラウザーのアクセシビリティツリーで確認するか、ページのスクリプトが動く前に、オプトインのinternalsフックをインストールしてください。各バインディング（<a href="/getting-started/">はじめに</a>を参照）とtest-matchersの<code>installInternalsHook()</code>、自分で用意したページならcoreの<code>internalsHookScript()</code>を使います（インストールする場所は<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}><code>INTEGRATION.md</code></a>を参照してください）。フックはスキャンのためにすべての要素のinternalsを記録するので、internalsを一度も付けていない要素も判別できます。internalsだけで設定したロール（<code>internals.role</code>）は、internalsを読める場所（プロパティかフック）であれば、要素のデフォルトのロールとして読み取ります。フックなしでプライベートフィールドに保持されている場合は見えず、その要素について確認も求めません。ほぼすべてのコンポーネントがそうしたロールを持ちうるからです。組み込み要素と、定義されていないカスタム要素は、これまでどおりに判定します。
				</li>
				<li>
					<strong>スクリプトで追加したイベントリスナーは列挙できません。</strong>
					<code>addEventListener</code>で追加したリスナーや、プロパティとして設定したリスナー（<code>el.onclick = fn</code>）はマークアップに何も残さず、どのスクリプトも読み戻せません。そのため、キーボードのルール（<a href="/rules/click-handler-keyboard-operable/"><code>click-handler-keyboard-operable</code></a>、<a href="/rules/mouse-only-event-handlers/"><code>mouse-only-event-handlers</code></a>）はインラインのハンドラー属性だけを判定します。スクリプトでクリックリスナーを付けたフォーカス可能な<code>role="button"</code>は報告されません（フォーカスを受け取れないものについては、それでも<a href="/rules/widget-keyboard-focusable/"><code>widget-keyboard-focusable</code></a>が確認を求めます）。スクリプトで追加したキーリスナーは、インラインの<code>onclick</code>を正当化できません。<code>password-paste-enabled</code>は、インラインの<code>onpaste</code>が取り消したテキストを、スクリプトで追加した貼り付けリスナーが戻すかどうかを判断できません。ページのスクリプトが動く前に、オプトインのリスナーフック（<code>listenerHookScript()</code>）をインストールしてください。ルールはフックが記録したリスナーも判定するようになり、キーリスナーが1つも見られなかった場合は、EnterキーとSpaceキーで操作できないコントロールを不合格にします。フレームワークがルート要素に付けるクリックリスナーは、何も指定していない要素のためのものなので、フックがあってもそれらの要素はマークアップで判定されます。インストールする場所は、GitHub上の<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}><code>INTEGRATION.md</code></a>を参照してください。
				</li>
				<li>
					<strong>ライブリージョンがどう埋められたかは、後からは見えません。</strong>
					ステータスメッセージは、支援技術が届く状態でライブリージョンが変化したときに読み上げられます（4.1.3）が、スキャンが見るのはある時点のページです。何も追加しなければ、<a href="/rules/live-region-announcements/"><code>live-region-announcements</code></a>が判定するのはそこにあるものだけです。<code>aria-hidden</code>や<code>inert</code>で支援技術から隠されたライブリージョン、開いているモーダルな<code>&lt;dialog&gt;</code>の背後にあるライブリージョン、<code>aria-busy</code>のまま残されたライブリージョンです。オプトインのライブリージョンフック（<code>liveRegionHookScript()</code>）をインストールすると、ページが最初からテキストを入れて追加したリージョンや、表示と同時に埋めたリージョンについても確認を求め、<code>getAnnouncements()</code>はページが読み上げ用に提供したものを列挙します。どちらも、スクリーンリーダーが実際に何を読み上げたかは示しません。それはスクリーンリーダーによって異なります。フックはシャドウルートの中は見ません。詳細は、GitHub上の<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}><code>INTEGRATION.md</code></a>を参照してください。
				</li>
				<li>
					<strong>モーダルダイアログが開いている間に行ったスキャンは、ページではなくダイアログを見ます。</strong>
					<code>showModal()</code>で開いた<code>&lt;dialog&gt;</code>は文書の残りの部分を不活性にし、ブラウザーは支援技術にダイアログだけを渡します。<code>open</code>属性や<code>show()</code>で開いたダイアログは、<code>aria-modal="true"</code>があってもモーダルではありません。背後のページには引き続き到達でき、エンジンもそれを判定します。トップレイヤーのないjsdomでは、開いている<code>&lt;dialog aria-modal="true"&gt;</code>を代わりにモーダルとみなします。そこでエンジンが判断できる中では最も近いものだからです。エンジンはこれに従います。ダイアログの背後にあるコンテンツは、ほかの非表示のコンテンツと同じようにすべてのルールの対象外になり、ページ自体の構造に関するルール（<a href="/rules/page-has-heading-one/"><code>page-has-heading-one</code></a>、<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>、<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>、<a href="/rules/region/"><code>region</code></a>）は、スキャンからその構造が見えないため<code>notApplicable</code>を報告します。背後にあるものを判断するには、ダイアログを閉じた状態でもう一度ページをスキャンしてください。独自のモーダル、つまり<code>role="dialog"</code>または<code>role="alertdialog"</code>と<code>aria-modal="true"</code>を持つ表示中の要素も、これらの構造に関するルールを<code>notApplicable</code>にします。<code>aria-modal</code>は何も不活性にしないので、ほかのすべてのルールは背後のページを引き続き判定します。開いたシャドウルート内のモーダルダイアログは、文書内のものと同じように扱います。閉じたシャドウルート内のものは見つけられません。<code>aria-modal="true"</code>のない独自のモーダルは、ページが残りの部分に付けた<code>inert</code>や<code>aria-hidden</code>を通じてしか扱われません。これらはページを隠しますが、ダイアログが開いていることを構造に関するルールに伝えません。
				</li>
				<li>
					<strong>
						<code>&lt;dialog&gt;</code>
						など、デフォルトのUAスタイルシートで非表示になる要素
					</strong>
					（
					<code>open</code>
					属性がなく、仕様上
					<code>display: none</code>
					）と、
					<code>display:none</code>
					、
					<code>visibility:hidden</code>
					、
					<code>[hidden]</code>
					、閉じた
					<code>&lt;details&gt;</code>
					で非表示になっているその他のサブツリー、そして
					<code>[inert]</code>
					のサブツリー（描画はされるので、コントラストやテキスト間隔など見た目に関するルールは引き続き判定します）は、
					<strong>デフォルトでルールの評価対象から除外されます</strong>
					。これは見落としではなく意図的なデフォルトです（
					<code>engineOptions.includeHiddenElements: false</code>
					）。非表示のコンテンツは表示されるまで支援技術からもキーボードからも到達できないので、その中のマークアップの欠陥をデフォルトで指摘すると、多くの場合ノイズになります。それでも非表示／折りたたまれたサブツリーを評価したい場合は、
					<code>engineOptions.includeHiddenElements: true</code>
					を設定してください。たとえば、ダイアログが開かれる前にマークアップの欠陥（壊れたARIAのID参照など）を見つけたい場合です。このオプションと、対象になる非表示の仕組みの詳細は
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>
					を参照してください。
				</li>
				<li>
					<strong>非表示のコンテンツを指す<code>aria-details</code>は報告されません。</strong>
					<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a>は、IDが要素を指していることは確認しますが、その要素が表示されていることは確認しません。Chromiumは、要素が非表示の間はその関係をアクセシビリティツリーから外し、表示されると戻します。そのため、必要に応じて開く詳細は開いたときに読み上げられ、WCAGもそれ以上は求めていません。支援技術が受け取るとおりに関係を確認するには、詳細を表示した状態でページをスキャンしてください。
				</li>
				<li>
					<strong>jsdomにはポップオーバーがありません。</strong>
					jsdomは閉じた<code>[popover]</code>を隠すHTMLの規則は備えていますが、<code>showPopover()</code>はなく、<code>:popover-open</code>の読み方も一定しません。DOMに<code>showPopover</code>がない場合、エンジンは開いた<code>&lt;dialog&gt;</code>以外のすべての<code>[popover]</code>を閉じていて非表示のものとして扱うため、その中身はチェックされません。ページ自身のCSSで表示し続けているポップオーバーも、jsdomではチェックされません。ブラウザーでは、エンジンは表示されているものを読みます。ポップオーバーの中身をチェックするには、ポップオーバーを開いた状態でブラウザーでページをスキャンしてください。
				</li>
				<li>
					<strong>jsdomでは、CSSの<code>content</code>によるテキストは名前になりません。</strong>
					jsdomは<code>::before</code>と<code>::after</code>のスタイルを計算しないため、生成されたテキストしか持たないボタンやリンク（<code>content: "Save"</code>、<code>content: attr(data-label)</code>）は、ブラウザーでは名前を持ちますが、jsdomでは名前がなく、<code>button-name-present</code>、<code>link-name-present</code>などの名前のルールで不合格になります。そうしたページはブラウザーでスキャンしてください。
				</li>
				<li>
					<strong>jsdomはフォントサイズを書かれたとおりに保持します。</strong>
					ブラウザーは計算済みのフォントサイズをpxで報告しますが、jsdomはキーワードや<code>calc()</code>を書かれたとおりに保持します。エンジンは、キーワードをデフォルトが16pxのときのブラウザーのサイズで読み（<code>xx-large</code>は32px）、長さと数値の<code>calc()</code>も読むので、大きな文字はブラウザーと同じように区別されます。親のサイズに依存する<code>larger</code>と<code>smaller</code>はjsdomでは解決されません。そうしたテキストは通常のテキストの比率で判定され、メッセージにはサイズが0pxと示されます。ブラウザーはどちらも解決します。
				</li>
				<li>
					<strong>jsdomは、シャドウルート自身のスタイルシートを無視します。</strong>
					jsdom 29.1.1で確認しています。シャドウルート内の<code>&lt;style&gt;</code>もその<code>adoptedStyleSheets</code>も、中の要素の計算済みスタイルに反映されないため、jsdomではそこで指定した色、サイズ、<code>display: none</code>や<code>visibility: hidden</code>が見えません。ルールはコンポーネントの中身をスタイルがないものとして判定します。コントラストはデフォルトの色で計測され、CSSで隠したコンテンツは表示されているものとして判定されます。唯一の例外はリンクの色で、コントラストのヘルパーがシャドウルートのスタイルシートから自分で求めます。スタイルを付けたWebコンポーネントで作ったページは、ブラウザーでスキャンしてください。
				</li>
				<li>
					<strong>
						jsdomで計算される
						<code>text-shadow</code>
						は、同じ要素を2回目に読むと信頼できません。
					</strong>
					jsdom 29.1.1で確認済みです。同じ要素の計算済み
					<code>text-shadow</code>
					の値を2回目に読むと、どのアクセサーを使っても、その要素について新たに取得したどの
					<code>CSSStyleDeclaration</code>
					からでも、キャッシュの有無に関係なく、実際に宣言された値ではなく「影なし」という誤った別の値が黙って返されます。1回目の読み取りは常に正しい値です。このエンジンは内部で、各要素の
					<code>text-shadow</code>
					を1回の実行につきちょうど1度だけ読み、その結果をキャッシュすることでこれを回避しています（
					<code>src/core/contrast-helpers.js</code>
					の
					<code>__textShadowInfoEl</code>
					を参照）。そのため1回のスキャンには影響しません。問題が表に出るのは、同じjsdomでパースした要素に対して、
					<code>getComputedStyle(el).textShadow</code>
					を自分で2回以上読んだ場合だけです。本物のブラウザーにはこのバグはありません。
				</li>
				<li>
					<strong>同じjsdomのDOMを2回目にスキャンすると、ショートハンドを上書きするスタイルが失われることがあります。</strong>
					jsdomは要素の計算済みスタイルを、一度読むと次にDOMが変わるまで保持しますが、そのキャッシュから返すコピーでは、詳細度の低いルールのショートハンドを上書きするロングハンドが失われます。<code>{"*{background:#888}"}</code>と<code>style="background-image:url(hero.png)"</code>がある場合、1回目の読み取りでは画像が得られ、それ以降はすべて<code>none</code>になります。スキャンは最初に読んだスタイルを使い続けるので影響を受けませんが、変更のない同じDOMを2回目にスキャンすると、画像を見落とし、1回目で確認を求めたテキストを合格にすることがあります（<code>contrast-computable</code>）。新しくパースしたものをスキャンするか、スキャンの間にDOMを変更してjsdomのキャッシュを消してください。<code>@surea11y/core/testing</code>は自身の2回目のスキャンでそうしています。本物のブラウザーにはこのバグはありません。
				</li>
				<li>
					<strong>
						jsdomでは、スキャン時間は要素数ではなくDOMの深さの2乗に比例して増えます。
					</strong>
					jsdomは
					<code>getComputedStyle</code>
					を呼ぶたびに要素の祖先をたどって継承されたCSSを解決するので、要素ごとに1回呼ぶとO(要素数×深さ)のコストがかかります。エンジンのコードを一切介さずにjsdom 29.1.1で計測したところ、1本の祖先チェーンに並んだ4000個の要素では
					<code>getComputedStyle</code>
					だけで8.3秒かかり、同じ4000個を兄弟要素として並べた場合は0.25秒でした。エンジン自身が祖先をたどる処理には上限があり線形のままなので、これはルールではなくjsdomのコストです。影響を受けるのは
					<code>runDomRulesInPage</code>
					と、それを土台にしたすべてのもの（
					<code>@surea11y/test-matchers</code>
					を含む）です。本物のブラウザーは継承スタイルをネイティブに計算するので、このような特性はありません。コンポーネントフレームワークでは100〜300階層のネストはよくありますが、その程度なら十分に高速です。目立ってくるのはおよそ1000階層を超えてからです。
				</li>
				<li>
					<strong>jsdomでは、スキャン時間はスタイルシートの大きさにも比例して増えます。</strong>
					jsdomは、すべてのCSSルールを要素と照合してスタイルを計算します。エンジンはスキャン中にDOMを変更しないので、各要素の計算は1回だけですが、その1回にO(ルール数)のコストがかかります。保存したニュースサイトのページ（要素7,916個、CSSルール2,683個、jsdom 29.1.1）では、243秒のスキャンのうち約224秒が、5,735個の要素の最初の計算にかかりました。これはjsdomのコストで、本物のブラウザーは同じページを1秒もかからずに計算します。jsdomはカスタムプロパティも置換しないため、<code>var()</code>で指定した色はそこでは読み取れません。そのテキストや背景は計測されず、確認が求められます（<code>contrast-computable</code>）。大規模な本番のページには本物のブラウザーを使ってください。
				</li>
				<li>
					<strong>jsdomでは、リンクの色をページ自身のルールから求めます。</strong>
					jsdomは自身の<code>{":link { color: #0000EE }"}</code>をページのルールと詳細度だけで比べるため、ページの<code>{"a { color: #fff }"}</code>がそれに負けてしまいますが、ブラウザーはページのルールを適用します。jsdomでは、エンジンはリンクとその中のテキストの色を、ブラウザーのカスケードと同じようにページのルールから求めます。ページのどのルールも色を付けていないリンクはブラウザーのリンク色のままで、リンクは未訪問として扱います。それができない場合（読み取れないスタイルシート、<code>var()</code>、<code>@supports</code>、<code>@layer</code>、<code>@container</code>の中のルールやネストしたルール）は、jsdomの青で計測せずに、そのテキストについて確認を求めます（<code>contrast-computable</code>、<code>FOREGROUND_UNPARSABLE</code>）。ブラウザーでは、計算済みの色をそのまま読みます。
				</li>
				<li>
					<strong>jsdomでは、テキストは計算済みの<code>font-size</code>で判定されます。</strong>
					ブラウザーでは、コントラストのルールと<code>p-as-heading</code>は、テキストを描画されるサイズで判定します。CSSの<code>zoom</code>、SVGのtransform、<code>font-size-adjust</code>も含み、最後のものはフォント自身のメトリクスから求めます（<code>font-size: 24px; font-size-adjust: 0.3</code>はArialを約14pxで描画し、これは大きな文字ではありません）。jsdomはレイアウトを行わずフォントも読まないため、そこでは<code>font-size</code>をそのまま使います。そのようにテキストを拡大縮小するページは、ブラウザーでスキャンしてください。
				</li>
				<li>
					<strong>実際のブラウザーでは、一部のルールが確認の間だけページを変更し、ページ自身のスクリプトがそれに反応することがあります。</strong>
					ブラウザーが描画する内容を計測するため、<code>css-hidden-focus</code>はキーボードと同じように要素にフォーカスを当て、計測する要素のトランジションを無効にします。<code>aria-hidden-focus</code>は、ページがすぐにフォーカスを移すかどうか（フォーカストラップの番兵）を確かめるため、<code>aria-hidden</code>のサブツリー内の要素にフォーカスを当てます。<code>text-spacing-content-loss</code>はWCAG 1.4.12の間隔を指定したスタイルシートを追加します。コントラストのルールは、プレースホルダーやドロップダウンの<code>&lt;select&gt;</code>についてブラウザー自身の色を読み取るため、画面外に空のフレームを追加します。スキャンは、ルールの実行中、実行中の各アニメーションを固定した時点に移します（有限のものは終わりに、無限のものは始まりに）。そのため、フェードインは落ち着いた状態で計測されます。これらはすべて、ルールやスキャンが終わる前に元に戻します。フォーカス、スクロール位置、style属性、アニメーション、追加したスタイルシート、フレームです。元に戻せないのは、それに反応してページのスクリプトが行う処理です。要素にフォーカスを当てるとその<code>focus</code>と<code>focusin</code>のハンドラーが実行されるため、カルーセルがフォーカスされたスライドに移動して<code>aria-hidden</code>も一緒に移したり、ボタンが有効になったりすることがあります。そのスキャンの検出結果は、見つけた時点のページのものです。<code>aria-hidden-focus</code>は、どのサブツリーが非表示か、そして報告するマークアップを、何かにフォーカスを当てる前に読み取ります。ただし、ページはスクリプトが変えたままの状態で残るため、同じページを2回目にスキャンすると別のものが見つかることがあります。引き続き使うページをスキャンする場合や、1つのページを2回スキャンする場合は、その間に再読み込みしてください。
				</li>
				<li>
					<strong>別のオリジンのスタイルシートは、ページからは読み取れません。</strong>
					ページのスクリプトは、別のオリジン（CDN、フォントサービス）が配信するスタイルシートのルールを列挙できないため、<code>css-orientation-lock</code>はそれについて確認を求め（<code>STYLESHEETS_NOT_READABLE</code>）、<code>css-hidden-focus</code>と<code>css-focus-indicator-suppressed</code>はその中のフォーカスのルールを見られません。そのテキストを<code>engineOptions.styleSheetTexts</code>で渡してください。<code>preloadStyleSheets()</code>はサーバーが共有しているもの（CORS）を取得し、ブラウザーを操作するツールならそれ以外のものもページの外から取得できます（GitHub上の<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}><code>INTEGRATION.md</code></a>を参照）。
				</li>
				<li>
					<strong>静的なマークアップと、ライブ／ハイドレーション後のDOMの状態</strong>
					。ルールのロジック自体はDOMの出どころを問いません。jsdomでパースした静的なHTML（パターン1）でも、読み込みとハイドレーションが済んだ本物のブラウザーのタブ（パターン2。
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
					を参照）でも、渡されたDOMを評価します。ただしCLI（
					<code>npx @surea11y/cli scan &lt;url&gt;</code>
					）は、JSを実行せずに静的なHTMLだけを取得します（
					<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md">CLIのドキュメント</a>
					を参照）。JSフレームワークでハイドレーションされるウィジェットで、サーバーレンダリングされたマークアップが、クライアントのJSが同期する前の状態を意図的に出している場合（たとえば
					<code>&lt;input type="checkbox" aria-checked="true"&gt;</code>
					を出しておき、ハイドレーション時にクライアントのJSがネイティブの
					<code>checked</code>
					プロパティをそれに合わせる。ごく一般的で、まったく正当なパターンです）、CLIのスキャンにはハイドレーション前のマークアップしか見えません。実際に読み込まれたブラウザーのタブ内で動くスキャンにはハイドレーション後の状態が見えるので、まさにこの種の要素について、ルールの正しさとは無関係な理由で両者の結果が食い違うことがあります。
					<code>aria-checked-state-mismatch</code>
					を確定的な
					<code>fail</code>
					ではなく
					<code>manual</code>
					／
					<code>cantTell</code>
					までに抑えているのはそのためです。ハイドレーションの影響を受けるチェックでライブDOMの正確さが必要なら、静的に取得するCLIではなく、パターン2で読み込み済みのページに対してライブラリを直接実行してください。
				</li>
				<li>
					<strong>レイアウトは、1つのビューポートで、その時点でページが持っているフォントを使って計測されます。</strong>
					ブラウザーが描画する内容を計測するルール（<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a>、<a href="/rules/target-size-minimum/"><code>target-size-minimum</code></a>、<a href="/rules/skip-link/"><code>skip-link</code></a>）の結果は、ページをスキャンしたビューポートでのみ成り立ちます。レスポンシブなページは、ある幅ではテキストを切ったりターゲットを小さくしたりしても、別の幅ではそうしないことがあります。また、Webフォントの読み込み前に計測したテキストは、幅が異なります。結果はその両方を<a href="/results-reports/output-schema/"><code>engine.environment</code></a>に記録し、これらのルールの検出結果は、ビューポートを繰り返し記録したうえで、何を計測したか（テキストが端からどれだけはみ出したか、ターゲットの大きさと隣のターゲットとの近さ）を示します。そのため、実行によって異なる検出結果を、その条件までたどることができます。必要な幅ごとにスキャンし、スキャンの前にページが落ち着くのを待ってください。<code>waitForPageReady()</code>はloadイベント、Webフォント、画像を待ちます（スキャンの前に呼び出す方法は<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}><code>INTEGRATION.md</code></a>を参照してください）。結果には、フォントや画像がまだ読み込み中だったかどうかが<code>engine.environment</code>に記録されます。
				</li>
				<li>
					<strong>ブラウザーでは、コントラストは、その時点のページでテキストの下に描画されているものに対して計測されます。</strong>
					画像、グラデーション、テキストの一部だけを覆う描画の上にあるテキストは、計測せずに確認を求めます（<a href="/rules/contrast-computable/"><code>contrast-computable</code></a>、理由コード<code>BACKGROUND_OVERLAP</code>）。<code>overflow: hidden</code>のボックスが完全に表示範囲外に置いているテキスト（トラックの外にあるカルーセルのスライドなど）は、表示されるまで対象外になるので、それを確認するにはその状態でページをスキャンしてください。テキストの上にある固定配置やstickyのボックスは無視されます。jsdomでは、テキストは祖先に対してだけ計測されます。強制カラー（Windowsのハイコントラストや、エミュレートした<code>forced-colors: active</code>）のもとでスキャンした場合、計測の間はページ自身の色に保たれるので、判定結果は強制カラーをオフにしたときと同じになります。ただし、ページ自身のCSSが強制カラーに反応する場合（<code>forced-colors</code>のメディアクエリや、<code>GrayText</code>のようなシステムカラー）は別で、スキャンはそれを<code>engine.environment.forcedColorsCss</code>で報告します。ページ自身の色に保てない場合（スタイルシートを採用できないブラウザーで、Content Security Policyがエンジンの<code>&lt;style&gt;</code>をブロックしている場合）は、計測される色の一部がブラウザーの色になり、コントラストの各出現箇所がそのことを示します（<code>details.forcedColors</code>）。計測の仕組みの詳細は、GitHubの<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#contrast`}><code>LAYOUT_MEASUREMENT.md</code></a>にあります。
				</li>
				<li>
					<strong>背景のないページのテキストは、キャンバスがわかる場合、ページの配色のキャンバス上で計測されます。</strong>
					不透明な背景を描画しないページの背後には、ブラウザーがキャンバスを描画します。その色は、ページが描画される配色の<code>Canvas</code>の色で、配色はページ自身の<code>color-scheme</code>で決まります。何も宣言しないページでは、ユーザーの好みにかかわらず白、ダークで描画されるページではダークのキャンバスです。コントラストのルールは、どちらのモードでもそこでテキストを計測します。計測せず、<code>contrast-computable</code>が確認を求めるもの（<code>BACKGROUND_NOT_OPAQUE_AT_ROOT</code>）は、周りのページが透けて見えることがあるキャンバスを持つフレーム内のテキストと、キャンバスがユーザーのパレットになる強制カラーのもとでのテキストです。
				</li>
				<li>
					<strong>jsdomでは、テキストは、求められる場合はページが描画される配色の色で計測され、求められない場合は確認が求められます。</strong>
					jsdomはライトの配色の色を計算し、<code>prefers-color-scheme</code>のルールを適用しません。ダークで描画されるページ（ルートや<code>&lt;meta name="color-scheme"&gt;</code>で<code>color-scheme: dark</code>）では、配色が色を付けるテキストはダークの配色の色（Chromiumのもの）になり、<code>light-dark()</code>やシステムカラーで指定したテキストの色はダーク用に求めます。その配色での色を求められないテキストは、ライトの色で計測せずに確認を求めます（<code>contrast-computable</code>の<code>COLOR_SCHEME_NOT_RENDERED</code>、<code>link-in-text-block</code>の<code>COLOR_NOT_COMPUTABLE</code>）。ブラウザーでは、色はブラウザーが描画するものです。
				</li>
				<li>
					<strong>ライトとダークの両方に対応するページでは、スキャンが見ていない配色は、テキストの色がそれによって変わりえない場合にだけ計測されます。</strong>
					スキャンが見るのはブラウザーが優先する配色です（jsdomではライト）。キャンバス上のテキストはもう一方の配色でも計測しますが、ページが指定した<code>prefers-color-scheme</code>のルール、<code>light-dark()</code>の値、システムカラーがテキストの色やその背後の背景に及ぶ場合と、スタイルシートを読み取れない場合は除きます。<code>data.details.colorSchemesChecked</code>は計測した配色を列挙します。もう一方の配色を確認するには、ブラウザーをその配色にしてもう一度スキャンしてください。
				</li>
				<li>
					<strong>生成されたテキストは、ブラウザーでだけ、しかも読み取れる場合にだけ計測されます。</strong>
					<code>::before</code>や<code>::after</code>の<code>content</code>が書き出すテキストと、リスト項目の<code>::marker</code>は、その疑似要素の色とフォントで計測されます。読み取れない内容（ページ独自の<code>@counter-style</code>のカウンター）や、独自の背景を持たずにフローの外に配置された<code>::before</code>や<code>::after</code>は、代わりに確認を求めます（<code>contrast-computable</code>）。マーカーは<code>&lt;li&gt;</code>でだけ探します。疑似要素のスタイルを計算しないjsdomでは、生成されたテキストは対象外です。
				</li>
				<li>
					<strong>フォームフィールドのテキストとプレースホルダーは、フィールドが描画するとおりに計測されますが、計測しないものもあります。</strong>
					日付や時刻のフィールドが空のときにブラウザーが描画するテキストと、ファイル入力のボタンとファイル名は計測しません。ドロップダウンの<code>&lt;select&gt;</code>は、閉じたコントロールが描画するとおりに、表示中の選択肢をselect自身の色で計測します。独自の色を持つほかの選択肢は、開いたときにプラットフォームが描画するリストにしか表示されないため、<code>cantTell</code>になります（<code>SELECT_OPTION_COLOR</code>）。比率を下回るプレースホルダーは、ページが色を選んだ場合は不合格（<code>PLACEHOLDER_BELOW_THRESHOLD</code>）、色がすべてブラウザー自身のものである場合は比率を満たすもの（達成方法G148）、それがわからない場合は<code>cantTell</code>になります。jsdomでは、プレースホルダーはまったく計測しません。詳細：<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#form-fields`}><code>LAYOUT_MEASUREMENT.md</code></a>。
				</li>
				<li>
					<strong><a href="/rules/target-size-minimum/"><code>target-size-minimum</code></a>は、ポインターが当たる領域を、ヒットテストではなくレイアウトから求めます。</strong>
					スクロールしないと見えない位置や、スクロールするボックス内にあるターゲットは、そこまでスクロールしたものとして全体を計測します。ターゲットの上にある固定配置やstickyのボックスは無視します。3Dのtransform、ほとんどの<code>clip-path</code>の形状、祖先による角の丸い切り取りは、バウンディングボックスとして計測します。区切り文字だけを挟んで互いに詰まっているリンク（「<span lang="en">Edit | Delete</span>」）は、例外にせず確認を求めます。jsdomでは、このルールは<code>notApplicable</code>になります。詳細：<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#target-size`}><code>LAYOUT_MEASUREMENT.md</code></a>。
				</li>
				<li>
					<strong>コントラストはsRGBで計算されます。</strong>
					<code>oklch()</code>、<code>oklab()</code>、<code>lab()</code>、<code>lch()</code>、<code>color()</code>で指定された色（<code>color-mix()</code>や相対色の計算値も含みます）は、標準的なディスプレイでの見え方と同じようにsRGBに変換されます。彩度の高い<code>display-p3</code>の赤のようにsRGBの範囲外にある色は、その範囲の端に切り詰められます。これはChromiumがsRGBの画面に描画するのと同じです。広色域の画面では、その色がコントラスト比の前提よりも鮮やかに表示されることがあります。エンジンが変換できない背景色（知らない色空間の<code>color()</code>）は透明として扱いません。<code>contrast-computable</code>が理由コード<code>BACKGROUND_UNPARSABLE</code>でそのテキストについて確認を求め、ほかのコントラストのルールはそのテキストを対象から外します。
				</li>
			</ul>

			<h2>対象外：安全に自動化できない判断</h2>
			<p>
				これらには、このエンジンの基準（
				<code>fail</code>
				は決定論的な違反のためだけに取っておく。例外はありません）を満たすほど安全なヒューリスティックがありません。それでも作れば、ほとんど何も検出しない（狭すぎて役に立たない）か、実際に誤検出を生む（広すぎて信頼できない）かのどちらかになります。
			</p>
			<ul>
				<li>
					<strong>「この見出し／ラベルのテキストは意味をなしているか」</strong>
					：実際の見出しやラベルは実にさまざまで、短くても正当なことがよくあります（「FAQ」「名前」「概要」はどれも問題ありません）。そのため、見出しがその下のセクションを説明しているか、ラベルが隣のフィールドを説明しているかを、マークアップから判断することはできません。判断
					<em>できる</em>
					のは、何も説明しえない文字列があるということです。
					<code>heading-quality</code>
					と
					<code>form-control-label-quality</code>
					は、消し忘れたプレースホルダー、番号付きのテンプレート枠、ファイル名、URLを、厳選した完全一致リストに照らして指摘します。
					<code>link-name-quality</code>
					と同じく、見逃しを許容してでも誤検出を避けるという、意図したトレードオフです。どちらも
					<code>cantTell</code>
					までに抑えた
					<code>manual</code>
					ルールで、レビューの候補を挙げるだけで、テキストが間違っていると断定することはありません。
				</li>
				<li>
					<strong>「このエラーメッセージは問題を説明しているか」</strong>
					：何がバリデーションエラーを発生させるか、その内容が何かは、ほぼ常にJSやバリデーションライブラリが決めるもので、そもそも静的なスキャンからは見えません。ヒューリスティックの設計だけの問題ではありません。
				</li>
				<li>
					<strong>時間依存メディアの細かいサブチェック</strong>
					（WCAG 1.2.xには、このエンジンに対応するルールのないACTルールが13あります。
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#gaps-no-corresponding-rule`}><code>ACT_RULE_MAPPING.md</code></a>
					のギャップの節を参照）：音声・映像のコンテンツそのものは、静的なマークアップからは本質的に検証できません。最も広く安全な2つのケース（
					<code>media-alternative-transcript-evidence</code>
					、
					<code>video-caption</code>
					）はカバーしていますが、より狭いケースは意図的にカバーしていません。
				</li>
				<li>
					<strong>文字画像の内容分析</strong>
					（WCAG 1.4.5／1.4.9）：画像がテキストを含むかどうかはそのピクセルの中にあり、それにはOCRに相当する画像理解が必要です。<a href="/rules/image-of-text/"><code>image-of-text</code></a>が確認を求めるのは、マークアップに手がかりがある場合だけです。<code>&lt;input type="image"&gt;</code>と、マークアップに<code>&lt;text&gt;</code>を含むSVGのデータURLを表示する<code>&lt;img&gt;</code>がそれに当たります。文章を撮った写真、テキストを焼き込んだバナー、テキストのCSS背景画像には手がかりがなく、確認も求めません。例外を認めない1.4.9にはルールがありません。
				</li>
				<li>
					<strong>動きによる起動の操作</strong>
					（WCAG 2.5.4）：ニッチで、実際に問題になる頻度も低いものです。優先していないだけで、構造的に不可能なわけではありません。
				</li>
				<li>
					<strong>
						<code>img-alt-decorative</code>
						の2つのACTエッジケース
					</strong>
					：現在のネットワークリクエストの状態が「完全に利用可能」でない（読み込み中、または壊れている）
					<code>&lt;img&gt;</code>
					と、完全に透明な（実際には何も描画されていない）
					<code>&lt;canvas&gt;</code>
					は、どちらもACT自身の適用範囲から除外されています。どちらも静的なDOMスキャンでは判断できない（画像のデコードも、canvasのピクセルの読み戻しもしない）ので、除外せずに対象に残しています。人間のレビュアーなら一目で却下できるまれな誤検出のほうが、本当に除外対象でない／装飾でない要素を黙って報告し損ねるより安全だからです。
				</li>
			</ul>

			<h2>実際に意味すること</h2>
			<p>
				ここに挙げたことの多くは、surea11yに固有のものではありません。DOMの1つの状態を判定するツールはどれも
				<a href="#outside-what-one-scan-can-see">1回のスキャンで見えないもの</a>
				の制限を共有しており、ほとんどの自動ツールは判断を要するものも人に任せています。ただし、ツールによって、実行のしかた、チェックする内容、判断できないものの報告のしかたは異なります。それでもここで明記する理由は、
				<strong>
					このエンジン（あるいはどんな自動ツール）の
					<code>pass</code>
					も、上に挙げた達成基準についてWCAG自体が求めている手動レビューの代わりには決してならない
				</strong>
				からです。ルールの<code>pass</code>が何を主張し、何を主張しないか、そしてルールがすべて<code>pass</code>でもWCAGの達成基準が<code>cantTell</code>のままなのはなぜかについては
				<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>
				を参照してください。
			</p>
		</>
	);
}
