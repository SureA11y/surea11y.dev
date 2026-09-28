import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import rules from "../data/rules.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const packageRows = [
	{ id: "playwright", want: "Playwrightのテストにアクセシビリティチェックを追加する", install: <code>@surea11y/playwright</code> },
	{ id: "puppeteer", want: "Puppeteerのテストに追加する", install: <code>@surea11y/puppeteer</code> },
	{ id: "selenium", want: "Seleniumのテストに追加する", install: <code>@surea11y/selenium</code> },
	{ id: "cypress", want: "Cypressのテストに追加する", install: <code>@surea11y/cypress</code> },
	{ id: "webdriverio", want: "WebdriverIOのテストに追加する", install: <code>@surea11y/webdriverio</code> },
	{ id: "cli", want: "ターミナルやCIパイプラインから静的なHTMLをスキャンする", install: <code>@surea11y/cli</code> },
	{ id: "test-matchers", want: "Jest／Vitestのコンポーネントテストやユニットテストでアクセシビリティをアサーションする", install: <code>@surea11y/test-matchers</code> },
	{ id: "core", want: "手元にあるDOMに対してエンジンを実行する", install: <code>@surea11y/core</code> },
];

export function OverviewLead() {
	return (
		<>
			<p>
				<a href="https://github.com/SureA11y/core">@surea11y/core</a>
				は、自分のテストスイートやCIパイプライン、コマンドラインから実行する
				<strong>アクセシビリティテストエンジン</strong>
				です。
			</p>
			<p>
				ほかと違うのは、自動テストでは決着がつかないケースの扱い方です。W3Cのオープンな
				<a href="https://www.w3.org/TR/act-rules-format/">
					<span lang="en">Accessibility Conformance Testing (ACT) Rules Format</span>
				</a>
				を実装しており、自分自身の基準だけで判断するのではなく、ACTが公開しているテストコーパスで検証しています。報告するのは、見つかった問題、問題がなかったこと、そして珍しいことに、明示的な「判断できない」です。そのため結果は、安心させるためのものではなく、検証できるものになっています。
			</p>
			<p>
				<em><span lang="en">Sure</span></em>
				が意味するのは、わかっていることについての確かさと、わからないことについての誠実さです。わからないことは、わからないと伝えます。
			</p>
		</>
	);
}

export function OverviewContent() {
	return (
		<>
			<h2>単体の製品ではありません</h2>
			<p>
				surea11yは、1つのコマンドでインストールする1つのツールではなく、1つのエンジンを共有するパッケージ群です。今のテストのやり方に合うものをインストールしてください。どれも
				<code>@surea11y/core</code>
				を自動的に取り込みます。
			</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "want", label: "やりたいこと", wrap: true },
					{ key: "install", label: "インストールするもの", width: "26%" },
				]}
				rows={packageRows}
			/>
			<p>
				バインディングごとのインストール方法と使い方は
				<a href="/getting-started/">はじめに</a>
				を参照してください。
			</p>

			<h2>結果の違い</h2>
			<p>
				どのルールも、4つの判定結果からなる固定の語彙で、1つの決定論的な判定を行います。ほかの広く使われているアクセシビリティテストツールの
				<code>violations</code>
				／
				<code>passes</code>
				／
				<code>incomplete</code>
				／
				<code>inapplicable</code>
				という形ではありません。
			</p>
			<ul className="outcome-list">
				<li>
					<ResultBadge lang="en" state="fail" />
					（
					<code>fail</code>
					）：DOMから証明できる違反です。客観的で規範的なケースだけに使います。
				</li>
				<li>
					<ResultBadge lang="en" state="pass" />
					（
					<code>pass</code>
					）：このルール固有の条件を満たしています。
					<strong>ページがアクセシブルだという主張ではありません。</strong>
				</li>
				<li>
					<ResultBadge lang="en" state="unknown" />
					（
					<code>cantTell</code>
					）：人間が判断する必要があります。何があいまいだったのかは結果に書かれています。
				</li>
				<li>
					<ResultBadge lang="en" state="na" />
					（
					<code>notApplicable</code>
					）：ルールの前提条件が存在しません。
				</li>
			</ul>
			<p>
				<code>cantTell</code>
				こそがこのプロジェクトの要です。判断できないことを黙って捨てるエンジンは、
				<strong>レポートが短くなる代わりに、カバーできているという誤った安心感を生みます</strong>
				。結果の全体像は
				<a href="/results-reports/output-schema/">結果とレポート</a>
				を、個々の結果がどのようにWCAGの判定に集約されるか（対象とするWCAGのバージョン2.0／2.1／2.2がどう決まり、どう適用されるかを含む）は
				<a href="/conformance/wcag-mapping/">適合性</a>
				を参照してください。
			</p>

			<h3 id="checked-against-the-act-corpus">ACTコーパスによる検証</h3>
			<p>
				エンジンには{rules.length}件のルールがあります。そのうち58件は
				<a href="https://act-rules.github.io/"><span lang="en">W3C ACT Rules</span></a>
				に対応するルールがあり、ACTが公開しているテストケース（この58件のルールにわたる798件の例）に対して実行しています。ACTがpassedまたはinapplicableとしている例をエンジンがfailにしたものは1件もなく、このコーパスに対して誤検出はありません。ACTがfailedとしている例のうち31件は検出していません。その多くは、見出しがその下の内容を説明しているかどうかといった、判断を要するものです。1件ずつの理由は
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>
				にまとめています。
			</p>
			<p>
				<a href="https://surea11y.github.io/act-report/act-report.jsonld">
					EARL実装レポート
				</a>
				には、passやinapplicableの結果も含め、これらのケースすべての判定結果を記録しています。そのため、適用対象がなくて何も報告しなかったルールと、そもそも実装されていないルールを区別できます。形式については
				<a href="/results-reports/earl-report/">EARLレポート</a>
				を参照してください。
			</p>

			<h2>基本方針</h2>
			<ul>
				<li><strong>決定論的な実行。</strong>同じ入力からは常に同じ出力が得られます。</li>
				<li><strong>意図して保守的に。</strong><code>fail</code>は客観的で規範的な違反だけに使い、誤った警告を最小限に抑えます。</li>
				<li><strong>標準へのトレーサビリティ。</strong>ルールは、適切な場合には、該当するWCAGの達成基準に紐付けています。</li>
				<li><strong>安定した機械可読の出力。</strong>ルールIDは言語によって変わりません。</li>
				<li><strong>フレームワークに依存しない。</strong>jsdomでも、どのブラウザー自動化フレームワークの中でも実行できます。</li>
				<li><strong>拡張可能。</strong>カスタムルールの追加、ポリシーの登録、ルールID・タグ・WCAGバージョンによるスキャンの絞り込みができます。</li>
				<li><strong>ローカライズされたレポート。</strong>人が読むメッセージは、機械可読のデータに影響を与えずに翻訳できます。現在は<code>en</code>、<code>fr</code>、<code>de</code>、<code>es</code>に対応しています。</li>
			</ul>

			<h2>考え方</h2>
			<blockquote>
				客観的に判断できることは自動化する。できないことを自動化したふりは決してしない。
			</blockquote>
			<p>
				WCAGの要件には、完全な確信を持ってチェックできるものもあれば、人間の判断や文脈の知識、ユーザビリティの評価が必要なものもあります。1つのスコアやpass／failの判定は、その違いを押しつぶしてしまいます。surea11yはその違いを報告します。
				<code>cantTell</code>
				と
				<code>notApplicable</code>
				が判定結果として存在するのはそのためで、この考え方がエンジンのすべてのルールを形づくっています。
			</p>

			<h3>surea11yが検出しないもの</h3>
			<p>自動化の限界をはっきりさせることも、同じ考え方の一部です。たとえばsurea11yは、次のことはしません。</p>
			<ul>
				<li>代替テキストが<em>意味のある</em>ものかどうかは確認せず、存在するかどうかだけを確認します（<code>"image123.png"</code>というalt属性も、客観的なチェックには合格します）。</li>
				<li>色のコントラストの選択が美的に適切かどうかは判断せず、該当するコントラスト比を満たしているかどうかだけを判断します。</li>
				<li>エラーメッセージが問題を実際に<em>説明している</em>かどうかは判断しません。それは静的なスキャンからは見えないバリデーションのロジックに左右されるからです。</li>
				<li>キーボードのフォーカストラップや、400%に拡大したときに切れてしまうコンテンツは検出しません。どちらも、ある一瞬のDOMを読むだけでなく、実際のユーザー操作を時間をかけてシミュレートする必要があるからです。</li>
			</ul>
			<p>
				こうしたケースでは、エンジンは
				<code>cantTell</code>
				を報告し、人間のレビュアーによる判断が引き続き必要になります。全一覧は
				<a href="/help/known-limitations/">既知の制限事項</a>
				を参照してください。
			</p>
		</>
	);
}

export function OverviewAbout() {
	return (
		<section className="stewardship" aria-labelledby="about-the-project">
			<h2 id="about-the-project" className="stewardship-label">プロジェクトについて</h2>
			<p className="stewardship-lead">
				surea11yは、開発の過程もすべて公開している、独立した<span className="stewardship-nowrap">オープンソース</span>のプロジェクトです。
			</p>
			<p className="stewardship-body">
				<code>@surea11y/core</code>
				とすべての連携パッケージは
				<a href="https://www.npmjs.com/org/surea11y">npm</a>
				で公開しています。issue、議論、変更はすべて
				<a href="https://github.com/SureA11y">GitHub</a>
				上で公開の場で行っており、コントリビューションを歓迎します。コントリビューションのガイドラインは
				<a href="https://github.com/SureA11y/core/blob/main/CONTRIBUTING.md">
					<code>CONTRIBUTING.md</code>
				</a>
				を参照してください。
			</p>
			<div className="stewardship-byline">
				<p className="stewardship-credit">
					<span className="stewardship-credit-label">作成・現メンテナー</span>
					<span className="stewardship-name">Jorge Rumoroso</span>
				</p>
				<p className="stewardship-role">
					デジタルアクセシビリティの専門家。アクセシビリティの監査、標準、ガバナンスの分野で実務経験があります。
				</p>
				<p className="stewardship-link">
					<a href="https://www.linkedin.com/in/jorgerumoroso/">LinkedInプロフィール</a>
				</p>
			</div>
		</section>
	);
}
