import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import localeData from "../data/locales.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const localeCoverageRows = localeData.locales.map((l) => ({
	id: l.id,
	locale: <code>{l.id}</code>,
	name: l.name,
	file: <code>{l.file}</code>,
	keys: String(l.keys),
	untranslated: l.canonical ? "—（基準・フォールバック用のセット）" : String(l.stillEnglish),
}));

const localeReasonRows = [
	{ id: "ok", reason: <code>ok</code>, meaning: "指定したとおりの辞書が使われ、その辞書にすべてのキーがそろっています。" },
	{
		id: "primary-subtag",
		reason: <code>primary-subtag</code>,
		meaning: (
			<>
				指定したコードのサブタグに対応する辞書がなかったため、その基本言語が使われました。
				<code>de-DE</code>
				を指定して
				<code>de</code>
				になった場合がこれです。通常の想定どおりの動作で、対処は不要です。大文字・小文字の違いだけならこれには当たらず、
				<code>DE</code>
				は
				<code>ok</code>
				を返します。
			</>
		),
	},
	{
		id: "dictionary-not-loaded",
		reason: <code>dictionary-not-loaded</code>,
		meaning: "プロジェクトとしてはその言語を提供していますが、このエンジンには含まれておらず、別途渡されてもいません。実際には、ロケール用の別ファイルを読み込まずにスタンドアロンのブラウザー用バンドルを使った場合です。",
	},
	{
		id: "unknown-locale",
		reason: <code>unknown-locale</code>,
		meaning: (
			<>
				プロジェクトにその言語の翻訳がまったくないため、英語が使われました。現時点では
				<code>ko</code>
				も
				<code>pt-BR</code>
				もこれに該当します。
			</>
		),
	},
	{
		id: "partial-dictionary",
		reason: <code>partial-dictionary</code>,
		meaning: "辞書は使われましたが一部のキーが欠けているため、その文字列だけ英語にフォールバックしました。",
	},
];

const dictionaryLocationRows = [
	{ id: "require", how: <code>require('@surea11y/core')</code>, what: "すべてのロケールが組み込み済みです。設定は不要です。" },
	{ id: "binding", how: "バインディング（Playwright、Cypressなど）", what: "すべてのロケールが組み込み済みです。設定は不要です。" },
	{
		id: "browser",
		how: <code>surea11y.browser.js</code>,
		what: (
			<>
				英語のみです。それ以外の言語は、このファイルの後に
				<code>surea11y.i18n.&lt;locale&gt;.js</code>
				を読み込んでください。
			</>
		),
	},
];

export function LocalesContent() {
	return (
		<>
			<p>
				ルールのtitle／description、検出箇所のsummary／hintはすべて、キーによる辞書引きでローカライズされます。言語ごとにハードコードしているわけではありません。このページで扱うのは、エンジンが結果やレポートに出力するメッセージの言語です。このドキュメントサイトの日本語訳とは別のものです。エンジンには日本語（<code>ja</code>）の辞書も同梱されており、WCAGの用語はWAICによるWCAG 2.2の日本語訳に従っています。
			</p>

			<h2>現在のロケール対応状況</h2>
			<DataTable
				label="ロケールの対応状況"
				rowKey="id"
				columns={[
					{ key: "locale", label: "ロケール", width: "18%" },
					{ key: "file", label: "ファイル", width: "24%" },
					{ key: "keys", label: "キー数", width: "12%" },
					{ key: "untranslated", label: "英語と同一の値", wrap: true },
				]}
				rows={localeCoverageRows.map((r) => ({
					...r,
					locale: (
						<>
							{r.locale} ({r.name})
						</>
					),
				}))}
			/>
			<p>
				最後の列は、英語のテキストと1文字残らず一致する値の数です。まだ誰も翻訳していないキーを見つけられますが、フランス語の「<span lang="fr">Orientation</span>」「<span lang="fr">Interruptions</span>」やスペイン語の「<span lang="es">Selector</span>」のように、両方の言語で単に同じ語も数えます。上の表で0以外になっているのはそうした語です。
			</p>
			<p>
				ロケールファイルはただのJSONで、キーから翻訳済み文字列へのフラットなマップを
				<code>en.json</code>
				と同じキー順で並べたものです。それ以外は何も入っていないので、言語を追加するのに必要なのはテキストの編集だけで、コードに触れることはありません。
			</p>
			<p>
				どのロケールも
				<code>en.json</code>
				と同じキーをすべて持っています。この状態を保つのが
				<code>npm run i18n:sync</code>
				の役目です。
				<code>en.json</code>
				を変更したら実行してください。英語以外のロケールファイルをすべて書き換えて一致させます。新しいキーは追加し、
				<code>en.json</code>
				からなくなったキーは削除し、既存の翻訳はそのまま残します。追加されたキーには英語のテキストが仮に入り、誰かが置き換えるまでは未翻訳として扱われます。
			</p>

			<h2>ロケールの指定</h2>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { locale: 'fr' }, null);"]} />
			<p>
				省略した場合のデフォルトは
				<code>'en'</code>
				です。どんな文字列でも受け付けます。
				<strong>認識できないロケールがエラーになることはありません</strong>
				。
			</p>

			<h2>ロケールの決まり方</h2>
			<p>
				処理は2段階で、この順に行われます。この2つを混同するのがよくある混乱のもとなので、分けて説明します。
			</p>
			<h3>ステップ1：辞書を選ぶ（スキャンごとに1回）</h3>
			<ol>
				<li>
					指定したコードに一致する辞書を使います。
					<code>de</code>
					なら
					<code>de.json</code>
					が見つかります。大文字・小文字は区別しません。
					<code>pt-br</code>
					、
					<code>pt-BR</code>
					、
					<code>PT-BR</code>
					のいずれでも
					<code>pt-BR.json</code>
					が見つかります。
				</li>
				<li>
					見つからなければ、最初の
					<code>-</code>
					以降を取り除いて探します。
					<code>de-DE</code>
					でも
					<code>de-AT</code>
					でも
					<code>de.json</code>
					が見つかります。
				</li>
				<li>それでもなければ英語を使います。</li>
			</ol>
			<p>
				つまり
				<code>de-DE.json</code>
				が必要になるのは、オーストリアとドイツでドイツ語の表現を実際に変えたい場合だけです。
				<code>de.json</code>
				を用意すれば、ドイツ語のバリエーションはすべてカバーされます。
			</p>
			<h3>ステップ2：文字列ごとに解決する（文字列単位）</h3>
			<p>選ばれた辞書の中で、文字列は1つずつ個別に引かれます。</p>
			<ol>
				<li>選ばれた辞書からそのキーの値を取ります。</li>
				<li>そのキーがなければ、英語の値を取ります。</li>
				<li>
					英語にもない場合（組み込みのキーでは起こらないはずですが、独自に作ったキーでは起こりえます）は、ルール自体が持っているテキストをそのまま使います。
				</li>
			</ol>
			<p>
				<strong>
					結果が空欄や
					<code>undefined</code>
					になったり、エラーが投げられたりすることはありません。
				</strong>
				翻訳が途中でも、訳がある部分は指定した言語で、それ以外はすべて英語で表示されます。
			</p>

			<h2>実際にどのロケールになったかを確認する</h2>
			<p>
				エラーにせず英語にフォールバックするこの仕組みには、1つ欠点があります。
				<strong>ビルドに含まれていない言語を指定すると、自然な英語が返ってきて、文字列を見てもそのことはわかりません</strong>
				。そのため、どの結果にも解決の結果が先頭に1度だけ記録されます。
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"engine": {',
					'  "tag": "a11ycore",',
					'  "schemaVersion": "1.0.0",',
					'  "locale": { "requested": "ko", "resolved": "en", "reason": "unknown-locale" }',
					"}",
				]}
			/>
			<p>
				<code>requested</code>
				は指定した値（前後の空白を除去したもの。何も渡さなかった場合や文字列以外を渡した場合は
				<code>en</code>
				）、
				<code>resolved</code>
				は実際に使われた辞書、
				<code>reason</code>
				は次のいずれかです。
			</p>
			<DataTable
				label="locale.reasonの値"
				rowKey="id"
				columns={[
					{ key: "reason", label: "reason", width: "26%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={localeReasonRows}
			/>
			<p>
				この一覧は今後増えるものとして扱ってください。後のリリースで値が追加されることがあるので、必要な値だけを照合し、それ以外はデフォルトの分岐に流すようにしてください。
			</p>
			<p>
				特定の言語が必要なら、CIで確認すべき条件は
				<code>requested !== resolved</code>
				です。ただし、これは問題のない
				<code>primary-subtag</code>
				の場合にも真になります。基本言語での一致で十分なら、
				<code>reason === 'unknown-locale' || reason === 'dictionary-not-loaded'</code>
				で判定してください。結果の中でのこのフィールドの位置は
				<a href="/results-reports/output-schema/">出力スキーマ</a>
				を、何が保証されているかは
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a>
				を参照してください。
			</p>

			<h2>辞書の置き場所</h2>
			<p>使える言語は、エンジンの読み込み方によって決まります。</p>
			<DataTable
				label="辞書の出どころ"
				rowKey="id"
				columns={[
					{ key: "how", label: "読み込み方", width: "36%" },
					{ key: "what", label: "使える言語", wrap: true },
				]}
				rows={dictionaryLocationRows}
			/>
			<p>
				バンドルを分けているのは、それを使うすべてのページにネットワーク経由で配信されるうえ、すべての言語を必要とするページはないからです。英語だけを内蔵し、残りを任意にしたことで、ダウンロードサイズが約280 KB減り、言語を追加しても増えなくなりました。それ以外は何も変わりません。Nodeパッケージとバインディングには影響しません。
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y.browser.js"></script>',
					'<script src="surea11y.i18n.ja.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, { locale: 'ja' }, null);",
					"</script>",
				]}
			/>
			<p>
				ファイルを読み込んでいない言語を指定すると英語になり、
				<code>engine.locale.reason</code>
				は
				<code>dictionary-not-loaded</code>
				になります。これは、プロジェクトにその言語の翻訳がまったくないことを示す
				<code>unknown-locale</code>
				とは別のものです。
			</p>

			<h3>辞書を自分で渡す</h3>
			<p>
				<code>engineOptions.messages</code>
				は
				<code>{"{ [locale]: { key: value } }"}</code>
				を受け取り、組み込みの辞書や別ファイルから読み込んだ辞書よりも優先されます。一部の文字列だけを上書きしたい場合や、社内で独自に管理している言語を使う場合に便利です。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  locale: 'de',",
					"  messages: { de: { img_altPresent_title: 'Eigener Text' } }",
					"}, null);",
				]}
			/>
			<p>渡さなかったキーは通常どおりフォールバックするので、一部だけの上書きでも問題ありません。</p>

			<h2 id="language-specific-matching">言語ごとの照合</h2>
			<p>
				5つのルールは既知の語句でテキストを判断するため、メッセージに加えて語のリストを持っています。
				<code>link-name-quality</code>
				（「<span lang="en">click here</span>」「こちら」）、
				<code>heading-quality</code>
				（「<span lang="en">Untitled</span>」「見出し」）、
				<code>form-control-label-quality</code>
				（「<span lang="en">Label</span>」「入力欄」）、
				<code>page-title-patterns</code>
				（「<span lang="en">Home</span>」「トップページ」）、
				<code>media-alternative-transcript-evidence</code>
				（「<span lang="en">transcript</span>」「文字起こし」）です。各リストは
				<code>en</code>
				、
				<code>de</code>
				、
				<code>es</code>
				、
				<code>fr</code>
				、
				<code>ja</code>
				に対応しています。
				<code>skip-link</code>
				ルールも、同じ5つの言語でスキップリンクの表現を認識します。
			</p>
			<p>
				英語は常に確認します。それに加えて、最も近い
				<code>lang</code>
				属性（ページタイトルの場合は
				<code>&lt;html&gt;</code>
				要素のもの）から得た要素自身の言語のリストを確認します。すべてのリストをどこでも確認すると、ある言語では一般的な語でも別の言語では実際の名前になる語、例えば英語のページの「<span lang="fr">Suite</span>」や「<span lang="fr">Plus</span>」を検出してしまうためです。文字起こしを表す語は例外です。どの言語でも紛れがなく、ページが別の言語の文字起こしにリンクすることもあるため、常にすべて確認します。テキストは最初にNFKC正規化するので、「見出し２」のような全角の形も一致します。
			</p>
			<p>
				<code>page-title-patterns</code>
				は、タイトルが短すぎるかを判断するとき、中国語、日本語、韓国語の文字を1文字につき2文字として数えます。「お問い合わせ」は6文字で完結したタイトルだからです。
			</p>

			<h2>キーが使われる場所</h2>
			<p>複数のキー名前空間があり、どれも同じ方法で解決されます。</p>
			<ul>
				<li>
					<strong>ルール単位</strong>
					：
					<code>meta.i18n.titleKey</code>
					／
					<code>meta.i18n.descriptionKey</code>
					。
					<code>checksResults[]</code>
					の各エントリーで、ルールの
					<code>title</code>
					／
					<code>description</code>
					を解決します。
				</li>
				<li>
					<strong>HTMLレポート</strong>
					：
					<code>report_*</code>
					キーは、
					<code>@surea11y/core/report</code>
					が生成するページのラベルです。見出し、表の列、判定結果と重大度の名前、見出し文、ページ送りが該当します。レポートはスキャンで解決されたロケールでこれらを読むため、辞書を翻訳すればレポートも翻訳されます。
				</li>
				<li>
					<strong>複合ルール単位</strong>
					：
					<code>rulesResults[]</code>
					の各集約の
					<code>title</code>
					／
					<code>description</code>
					を解決します。達成基準の名前には、各言語で公開されている名称を使います。
				</li>
				<li>
					<strong>検出箇所単位</strong>
					：
					<code>i18n.summaryKey</code>
					／
					<code>i18n.hintKey</code>
					。
					<code>{"{{placeholder}}"}</code>
					の埋め込みには
					<code>i18n.params</code>
					を使います。検出箇所の
					<code>summary</code>
					／
					<code>hint</code>
					を解決します。詳しくは
					<a href="/results-reports/output-schema/">出力スキーマ</a>
					を参照してください。
				</li>
			</ul>
			<p>
				どちらも解決済みのテキストと一緒に結果に含まれるので、保存した結果から、再スキャンせずに別のロケールで表示し直せます。
			</p>
		</>
	);
}
