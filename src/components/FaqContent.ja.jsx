import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-12">「core 1.12にアップグレードしたら、CIの結果が変わった」</h2>
				<p>
					エンジンが見つけるものはほとんど変わっていません。変わったのは、それがどこに表れるかと、いくつかのルールです。パイプラインに表れやすい変更は次のとおりです。
				</p>
				<ul>
					<li>
						<strong>空の見出しが不合格になります。</strong>
						<a href="/rules/empty-heading/"><code>empty-heading</code></a>は、アクセシブルな名前のない見出しについて、確認を求める代わりに不合格にします。ベストプラクティスなので、何も選択しないスキャンや、ベストプラクティスを追加したスキャンで実行され、WCAGの目標、タグ、プロファイルのもとでは実行されません。見出しを直すか、WCAGの目標でスキャンしてください。
					</li>
					<li>
						<strong><a href="/rules/label-in-name/"><code>label-in-name</code></a>は、<code>aria-hidden</code>だけで隠したテキストも数えます。</strong>
						そうしたテキストも描画はされているからです。「<span lang="en">Download specification</span>」という名前の<code>{'Download <span aria-hidden="true">gizmo</span> specification'}</code>は、2.5.3で不合格になるようになりました。
					</li>
					<li>
						<strong>チェックを指定したスキャンも、その達成基準を報告します。</strong>
						ルールID、WCAGのレベルを示さないタグ、ベストプラクティスを指定したスキャンは、これまで空だった<code>rulesResults</code>に、それらのルールが属する達成基準を入れるようになりました。ほかのルールが選ばれていない達成基準は<code>cantTell</code>、つまり一部だけチェックしたものになります。それらをあるレベルまでに絞るには、<code>engineOptions.wcagLevel</code>（バインディングでは<code>.wcagLevel()</code>、CLIでは<code>--wcag-level</code>）を設定してください。<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照してください。
					</li>
					<li>
						<strong>5つのルールが、より多くの達成基準に算入されます。</strong>
						W3CのACTルールの対応付けに合わせたものです。<code>input-image-alt-present</code>は4.1.2、<code>aria-roles-valid</code>は1.3.1、<code>link-name-present</code>と<code>link-name-quality</code>は2.4.9（AAA）、<code>meta-refresh-timing-absent</code>は2.2.4と3.2.5（AAA）が加わります。検出結果は変わりませんが、1.3.1と4.1.2の集約が、これまで合格だったところで不合格になることがあります。
					</li>
					<li>
						<strong>JUnitのスイート名がどのロケールでも同じになります</strong>
						（<code>WCAG 4.1.2</code>）。タイトルはスイートの<code>title</code>プロパティに移ります。スイート名でテストを追跡しているダッシュボードでは、それらが一度だけ新しいテストとして表示されます。<a href="/results-reports/junit-report/">JUnitレポート</a>を参照してください。
					</li>
					<li>
						<strong>コントラストは、ページが描画されるとおりに計測されます。</strong>
						ブラウザーでは、背景のないページ上のテキスト、生成されたテキスト（<code>::before</code>、<code>::after</code>、<code>::marker</code>）、閉じた<code>&lt;select&gt;</code>が、これまで対象外か<code>cantTell</code>だったところで計測されるため、新たにコントラストの不合格が出ることがあります。コントロールの名前の代わりになっている1文字（「<span lang="en">Close</span>」という名前のボタンの「X」など）は、比率を下回っても不合格にせず、確認を求めます。
					</li>
					<li>
						<strong>名前のないWebコンポーネントは確認の対象になります。</strong>
						読み取れる名前のない定義済みのカスタム要素は、これまで不合格だったところで<code>cantTell</code>になります。<a href="#web-component-canttell">Webコンポーネントの項目</a>を参照してください。
					</li>
				</ul>
				<p>
					変更の全一覧は、coreの<a href={`${core}/CHANGELOG.md`}><code>CHANGELOG.md</code></a>にあります。
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
				<h2>「スキャン結果に問題がない（すべて<code>pass</code>）なら、そのページはWCAGに適合しているのか」</h2>
				<p>
					いいえ。
					<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>
					を参照してください。
					<strong>
						<code>pass</code>
						が意味するのは、実行されたチェックが、スキャンしたページの範囲で問題なしだったということです。
					</strong>
					ページの一部に絞ったスキャン、一部のルールに限ったスキャン、jsdomで実行したスキャンは、チェックできる範囲が狭くなります。WCAGのかなりの部分は、人の判断（正確な代替テキスト、理解しやすいエラーメッセージ）や、このエンジンの設計ではまったく行えない動的なテスト（キーボードトラップ、ズーム時のリフロー）を必要とします。明示的な、意図的に網羅を目指していない一覧は
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a>
					を参照してください。
				</p>
			</article>

			<article>
				<h2>「<code>cantTell</code>は失敗として扱うべきか」</h2>
				<p>
					<strong>「人が確認する必要がある」として扱ってください。設計上、合格でも不合格でもありません。</strong>
					よくある選択は、
					<code>cantTell</code>
					の検出結果を記録するだけで、CIを失敗させないことです。エンジンが判定できないと明言したものでビルドを失敗させると、みんながゲートを無視するようになりがちだからです。マージ前にすべてをレビューしたいチームは、それでゲートを設けることもできます。どちらの場合も、不合格とは分けて扱ってください。この動作を変えたい場合（カスタムポリシーの契約を使うなど）は
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
					を参照してください。キーの一致は期待任せではなく、強制しています。
					<code>npm run i18n:sync</code>
					は
					<code>en.json</code>
					に追加された、または名前が変わったキーをほかのすべてのロケールファイルに反映し、どれかが揃っていなければビルドが失敗します。追加されたキーは誰かが翻訳するまで英語のテキストを保持するので、ロケールの文言が遅れることはあっても、キーが遅れることはありません。
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
		</>
	);
}
