import React from "react";
import rules from "../data/rules.generated.json";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";

const familyRows = [
	{ id: "present", ruleId: <code>img-alt-present</code>, family: <code>img</code>, intent: <code>present</code>, type: "自動" },
	{ id: "quality", ruleId: <code>img-alt-quality</code>, family: <code>img</code>, intent: <code>quality</code>, type: "手動" },
	{ id: "decorative", ruleId: <code>img-alt-decorative</code>, family: <code>img</code>, intent: <code>decorative</code>, type: "手動" },
];

export function RuleOrganizationContent() {
	return (
		<>
			<p>
				<a href="/rules/">カタログ</a>
				にある{rules.length}件のルールがどのように構成されているかを説明します。結果の意味を理解したり、目的のルールを探したりするのに役立ちます。抽象的な設計ではなく、ルールセットに実際にあるものをそのまま反映しています。
			</p>

			<h2>自動ルールと手動ルール</h2>
			<p>
				各ルールの
				<code>type</code>
				は2種類のどちらかです。違いは、ルールが
				<em>何を判定できるか</em>
				にあり、たまたまどの判定結果を報告するかではありません。
			</p>
			<ul>
				<li>
					<strong>automatic（自動）</strong>
					：ヒューリスティックも推測も使わず、決定論的に判定します。
					<code>fail</code>
					を報告できます。それでも
					<code>cantTell</code>
					が出るのは次の場面です。実際の違反はあるものの、それだけでは対応するWCAG達成基準の不適合が確定しない場合（公開される名前・役割・値がそれでも保たれている、ARIAの作成者要件など）。ルールはベストプラクティスが守られていないことを決定論的に判定するが、達成基準を主張しておらず、見つけたものが誰の妨げにもならない可能性がある場合。ロールや要素はそのままの形で支援技術に届いているからです（ベストプラクティスとタグ付けされた
					<code>aria-allowed-role</code>
					、
					<code>landmark-role-name-present</code>
					）。そして、ルールが確認できるのは仕組みが
					<em>存在する</em>
					ことだけで、存在するものが実際に妥当かどうかは兄弟ルールの担当である場合（
					<code>aria-required-children</code>
					と、対になる
					<code>aria-prohibited-children</code>
					）。あるいは、ルールが推測なしには判定できないため、不合格にする代わりに確認を求める場合です。閉じたシャドウルート、エンジンが読み取れない
					<code>ElementInternals</code>
					、読み取れないほど深く入れ子になったコンテンツから来ている可能性がある名前（
					<code>*-name-present</code>
					ルール）、間隔を広げると切れたり重なったりする可能性があるテキスト（
					<code>text-spacing-content-loss</code>
					）、ページのコンテンツ以外の要素を回転させる画面の向きのメディアブロック（
					<code>css-orientation-lock</code>
					）、比率を下回るプレースホルダーや、コントロールの名前の代わりになっている1文字（
					<code>contrast-minimum</code>
					）、計算できない色やサイズ（コントラストのルール、
					<code>target-size-minimum</code>
					）がこれに当たります。例外を投げたルールも、安全策として
					<code>cantTell</code>
					と報告されます。
				</li>
				<li>
					<strong>manual（手動）</strong>
					：人が判断しなければならないことを示します。ルールは、見つけたものが問題かどうかを判定できません。判定結果は
					<code>cantTell</code>
					か
					<code>notApplicable</code>
					で、判断を必要としない答えが見つかった場合に限り
					<code>pass</code>
					になります。
					<code>fail</code>
					になることはありません。
					<a href="/rules/landmark-unique/"><code>landmark-unique</code></a>
					は、名前が同じ2つのランドマークが問題かどうかを判定できません（内容が同一であればAPGはこれを認めています）。そのためこれは
					<code>cantTell</code>
					です。一方、「すべての名前が異なる」は事実なので
					<code>pass</code>
					です。画像のテキスト代替が正確かどうかのように、見つけた対象のすべてについて人に判断を求めるルールが
					<code>pass</code>
					を報告することはありません。
				</li>
			</ul>
			<p>
				ベストプラクティスとタグ付けされたルールは達成基準を主張しませんが、判定したもの自体がバリアである場合は
				<code>fail</code>
				を報告します。空の見出しは、中身のない見出しとして読み上げられます（
				<a href="/rules/empty-heading/"><code>empty-heading</code></a>
				。W3CのACTルールも同じように報告します）。その
				<code>fail</code>
				が示すのは、ルール自身の期待が満たされていないということであり、達成基準が満たされていないということではありません。WCAGの集約はこれを算入しません。見つけたものが誰の妨げにもならない可能性がある場合は、上で述べたとおり、代わりに
				<code>cantTell</code>
				を報告します。
			</p>
			<p>
				<strong>
					手動ルールが報告する
					<code>cantTell</code>
					と自動ルールが報告する
					<code>cantTell</code>
					は、値は同じでも同じ出来事ではありません
				</strong>
				。自動ルールは判定を終えたうえで、見つけたものを伝えています。手動ルールは、その問いがそもそもマークアップからは判定できないことを伝えています。判定結果、重大度、確度の完全なリファレンスは
				<a href="/results-reports/output-schema/">結果とレポート</a>
				を参照してください。
			</p>

			<h2>ルールIDの構成</h2>
			<p>
				ルールIDはおおむね
				<code>&lt;family&gt;-&lt;intent&gt;</code>
				の形です。まずルールが対象とする要素や仕組み、次にそれについてどんな問いを立てるかを表します。いちばんわかりやすい例は画像の代替テキストのファミリー（WCAG 1.1.1）です。
			</p>
			<DataTable
				label="ルールIDの例"
				rowKey="id"
				columns={[
					{ key: "ruleId", label: "ルールID", mono: true },
					{ key: "family", label: "ファミリー", mono: true },
					{ key: "intent", label: "意図", mono: true },
					{ key: "type", label: "種類" },
				]}
				rows={familyRows}
			/>
			<ul>
				<li><code>present</code>：必要な仕組みが存在するかを確認します。通常は自動です。</li>
				<li><code>quality</code>：適切さ、正しさ、意味があるかを確認します。常に手動です。</li>
				<li><code>decorative</code>：純粋に装飾的なコンテンツが正しく扱われているかを確認します。常に手動です。</li>
			</ul>
			<p>
				ルールが自動に
				<em>なりうるか</em>
				は意図で決まります。「何かが存在するか」はマークアップだけで判定できることが多い一方、「それが良いか」はほぼ判定できません。各ルールのページにある
				<strong>関連するルール</strong>
				のリンクも同じ考え方によるものです。ファミリー（IDの最後の
				<code>-</code>
				区切りより前の部分）が共通するルールがそこにまとめられています。ルールセットには
				<code>img</code>
				以外にも、
				<code>aria-*</code>
				、
				<code>contrast-*</code>
				、
				<code>dialog-*</code>
				、
				<code>iframe-*</code>
				、
				<code>label-*</code>
				、
				<code>link-*</code>
				、
				<code>list-*</code>
				、
				<code>landmark-*</code>
				など数十のファミリーがあります。最新の一覧は自動生成される
				<a href="/rules/">カタログ</a>
				にあります。
			</p>
			<p>
				1つのルールが複数のファミリーにまたがることはありません。各ルールは1種類の要素を対象に、それに適したヘルパーを使って問い合わせます。ルールセットが大まかなルール十数件ではなく、範囲の狭い{rules.length}件のルールで構成されているのもそのためです。判定する内容、対象、カバーするWCAGのファセットのいずれかが異なる2つのチェックは、統合せずに別のルールとして保っています。そうすれば、具体的に何が見つかったのかを言うために、後から結果を解きほぐす必要がありません。
			</p>

			<h2>WCAGのファセット</h2>
			<p>
				WCAGの達成基準は、たいてい1つのルールが決定論的に判定できる範囲よりも大きなものです。内部では、各達成基準を名前付きの「ファセット（facet）」に分けています。達成基準1.1.1「非テキストコンテンツ」であれば、
				<code>alt</code>
				属性が存在するか、そのテキストに意味があるか、装飾的な画像が正しくnullとしてマークされているか、といったものです。1つのルールは1つ以上のファセットに対応し、同じ達成基準の異なるファセットを複数のルールが分担するのが一般的です。上のimg-altファミリーが1.1.1に対して行っているのがまさにこれです。
			</p>
			<p>
				これは複合ルール（WCAG達成基準の集約）の結果を読むときに重要になります。複合ルールの
				<ResultBadge lang="en" state="pass" size="sm" />
				は、その達成基準に対する自動チェックがすべて問題なしだったことを意味します。ただし、
				<strong>自動化されたカバレッジがまったくないファセットについては、複合ルールは問題ないと主張するのではなく、そのファセットについて何も述べません</strong>
				。3つの層（アトミックルール、ファセット、複合ルール）と、複合ルールの判定結果が実際にどう計算されるかについては
				<a href="/conformance/wcag-mapping/">適合性</a>
				を参照してください。
			</p>
		</>
	);
}
