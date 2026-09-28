import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CiIntegrationContent() {
	return (
		<>
			<p>
				<a href="https://github.com/SureA11y/cli#readme">CLI</a>
				（
				<code>npx @surea11y/cli scan ...</code>
				）をGitHub ActionsとBitbucket Pipelinesで実行する、そのまま貼り付けられるテンプレートです。CLIではなく自分のNodeスクリプトからライブラリーを直接呼び出す場合は、
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>
				を参照してください。このページが扱うのは、パイプラインのステップとしてのCLIに限られます。
			</p>
			<p>
				いずれのテンプレートも、パイプラインのゲートにはCLI自体の終了コードを使います（
				<code>0</code>
				は問題なし、
				<code>1</code>
				は
				<code>fail</code>
				の判定結果が1件以上、
				<code>--baseline</code>
				を付けた場合は
				<em>新しい</em>
				<code>fail</code>
				が1件以上、
				<code>2</code>
				は使い方の誤りまたはスキャンのエラー）。基本的な合否のゲートに、追加のスクリプトは必要ありません。
			</p>

			<h2>GitHub Actions</h2>
			<h3>基本：終了コードでゲートする</h3>
			<CodeBlock
				lang="yaml"
				lines={[
					"name: Accessibility scan",
					"on: [pull_request]",
					"",
					"jobs:",
					"  a11y-scan:",
					"    runs-on: ubuntu-latest",
					"    steps:",
					"      - uses: actions/checkout@v4",
					"      - uses: actions/setup-node@v4",
					"        with:",
					"          node-version: 20",
					"      - run: npm ci && npm run build   # produce whatever static HTML you're scanning",
					"      - run: npx @surea11y/cli scan ./dist/index.html",
				]}
			/>
			<p>
				<code>fail</code>
				の判定結果が1つでも見つかった時点でジョブが失敗します。既存の違反がある既存サイトでは、このステップを無効にするのではなく、以下のベースラインを使う例を参照してください。
			</p>

			<h3>ベースラインを使う（既存サイトで、新しい違反だけをゲートの対象にする）</h3>
			<CodeBlock
				lines={[
					"# Once, locally: record every current fail occurrence, commit the file.",
					{ text: "surea11y scan ./dist/index.html --write-baseline a11y-baseline.json", command: true },
					{ text: "git add a11y-baseline.json", command: true },
				]}
			/>
			<CodeBlock
				lang="yaml"
				lines={[
					"      - run: npm ci && npm run build",
					"      - run: npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json",
				]}
			/>
			<p>
				何が「既知」で何が「新規」とみなされるか、違反の修正に合わせてファイルを再生成する方法については、
				<a href="/conformance/baseline/">ベースライン／許可リスト</a>
				を参照してください。
			</p>

			<h3>SARIFをGitHub Code Scanningにアップロードする</h3>
			<p>
				<code>upload-sarif</code>
				には
				<code>security-events: write</code>
				の権限が必要で、
				<strong>それ自体はジョブを失敗させません</strong>
				。新しい違反でビルドも失敗させたい場合は、別のゲート用ステップ（または
				<code>continue-on-error</code>
				と独自のチェック）と組み合わせてください。
			</p>
			<CodeBlock
				lang="yaml"
				lines={[
					"name: Accessibility scan",
					"on: [pull_request]",
					"",
					"permissions:",
					"  contents: read",
					"  security-events: write",
					"",
					"jobs:",
					"  a11y-scan:",
					"    runs-on: ubuntu-latest",
					"    steps:",
					"      - uses: actions/checkout@v4",
					"      - uses: actions/setup-node@v4",
					"        with:",
					"          node-version: 20",
					"      - run: npm ci && npm run build",
					"      - name: Scan (report, don't fail the job here)",
					"        run: npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json --sarif results.sarif",
					"        continue-on-error: true",
					"        id: scan",
					"      - name: Upload SARIF to Code Scanning",
					"        uses: github/codeql-action/upload-sarif@v3",
					"        with:",
					"          sarif_file: results.sarif",
					"      - name: Fail the job on new violations",
					"        if: steps.scan.outcome == 'failure'",
					"        run: exit 1",
				]}
			/>
			<p>
				<a href="/results-reports/sarif-report/">SARIFレポートの形式</a>
				と、既知の制限事項も確認してください。チェックアウトした
				<strong>ローカルファイル</strong>
				をスキャンした場合はCode ScanningのUIにインラインの注釈が付きますが、
				<strong>公開中のURL</strong>
				をスキャンした場合は付きません（SARIF/Code Scanningが検出結果を関連付けられるのは、リポジトリ内の実在するファイルだけです）。
			</p>

			<h2>Bitbucket Pipelines</h2>
			<p>
				Bitbucket Pipelinesには、GitHub Code Scanningに相当するSARIF対応の組み込みダッシュボードがありません。そのため、実用的な連携ポイントは
				<code>--sarif</code>
				ではなく、CLIの終了コード（と、必要に応じてダウンロード可能なパイプラインの成果物としての
				<code>--html</code>
				）になります。
			</p>
			<CodeBlock
				lang="yaml"
				lines={[
					"pipelines:",
					"  pull-requests:",
					"    '**':",
					"      - step:",
					"          name: Accessibility scan",
					"          image: node:20",
					"          script:",
					"            - npm ci",
					"            - npm run build",
					"            - npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json --html a11y-report.html",
					"          artifacts:",
					"            - a11y-report.html",
				]}
			/>
			<p>
				このステップは、ほかの
				<code>script</code>
				のエントリーとまったく同じように、CLIの終了コードでパイプラインを失敗させます。
				<code>a11y-report.html</code>
				（
				<a href="/results-reports/html-report/">HTMLレポート</a>
				を参照）はダウンロード可能なビルド成果物として添付されるので、レビュー担当者はローカルでスキャンを再実行せずにレポートを開けます。
			</p>

			<h2>無料枠やプライベートリポジトリの実行時間制限</h2>
			<p>
				パイプラインサービスの無料枠に実行時間の制限がある場合（たとえばBitbucket Pipelinesの無料枠は、プライベートワークスペースで月50ビルド分です）、静的なHTMLやサーバーでレンダリングされたHTMLを
				<code>jsdom</code>
				ベースでスキャンする方法（CLIが行っていること）は、実際のブラウザーを操作するよりはるかに低コストです。その代わりに失うもの（クライアントサイドでレンダリングされるコンテンツと実際のCSSレイアウトは対象外）については
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#what-it-can-and-cant-scan">
					CLIのドキュメント
				</a>
				を参照してください。
			</p>
		</>
	);
}
