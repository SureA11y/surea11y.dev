import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const formatRows = [
	{ format: <code>JSON</code>, use: "連携、保存、独自の処理", audience: "開発者、プラットフォーム" },
	{ format: "HTML", use: "特定の1回のスキャンを人がレビューする", audience: "QA、監査" },
	{ format: "SARIF", use: "コード解析ツールとの連携", audience: "開発チーム、セキュリティチーム" },
	{ format: "JUnit", use: "CIダッシュボードのテストビュー", audience: "開発チーム、QAチーム" },
	{ format: "EARL", use: "相互運用性、ACTの実装報告", audience: "標準化、研究、適合性" },
];

export function ResultsReportsContent() {
	return (
		<>
			<p>
				スキャン結果はすべて1つのプレーンなJSONオブジェクトとして返ります。以下の4つのレポート形式は、どれもこの同じオブジェクトから生成され、それぞれ別の読み手に合わせた形になっています。ブラウザーのタブで目を通す人、SARIFしか扱えないコード解析ダッシュボード、JUnitを読むCIのテストビュー、そしてW3C自身の実装報告形式です。実際に誰が見るのかに合った形式を選んでください。
			</p>
			<DataTable
				label="出力形式"
				rowKey="format"
				columns={[
					{ key: "format", label: "形式" },
					{ key: "use", label: "主な用途", wrap: true },
					{ key: "audience", label: "対象" },
				]}
				rows={formatRows}
			/>

			<h2>出力スキーマ</h2>
			<p>
				すべてのランナーが返す厳密な契約であり、ほかのレポート形式はすべてここから導かれます。最上位の結果エンベロープ、ルールごとに1件のエントリー（
				<code>pass</code>
				と
				<code>notApplicable</code>
				もすべて含みます。違反だけのリストにはなりません）、指摘された要素まで追える検出箇所ごとの詳細、ルールが判定できなかったものに付く明示的な不確実性コード、そしてWCAG達成基準の複合集約です。生の結果の上に何かを構築するなら、一度は読んでおく価値があります。全体の構造は
				<a href="/results-reports/output-schema/">出力スキーマ</a>
				を参照してください。
			</p>

			<h2>HTMLレポート</h2>
			<p>
				どのブラウザーでも開ける1つのHTMLファイルで、サーバーもビルド手順も要りません。冒頭に平易な言葉の概要、エンジン自身の複合ルールの結果をもとに適合レベルごとにまとめたWCAG集約、その下に詳しく調べたい人のための検索可能な全件の表があります。生の出力を読みたくないレビュー担当者に渡すのはこのレポートです。
				<a href="/results-reports/html-report/">HTMLレポート</a>
				を参照してください。
			</p>

			<h2>SARIFレポート</h2>
			<p>
				変換処理を自分で書かなくても、スキャン結果を<span lang="en">GitHub Code Scanning</span>やその他のSARIF対応ダッシュボードへ直接渡せます。違反は内容ベースの安定したフィンガープリント付きでSARIFの結果に対応付けられるため、
				<a href="/conformance/baseline/">ベースライン／許可リスト</a>
				のフィルタリングも確実に機能し、ダッシュボードは行番号がずれるたびに検出結果を見失うことなく、コミットをまたいで追跡できます。
				<a href="/results-reports/sarif-report/">SARIFレポート</a>
				を参照してください。
			</p>

			<h2>JUnitレポート</h2>
			<p>
				アクセシビリティの結果を、CIにすでにあるテストビュー（GitLabのマージリクエストのウィジェット、<span lang="en">Azure DevOps</span>のTestsタブ、Jenkins、CircleCI）に、ユニットテストと並べて表示できます。WCAGの達成基準ごとに1つのスイート、ルールごとに1つのテストになるため、ページ内で繰り返される不具合も1つの失敗したテストにまとまり、件数は実行ごとに安定します。<code>cantTell</code>はスキップされたテストとして表示され、ビルドを赤にせずに確認できます。詳しくは
				<a href="/results-reports/junit-report/">JUnitレポート</a>
				を参照してください。
			</p>

			<h2>EARLレポート</h2>
			<p>
				W3CのEARL/JSON-LD形式の実装報告で、
				<strong>失敗だけでなくすべてのルールの判定結果を表明します</strong>
				。<span lang="en">ACT Rules</span>コミュニティグループが実装報告として受け付ける形式です。ACTのテストケースで実行すると、各テストケースの判定結果が記録されるため、エンジンが各ルールをどう実装しているかを、信頼に頼らずに検証できます。これは認証でも、WCAG適合性の証拠でもありません。ACTの実装として掲載されることは、W3Cによる承認ではありません。
				<a href="/results-reports/earl-report/">EARLレポート</a>
				を参照してください。
			</p>
		</>
	);
}
