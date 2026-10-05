import React from "react";

const core = "https://github.com/SureA11y/core/blob/main";

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				使っているうちに気づくのではなく、最初にはっきり書いておきます。ここに挙げたものはどれも見落としではなく、理由があって意図的に決めたことです。ただし「意図的」だからといって、「このツールに頼る前に知らなくてもよい」わけではありません。
			</p>

			<h2>構造上の制限：このアーキテクチャではまったく扱えないもの</h2>
			<p>
				surea11yは
				<strong>静的なDOMスキャン</strong>
				です。ある一瞬のDOMツリーと計算済みスタイルを読み取るもので、ユーザー操作のシミュレーション、非同期の状態変化の待機、任意のビューポートサイズでの実際のレイアウト計測はできません。これらはルールが足りないのではありません。根本的に異なるアーキテクチャ（実際のキーボード／ポインターイベントを時間をかけて送る、本物のブラウザー自動化）がなければ、どれほど工夫したルール実装でも埋められない部分です。
			</p>
			<ul>
				<li>
					<strong>キーボードトラップの検出</strong>
					（WCAG 2.1.2）：ページ内でフォーカスを動かし、どこに移るかを観察する必要があり、DOMを1度読むだけではできません。実現できそうな手法は検討済みですが（
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#keyboard-trap-detection-scoping-notes`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					のキーボードトラップの節を参照）、それはこのエンジンで初めて、検査中のページを書き換えるチェックになります。そのため実装しておらず、仮に実装しても通常のスキャンには含めません。それまでの間、静的なマークアップで代わりになるものはありません。
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
					スキャンする）。
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
					<strong>モーダルダイアログが開いている間に行ったスキャンは、ページではなくダイアログを見ます。</strong>
					<code>showModal()</code>で開いた<code>&lt;dialog&gt;</code>（または開いている<code>&lt;dialog aria-modal="true"&gt;</code>）は文書の残りの部分を不活性にし、ブラウザーは支援技術にダイアログだけを渡します。エンジンもそれに従います。ダイアログの背後にあるコンテンツは、ほかの非表示のコンテンツと同じようにすべてのルールの対象外になり、ページ自体の構造に関するルール（<a href="/rules/page-has-heading-one/"><code>page-has-heading-one</code></a>、<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>、<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>、<a href="/rules/region/"><code>region</code></a>）は、スキャンからその構造が見えないため<code>notApplicable</code>を報告します。背後にあるものを判断するには、ダイアログを閉じた状態でもう一度ページをスキャンしてください。制限が2つあります。シャドウルート内のモーダルな<code>&lt;dialog&gt;</code>は検出されません。また、<code>role="dialog"</code>の要素で作り、ページの残りの部分に<code>inert</code>や<code>aria-hidden</code>を付けた独自のモーダルは、それらの属性を通じてしか扱われません。これらの属性はページを隠しますが、ダイアログが開いていることを構造に関するルールに伝えません。axe-coreと同じ動作です。IBM Equal AccessとSiteimprove Alfaは、何も開いていないものとしてダイアログの背後のページを判定します。
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
					で非表示になっているその他のサブツリーは、
					<strong>デフォルトでルールの評価対象から除外されます</strong>
					。ほかの定評あるエンジンの、表示状態を考慮した動作に合わせています。これは見落としではなく意図的なデフォルトです（
					<code>engineOptions.includeHiddenElements: false</code>
					）。非表示のコンテンツは表示されるまで支援技術からもキーボードからも到達できないので、その中のマークアップの欠陥をデフォルトで指摘すると、多くの場合ノイズになります。それでも非表示／折りたたまれたサブツリーを評価したい場合は、
					<code>engineOptions.includeHiddenElements: true</code>
					を設定してください。たとえば、ダイアログが開かれる前にマークアップの欠陥（壊れたARIAのID参照など）を見つけたい場合です。このオプションと、対象になる非表示の仕組みの詳細は
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>
					を参照してください。
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
					<strong>実際のブラウザーでは、一部のルールが確認の間だけページを変更し、ページ自身のスクリプトがそれに反応することがあります。</strong>
					ブラウザーが描画する内容を計測するため、<code>css-hidden-focus</code>はキーボードと同じように要素にフォーカスを当て、計測する要素のトランジションを無効にします。<code>text-spacing-content-loss</code>はWCAG 1.4.12の間隔を指定したスタイルシートを追加します。これらはすべて、ルールが終わる前に元に戻します。フォーカス、スクロール位置、style属性、追加したスタイルシートです。元に戻せないのは、それに反応してページのスクリプトが行う処理です。要素にフォーカスを当てるとその<code>focus</code>ハンドラーが実行されるため、カルーセルがフォーカスされたスライドに移動したり、ボタンが有効になったりすることがあります。検出結果には影響しませんが、引き続き使うページをスキャンした場合は、後で再読み込みしてください。
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
					<strong>コントラストのルールは、テキストを祖先の背景に対して計測し、ブラウザーでは、そこにほかの何かが描画されていないかも確認します。</strong>
					兄弟要素の上、<code>&lt;img&gt;</code>のヒーロー画像の上、<code>::before</code>のオーバーレイの上に配置されたテキストや、負のマージンで別のブロックの上に引き寄せられたテキストは、どの祖先のものでもない描画の上にあります。ブラウザーでは、エンジンはテキストの行ボックスを計測し、背景色、背景画像、置換コンテンツ（<code>img</code>、<code>video</code>、<code>canvas</code>、<code>svg</code>、<code>iframe</code>）を描画していて、行のおよそ1グリフ分以上を覆う要素と、色やグラデーションを持つ配置済みの<code>::before</code>や<code>::after</code>を探します。見つかった場合、<a href="/rules/contrast-computable/"><code>contrast-computable</code></a>が理由コード<code>BACKGROUND_OVERLAP</code>でそのテキストについて確認を求め、コントラスト比を計算するルールはそのテキストを対象から外します。重なり合う2つのボックスのどちらが上に描画されるかは判定しないため、見つかった描画に対するコントラスト比は計算しません。ノイズを抑えるための制限が3つあり、それぞれが見落としの原因になりえます。数えるのは、テキストに最も近い不透明な背景を持つ祖先の内側にある描画だけです（ヒーロー画像の上の白いカードは画像を隠します）。固定配置とstickyのボックスは対象外です（Cookieバナーやヘッダーは、テキストの背後にあるのではなく、テキストを覆います）。すでに計測した背景と同じ色の単色の描画は無視します。jsdomにはレイアウトがないため何も見つからず、テキストは祖先に対してだけ計測されます。
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
					（WCAG 1.2.xには、実装済みのもの以外にACTルールレベルで約8つの別個のケースがあります）：音声・映像のコンテンツそのものは、静的なマークアップからは本質的に検証できません。最も広く安全な2つのケース（
					<code>media-alternative-transcript-evidence</code>
					、
					<code>video-caption</code>
					）はカバーしていますが、より狭いケースは意図的にカバーしていません。
				</li>
				<li>
					<strong>文字画像の内容分析</strong>
					（WCAG 1.4.5／1.4.9）：OCRに相当する画像理解が必要で、静的なマークアップを扱うエンジンの範囲外です。
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
				ここに挙げたことは、どれもsurea11yに固有のものではありません。静的解析を行うアクセシビリティツールは（ほかの定評あるエンジンも含めて）どれも構造上の制限を共有しており、判断を要するものについてもほとんどが同じです。それでもここで明記する理由は、
				<strong>
					このエンジン（あるいはどんな自動ツール）の
					<code>pass</code>
					も、上に挙げた達成基準についてWCAG自体が求めている手動レビューの代わりには決してならない
				</strong>
				からです。
				<code>pass</code>
				／複合ルールの
				<code>pass</code>
				が何を主張し、何を主張しないかについては
				<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>
				を参照してください。
			</p>
		</>
	);
}
