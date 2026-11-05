import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-15">「core 1.15にアップグレードしたら、結果が変わった」</h2>
				<p>
					1.15では、WCAGの達成基準を不合格にするのはWCAG自体が不合格とする場合だけになり、フレームはブラウザーが表示するとおりに読まれます。パイプラインに表れやすい変更は次のとおりです。
				</p>
				<ul>
					<li>
						<strong>ARIAとHTMLの構造の不合格が減ります。</strong>
						8つのARIAのルールとHTMLの構造のルールは、WAI-ARIAやHTMLのコンテンツモデルだけが破られている場合に、達成基準を不合格にしなくなりました。そうした検出結果は、不確実性<code>spec-only</code>と確認の手順を伴う<code>cantTell</code>になります。対象は、<a href="/rules/aria-role-name-present/"><code>aria-role-name-present</code></a>（grid、tree、radiogroup、meter、progressbar）、<a href="/rules/dialog-name-present/"><code>dialog-name-present</code></a>、<a href="/rules/tooltip-name-present/"><code>tooltip-name-present</code></a>、<a href="/rules/aria-allowed-attr/"><code>aria-allowed-attr</code></a>、<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a>（コントロールの状態、値、フォーカスを除く）、<a href="/rules/aria-prohibited-attr/"><code>aria-prohibited-attr</code></a>、<a href="/rules/aria-roles-valid/"><code>aria-roles-valid</code></a>（フォーカス可能な要素の場合を除く）、<a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a>（祖先。現在は1.3.1にだけ対応します）、<a href="/rules/list-children-valid/"><code>list-children-valid</code></a>と<a href="/rules/listitem-parent-valid/"><code>listitem-parent-valid</code></a>（壊れた項目をページが描画する場合を除く）、<a href="/rules/definition-list-children-valid/"><code>definition-list-children-valid</code></a>、<a href="/rules/dlitem-parent-valid/"><code>dlitem-parent-valid</code></a>、<a href="/rules/nested-interactive-controls-absent/"><code>nested-interactive-controls-absent</code></a>（子要素がプレゼンテーションになるコントロールの中を除く）です。すべての検出結果は理由コードを保つので、ベースラインは引き続き一致しますが、これらだけが不合格にしていたゲートや集約は、合格になるか<code>cantTell</code>になります。同じ検出結果を、それが不合格になるWAI-ARIAで判定するには、<a href="/configuration/packs/#wai-aria-pack">WAI-ARIAのパック</a>を追加してください。
					</li>
					<li>
						<strong>フレーム内の文書は、それ自体で1つのページではありません。</strong>
						フレームの中では、<code>page-title-present</code>、<code>html-lang-attr-present</code>、ビューポート、ブロックスキップ、ランドマークのルールは<code>notApplicable</code>になります（<a href="#framed-page-rules">後述の項目</a>を参照）。<code>aria-hidden</code>や<code>inert</code>の下にあるフレームはそのとおりに読まれ、開いているモーダルダイアログの背後にあるフレームは除外されます。
					</li>
					<li>
						<strong>ロールがWAI-ARIAにより忠実になります。</strong>
						<code>role="text"</code>は妥当なロールを示しません。プレゼンテーションのロールとグローバルなARIA属性を持つ画像はそのロールを保ち、<code>alt</code>がなければ<a href="/rules/img-alt-present/"><code>img-alt-present</code></a>で不合格になります。WAI-ARIA 1.2が非推奨にした4つのグローバル属性は、プレゼンテーションの要素にロールを戻さなくなりました。
					</li>
					<li>
						<strong>見出しレベルの飛びはベストプラクティスの問題です</strong>
						。1.3.1の不合格ではありません。これは見直された<a href="/conformance/procedures/">テスト手順</a>によるもので、6つの新しい問いの「確認方法」の手順もそこから来ています。
					</li>
					<li>
						<strong>1.13のベースラインは、先に更新が必要です。</strong>
						1.15は理由コードを移動しておらず、1.13から1.14への移動を削除しました（<a href="#baseline-after-upgrade">後述の項目</a>を参照）。
					</li>
				</ul>
				<p>
					新しく追加され、使わない限り何も変えないもの：複数のプロファイルでの同時のスキャン（<a href="/configuration/engine-options/#several-profiles">エンジンオプション</a>）、<code>wcag22-a</code>と<code>wcag22-aaa</code>のプロファイル、手作業で評価するためのテスト手順、HTMLレポートの「人による確認が残っているもの」。変更の全一覧は、coreの<a href={`${core}/CHANGELOG.md`}><code>CHANGELOG.md</code></a>にあります。
				</p>
			</article>

			<article>
				<h2 id="runonly-threw">
					「<code>runOnly</code>がエラーを投げた：<span lang="en">no rule or tag named …</span>、または<span lang="en">either rule ids or tags</span>」
				</h2>
				<p>
					1.10.0以降、配列そのものや文字列として渡した<code>runOnly</code>は、ルールIDかタグとして読まれます（<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>を参照してください）。次の2つの場合はエラーを投げます。
				</p>
				<ul>
					<li>
						<strong>どのルールもタグも指していない値</strong>
						。たいていはタイプミスです（<code>runOnly: ['img-alt-presnt']</code>）。IDを<code>getChecksCatalog()</code>と照らし合わせてください。大文字小文字は原因になりません。ルールIDとタグは大文字小文字を問わず照合されるので、<code>IMG-ALT-PRESENT</code>は<code>img-alt-present</code>を選択します。
					</li>
					<li>
						<strong>1つの配列にルールIDとタグが混在している場合</strong>
						（<code>runOnly: ['img-alt-present', 'wcag2a']</code>）。組み合わせるにはオブジェクト形式を使います。
					</li>
				</ul>
				<CodeBlock
					lang="js"
					lines={[
						"runOnly: {",
						"  includeRuleIds: ['img-alt-present'],",
						"  tags: ['wcag2a'],",
						"  includeMode: 'or',",
						"}",
					]}
				/>
				<p>1.10.0より前は、配列そのものを渡すと無視され、すべてのルールが実行されていました。</p>
				<p>
					オブジェクト形式（<code>{"{ includeRuleIds }"}</code>、<code>{"{ tags }"}</code>、<code>{"{ type: 'tag', values }"}</code>）や、<code>engineOptions.rules.include</code>／<code>.tags.include</code>も、リスト内のどの値もルールやタグを指していない場合は、<code>code: 'INVALID_RUN_ONLY'</code>付きでエラーを投げます（<code>runOnly.tags: no tag named "wcag2.2aa".</code>）。以前はルールが1つも実行されず、問題のない合格のように見えていました。既知の値と並んだ未知の値が1つだけの場合や、除外リスト内の未知の値は、<code>console.warn</code>を出力するだけです。
				</p>
			</article>

			<article>
				<h2 id="tags-and-rules-run-nothing">
					「タグとルールIDを選んだら、スキャンがルールを1つも実行しなかったのに問題のない結果に見える」
				</h2>
				<p>
					デフォルトの<code>includeMode: 'and'</code>のもとでは、タグとルールIDの両方を含む選択は、両方に一致するルールだけを実行します。<code>region</code>は<code>wcag2a</code>タグを持たないベストプラクティスなので、<code>.withTags('wcag2a').withRules('region')</code>は何も実行せず、ルールを1つも実行しないスキャンには不合格がありません。エンジンはページのコンソールに警告を出しますが、テストの実行ではそれは表示されません。<code>INVALID_RUN_ONLY</code>を投げるのは<code>strictOptions</code>のもとでだけです。どちらかに一致するものを実行するには、そう指定します。バインディングでは<code>.includeMode('or')</code>、<code>runOnly</code>では<code>includeMode: 'or'</code>（上記）、<a href="/getting-started/cli/">CLI</a>では<code>--include-mode or</code>です。バージョン1.3.0以降のCLIは、2つに共通するルールがない場合、そのヒントを示して終了コード<code>2</code>で終了します。
				</p>
				<p>
					何も選ばない選択を実行前に見つけるには、ビルダーの<code>plannedChecks()</code>を確認してください。スキャンが実行するルールを、ページなしで求めます（Cypressではchainableを返します）。
				</p>
				<CodeBlock
					lang="js"
					lines={[
						"const builder = new A11yCoreBuilder({ page })",
						"  .withTags('wcag2a')",
						"  .withRules('region')",
						"  .includeMode('or'); // the wcag2a rules, plus region",
						"",
						"if (builder.plannedChecks().length === 0) {",
						"  throw new Error('This selection runs no rule.');",
						"}",
					]}
				/>
				<p>
					選択の各部分がどう組み合わさるかは、<a href="/configuration/engine-options/#via-runonly-4th-argument">エンジンオプション</a>を参照してください。
				</p>
			</article>

			<article>
				<h2 id="untested-wcag-tag">
					「<code>runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a")</code>」
				</h2>
				<p>
					WCAGのバージョンとレベルを表す9つのタグ（<code>wcag2a</code>から<code>wcag22aaa</code>まで）は常に既知ですが、そのうち3つにはルールがありません。<code>wcag21aaa</code>、<code>wcag22a</code>、<code>wcag22aaa</code>で、これらの達成基準には自動チェックがないためです。ほかのタグと並べてこれらを指定すると、<code>console.info</code>でこの行が出力されます。リストの残りは実行され、これらの達成基準には手動確認が必要です。出力しないようにするには<code>engineOptions.logUntestedWcag: false</code>を渡すか、タグを指定しない目標による選択を使ってください。<code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code>です（<a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">WCAGの目標で選ぶ</a>を参照）。このようなタグだけのリストでは何も実行されないため、同じ説明とともに<code>INVALID_RUN_ONLY</code>を投げます。
				</p>
			</article>

			<article>
				<h2 id="invalid-wcag-target">
					「<code>runOnly.wcag.version must be …</code>」または「<code>runOnly.bestPractices must be true or false …</code>」
				</h2>
				<p>
					<code>runOnly.wcag</code>は<code>{"{ version, level }"}</code>を受け取ります。<code>version</code>は<code>'2.0'</code>、<code>'2.1'</code>、<code>'2.2'</code>のいずれか（文字列です。数値の<code>2.2</code>は拒否されます）、<code>level</code>は<code>'A'</code>、<code>'AA'</code>、<code>'AAA'</code>のいずれかです。<code>runOnly.bestPractices</code>は<code>true</code>か<code>false</code>を受け取ります。それ以外の値は、意図しない選択で実行するのではなく、フィールドと値を示して<code>INVALID_RUN_ONLY</code>を投げます。
				</p>
			</article>

			<article>
				<h2 id="invalid-engine-options">
					「<code>engineOptions: unknown option "lcoale" (did you mean "locale"?)</code>」、またはスキャンが<code>INVALID_ENGINE_OPTIONS</code>を投げた
				</h2>
				<p>
					既知のオプションと1文字か2文字だけ違う（大文字小文字は問いません）オプションのキーは、警告されたうえで無視されます。スキャンはそれがないものとして実行されるので、綴りを直してください。それ以外の未知のキーには何も出力されません。カスタムルールは<code>ctx.engineOptions</code>から独自の設定を読めるためです。<code>engineOptions.strictOptions: true</code>を指定すると、エンジンが読まないキー（入れ子のものを含む）や、型が誤っているか集合の外にある値に対して、スキャンは代わりに<code>code: 'INVALID_ENGINE_OPTIONS'</code>付きでエラーを投げ、それぞれを最も近い既知のキーとともに示します。エラーの<code>problems</code>がそれらを列挙します。<a href="/configuration/engine-options/#catching-mistakes-in-the-options-strictoptions">オプションの誤りを見つける</a>を参照してください。
				</p>
			</article>

			<article>
				<h2 id="custom-rule-rollup">
					「カスタムルールは不合格なのに、WCAGの集約は不合格にならない」
				</h2>
				<p>
					カスタムルールは、対応する各達成基準のWCAGの集約（<code>rulesResults</code>）に算入されます。<code>meta.wcagSc: ['1.1.1']</code>か、<code>meta.normativeMappings</code>のWCAGのエントリーを指定してください。どちらもなければ、どの集約にも入りません。実行されなかったカスタムルール（<code>skippedCustomRules</code>に列挙されます）も算入されません。組み込みルールの上書きは、それ自身の対応付けが示す場所にだけ算入されます。そのため、対応付けを宣言しない上書きは、組み込みルールが算入されていた集約から外れ、警告（<code>customRules: "…" overrides a built-in rule but maps to none of the criteria of …</code>）がそれらを示します。そこに残すには、組み込みルールの達成基準を指定してください。
				</p>
			</article>

			<article>
				<h2 id="contextselector-matched-nothing">
					「範囲を絞ったスキャンですべてが<code>notApplicable</code>になる」、または「<code>contextSelector</code>がエラーを投げた：<span lang="en">… is not a valid CSS selector</span>」
				</h2>
				<p>
					1.10.0以降、どの要素にも一致しない<code>contextSelector</code>は何もスキャンせず、ブラウザーが解析できないものはエラーを投げます（<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>を参照してください）。
				</p>
				<ul>
					<li>
						<strong>すべてが<code>notApplicable</code>になる</strong>
						：<code>result.contextMatch</code>を確認してください。<code>elementCount: 0</code>はセレクターが何にも一致せず、何もスキャンされなかったことを意味します。これは問題のない結果ではありません。<code>unmatchedSelectors</code>にそのセレクターが示されます。タイプミスがないか、またスキャンの時点でその要素がもうページ上にあるか（読み込み後にスクリプトが描画するコンテンツなど）を確認してください。
					</li>
					<li>
						<strong><code>code: 'INVALID_CONTEXT_SELECTOR'</code>付きでスキャンがエラーを投げた</strong>
						：メッセージと、エラーの<code>selector</code>に示されたセレクターが、有効なCSSではありません。たとえば<code>'#main['</code>や<code>&gt;&gt;&gt;</code>結合子です。あるいは、範囲が要素や<code>{"{ include, exclude }"}</code>オブジェクトのように、そもそもセレクターではない場合で、メッセージは渡されたものを示します。その要素に一致するセレクターを渡し、除外は<code>engineOptions.excludeSelectors</code>で指定してください。
					</li>
				</ul>
				<p>
					以前は、これらの場合はどれも代わりにページ全体をスキャンしていました。何にも一致しないセレクターや解析できないセレクターは1.10.0まで、セレクターではない範囲は1.10.0でもそうでした。
				</p>
			</article>

			<article>
				<h2 id="page-builtins-broken">「スキャンが<code>PAGE_BUILTINS_BROKEN</code>を投げた」</h2>
				<p>
					ページ自身のスクリプトが、エンジンが依存するJavaScriptの組み込みオブジェクト（<code>Array.prototype.filter</code>、<code>Map</code>、<code>JSON.stringify</code>など）を変更しているため、そのページのスキャンは、もっともらしく見えて誤っている結果を返す可能性があります。エラーのメッセージとその<code>broken</code>リストが、それぞれを示します。ページのスクリプトがそれらを変更する前にスキャンしてください（バンドルをもっと早く注入するか、それを行うスクリプトを含まないビルドをスキャンします）。<a href="/help/known-limitations/">既知の制限事項</a>を参照してください。
				</p>
			</article>

			<article>
				<h2 id="scan-never-returns">「スキャンがいつまでも返らない」</h2>
				<p>
					ページ内の何かがスキャンを止めています。戻らないゲッターやスクリプト、あるいはパックやカスタムルールのループです。いったん始まったスキャンをページ内から止める手段はないので、スキャンを開始する側で制限時間を設け、それを過ぎたらそのタブを諦めてください。PlaywrightとPuppeteerでの方法は<a href="/getting-started/standalone/#a-time-limit-on-a-scan">スタンドアロン</a>にあります。jsdomでは、スキャンをワーカースレッドか子プロセスで実行してください。
				</p>
			</article>

			<article>
				<h2 id="scan-time">「アップデート後にスキャンが遅くなった」</h2>
				<p>
					スキャンにかかる時間の大半はブラウザーでのスタイルとレイアウトの処理なので、エンジンだけでなく、ページ、マシン、ブラウザーにも左右されます。それでもリリースによって変わることはあります。ページのより多くの部分を確認するようになったルールは、その分時間がかかります。リリースでルールのコストが変わったときは、coreの<a href={`${core}/CHANGELOG.md`}><code>CHANGELOG.md</code></a>に記載されます。GitHub上の<a href={`${core}/docs/PERFORMANCE.md`}><code>PERFORMANCE.md</code></a>には、リリースごとのスキャン時間が、同じページでの以前のリリースに対する比率として、計測方法とともに記録されています。遅くなっても検出が増えたルールは、新たに見つけるものの分だけ時間がかかっているのかもしれません。結果が同じなのに遅くなったルールは退行なので、<a href="https://github.com/SureA11y/core/issues">報告</a>してください。
				</p>
				<p>
					複数のプロファイルでの同時のスキャン（<code>profile: ['wcag22-aa', 'wai-aria-1.2']</code>）は、プロファイルごとに1回ページをスキャンするので、その回数分のスキャンとほぼ同じ時間がかかります。
				</p>
			</article>

			<article>
				<h2 id="profile-not-run">
					「プロファイルが実行されなかった」、または<code>engine.profilesNotRun</code>が空でない
				</h2>
				<p>
					複数のプロファイルでのスキャンでは、実行できなかったプロファイルが理由とともに<code>engine.profilesNotRun</code>に列挙され、ほかのプロファイルは引き続き実行されます。理由は、<code>unknown-profile</code>（そのようなプロファイルがない。パックのプロファイルには、そのパックを<code>packs</code>に渡す必要があります）、<code>pack-skipped</code>（そのパックが実行されなかった。<a href="#pack-did-not-run">後述の項目</a>を参照）、<code>overridden-by-selection</code>（<code>runOnly</code>の含める指定、または<code>engineOptions</code>のルールIDやタグが、すべてのプロファイルについて代わりにルールを選んだ）のいずれかです。そうしたスキャンは求められたより少なく判定したことになるので、SARIFとJUnitは<code>allowProfilesNotRun: true</code>を指定しない限りエラーを報告し、CLIは<code>--allow-profiles-not-run</code>を付けない限り終了コード<code>2</code>で終了し、バインディングは<code>'profile-not-run'</code>のスキャンギャップを報告し、test-matchersはアサーションを失敗させます。<a href="/configuration/engine-options/#several-profiles">エンジンオプション</a>を参照してください。
				</p>
			</article>

			<article>
				<h2 id="pack-did-not-run">「パックが実行されなかった」、または<code>skippedPacks</code>が空でない</h2>
				<p>
					<code>core</code>の範囲がインストールされているコアを含まないパック、妥当でないパック、コアと両立しないパック（名前空間の外にあるルールID、コアが持つ辞書のキー）はスキップされます。スキャンはそのパックなしで実行され、警告を出し、理由とともに<code>result.skippedPacks</code>に列挙します。<code>strictOptions</code>のもとではエラーを投げます。ページ内では、<code>engineOptions.packs</code>で指定されたのに、どの<code>packScript</code>の呼び出しも登録していないパックや、別のバージョンのコアで登録されたパックが、同じように列挙されます。バインディングはこれを<code>'pack-skipped'</code>のスキャンギャップとして報告し、test-matchersはアサーションを失敗させ、CLIは終了コード<code>2</code>で終了します。パックは<code>@surea11y/core</code>およびそれを実行するパッケージと並べてインストールし、3つが同じコアを共有するようにしてください。<a href="/configuration/packs/#when-a-pack-doesnt-run">パック</a>を参照してください。
				</p>
			</article>

			<article>
				<h2>「カスタムルールが、はっきりした理由もなく常に<code>cantTell</code>を返す」</h2>
				<p>
					まず結果の
					<code>error</code>
					フィールドを確認してください。
					<code>"&lt;something&gt; is not defined"</code>
					と書かれている場合、
					<code>runInPage</code>
					が関数本体の外にある変数（モジュールスコープの
					<code>const</code>
					、インポートしたヘルパーなど、
					<code>ctx.*</code>
					を経由せずに参照しているもの）を参照しています。これは実際によくある落とし穴です。
					<code>runInPage</code>
					はソースコードの文字列にシリアライズされ、後でページのコンテキスト内で評価し直されます。そのため
					<strong>ビルドではこれを検出できず、ルールを実行して初めてわかります</strong>
					。しかも失敗はクラッシュではなく、（情報に乏しいとはいえ）ふつうの結果に見えます。詳しい説明と修正方法（値を
					<code>runInPage</code>
					の中に移すか、
					<code>ctx.rule</code>
					／
					<code>ctx.helpers</code>
					経由で渡す）は
					<a href={`${core}/docs/RULE_AUTHORING.md`}><code>RULE_AUTHORING.md</code></a>
					の§1.1を参照してください。
				</p>
			</article>

			<article>
				<h2>
					「ジオメトリに依存するルール（
					<code>target-size-minimum</code>
					など）が常に
					<code>notApplicable</code>
					を返す」
				</h2>
				<p>
					素のjsdom（実際のブラウザーなし）はCSSレイアウトを実装していないため、
					<code>getBoundingClientRect()</code>
					は常にゼロのジオメトリを返します。
					<strong>
						実際のレイアウトが必要なルールは、jsdomでは推測せずに
						<code>notApplicable</code>
						を報告します。
					</strong>
					これらのルールで実際の検出結果を得るには、実際のブラウザー（Puppeteer／Playwright。
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
					の<span lang="en">Pattern 2</span>を参照）で実行してください。
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a>
					も参照してください。
				</p>
			</article>

			<article>
				<h2 id="framed-page-rules">
					「フレームの中で、タイトル、言語、ランドマークのルールが<code>notApplicable</code>になる」
				</h2>
				<p>
					1.15以降、フレーム内に表示された文書はそれ自体で1つのページではありません。その中では、<code>page-title-present</code>、<code>page-title-patterns</code>、<code>html-lang-attr-present</code>、<code>meta-viewport-zoom-enabled</code>、<code>meta-viewport-large</code>、<code>region</code>、<code>bypass-blocks-present</code>、<code>landmark-one-main</code>、<code>page-has-heading-one</code>が<code>notApplicable</code>になります。人々が使うタイトル、言語、ランドマークを持つのはフレームを囲むページであり、ブラウザーはフレーム内の文書のビューポートの<code>&lt;meta&gt;</code>を無視するからです。テスト対象のページを自身のフレームの中に表示するテストランナーは、<code>engineOptions.topLevelDocument: true</code>を設定します。<a href="/getting-started/cypress/">@surea11y/cypress</a> 1.6.0は自動で設定します。<a href="/configuration/engine-options/">エンジンオプション</a>を参照してください。
				</p>
			</article>

			<article>
				<h2 id="web-component-canttell">
					「Webコンポーネントが<code>cantTell</code>（<code>name_internals</code>）になる」
				</h2>
				<p>
					プライベートフィールド（<code>#internals</code>）に保持した<code>ElementInternals</code>を通じて、自分に名前を付けたり、状態を設定したり、ロールを与えたりするカスタム要素は、ブラウザーによって公開されますが、ページのスクリプトはそれを読み戻せません。1.12以降、エンジンはプロパティ（<code>_internals</code>、<code>internals</code>など）に保持されたinternalsを読み取り、読み取れる名前や必須の状態がないほかの定義済みカスタム要素については、不合格にする代わりに確認を求めます（<code>name_internals</code>、<code>state_internals</code>）。
				</p>
				<p>
					そうした要素をスキャンで判定できるようにするには、ページのスクリプトが動く前にinternalsフックをインストールしてください。各バインディングの<code>installInternalsHook()</code>（<a href="/getting-started/playwright/">Playwright</a>ではページかコンテキスト、<a href="/getting-started/puppeteer/">Puppeteer</a>ではページ、<a href="/getting-started/selenium/">Selenium</a>ではドライバー、<a href="/getting-started/webdriverio/">WebdriverIO</a>ではブラウザー、<a href="/getting-started/cypress/">Cypress</a>ではサポートファイルか<code>onBeforeLoad</code>で呼び出します）、<a href="/getting-started/test-matchers/">test-matchers</a>のセットアップファイル、自分で用意したページならcoreの<code>internalsHookScript()</code>を使います。フックが動いたかどうかは、結果の<code>engine.environment.internalsHook</code>（<code>'early'</code>または<code>'late'</code>）でわかります。フックがあると、ページ上のどのスクリプトもすべてのコンポーネントのinternalsを読めるため、テストと監査のための実行に限って使うものです。<a href="/help/known-limitations/">既知の制限事項</a>を参照してください。
				</p>
			</article>

			<article>
				<h2>
					「
					<code>fail</code>
					／
					<code>cantTell</code>
					の検出箇所しか表示されない。合格した要素の一覧はどこにあるのか」
				</h2>
				<p>
					<strong>
						このエンジンは設計上、ルールが
						<em>合格</em>
						とした要素を列挙しません。列挙するのは指摘した要素だけです。
					</strong>
					ルール全体の
					<code>outcome: 'pass'</code>
					は「適用対象が存在し、どれも指摘されなかった」ことを意味し、
					<code>occurrences</code>
					は
					<code>[]</code>
					です。例外はコントラストのルールで、その
					<code>pass</code>
					には、要素ではなくスキャンについて説明する（対象となり計算できたテキストがどれだけあったか）、
					<code>selector</code>
					が空の出現箇所が1つ付きます。具体的にどの要素がチェックされて問題なしとされたのかを知りたい場合、その情報は現在公開されていません。
					<a href="/results-reports/output-schema/"><code>OUTPUT_SCHEMA.md</code></a>
					を参照してください。
				</p>
			</article>

			<article>
				<h2>
					「反応するはずのルールが、問題があるとわかっているページで
					<code>notApplicable</code>
					を返した、または何も見つけなかった」
				</h2>
				<p>よくある原因は2つあります。可能性の高い順に挙げます。</p>
				<ol>
					<li>
						<strong>要素がアクセシビリティツリーから除外されている</strong>
						：
						<code>aria-hidden="true"</code>
						、
						<code>display: none</code>
						、
						<code>visibility: hidden</code>
						、
						<code>hidden</code>
						、または
						<code>inert</code>
						の祖先要素。ほとんどのルールは、支援技術からすでに見えないコンテンツをスキップします。非表示の要素をチェックしても意味がなく、どのユーザーも出会わないコンテンツに対して誤解を招く
						<code>fail</code>
						を出しかねないからです。この除外が意味をなさない場合に、明示的に除外しないルールもあります（たとえば
						<code>no-autoplay-audio</code>
						。非表示のオーディオでも音は鳴ります）。
						<code>src/checks/</code>
						にある該当ルールのファイル先頭のコメント（
						<code>@applicability</code>
						）を確認してください。
					</li>
					<li>
						<strong><code>excludeSelectors</code></strong>
						：これを設定している場合（直接、または共有設定から継承している場合）、対象の要素がそれに一致していないか確認してください。これは
						<code>engineOptions.rules[ruleId].excludeSelectors</code>
						で単一のルールに限定することもできます（
						<a href="/configuration/engine-options/#rule-scoped-excludeselectors"><code>ENGINE_OPTIONS.md</code></a>
						を参照）。反応するはずのルールが1つの要素に対してだけ
						<code>notApplicable</code>
						／
						<code>pass</code>
						を返し続ける場合は、グローバルの除外リストだけでなく、そのルール固有の除外リストが設定されていないかも確認してください。
					</li>
				</ol>
			</article>

			<article>
				<h2 id="why-criterion-canttell">「チェックはすべて<code>pass</code>なのに、なぜWCAGの各達成基準が<code>cantTell</code>なのか」</h2>
				<p>
					1.14からは、<code>rulesResults</code>のWCAGの集約が<code>pass</code>になるのは、その達成基準が求めることをすべてルールがチェックする場合だけで、そうした達成基準はまだ1つも挙げられていません（<code>src/coverage/complete-applicability.js</code>の<code>COMPLETE_CHECK</code>）。達成基準のルールがすべて<code>pass</code>のとき、その集約は<code>reasonCode</code>が<code>composite.rollup.cantTell.partialCheck</code>の<code>cantTell</code>になります。ルールがチェックする部分は満たされていて、残りは人が確認するということです。<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a>は<code>{'<html lang="fr">'}</code>が言語を示していることを確かめますが、ページがフランス語で書かれていることは確かめません。同じように、ルールが何も見つけなかった達成基準が<code>notApplicable</code>になるのは、その達成基準が適用されるすべてのケースをルールが見つけられる場合だけで、それ以外は<code>composite.rollup.cantTell.partialCoverage</code>の<code>cantTell</code>です。不合格のルールがあれば、その達成基準は引き続き不合格になります。これらは「チェックは問題なし、確認が必要」「チェックする対象が見つからない」として表示し、<code>pass</code>として表示しないでください。<a href="/conformance/wcag-mapping/#when-a-criterion-passes">WCAG適合性との対応</a>を参照してください。
				</p>
			</article>

			<article>
				<h2>「スキャン結果に不合格がないなら、そのページはWCAGに適合しているのか」</h2>
				<p>
					いいえ。
					<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>
					を参照してください。
					<strong>
						ルールの<code>pass</code>が意味するのは、実行されたチェックが、スキャンしたページの範囲で問題なしだったということです。
					</strong>
					ページの一部に絞ったスキャン、一部のルールに限ったスキャン、jsdomで実行したスキャンは、チェックできる範囲が狭くなります。WCAGのかなりの部分は、人の判断（正確な代替テキスト、理解しやすいエラーメッセージ）や、このエンジンの設計ではまったく行えない動的なテスト（キーボードトラップ、ズーム時のリフロー）を必要とします。明示的な、意図的に網羅を目指していない一覧は
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a>
					を参照してください。残りは人が確認するもので、その方法はコアの<a href="/conformance/procedures/">テスト手順</a>が達成基準ごとに示しています。
				</p>
			</article>

			<article>
				<h2>「<code>cantTell</code>は失敗として扱うべきか」</h2>
				<p>
					<strong>「人が確認する必要がある」として扱ってください。設計上、合格でも不合格でもありません。</strong>
					よくある選択は、
					<code>cantTell</code>
					の検出結果を記録するだけで、CIを失敗させないことです。エンジンが判定できないと明言したものでビルドを失敗させると、みんながゲートを無視するようになりがちだからです。マージ前にすべてをレビューしたいチームは、それでゲートを設けることもできます。どちらの場合も、不合格とは分けて扱ってください。その中間として、ページの手がかりが不合格を示している、不合格の方向に傾く検出結果だけでビルドを止めることもできます。<a href="/results-reports/junit-report/#options">JUnit</a>と<a href="/results-reports/sarif-report/#options">SARIF</a>のレポートの<code>leanFailAs</code>、または<code>leaningFailures(result)</code>を使います（<a href="/results-reports/output-schema/#leans">出力スキーマ</a>を参照）。coreのルールの<code>cantTell</code>の検出結果は、それぞれ<code>howToCheck</code>で答え方を示します。この動作を変えたい場合（カスタムポリシーの契約を使うなど）は
					<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>
					を、CIゲートの具体例は
					<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
						<code>INTEGRATION.md</code>
					</a>
					を参照してください。
				</p>
			</article>

			<article>
				<h2>「ロケールが部分的にしか翻訳されていない場合はどうなるのか」</h2>
				<p>
					<strong>欠けているキーは文字列ごとに英語へフォールバックします（空欄や壊れた結果にはなりません）。そのため、部分的なロケールでも完全に失敗することはなく、品質が段階的に下がるだけです。</strong>
					仕組みと現在の対応範囲は
					<a href="/configuration/locales/"><code>I18N.md</code></a>
					を参照してください。キーの一致は期待任せではなく、core自身のビルドで強制しています。英語に追加された、または名前が変わったキーはすべて、ほかのすべてのロケールファイルに反映され、誰かが翻訳するまで英語のテキストを保持します。そのため、ロケールの文言が遅れることはあっても、キーが遅れることはありません。
				</p>
			</article>

			<article>
				<h2>
					「
					<code>runDomRulesInPage</code>
					と
					<code>runa11yCoreInPage</code>
					、どちらを使えばよいのか」
				</h2>
				<p>
					同じNodeプロセス内で直接呼び出す場合（jsdom）は
					<code>runDomRulesInPage</code>
					です。
					<em>関数そのもの</em>
					を別のJSレルムに渡す場合は
					<code>runa11yCoreInPage</code>
					です。ほぼ常にPuppeteer／Playwrightの
					<code>page.evaluate</code>
					のケースで、これは関数をソースコードの文字列にシリアライズし、ブラウザーのタブ内で再実行します（タブからはNodeのモジュールスコープにアクセスできません）。両方のパターンの完全な例は
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
					を参照してください。
				</p>
			</article>

			<article>
				<h2 id="baseline-after-upgrade">「アップグレード後、ベースラインが既知の検出結果を新規として、そのエントリーをstaleとして報告する」</h2>
				<p>
					検出結果の識別子には理由コードが含まれます。1.14では、理由コードを付けていなかった17のルールにコードが付き、いくつかのコードが原因ごとに分割されました。1.13で書いたベースラインは、<code>src/baseline-moves.json</code>によって、1.14.xでは引き続きそれらの検出結果と一致しますが、それらの移動を削除した1.15では一致しません。1.15では、古いコードのエントリーは古くなったものであり、その検出結果は新しいものになります。1.14.xのもとで<code>@surea11y/core/baseline</code>の<code>migrateBaselineEntries</code>でファイルのコードを書き換えてからアップグレードするか、1.15のもとでベースラインを再生成して差分を確認してください。1.15自体は理由コードを移動していないので、1.14で書いたベースラインは引き続き一致します。アップグレードで判定結果が変わった検出結果は、それでも新規になったり消えたりします。その理由は変更履歴に書かれています。<a href="/conformance/baseline/#upgrading">ベースライン／許可リスト</a>を参照してください。
				</p>
			</article>

			<article>
				<h2 id="stylesheets-not-readable">「<code>css-orientation-lock</code>が<code>STYLESHEETS_NOT_READABLE</code>で確認を求める」</h2>
				<p>
					ページのスクリプトは、別のオリジン（CDN、フォントサービス）が配信するスタイルシートを読めないため、CSSを読むルールはその内容がわかりません。そのテキストを<code>engineOptions.styleSheetTexts</code>でスキャンに渡してください。<code>preloadStyleSheets()</code>、またはブラウザーバンドルの<code>runa11yCoreInPageAsync</code>は、サーバーが共有しているものを取得します。ブラウザーを操作するツールなら、それ以外のものもページの外から取得できます。GitHub上の統合ガイド<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}><code>INTEGRATION.md</code></a>の「<span lang="en">Style sheets from another origin</span>」を参照してください。
				</p>
			</article>

			<article>
				<h2 id="results-changed-1-14">「core 1.14にアップグレードしたら、結果が変わった」</h2>
				<p>
					1.14は、意図して<code>cantTell</code>を多く報告し、主張することを減らしています。パイプラインに表れやすい変更は次のとおりです。
				</p>
				<ul>
					<li>
						<strong>WCAGの集約は<code>pass</code>になりません。</strong>
						達成基準が<code>pass</code>になるのは、その達成基準が求めることをすべてルールがチェックする場合だけで、完全にチェックできるものとして挙げられた達成基準はまだありません。そのため、ルールがすべて<code>pass</code>の達成基準は<code>cantTell</code>（<code>composite.rollup.cantTell.partialCheck</code>）になります。ルールが何も見つけなかった達成基準が<code>notApplicable</code>になるのは2.4.3、2.4.4、2.4.7、2.4.9、2.5.3、4.1.1だけで、それ以外は<code>cantTell</code>（<code>composite.rollup.cantTell.partialCoverage</code>）です。不合格のルールがあれば、その達成基準は引き続き不合格になります。満たされた達成基準を数えるダッシュボードやゲートには、1つも表示されません。<a href="#why-criterion-canttell">前述の項目</a>と<a href="/conformance/wcag-mapping/#when-a-criterion-passes">WCAG適合性との対応</a>を参照してください。
					</li>
					<li>
						<strong>2つのルールが確認を求める範囲が広がります。</strong>
						<a href="/rules/page-title-patterns/"><code>page-title-patterns</code></a>は、汎用的なタイトルやテンプレートのタイトルだけでなく、すべてのページタイトルについて確認を求めます。タイトルがページを説明しているかどうかは人が判断することだからです（G88）。<a href="/rules/duplicate-id/"><code>duplicate-id</code></a>は、WCAG 2.0と2.1でも4.1.1について確認を求めます。2023年の正誤表が4.1.1を満たされているものとみなしているからです。ただし、<code>en301549-v3.2.1</code>のように<code>keepsParsing: true</code>を宣言したプロファイルは例外です。
					</li>
					<li>
						<strong>11の新しいルール</strong>
						が追加され、その中には3.3.1（<a href="/rules/invalid-field-error-message/"><code>invalid-field-error-message</code></a>）、4.1.3（<a href="/rules/live-region-announcements/"><code>live-region-announcements</code></a>）、1.4.5（<a href="/rules/image-of-text/"><code>image-of-text</code></a>）の最初のルールがあります。ほとんどは確認を求めるものですが、<a href="/rules/click-handler-keyboard-operable/"><code>click-handler-keyboard-operable</code></a>、<a href="/rules/focus-not-removed-by-script/"><code>focus-not-removed-by-script</code></a>、<a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a>は不合格を報告することがあります。属性間の制約（<code>aria-valuemax</code>を上回る<code>aria-valuemin</code>など）をチェックするようになった<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a>も同様です。<a href="/rules/">ルールカタログ</a>を参照してください。
					</li>
					<li>
						<strong>一部の不合格は確認に変わり、新しい不合格も出ます。</strong>
						<code>td-has-header</code>は、見出しセルのない大きな表について、すべてのセルを不合格にする代わりに一度だけ確認を求めます。<code>form-control-single-label</code>は、ラベルが2つあるフィールドについて確認を求めます。コントラストは、ページが描画するもののより多くの部分で計測されるようになった（各配色でのページのキャンバス上のテキスト、<code>::first-line</code>、<code>font-size-adjust</code>、ページが色を選んだプレースホルダー）ため、新たにコントラストの不合格が出ることがあります。
					</li>
					<li>
						<strong>一部の検出結果に新しい理由コードが付きます。</strong>
						理由コードを付けていなかった17のルールが付けるようになり、いくつかのコードは原因ごとに分割されました。1.13で書いたベースラインは1.15まで引き続き一致します。<code>migrateBaselineEntries</code>で書き換えてください（<a href="#baseline-after-upgrade">前述の項目</a>を参照）。そうした検出結果のCode Scanningのアラートは、いったん閉じて新しいものとして再び表示されます。
					</li>
					<li>
						<strong>すべての<code>cantTell</code>に、答え方が示されます。</strong>
						coreのルールの検出結果には<code>howToCheck</code>の手順が付き、一部にはページの手がかりがどちらを示しているかを表す<code>lean</code>が付きます。判定結果は<code>cantTell</code>のままで、指定しない限り（<code>leanFailAs</code>）<code>lean</code>でビルドが止まることはありません。<a href="/results-reports/html-report/">HTMLレポート</a>は、これらの検出結果を、不適合の可能性が高いもの、適合の可能性が高いもの、人による確認が必要なものに分けて表示します。<a href="/results-reports/output-schema/#leans">出力スキーマ</a>を参照してください。
					</li>
					<li>
						<strong>1.14.1では、テキストの間隔による不合格が減ります。</strong>
						<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a>
						は、ページが失っていないテキストを不合格にしなくなりました。同意バナーの裏でよくあるように<code>{"body { position: fixed }"}</code>でスクロールを固定したページと、ビューポートより高い固定ボックスは、<code>VIEWPORT_SCROLL_LOCKED</code>として確認を求めます。Angular Materialのフィールドのフローティングラベルのように、ページのスクリプトがテキストに合わせて大きさを決めるボックスで切れたテキストは、<code>TEXT_CLIPPED_SCRIPT_SIZED</code>として確認を求めます。それらのベースラインの項目やCode Scanningのアラートは、修正されたバグと同じように閉じます。また、36の質問の手順は、不合格につながる前に、ページ上の別の方法で同じことができるかどうかも確認するようになりました。
					</li>
					<li>
						<strong>1.14.2では、ブラウザーが描画するとおりにページを読み取ります。</strong>
						ブラウザーが<code>content-visibility: auto</code>で画面外のレイアウトを省略する内容は、実際にレイアウトされた状態で計測されます。そのため、カードが並ぶページで出ていた誤った重なり、背景についての質問、到達できないフォーカスやターゲットサイズの検出結果はなくなり、
						<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a>
						は、そうした要素が切り取るテキストを不合格にするようになりました（<code>details.clippedBy</code>）。
						<a href="/rules/label-in-name/"><code>label-in-name</code></a>
						は、接したボックスにまたがっているだけのラベルを不合格にしなくなり、スタイルシートを読むルールは、印刷専用やサポートされていないCSSと、要素に届かないルールを読み飛ばします。報告されなくなった検出結果のベースラインの項目やCode Scanningのアラートは、修正されたバグと同じように閉じます。
					</li>
				</ul>
				<p>
					変更の全一覧は、coreの<a href={`${core}/CHANGELOG.md`}><code>CHANGELOG.md</code></a>にあります。
				</p>
			</article>
		</>
	);
}
