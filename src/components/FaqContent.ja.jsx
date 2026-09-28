import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2>「<code>runOnly: ['some-rule-id']</code>を渡したのに、全ルールが実行された」</h2>
				<p>
					<strong><code>runOnly</code>は配列そのものではなく、オブジェクトでなければなりません。</strong>
					<code>runOnly: ['img-alt-present']</code>
					は黙って無視されます（エンジンは「すべて実行」に切り替わります）。この形には、エンジンが実際に確認するフィールド（
					<code>includeRuleIds</code>
					、
					<code>tags</code>
					など）が1つもないからです。配列をそのまま渡すのはついやりがちなので、まずここを確認する価値があります。
				</p>
				<p>修正方法：</p>
				<CodeBlock lang="js" lines={["runOnly: { includeRuleIds: ['img-alt-present'] }"]} />
				<p>
					完全な構造は
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>
					を参照してください。
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
					は「適用対象が存在し、どれも指摘されなかった」ことを意味しますが、どちらの場合も
					<code>occurrences</code>
					は
					<code>[]</code>
					です。具体的にどの要素がチェックされて問題なしとされたのかを知りたい場合、その情報は現在公開されていません。
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
						が意味するのは、
						<em>自動化できる</em>
						チェックがすべて問題なしだったということです。
					</strong>
					WCAGのかなりの部分は、人の判断（正確な代替テキスト、理解しやすいエラーメッセージ）や、このエンジンの設計ではまったく行えない動的なテスト（キーボードトラップ、ズーム時のリフロー）を必要とします。明示的な、意図的に網羅を目指していない一覧は
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a>
					を参照してください。
				</p>
			</article>

			<article>
				<h2>「<code>cantTell</code>は失敗として扱うべきか」</h2>
				<p>
					<strong>「人が確認する必要がある」として扱ってください。設計上、合格でも不合格でもありません。</strong>
					多くのチームは
					<code>cantTell</code>
					の検出結果を記録するだけで、CIを失敗させることはしません。エンジンが判定できないと明言したものでビルドを失敗させると、みんながゲートを無視するようになりがちだからです。この動作を変えたい場合（カスタムポリシーの契約を使うなど）は
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
					同じNodeプロセス内で直接呼び出す場合（jsdom、ブラウザー拡張機能のコンテンツスクリプト）は
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
