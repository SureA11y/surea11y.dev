import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import rules from "../data/rules.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const packageRows = [
	{ id: "playwright", want: "Playwrightのテストにアクセシビリティチェックを追加する", install: <><code>@surea11y/playwright</code> + <code>@surea11y/core</code></> },
	{ id: "puppeteer", want: "Puppeteerのテストに追加する", install: <><code>@surea11y/puppeteer</code> + <code>@surea11y/core</code></> },
	{ id: "selenium", want: "Seleniumのテストに追加する", install: <><code>@surea11y/selenium</code> + <code>@surea11y/core</code></> },
	{ id: "cypress", want: "Cypressのテストに追加する", install: <><code>@surea11y/cypress</code> + <code>@surea11y/core</code></> },
	{ id: "webdriverio", want: "WebdriverIOのテストに追加する", install: <><code>@surea11y/webdriverio</code> + <code>@surea11y/core</code></> },
	{ id: "test-matchers", want: "Jest／Vitestのコンポーネントテストやユニットテストでアクセシビリティをアサーションする", install: <><code>@surea11y/test-matchers</code> + <code>@surea11y/core</code></> },
	{ id: "cli", want: "ターミナルやCIパイプラインから静的なHTMLをスキャンする", install: <code>@surea11y/cli</code> },
	{ id: "core", want: "手元にあるDOMに対してエンジンを実行する", install: <code>@surea11y/core</code> },
	{ id: "core-build", want: "エンジンの上に独自のツール（CLI、拡張機能、ダッシュボード、レポート生成ツールなど）を作る", install: <code>@surea11y/core</code> },
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
				surea11yは、1つのコマンドでインストールする1つのツールではなく、1つのエンジンを共有するパッケージ群です。今のテストのやり方に合うものを、それが実行するエンジンである
				<code>@surea11y/core</code>
				と一緒にインストールしてください。手元にあるDOMに対してエンジンを実行する場合や、その上に独自のツールを作る場合は、コアだけをインストールしてください。
			</p>
			<DataTable
				label="インストールするパッケージ"
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
				を参照してください。ツールを作る場合は、GitHub上の
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}><code>BUILDING_ON_CORE.md</code></a>
				（英語）が、安定した契約、スキャンの実行、チェックの選び方、そして結果が示す以上のことを主張しない提示の仕方を説明しています。
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
			<p>
				<code>pass</code>
				は、どれだけ余裕をもって合格したかも示します。しきい値に対して測定するルール（コントラスト、ターゲットのサイズ、テキストの間隔）は
				<code>margin</code>
				を報告します。しきい値を満たしつつ、最も限界に近づいた要素です。最低4.5:1に対して4.52:1のテキストは合格しますが、マージンがそれを示すため、わずかな変更で
				<code>fail</code>
				に変わる前に修正できます。詳しくは
				<a href="/results-reports/output-schema/#margin">出力スキーマ</a>
				を参照してください。
			</p>
			<p>
				規格を指定すれば、エンジンがルールを選びます。
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code>
				は、WCAG 2.2のAとAAの達成基準のルールを、各達成基準がそのバージョンで持つレベルに従って実行し、
				<code>bestPractices: true</code>
				はWCAGが求めていないチェックを追加します。国の規格や組織独自の方針など、WCAGを超える規格はパックとして提供されます。パックのルール、プロファイル、チェックリスト項目はコアのものと並んで実行され、すべてのレポートに表示されます。詳しくは
				<a href="/configuration/engine-options/#selecting-which-rules-run">エンジンオプション</a>
				と
				<a href="/configuration/packs/">パック</a>
				を参照してください。
			</p>
			<p>
				規格ではなくチェックを指定しても、結果にはそれが関わるWCAGの達成基準が示されます。
				<code>link-name-present</code>
				だけを実行するスキャンでも2.4.4と4.1.2が報告され（レベルを指定しない場合はAAAの2.4.9も）、スキャンがほかのチェックを除外した達成基準は
				<code>pass</code>
				ではなく
				<code>cantTell</code>
				（HTMLレポートでは「一部のみ確認」）になります。
				<code>wcagLevel: 'AA'</code>
				はスキャンが報告する達成基準のレベルを決め、JUnit、SARIF、EARLの各レポートもそれに従います。そのため、AAのビルドがAAAの達成基準で失敗することはありません。
			</p>
			<p>
				Webコンポーネントは、公開している情報で判定されます。
				<code>ElementInternals</code>
				で名前、状態、ロールを与えるカスタム要素は、エンジンがそれを読み取れる場合はその内容で確認され、読み取れない場合は人の確認に回されます。テストや監査の実行向けには、オプトインのスクリプト
				<code>internalsHookScript()</code>
				があり、コンポーネントが非公開で保持している
				<code>internals</code>
				をスキャンが読み取れるようにします。これにより、そうした要素も
				<code>cantTell</code>
				ではなく合格か不合格かで判定されます。ページ自身のスクリプトより前にインストールする方法は、GitHub上の
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
					<code>INTEGRATION.md</code>
				</a>
				を参照してください。
			</p>
			<p>
				ブラウザーでは、コントラストをページが描画されたとおりに測定します。対象は、独自の背景を持たないページのテキスト（ブラウザーが描くキャンバスの上で、明るい場合も暗い場合も）、
				<code>::before</code>
				、
				<code>::after</code>
				、リストマーカーによる生成テキスト、閉じた状態の
				<code>&lt;select&gt;</code>
				、輪郭線だけで描かれたテキストです。これらは以前はスキップされるか、人の確認に回されていました。一方、コントロールの名前の代わりに置かれた1文字（「閉じる」という名前のボタンの「X」など）は、失敗とせず人の確認に回します。アイコンなのか文字なのかは、人が判断する必要があるためです。
			</p>

			<h3 id="checked-against-the-act-corpus">ACTコーパスによる検証</h3>
			<p>
				エンジンには{rules.length}件のルールがあります。そのうち59件は
				<a href="https://www.w3.org/WAI/standards-guidelines/act/rules/"><span lang="en">W3C ACT Rules</span></a>
				に対応するルールがあり、W3Cがそれらのルールについて公開しているテストケース、つまりW3Cの実装一覧が評価に使うもの（この59件のルールにわたる942件の例）に対して実行しています。ACTがpassedまたはinapplicableとしている例をエンジンがfailにしたものは1件もなく、このコーパスに対して誤検出はありません。これはこれらの例についての結果であり、あらゆるページについての保証ではありません。エンジンが判断できないケースでは
				<code>cantTell</code>
				を返します。これはACTが自動テストの実装に認めているものです。
			</p>
			<p>
				この結果は、エンジンが動く2つの環境の両方で成り立ちます。test-matchersとCLIが使うjsdomと、ブラウザーのバインディングが使うChromiumです。Chromiumでは、各テストケースをスクリプトやリンクされたスタイルシートも含めて実際のページとして読み込みます。ACTがfailedとしている例のうち、jsdomでは25件、Chromiumでは21件を検出していません。その多くは、見出しがその下の内容を説明しているかどうかといった、判断を要するものです。ブラウザーで検出できる4件は、jsdomが実行しないページ自身のスクリプトやスタイルシートを必要とします。1件ずつの理由は
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>
				にまとめています。
			</p>
			<p>
				2つのEARL実装レポートには、passやinapplicableの結果も含め、これらのケースすべての判定結果を記録しています。そのため、適用対象がなくて何も報告しなかったルールと、そもそも実装されていないルールを区別できます。jsdomで実行した
				<a href="https://surea11y.github.io/act-report/act-report.jsonld" lang="en">SureA11y</a>
				と、Chromiumで実行した
				<a href="https://surea11y.github.io/act-report/act-report-browser.jsonld" lang="en">SureA11y in a browser</a>
				です。形式については
				<a href="/results-reports/earl-report/">EARLレポート</a>
				を参照してください。
			</p>

			<h2>基本方針</h2>
			<ul>
				<li><strong>決定論的な実行。</strong>同じ条件で描画された同じページを同じオプションでスキャンすれば、同じ判定になります。ただし、結果に含まれる所要時間、タイムスタンプ、環境の詳細は実行ごとに異なることがあります。実行中のアニメーションやトランジションはスキャンの間止められるため、進行中のフェードがルールの計測を変えることはありません。</li>
				<li><strong>意図して保守的に。</strong>コアのルールは、誤った警告を少なく抑えるため、<code>fail</code>を客観的で規範的な違反だけに使います。</li>
				<li><strong>標準へのトレーサビリティ。</strong>ルールは、適切な場合には、該当するWCAGの達成基準に紐付けています。</li>
				<li><strong>安定した機械可読の出力。</strong>ルールIDは言語によって変わりません。</li>
				<li><strong>フレームワークに依存しない。</strong>jsdomでも、どのブラウザー自動化フレームワークの中でも実行できます。</li>
				<li><strong>拡張可能。</strong>カスタムルールの追加、ポリシーの登録、ルールID・タグ・WCAGバージョンによるスキャンの絞り込みができます。</li>
				<li><strong>ローカライズされたレポート。</strong>人が読むメッセージは、機械可読のデータに影響を与えずに翻訳できます。現在は<code>en</code>、<code>fr</code>、<code>de</code>、<code>es</code>、<code>ja</code>に対応しています。</li>
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
				実装済みのチェックの一部は、人が判断しなければならない場合に
				<code>cantTell</code>
				を報告します。キーボードトラップや拡大時のリフローなど、ほかの側面はエンジンがまったくチェックしないため、別途テストが必要です。それらの代わりになる
				<code>cantTell</code>
				はないので、
				<code>cantTell</code>
				のない結果は、それらが確認済みであることを意味しません。全一覧は
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
