import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function BaselineContent() {
	return (
		<>
			<p>
				厳格なCIゲート（「
				<code>fail</code>
				の判定結果が1つでもあればビルドを失敗させる」）は、完璧ではない既存サイトを初めてスキャンするチームにとって導入の障害になります。既存の違反をすべて直すまで、何もリリースできないからです。ベースラインを使えば、チームは「このN件は既知なのでゲートの対象にしない。ただし本当に新しい違反が出たらその時点で失敗させる」と指定できます。
			</p>
			<CodeBlock
				lines={[
					"# Once: record every current fail occurrence, does not fail the build.",
					{ text: "surea11y scan ./dist/index.html --write-baseline baseline.json", command: true },
					"",
					"# Commit baseline.json to git.",
					"",
					"# From then on, in CI: only a NEW (not-yet-baselined) fail occurrence gates the build.",
					{ text: "surea11y scan ./dist/index.html --baseline baseline.json", command: true },
				]}
			/>
			<p>
				ベースラインファイルはgitにコミットする前提です。そうすることで、アクセシビリティの負債を追加で受け入れることが、明示的でレビュー可能な判断になります。新しい違反は件数の静かな変化ではなく、PRでのファイル差分の新しい行として現れます。
			</p>

			<h2>役に立つ場面</h2>
			<ul>
				<li>
					<strong>既存サイトにスキャンを導入するとき。</strong>
					上で挙げた、そもそもの動機となったケースです。成熟したサイトを初めてスキャンすると、既存の違反が数百件見つかることがあります。それらを一度ベースラインに記録すれば、「まずすべて直す」ことを求めずに、すぐにゲートを有効にできます。
				</li>
				<li>
					<strong>減っていく様子が見える段階的な修正。</strong>
					違反をまとめて修正し、定期的に
					<code>--write-baseline</code>
					でベースラインを再生成します。再生成のたびにエントリーが消え、gitの差分は
					<em>小さく</em>
					なっていきます。ファイルそのものが進捗の記録になり、一群の問題を直したPRでは、何が片付いたのかが正確にわかります。
				</li>
				<li>
					<strong>自分では管理できないサードパーティーやベンダーのコンテンツ。</strong>
					ページに埋め込まれたウィジェット（チャットバブル、広告枠、決済用のiframe）に、既知で自分では直せない違反がある場合です。その特定の検出箇所だけをベースラインに記録するほうが、
					<code>excludeSelectors</code>
					でサブツリー全体を除外する（
					<a href="/configuration/engine-options/#rule-scoped-excludeselectors">エンジンオプションのガイド</a>
					を参照）よりも正確です。その周辺のほかの場所、自分のコードの中も含めて新たに入り込んだ問題は、通常どおりゲートの対象になります。
				</li>
				<li>
					<strong>大規模なリファクタリング中のリグレッション防止。</strong>
					移行の途中では、一部のルールが一時的に失敗するのもやむを得ない場合があります。その失敗はすでに把握されていて、多数のPRにわたって修正が進んでいるものです。進行中の既知の違反をベースラインに記録しておけば、ゲートを完全に切ったり、全PRをそれで止めたりせずに、同じ期間にほかのPRが持ち込んだ
					<em>無関係な</em>
					新しいリグレッションを検出できます。
				</li>
				<li>
					<strong>新しいルールや、より厳しいルールの段階的な導入。</strong>
					コードベースがまだ満たしていないルール（またはWCAGのレベル全体）を有効にする場合です。既存の不足をベースラインに記録してすぐにゲートを有効にし、残りの課題は別途片付けながら、そのルールへの
					<em>新たな</em>
					違反を防ぎます。コードベースが準拠するまでルールの有効化を待つ必要はありません。
				</li>
			</ul>

			<h2>照合の仕組み</h2>
			<p>
				検出箇所の構造には、ページ上の位置に左右されない完全な識別子になるものはありません（
				<a href="/results-reports/output-schema/">出力スキーマ</a>
				を参照）。
				<code>selector</code>
				と
				<code>structuralPath</code>
				はどちらもDOM内での要素の位置から導かれるため、指摘された要素自体はまったく変わっていなくても、ページのほかの場所で
				<em>無関係な</em>
				マークアップが変わるとずれることがあります。
			</p>
			<p>そこで、ベースラインのエントリーの識別子は次のようにしています。</p>
			<CodeBlock lines={["ruleId + reasonCode + html"]} />
			<p>
				<code>reasonCode</code>
				は
				<code>occurrence.data.details.reasonCode</code>
				にあるルール固有のコード（ルールが設定しない場合、または空でない文字列以外を設定した場合は
				<code>"DEFAULT"</code>
				）、
				<code>html</code>
				は検出箇所のouterHTMLのスニペットです。位置ではなく内容に基づくので、指摘された要素自体のマークアップが変わらない限り、要素がページ内で移動しても（並べ替え、無関係な兄弟要素の追加や削除）一致し続けます。<code>&lt;html&gt;</code>や<code>&lt;body&gt;</code>で報告される、ページそのものについての検出結果（<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a>、<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>、<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>）では、スニペットは開始タグだけなので、ページの内容を編集しても新しい検出結果にはなりません。スニペットは、各タグの属性を名前順に、クラス名を並べ替えたうえで比較されます。そのため、前回のビルドが<code>src class="a b"</code>と書いたところを今回のビルドが<code>class="b a" src</code>と書いても一致します。比較は照合の時点で行われるので、この変更より前に書かれたベースラインファイルも引き続き一致します。
				<code>selector</code>
				もベースラインファイルに記録されますが、差分を読む人のための手がかりにすぎず、照合には一切使いません。
			</p>
			<p>
				<strong>既知の制限事項</strong>
				：
				<em>要素自体の</em>
				マークアップに動的な内容（タイムスタンプ、ライブカウンター、ランダムに生成されるID）が含まれる場合、
				<code>html</code>
				のスニペットが毎回異なるため、2回のスキャンの間で一致することはありません。お使いのページがこれに当てはまる場合、その特定のルールや要素についてはベースラインの仕組みは役に立ちません。後述の「代替手段」を参照してください。
			</p>
			<p>
				<strong>照合では、有無だけでなく検出箇所の数も数えます。</strong>
				ページに、
				<code>ruleId</code>
				+
				<code>reasonCode</code>
				+
				<code>html</code>
				がバイト単位で同一になる要素が3つあり（同じ壊れたコンポーネントが3回繰り返されている場合など）、ベースラインにはそのうち1つしか記録されていなければ、新しいスキャンは3つすべてを既知とはせず、既知1件、新規2件と報告します。
			</p>
			<p>
				フレーム横断の結果（
				<code>runa11yCoreAcrossFrames</code>
				）でフレーム内にある検出結果は、フレームでも区別されます。そのエントリーにはフレームの
				<strong>パス</strong>
				、つまりそのフレームに至るフレーム要素のセレクター（
				<code>"frame": ["#checkout"]</code>
				）が記録され、そのパスのフレームにある検出結果とだけ一致します。ページとフレームにある同じ壊れたコンポーネントは、2つの検出結果です。
				<code>frame</code>
				のないエントリーはページ自身のものなので、単一ドキュメントのスキャンから書き出したベースラインは引き続きページと一致します。
			</p>
			<p>
				コンパクトな結果（
				<code>engineOptions.output.detail: 'findings'</code>
				。
				<a href="/results-reports/output-schema/#top-level-result">出力スキーマ</a>
				を参照）は、それが表す完全な結果として読まれるので、同じように報告されます。
			</p>
			<p>
				新しいスキャンのどれとも一致しないベースラインのエントリーは
				<strong>stale（古い）</strong>
				として報告されます。その違反が修正されたのかもしれませんし、要素のマークアップが変わったのかもしれません。あるいは、スキャンがそこに届かなかった（別のビューポート、範囲、ルールのセット）のかもしれません。これは情報提供のためだけのもので、ビルドを止めることはありません。staleのエントリーを確認したうえで、定期的に
				<code>--write-baseline</code>
				でベースラインを再生成して整理してください。
			</p>

			<h2 id="scanning-at-several-viewport-widths">複数のビューポート幅でのスキャン</h2>
			<p>
				ベースラインのエントリーはビューポートを記録せず、照合にも使いません。同じ要素の同じ欠陥は、どの幅でも一致します。これは、検出結果がレイアウトに左右されないページに適しています。<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a>や<a href="/rules/target-size-minimum/"><code>target-size-minimum</code></a>のようにレイアウトに依存するルールは、ある幅では<code>fail</code>になり、別の幅ではならないことがあります。そのため、複数の幅でスキャンするページでは、<strong>幅ごとに1つのベースライン</strong>を用意してください（<code>a11y-baseline-390.json</code>、<code>a11y-baseline-1280.json</code>）。
			</p>
			<p>
				すべての幅から書き出した1つのベースラインでも、ゲートは正しく機能します。検出結果が新規になるのは、どのエントリーにも一致しない場合だけだからです。ただしその場合、各実行がほかの幅の検出結果をstale（古い）として報告するため、staleの件数から何が修正されたかを読み取れなくなります。
			</p>

			<h2 id="file-format">ファイル形式</h2>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "DEFAULT", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code>
				は、
				<code>{"{ version: 1, entries: [...] }"}</code>
				の形でないファイルを、古い形式や別の形式だと推測せず、終了コード2の明確なエラーで拒否します。
				<code>matchBaseline</code>
				と、SARIFおよびJUnitのレポーターの
				<code>baselineEntries</code>
				オプションは、保存したままのファイル（それを
				<code>JSON.parse</code>
				したもの）か、その
				<code>entries</code>
				リストを受け取ります。
			</p>

			<h2><code>--json</code>との併用</h2>
			<p>
				<code>--baseline</code>
				または
				<code>--write-baseline</code>
				を
				<code>--json</code>
				と一緒に使うと、出力されるオブジェクトには通常のエンジンの結果と並んで
				<code>baseline</code>
				キーが追加されます（これはCLIの出力だけのもので、出力スキーマで説明しているエンジン自体の結果の契約には含まれません）。
			</p>
			<ul>
				<li>
					<code>--write-baseline</code>
					：
					<code>{'{ mode: "write", path, entries: <number written> }'}</code>
				</li>
				<li>
					<code>--baseline</code>
					：
					<code>
						{'{ mode: "check", totalFail, knownCount, newCount, staleCount, newOccurrences: [...] }'}
					</code>
				</li>
			</ul>

			<h2>代替手段：2回のスキャンの差分を自分で取る</h2>
			<p>
				お使いのページがこのモデルに合わない場合（指摘される要素自体に動的な内容が多い場合）は、2回分の
				<code>--json</code>
				の完全な出力の差分を自分で取る方法がいつでも使えます。
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>
				を参照してください。識別や照合のロジックを完全に制御できる代わりに、それを自分で書く必要があります。
			</p>
		</>
	);
}
