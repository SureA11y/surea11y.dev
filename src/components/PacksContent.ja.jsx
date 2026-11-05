import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "https://github.com/SureA11y/pack-en301549#readme";
const ariaPack = "https://github.com/SureA11y/pack-wai-aria";
const aria = "https://www.w3.org/TR/wai-aria-1.2/";

const ariaRequirementRows = [
	{ id: "name-required", req: <code>name-required</code>, title: <a href={`${aria}#namecalculation`}>アクセシブルな名前を必要とするロールが名前を持つ</a> },
	{ id: "roles", req: <code>roles</code>, title: <a href={`${aria}#roles`}>ロールが具象で、現行のものである</a> },
	{ id: "required-states", req: <code>required-states</code>, title: <a href={`${aria}#requiredState`}>必須の状態とプロパティがある</a> },
	{ id: "supported-attributes", req: <code>supported-attributes</code>, title: <a href={`${aria}#supportedState`}>状態とプロパティがロールでサポートされている</a> },
	{ id: "prohibited-attributes", req: <code>prohibited-attributes</code>, title: <a href={`${aria}#prohibitedattributes`}>禁止された状態とプロパティがない</a> },
	{ id: "attribute-values", req: <code>attribute-values</code>, title: <a href={`${aria}#propcharacteristic_value`}>状態とプロパティが妥当な値を持つ</a> },
	{ id: "owned-elements", req: <code>owned-elements</code>, title: <a href={`${aria}#mustContain`}>コンテナーが、そのロールが必要とする要素を、それぞれ1つの所有者のもとで所有する</a> },
	{ id: "context-roles", req: <code>context-roles</code>, title: <a href={`${aria}#scope`}>要素が、そのロールが必要とするコンテキストの中にある</a> },
];

const procedureFormRows = [
	{ id: "restates", form: <code>{"{ wcag: '1.1.1' }"}</code>, means: "WCAGの達成基準を再掲し、その達成基準のファセット、ルール、テスト手順を、コアが持つすべての言語でそのまま使います。" },
	{ id: "replace", form: <code>{"{ wcag: '1.4.3', replace: { <facet>: { … } } }"}</code>, means: "達成基準を再掲しますが、その一部を独自の方法でテストします。名前を挙げたファセットは、コアの手順の代わりにその規格の手順を示します。" },
	{ id: "own", form: <code>{"{ facets: [ … ] }"}</code>, means: "規格独自の要件です。人が確認するテストの目的を、それぞれの手順とともに持ちます。" },
	{ id: "note", form: <code>{"{ note: '…' }"}</code>, means: "評価するものがありません。たとえば、ある版で空になった条項です。注記とともに列挙されるので、それを探す人は理由を知ることができます。" },
];

// The example pack each binding ships as examples/acme-policy-pack.js.
const examplePack = [
	"'use strict';",
	"",
	"// A small pack: one house rule, a checklist profile and two checklist items.",
	"// A real pack is a package of its own; `npx surea11y-pack new <folder>` writes one.",
	"",
	"const { definePack, wcagTags } = require('@surea11y/core/pack');",
	"",
	"module.exports = definePack({",
	"  name: '@acme/a11y-policy',",
	"  title: 'Acme web policy',",
	"  version: '1.0.0',",
	"  namespace: 'acme',",
	"  core: '^1.11.1',",
	"  rules: [",
	"    {",
	"      id: 'acme-no-autoplay',",
	"      meta: {",
	"        title: 'Videos do not play sound on their own',",
	"        description: 'A video that starts with sound talks over a screen reader.',",
	"        tags: ['acme'],",
	"        defaultSeverity: 'serious'",
	"      },",
	"      runInPage(ctx) {",
	"        // defaultMuted reflects the muted attribute where muted isn't set from it yet (jsdom).",
	"        const loud = [...ctx.document.querySelectorAll('video[autoplay]')].filter((v) => !(v.muted || v.defaultMuted));",
	"        return loud.length",
	"          ? {",
	"              outcome: 'fail',",
	"              occurrences: loud.map((v) =>",
	"                ctx.helpers.reportOccurrence(v, { summary: 'This video plays with sound as the page opens.', hint: 'Remove autoplay, or add muted.' })",
	"              )",
	"            }",
	"          : { outcome: 'pass', occurrences: [] };",
	"      }",
	"    }",
	"  ],",
	"  profiles: {",
	"    'acme-web-2026': { tags: wcagTags('2.2', ['A', 'AA']), rules: ['region', 'acme-no-autoplay'] }",
	"  },",
	"  rollups: [",
	"    { id: 'acme-images', title: 'Images have a text alternative', checksIds: ['img-alt-present'] },",
	"    { id: 'acme-media', title: 'Media stays quiet until asked', checksIds: ['acme-no-autoplay'] }",
	"  ]",
	"});",
];

const kindRows = [
	{
		id: "checklist",
		have: "組織のアクセシビリティ方針：「WCAG 2.2 AAに、これらのルールを加え、あのルールを除き、これらの項目をレポートに載せる」",
		kind: <strong>チェックリスト</strong>,
		holds: "コアのルールと独自のルールを選ぶプロファイルと、チェックリストの項目となる集約。",
	},
	{
		id: "standard",
		have: "独自の要件を持つ規格（RGAAのような国の規格や、業界の規格）：番号の付いた要件があり、それぞれをいくつかのルールが検査する",
		kind: <strong>規格</strong>,
		holds: "要件の表、各要件を検査するルール、要件ごとの結果、プロファイル。",
	},
	{
		id: "rules",
		have: "プロファイルなしで、すべてのスキャンに追加したいいくつかのルール",
		kind: "ルールのみ",
		holds: "ルールと、コアのルールのバリアントや上書き。チェックリストから始めて、そのプロファイルと集約を削除してください。",
	},
];

const fileRows = [
	{ id: "index", file: <code>index.js</code>, what: <><code>@surea11y/core/pack</code>の<code>definePack()</code>で書いたパックです。</> },
	{ id: "auto", file: <code>rules/automatic/&lt;ns&gt;-link-text-specific.js</code>, what: "コアのヘルパーを使って判定するルールです。" },
	{ id: "variant", file: <code>rules/automatic/&lt;ns&gt;-contrast-enhanced.js</code>, what: <>7:1で判定する、コアの<code>contrast-minimum</code>のバリアントです。</> },
	{ id: "manual", file: <code>rules/manual/&lt;ns&gt;-new-window-review.js</code>, what: <>人によるレビューが必要な手動ルールです。理由コードと、人がそれに答えるための手順を持ちます（<code>meta.reasonCodes</code>、<code>meta.review</code>）。</> },
	{ id: "i18n", file: <code>i18n/en.json</code>, what: "メッセージです。" },
	{ id: "tests", file: <><code>tests/rules/*.test.js</code>、<code>tests/profiles.test.js</code></>, what: "ルールごとのテストと、各プロファイルが実行するもののテストです。" },
	{ id: "examples", file: <code>docs/RULE_EXAMPLES.md</code>, what: "各ルールの判定結果の例です。" },
	{ id: "eslint", file: <code>eslint.config.js</code>, what: "ルールに対するコアのlintルールです。" },
	{ id: "standard", file: <><code>requirements.js</code>、<code>rule-map.js</code></>, what: "規格の場合のみ：要件と、それぞれを検査するルールです。" },
	{ id: "procedures", file: <><code>procedures.js</code>、<code>tests/procedures.test.js</code></>, what: "規格の場合のみ：人が各要件を手作業でどう評価するかと、すべての要件がその各ファセットについて手順を持つことを確かめるテストです。" },
	{ id: "package", file: <code>package.json</code>, what: <><code>private</code>で、<code>@surea11y/core</code>を、それを書き出したバージョン（<code>^1.15.0</code>）でpeer依存関係に、eslint、jsdom、Playwrightを開発用の依存関係に持ちます。</> },
	{ id: "readme", file: <><code>README.md</code>、<code>.gitignore</code></>, what: "これらのファイルについてのパック自身のガイドと、gitが対象外にするものです。" },
];

const profileFieldRows = [
	{ id: "tags", field: <code>tags</code>, what: <>これらのタグのいずれかを持つルールです。<code>@surea11y/core/pack</code>の<code>wcagTags(version, levels)</code>はコアのWCAGのタグを返します（<code>wcagTags('2.1')</code>は2.0と2.1の、AとAAです）。</> },
	{ id: "rules", field: <code>rules</code>, what: <>コアまたはパックのルールをIDで指定します。WCAGのタグでは選択されないベストプラクティスのルールや、<code>tags: []</code>と組み合わせて、パック自身のルールのほかにプロファイルが実行するコアのルールを指定します。</> },
	{ id: "exclude", field: <code>exclude</code>, what: <><code>{"{ rules: [...] }"}</code>はルールをスキャンから除外します。<code>{"{ criteria: ['2.5.8'] }"}</code>はそれらの達成基準を免除します。その集約は除かれ、すべての達成基準が免除されたルールも除かれます。プロファイルが残す達成基準も検査するルールは引き続き実行されます。これはスキャンがチェックする範囲を狭めるもので、WCAGの要件は変わりません。</> },
	{ id: "severity", field: <code>severity</code>, what: <><code>{"{ ruleId: level }"}</code>：そのプロファイルでの別の重大度です。結果にはそれが表示され、ルール自身の重大度は<code>ruleSeverity</code>として保持されます。ベースラインと検出結果のIDは変わりません。</> },
	{ id: "wcagVersion", field: <code>wcagVersion</code>, what: <><code>'2.0'</code>、<code>'2.1'</code>、<code>'2.2'</code>のいずれかで、プロファイルのスキャンを判定するWCAGのバージョン（<code>engine.wcagVersion</code>）です。指定しない場合は<code>tags</code>のWCAGのタグがバージョンを示し、WCAGのタグがないプロファイルは2.2で判定されます。スキャン自身の<code>engineOptions.wcagVersion</code>が引き続き優先されます。コア1.12.0以降です。</> },
	{ id: "keepsParsing", field: <code>keepsParsing</code>, what: <>EN 301 549 V3.2.1のように、規格が4.1.1「構文解析」を文言どおりに求める場合は<code>true</code>です。そのとき、2.0や2.1を対象にしても、その不合格は不合格のままです。これがないプロファイルでは、WCAG 2.0と2.1に対する2023年の正誤表がHTMLとXMLについて4.1.1を満たされているものとするため、<code>duplicate-id</code>は代わりに確認を求めます（4.1.1を削除した2.2では、プロファイルの指定にかかわらず確認を求めます）。数えるのはプロファイル自身のフィールドだけで、コアのプロファイルの代わりになるパックのプロファイルはそれを引き継ぎません。<code>engineOptions.mappings</code>は判定結果を変えないため、4.1.1を維持する規格で判定するスキャンは、その規格のプロファイルを実行します。core 1.14.0以降です。</> },
	{ id: "version", field: <><code>version</code>、<code>mappedRules</code></>, what: <>規格のプロファイルの場合のみ：対象とする規格のバージョンと、そのバージョンで規格が対応付けるすべてのルールを実行するための<code>mappedRules: true</code>です。</> },
];

export function PacksContent() {
	return (
		<>
			<p>
				<strong>パック</strong>は、ルール、コアのルールのバリアント、規格やチェックリストと、それらのプロファイルやメッセージを、コアをフォークもビルドもせずに、それ自身のパッケージとして<code>@surea11y/core</code>に提供します。RGAAのような国の規格もパックにでき、組織のアクセシビリティ方針もパックにできます。スキャンは<code>engineOptions.packs</code>でパックを受け取り、コア自身のルールや規格と同じように実行します。Nodeでもブラウザーでも、CLI、バインディング、test-matchersのどこからでも動作し、結果、集約、レポートの項目はコアのものと同じ形式になります。パックには<code>@surea11y/core</code> 1.11.1以降が必要です。SureA11yファミリーの規格パックで、すぐにインストールできるものが2つあります。<a href="#en-301-549-pack">EN 301 549</a>と<a href="#wai-aria-pack">WAI-ARIA 1.2</a>です。
			</p>

			<h2 id="which-kind-of-pack">パックの種類</h2>
			<DataTable
				label="パックの種類"
				rowKey="id"
				columns={[
					{ key: "have", label: "手元にあるもの", wrap: true },
					{ key: "kind", label: "種類", width: "16%" },
					{ key: "holds", label: "含むもの", wrap: true },
				]}
				rows={kindRows}
			/>
			<p>
				パックのルールとプロファイルは、コアのどのルールでも使えます。チェックリストや規格の大部分は、選んでまとめたコアのルールに、コアにない少数のルールを加えたものです。このページの例では、すべてのバインディングが<code>examples/</code>フォルダーに同梱している小さなパック<code>acme-policy-pack.js</code>を使います。独自ルール1つ、チェックリストのプロファイル（WCAG 2.2のAとAA、<code>region</code>、独自ルール）、チェックリストの項目2つを持ちます。<a href="#start-from-the-example">そのソース</a>は後述します。
			</p>

			<h2 id="en-301-549-pack">EN 301 549のパック</h2>
			<p>
				<a href={pack}><code>@surea11y/pack-en301549</code></a>は、SureA11yファミリーの、すぐにインストールできる規格パックです。EN 301 549の第9章（Web）を、V3.2.1とV4.1.1で扱います。バージョンごとのプロファイル<code>en301549-v4.1.1</code>と<code>en301549-v3.2.1</code>は条項ごとに結果を1つ報告し、<code>mappings: ['en301549']</code>は、WCAGのスキャンを含むあらゆるスキャンの結果に条項を示します。<code>@surea11y/core</code> 1.13.0以降が必要です。
			</p>
			<p>
				core 1.14.0に合わせた1.1.0では、各条項を、それが再掲するWCAGの達成基準をコアが判定するのと同じように判定します。そのため、まだ合格する条項はありません。ルールがすべて合格した条項は、残りを人が確認するよう、その達成基準と同じく<code>cantTell</code>になります（<a href="/conformance/wcag-mapping/">WCAG適合性との対応</a>を参照）。<code>en301549-v3.2.1</code>プロファイルは4.1.1「構文解析」を維持するため、そこでは重複したidは引き続き9.4.1.1を不合格にします。また、9.1.4.5、9.3.3.1、9.4.1.3に最初のルールが加わりました（<code>image-of-text</code>、<code>invalid-field-error-message</code>、<code>live-region-announcements</code>）。core 1.13では、1.0系と同じように動作します。
			</p>
			<p>
				core 1.15.0以降と組み合わせた1.2.0では、人が各条項を手作業でどう確認するかも示します。コアのルールが評価する場合は、それが再掲するWCAGの達成基準の<a href="/conformance/procedures/">テスト手順</a>を、その条項として読み替えたもの（「which fails EN 301 549 9.1.4.3」）です。条項は規格自身の順に、第9章の原則とガイドラインのもとに並び、規格はフランス語、ドイツ語、スペイン語、日本語に翻訳されているので、テスト手順の一覧やワークシート、スキャンの条項のタイトルは、最初から最後までそれらの言語で読めます。パックが扱うのは第9章だけです。規格のほかの要件（第4章の機能的パフォーマンスの記述、第12章、Webページではないものの章）については、ルールも結果も手順もありません。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// npm install @surea11y/core @surea11y/pack-en301549",
					"const en301549 = require('@surea11y/pack-en301549');",
					"",
					"runDomRulesInPage(url, null, { packs: [en301549], profile: 'en301549-v4.1.1' });",
					"runDomRulesInPage(url, null, { packs: [en301549], profile: 'wcag22-aa', mappings: ['en301549:V4.1.1'] });",
				]}
			/>
			<p>
				独自の規格を作るときの実例でもあります。ルールは持ちません。第9章はWCAGを再掲したものなので、各条項はその達成基準に対するコアのルールで確認します。プロファイルはそれらのルールを選び（<code>tags</code>、<code>mappedRules: true</code>）、規格の各バージョンを判定するWCAGのバージョンを示し（<code>wcagVersion</code>）、V3.2.1では4.1.1「構文解析」を維持します（<code>keepsParsing</code>）。条項はWCAGの達成基準を1対1で再掲しています（<code>applicability: 'wcag'</code>）。ルールの対応表はインストールされたコアのカタログから導くため、コアが追加したルールもパックを変えずに対象になります。WCAGにない要件を持つ規格も同じ形で、独自のルールを加えます。ソースは短いので、後述の<a href="#writing-a-pack">パックを書く</a>と合わせて読む価値があります。
			</p>
			<p>
				コアは1.13.0までEN 301 549を内蔵していましたが、1.13.0でこのパックに置き換える形で非推奨にしました（<a href="/conformance/wcag-mapping/#en-301-549">WCAG適合性との対応</a>を参照）。ほかのプロファイルと同じく、パックのプロファイルが決めるのは何を実行するかです。適合を表明するには、引き続き人がすべての条項を確認する必要があります。
			</p>

			<h2 id="wai-aria-pack">WAI-ARIAのパック</h2>
			<p>
				<a href={ariaPack}><code>@surea11y/pack-wai-aria</code></a>は、WAI-ARIA 1.2を規格として扱います。ルールが確認できる作成者要件ごとに結果を1つ、コアのARIAのルールをWAI-ARIA自身の文言で判定して報告します。そのプロファイル<code>wai-aria-1.2</code>は、コアのARIAのルールとパック独自のルールを実行し、それ以外は実行しません。<code>@surea11y/core</code> 1.15.0以降が必要です。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// npm install @surea11y/core @surea11y/pack-wai-aria",
					"const waiAria = require('@surea11y/pack-wai-aria');",
					"",
					"runDomRulesInPage(url, null, { packs: [waiAria], profile: 'wai-aria-1.2' });",
				]}
			/>
			<p>
				<strong>なぜ独自の規格なのか。</strong>コアのARIAのルールはWCAGのルールであり、WCAGのスキャンは、それらが見つけたWAI-ARIAの違反をすべて、WCAGの不合格か、人への問いとして報告します。この2つは食い違うことがあります。名前のない<code>role="grid"</code>はWAI-ARIAの「<span lang="en">Accessible Name Required</span>」に確実に違反しますが、WCAG 4.1.2の不合格になるかどうかはページが示すものによるので、WCAGは問いかけます。core 1.15.0以降、WCAGのスキャンが不合格にするのはWCAG自体が不合格とする場合だけです（<a href="/help/faq/#results-changed-1-15">変更点</a>）。このパックは同じ検出結果をWAI-ARIAに基づいて読み、そこではgridは不合格になります。
			</p>
			<DataTable
				label="パックにあるWAI-ARIA 1.2の要件"
				rowKey="id"
				columns={[
					{ key: "req", label: "要件", width: "30%" },
					{ key: "title", label: "タイトル", wrap: true },
				]}
				rows={ariaRequirementRows}
			/>
			<p>
				それぞれが1つの結果<code>{"wai-aria-1.2-<requirement>"}</code>になります。WAI-ARIAが、作成者がしなければならない（MUST）、またはしてはならない（MUST NOT）と定めることをルールが見つけた場合は<code>fail</code>、それ以外は<code>cantTell</code>です。WAI-ARIAが推奨しないだけのもの（SHOULD、「<span lang="en">not recommended</span>」）の検出結果や、検出結果がまったくない場合がこれに当たります。ルールが確認するのはマークアップが示すものであり、要件がカバーするすべて（スクリプトが変えるもの、ブラウザーが計算するもの）ではないからです。ルールだけで要件が合格になることはありません。パックはコアのルールに加えて、もっともらしいWCAGへの影響がないためにコアのどのルールも確認しない要件のための独自のルールを11個持っています。スクロールバーの<code>aria-controls</code>、フィードの記事、キャプションのコンテキスト、コンボボックスのポップアップ、スピンボタンが所有する要素、表のインデックス、<code>aria-setsize</code>、<code>aria-keyshortcuts</code>、ツールバーの名前、プレゼンテーション用の要素、そして<code>wai-aria-role-name-present</code>です。最後のものはコアの<code>aria-role-name-present</code>のバリアントで、WAI-ARIAが名前を必要とするすべてのロール（コアのものに加えて、application、marquee、table、tabpanel、treegrid）をカバーします。パック独自のテキストは英語です。
			</p>
			<p>
				<strong>WCAGや別の規格と一緒に。</strong>1回のスキャンで、WAI-ARIAとWCAGで同時にページを判定することも（<a href="#with-other-profiles">後述</a>）、両方のパックを使ってEN 301 549とWAI-ARIAで判定することもできます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(url, null, {",
					"  packs: [waiAria],",
					"  profile: ['wcag22-aa', 'wai-aria-1.2']",
					"});",
					"",
					"// <div role=\"group\" aria-checked=\"true\">: an attribute the role doesn't",
					"// support, a question for WCAG 4.1.2 and a failure of WAI-ARIA.",
					"const check = result.checksResults.find((c) => c.ruleId === 'aria-allowed-attr');",
					"check.verdicts;     // { 'wcag22-aa': 'cantTell', 'wai-aria-1.2': 'fail' }",
					"check.outcome;      // 'fail', the worst of them, which SARIF and JUnit gate on",
					"check.checkOutcome; // 'cantTell', the rule's own, which WCAG's criteria read",
					"",
					"result.profiles['wai-aria-1.2'].rulesResults; // this standard's results, by id",
				]}
			/>
			<p>
				両方のプロファイルが実行するルールは、それぞれから判定を受ける1つのチェックです。名前は例外です。<code>wai-aria-1.2</code>のもとではパックのバリアントで確認されるので、名前のない<code>role="grid"</code>は2つのチェックになります。コアの<code>aria-role-name-present</code>（<code>{"{ 'wcag22-aa': 'cantTell' }"}</code>）とバリアント（<code>{"{ 'wai-aria-1.2': 'fail' }"}</code>）です。
			</p>
			<p>
				<strong>人が問いにどう答えるか。</strong><code>wai-aria-1.2</code>のもとでは、この規格が問いにするコアの問いの手順はWAI-ARIAの言葉で書かれ、検出結果が見つけたものを名指しします（「<span lang="en">When the page was scanned, the element it controls had role dialog</span>」）。WCAGのプロファイルも実行するスキャンでは、WCAGの達成基準を名指しするコアの手順のままです。<code>{"proceduresFor('name-required', { packs: [waiAria], standard: 'wai-aria' })"}</code>は各要件のチェックリストを返し、妥当なロール、状態、値を、勧告の表からすべて列挙します。パックの<code>docs/COVERAGE.md</code>は、ルールがマークアップから確認できるWAI-ARIA 1.2のすべての作成者要件を、ロール、状態、プロパティごとに1つのケースとして挙げ、それぞれをプロファイルがどう判定するかを示します。
			</p>
			<p>
				WCAGが問いかけるところで確信を持つ規格の実例でもあります。<code>rule-map.js</code>は、コアの各ARIAのルールについて、各理由コードがWAI-ARIAのもとで何を意味するかを列挙し、MUSTには<code>outcome: 'fail'</code>を付けています（<a href="#sending-findings-to-requirements">検出結果を要件に振り分ける</a>を参照）。
			</p>

			<h2 id="using-a-pack">パックを使う</h2>

			<h3 id="from-node">Nodeから</h3>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' }, null);",
					"result.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
				]}
			/>
			<p>
				パックは1回だけ準備され、同じパックのオブジェクトでの次のスキャンのために保持されます。そのため、すべてのページに同じパックを渡すクロールでは、準備は1回で済みます。<code>definePack</code>はパックのオブジェクトを凍結します。変更できないものとして扱い、スキャン間では同じオブジェクトを再利用してください。パックを渡すとスキャンに登録されますが、そのルールが選択されるわけではありません。パックの名前空間のタグを持つパックのルールはオプトインです。パックのプロファイルを使わない場合、IDかそのタグで選択されたときだけ実行されます（<a href="#names">名前</a>を参照）。このタグを持たないパックのルールはコアのルールと同じように選択されるため、パックを渡したデフォルトのスキャンで実行されます。ベストプラクティスも実行するには、プロファイルと並べて<code>{"runOnly: { bestPractices: true }"}</code>を追加してください。
			</p>

			<h3 id="with-a-browser-binding">ブラウザーのバインディングで</h3>
			<p>
				Playwright、Puppeteer、Selenium、WebdriverIOは、<code>.withPacks()</code>でパックのオブジェクトを受け取り、スキャンの前にページに、また<code>.frames(true)</code>ではすべてのフレームに登録します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { A11yCoreBuilder, getScanGaps } = require('@surea11y/playwright');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const results = await new A11yCoreBuilder({ page })",
					"  .withPacks(acmePolicy)",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze();",
					"",
					"results.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"",
					"// A checklist's items, each one result, beside core's WCAG rollups:",
					"results.rulesResults.filter((r) => r.meta && r.meta.standard === 'Acme web policy');",
				]}
			/>
			<p>
				複数のパックでスキャンするには、配列を渡すか、<code>.withPacks()</code>をもう一度呼び出してください。バインディングは<code>.withPacks()</code>を共通して持ちますが、各ビルダーはそれぞれのドライバーのオブジェクト（<code>{"{ page }"}</code>、<code>{"{ driver }"}</code>、<code>{"{ browser }"}</code>）を受け取り、それぞれのセットアップが必要です。<a href="/getting-started/playwright/">Playwright</a>、<a href="/getting-started/puppeteer/">Puppeteer</a>、<a href="/getting-started/selenium/">Selenium</a>、<a href="/getting-started/webdriverio/">WebdriverIO</a>を参照してください。
			</p>

			<h3 id="with-cypress">Cypressで</h3>
			<p>
				パックはNodeで準備されますが、Cypressのspecはブラウザーで実行されます。そのためCypressでは、<code>.withPacks()</code>は各パックのモジュール名（パッケージ名、またはプロジェクトのルートからのパス）を受け取り、バインディングのプラグインがNodeでパックを準備します。プラグインは1回だけ登録してください。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// cypress.config.js",
					"const { defineConfig } = require('cypress');",
					"const surea11y = require('@surea11y/cypress/plugin');",
					"",
					"module.exports = defineConfig({",
					"  e2e: {",
					"    setupNodeEvents(on, config) {",
					"      surea11y(on, config);",
					"    }",
					"  }",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"new A11yCoreBuilder()",
					"  .withPacks('./examples/acme-policy-pack.js') // or a package name, '@acme/a11y-policy'",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze()",
					"  .then((results) => {",
					"    expect(results.engine.packs).to.deep.equal(['@acme/a11y-policy@1.0.0']);",
					"  });",
				]}
			/>
			<p>
				<code>.analyze()</code>は、パックを登録するスクリプトを<code>cy.task</code>を通じてプラグインに求め、それをページで、また<code>.frames(true)</code>では同一オリジンのすべてのフレームで実行します。プラグインは実行が終わるまでパックを保持するため、パックのファイルへの変更は、次の<code>cypress run</code>か、<code>cypress open</code>を再起動した後に反映されます。ほかのバインディングが受け取るようなパックのオブジェクトを渡すと、ブラウザーでは準備できないため、<code>.withPacks()</code>で例外が投げられます。
			</p>

			<h3 id="with-the-test-matchers">test-matchersで</h3>
			<p>
				<code>@surea11y/test-matchers</code>はNodeでスキャンするため、パックはオブジェクトそのものとして渡します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const acmePolicy = require('./acme-policy-pack');",
					"const policy = { packs: [acmePolicy], profile: 'acme-web-2026' };",
					"",
					"test(\"a page that breaks the pack's house rule fails the assertion\", () => {",
					"  document.body.innerHTML = '<main><h1>Welcome</h1><video autoplay src=\"intro.mp4\"></video></main>';",
					"  expect(document).not.toHaveNoA11yViolations(policy);",
					"});",
				]}
			/>
			<p>
				すべてのテストが同じパックのオブジェクトを渡すよう、パックのオブジェクトは1か所（セットアップファイルやモジュール）にまとめてください。実行されなかったパックは、アサーションを失敗させます。<a href="/getting-started/test-matchers/#packs">test-matchers</a>を参照してください。
			</p>

			<h3 id="from-the-cli">CLIから</h3>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				<code>--pack</code>は、作業ディレクトリのプロジェクトから解決されるパッケージ名か、パスを受け取り、複数のパックには繰り返して指定します。パックは<code>@surea11y/core/pack</code>を読み込みます。これは、プロジェクトに<code>@surea11y/cli</code>をインストールすると、CLIと並んでインストールされます。<a href="/getting-started/cli/#packs">CLI</a>を参照してください。
			</p>

			<h3 id="in-a-page-of-your-own">独自のページで</h3>
			<p>
				ブラウザー拡張機能や独自の<code>page.evaluate</code>では、コアのブラウザー用バンドルの後に<code>@surea11y/core/pack</code>の<code>packScript([acmePolicy])</code>を注入するか、<code>buildBrowserBundle({"{ packs: [acmePolicy] }"})</code>で作った1つのファイルを配布し、パックを<code>name@version</code>として指定してください。<a href="/getting-started/standalone/#packs-in-a-page">スタンドアロン</a>を参照してください。スクリプトをファイルとして読み込むページには、<code>buildBrowserBundle</code>で作る1つのファイルが最適です。パックのスクリプトは、それを書き出したコアでしか動作しません。
			</p>
			<p>
				別のコアのバンドルを持つページはパックをスキップし、<code>skippedPacks</code>が2つのバージョンを示します。そのため、そのファイルはコアかパックのリリースごとに作り直してください。
			</p>

			<h3 id="with-other-profiles">ほかのプロファイルと並べて</h3>
			<p>
				パックのプロファイルは、1回のスキャンでWCAGのプロファイルや別のパックのプロファイルと並べて実行できます。core 1.15.0以降、<code>profile</code>はリストを受け取り、各プロファイルは単独で使ったときと同じようにページを判定します（<a href="/configuration/engine-options/#several-profiles">エンジンオプション</a>を参照）。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(url, null, {",
					"  packs: [acmePolicy, en301549],",
					"  profile: ['acme-web-2026', 'en301549-v4.1.1']",
					"});",
					"result.engine.profiles; // ['acme-web-2026', 'en301549-v4.1.1']",
					"result.profiles['acme-web-2026'].rulesResults; // the policy's items, by id",
				]}
			/>
			<p>
				WCAGが問いかけるところで規格が確信を持つ検出結果（そのルールの対応表で<code>outcome: 'fail'</code>）はスキャンを不合格にし、その<code>verdicts</code>はそれぞれのプロファイルがその検出結果をどう判定するかを示します。パックがスキップされたプロファイルは<code>engine.profilesNotRun</code>に列挙され、ほかのプロファイルは引き続き実行されます。リストは、バインディングでは<code>.options({"{ profile }"})</code>で、test-matchersではそのオプションで、CLIでは<code>--profile</code>の繰り返しで指定します。
			</p>

			<h2 id="what-a-scan-reports">スキャンが報告するもの</h2>
			<ul>
				<li>
					<code>engine.packs</code>は実行された各パックを<code>name@version</code>の形で示し、<code>engine.profile</code>は適用されたプロファイルを示します。
				</li>
				<li>
					パックのルールはコアのルールと同じように<code>checksResults</code>に現れ、そのIDはパックの名前空間で始まります（<code>acme-no-autoplay</code>）。WCAGの達成基準に対応するパックのルールは、その達成基準の集約に算入されます。ただし、パックのオプトインの名前空間のタグを持つルールは除きます。それらのルールはWCAGが求めていないことをチェックするため、パック自身の集約にだけ算入されます。それでもその<code>wcagSc</code>は、レポーターのために、検査するWCAGの達成基準を示します。ほかの規格（すべてのルールをWCAGの達成基準で対応付けるEN 301 549）がそれらを自身のものとすることはありません。上書きは、置き換えるコアのルールの代わりに、それ自身の対応が示す集約に算入されます。
				</li>
				<li>
					チェックリストの項目や規格の要件は<code>rulesResults</code>の集約で、チェックリストや規格の名前を<code>meta.standard</code>として持ちます。<a href="/results-reports/html-report/">HTMLレポート</a>はそれらを独自のセクションに表示し、<a href="/results-reports/sarif-report/">SARIF</a>は各ルールに、それが属する項目のタグ（<code>acme-images</code>）を付け、<a href="/results-reports/junit-report/">JUnit</a>はそれらをプロパティとして列挙します。結果の<code>standards</code>がチェックリストを示すため、保存した結果はどこでレンダリングしても同じになります。
				</li>
				<li>
					プロファイルの<code>severity</code>は、それが変更する結果に表示され、ルール自身の重大度は<code>ruleSeverity</code>として保持されます。
				</li>
				<li>
					複数のプロファイルでのスキャンでは、<code>engine.profiles</code>が実行されたプロファイルを列挙し、<code>profiles[id]</code>がそれぞれの集約を持ち、各検出結果の<code>verdicts</code>がそれぞれのプロファイルがその検出結果をどう判定するかを示します（<a href="/results-reports/output-schema/#several-profiles">出力スキーマ</a>）。
				</li>
				<li>
					HTMLレポートの「人による確認が残っているもの」は、スキャンがそのプロファイルを実行し、規格が<a href="#procedures">テスト手順</a>を提供する場合、パックの規格に、その規格自身の番号で従います。
				</li>
			</ul>

			<h2 id="when-a-pack-doesnt-run">パックが実行されない場合</h2>
			<p>
				<code>core</code>の範囲がインストールされているコアを含まないパック、妥当でないパック、コアと両立しないパック（名前空間の外にあるルールID、コアが持つ辞書のキー、存在しないルールのバリアント）はスキップされます。スキャンはそのパックなしで実行され、警告を出し、<code>skippedPacks</code>に<code>{"{ name, reason }"}</code>として列挙します。<code>strictOptions</code>のもとでは、<code>engineOptions.packs</code>のすべてのエラーと同じく<code>code: 'INVALID_ENGINE_OPTIONS'</code>付きのエラーを投げます。互いに衝突する2つのパック（両方が定義する辞書のキー、1つのキーを持つ2つの規格）はエラーを投げます。どちらかを選ぶ方法は、どれも渡された順序に左右されてしまうからです。ページ内では、<code>engineOptions.packs</code>で指定されたのに、どの<code>packScript</code>の呼び出しも登録していないパックや、別のバージョンのコアで登録されたパックが、同じように列挙されます。そのため、パックを追加した目的のチェックがないままスキャンが終わることもあります。パックに依存するツールは、スキャンを完了したものとして扱う前に<code>skippedPacks</code>を確認してください。
			</p>
			<p>どのツールも、スキップされたパックを目に見える失敗に変えます。</p>
			<ul>
				<li>
					ブラウザーのバインディングは、<code>.withPacks()</code>を呼び出したときに各パックを確認し、コアが実行できないパックがあればスキャンの前に例外を投げます。それでもページが実行しなかったパックは、<code>getScanGaps(results)</code>の<code>'pack-skipped'</code>のスキャンギャップになり、<code>.analyze()</code>がそれについて警告するため、スキャンギャップを検証するテストは失敗します。
				</li>
				<li>test-matchersは、パックと理由を示してアサーションを失敗させます。</li>
				<li>
					CLIは、見つからない、または読み込めないパックや、エンジンがスキップするパックに対して、レポートもベースラインも書き出さずに終了コード<code>2</code>で終了します。
				</li>
			</ul>
			<p>
				パックは<code>@surea11y/core</code>およびそれを実行するパッケージと並べてインストールし、3つが同じコアを共有するようにしてください。
			</p>

			<h2 id="writing-a-pack">パックを書く</h2>

			<h3 id="start-from-the-example">例から始める</h3>
			<p>
				パックは、<code>@surea11y/core/pack</code>の<code>definePack</code>で作るオブジェクトです。これは、バインディングが同梱している例の<code>acme-policy-pack.js</code>です。
			</p>
			<CodeBlock lang="js" lines={examplePack} />
			<p>
				そのプロファイル<code>acme-web-2026</code>は、コアのWCAG 2.2のAとAAのルール、どのWCAGのタグでも選択されないベストプラクティスのルール<code>region</code>、そして独自ルールを実行します。2つの集約はチェックリストの項目で、それぞれがコアまたはパックのルールを1つの結果にまとめます。
			</p>

			<p>
				規格の場合は、<a href="#en-301-549-pack">EN 301 549のパック</a>が、公開済みの完全な例です。
			</p>

			<h3 id="create-one"><code>surea11y-pack new</code>で作る</h3>
			<p>独自のパックを作るには、生成したパッケージから始めてください。</p>
			<CodeBlock
				lines={[
					{ text: "npx -p @surea11y/core surea11y-pack new acme-a11y --name @acme/a11y-pack", command: true },
					"# or, for a standard:",
					{ text: "npx -p @surea11y/core surea11y-pack new city-standard --name @city/a11y-standard --kind standard --title \"City Standard\"", command: true },
					"",
					{ text: "cd acme-a11y", command: true },
					{ text: "npm install", command: true },
					{ text: "npx playwright install chromium   # once, for npm run docs", command: true },
					{ text: "npm test && npm run lint && npm run docs", command: true },
				]}
			/>
			<p>
				パックは生成した時点で動作します。テストは合格し、ルールはlintを通り、例はルールと一致します。<code>surea11y-pack new</code>は、何かを書き出す前にスキャンと同じようにパックを確認し、パックを無効にする名前、名前空間、タイトル（<code>WCAG</code>というタイトルは、その規格をコアの規格の1つとして示してしまいます）を、理由を示して拒否します。そこから少しずつ変更し、その都度<code>npm test</code>を実行してください。READMEが各ファイルを順に説明しています。
			</p>
			<DataTable
				label="生成されたパックのファイル"
				rowKey="id"
				columns={[
					{ key: "file", label: "ファイル", width: "40%", wrap: true },
					{ key: "what", label: "含むもの", wrap: true },
				]}
				rows={fileRows}
			/>

			<h3 id="names">名前</h3>
			<ul>
				<li>
					<strong>パッケージ名とバージョン</strong>は、npmのパッケージ名と完全なバージョン（<code>1.0.0</code>）です。スキャンはそれらを<code>engine.packs</code>で報告します。
				</li>
				<li>
					<strong>名前空間</strong>（<code>namespace: 'acme'</code>）は、パックのIDをコアやほかのパックのIDと区別します。すべてのルール、集約、プロファイルのIDは、名前空間と<code>-</code>で始まります。コアのルールIDの接頭辞になる名前（<code>img-alt-present</code>に対する<code>img</code>のように、<code>img</code>、<code>aria</code>、<code>link</code>）や、<code>wcag</code>で始まる名前は使えず、1つのスキャンにある2つのパックが同じ名前空間を持つことはできません。名前空間は、パック自身のルールをオプトインにするタグでもあります。このタグを持つルールは、パックのいずれかのプロファイルのもとか、IDか、タグ（<code>optInRules: ['acme']</code>）で選択されたときだけ実行されます。そのため、デフォルトでは、WCAGを対象とするスキャンでは実行されません。<code>optInRules</code>でこのタグを有効にしても、スキャンのプロファイルやフィルターはなくなりません。WCAGのプロファイルのもとでは、有効にしたルールは、そのタグがプロファイルにも一致するときだけ実行されます。パックを使うすべてのスキャンで実行すべきルールには、このタグを付けないでください。そうすると、そのルールはコアのルールと同じように選択され、タグが一致すれば、WCAGを対象とするスキャンでも実行されて不合格を報告することがあります。
				</li>
				<li>
					<strong><code>core</code></strong>は、パックが動作するコアのバージョンの範囲（<code>'^1.11.1'</code>）で、npmと同じように範囲として読まれます。新しいパックは1.11.1から始めてください。1.11.0のパッケージには、Nodeでパックに必要なファイルが含まれていませんでした。範囲外のコアでのスキャンはパックをスキップし、理由を<code>skippedPacks</code>に示します。<code>surea11y-pack new</code>は、パックを生成したバージョン（<code>^1.15.0</code>）を書き出します。1.14で追加されたもの（<code>meta.review</code>、<code>reasonCodes</code>や<code>findings</code>の行、<code>meta.contributions</code>、<code>applicability</code>、<code>partial</code>、<code>keepsParsing</code>）をパックが使う場合は、1.14から始まる範囲のままにし、<code>outcome: 'fail'</code>を使う場合は1.15から始まる範囲にしてください。1.15が読むそのほかのもの（規格のテスト手順、グループ、翻訳、独自の確認手順）は、古いコアでは無視されます。
				</li>
				<li>
					<strong><code>title</code></strong>は結果やレポートでのチェックリストの呼び名、<strong><code>description</code></strong>はパックが何をチェックするかを述べる1文で、利用者にパックを選ばせるツールのためのものです（<code>describePacks</code>がそれを返します）。
				</li>
			</ul>

			<h3 id="profiles">プロファイル</h3>
			<p>
				プロファイルは名前の付いた選択で、<code>engineOptions.profile</code>で実行します。ルールは、そのプロファイルの<code>tags</code>のいずれかを持つか、IDが<code>rules</code>にあり、<code>exclude</code>にない場合に、そのもとで実行されます。パックの名前空間のタグを持つパックのルールは、パックのすべてのプロファイルのもとで実行されます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"profiles: {",
					"  'acme-policy': {",
					"    tags: wcagTags('2.2', ['A', 'AA']),               // core's WCAG 2.2 A and AA rules",
					"    rules: ['region', 'heading-order'],               // and these, by id",
					"    exclude: { rules: ['contrast-minimum'] },         // but not this one",
					"    severity: { 'img-alt-present': 'critical' }       // and this one is critical here",
					"  },",
					"  'acme-quick': {",
					"    tags: [],",
					"    rules: ['img-alt-present', 'link-name-present', 'page-title-present']",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="プロファイルのフィールド"
				rowKey="id"
				columns={[
					{ key: "field", label: "フィールド", width: "22%" },
					{ key: "what", label: "働き", wrap: true },
				]}
				rows={profileFieldRows}
			/>
			<p>
				<strong>規格が求めるものだけを実行するプロファイル。</strong><code>{"tags: [<ns>]"}</code>と<code>mappedRules: true</code>を持つ規格のプロファイルは、パック自身のルールと、その対応表が要件に結び付けるコアのルールだけを実行します。規格が求めないことを検査するルールはなく、結果にWCAGの達成基準は含まれません。ただし、WCAGのタグがないため、その規格がどのWCAGのバージョンに基づくかを示すものがなく、実行は2.2で判定されます。2.1に基づく規格ではこれは誤りです。実行は、2.5.8のように規格にない2.2の達成基準を報告します。バージョンを指定してください。規格が今も4.1.1「構文解析」を求める場合は、<code>keepsParsing: true</code>も指定してください。生成された<code>index.js</code>は、それを<code>requirements.js</code>から読みます。そこでは規格の各バージョンが、基づくWCAGのバージョンを示しています（<code>{"{ version: '1.0', wcagVersion: '2.2' }"}</code>）。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'city-1.0': {",
					"  version: '1.0',",
					"  tags: ['city'],                      // the pack's own rules",
					"  mappedRules: true,                   // and the core rules its map links to a requirement",
					"  wcagVersion: wcagVersionOf('1.0')    // judged by the WCAG version requirements.js gives for 1.0",
					"}",
				]}
			/>
			<p>
				コアのルールとそのID、タグは、<a href="/rules/">ルール</a>のカタログにあります。
			</p>

			<h3 id="checklist-items-and-requirements">チェックリストの項目と要件</h3>
			<p>
				<strong>チェックリストの項目</strong>は、その<code>rollups</code>です。<code>{"{ id, title, checksIds }"}</code>の形で、それぞれがルールを1つの結果にまとめます。項目は、ルールのいずれかが不合格なら不合格になり、すべてが合格すれば合格します。不合格のルールがなく、いずれかが<code>cantTell</code>を返した場合、項目も<code>cantTell</code>になり、人によるレビューが必要です。パックが持つのは、<code>profiles</code>と<code>rollups</code>（チェックリスト）か、<code>standard</code>のどちらか一方で、両方は持ちません。
			</p>
			<p>
				<strong>規格の要件</strong>は、ジェネレーターが書き出す2つの表から来ます。<code>requirements.js</code>（バージョンごとに、各要件の番号、文言、WCAGの達成基準）と<code>rule-map.js</code>（各ルールがどの要件を検査するか、そしてその理由）です。<code>@surea11y/core/pack</code>の<code>ruleMappedStandard()</code>は、それらを規格に変換します。要件ごとの集約、各ルールの結果が示す要件、そしてパックを準備するときの両方の表の確認です。
			</p>

			<h3 id="sending-findings-to-requirements">検出結果を要件に振り分ける</h3>
			<p>
				<code>rule-map.js</code>のルールの行は、<code>{"reasonCodes: { [code]: { requirements, outcome } }"}</code>で、ある理由コードの検出結果を別の要件に振り分けられます。<code>requirements</code>（デフォルトは行のもの）はその検出結果を数える要件で、<code>[]</code>ならどこにも数えません。<code>outcome: 'cantTell'</code>は、そこで不合格の検出結果を確認の問いにし、<code>outcome: 'fail'</code>（core 1.15.0以降）は、そこで問いを不合格にします。要件の集約は、その要件に数える検出結果でルールを判定するため、規格は、WCAGが不合格にする原因について確認を求めたり、WCAGが問いかける原因について確信を持ったり、2つの原因を2つのテストに振り分けたりできます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'list-children-valid': {",
					"  requirements: ['9.3.1'],",
					"  reasonCodes: { LIST_ITEM_ROLE_OVERRIDDEN: { requirements: ['9.3.1', '9.3.2'], outcome: 'cantTell' } }",
					"}",
				]}
			/>
			<p>
				<code>outcome: 'fail'</code>は、WCAGが問いかけるところで確信を持つ規格のためのものです。名前のない<code>role="grid"</code>は、4.1.2がページの示すものによるWCAGにとっては<code>cantTell</code>ですが、<a href="#wai-aria-pack">WAI-ARIAのパック</a>が示すとおり、WAI-ARIAの「<span lang="en">Accessible Name Required</span>」には確実に違反します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'aria-role-name-present': {",
					"  requirements: ['name-required'],",
					"  reasonCodes: { name_missing: { outcome: 'fail' } }",
					"}",
				]}
			/>
			<p>
				これが不合格にするのは規格の要件だけです。チェック結果自身の判定結果と、すべてのWCAGの集約はそのままです。規格が確実に述べるコードだけを列挙してください。列挙しなかったコードは、ルール自身の判定結果で判定されます。独自の集約を書く規格は、<code>meta.contributions</code>で同じように<code>'fail'</code>の作用を使います。
			</p>
			<p>
				行は、検出結果が記録している内容で振り分けることもできます。<code>{"findings: [{ when, requirements, outcome }]"}</code>の<code>when</code>は、検出結果の<code>data.details</code>のフィールドが等しくなければならない値を、ドット区切りのパスで示します。検出結果は、最初に一致したエントリーに従い、なければ理由コード、それもなければ行に従います。そのため、規格はあるルールの不合格を、理由コードが同じでも、テキストの大きさごとのテストに振り分けられます。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'contrast-minimum': {",
					"  requirements: ['3.1', '3.2'],",
					"  findings: [",
					"    { when: { 'typography.isLargeText': false }, requirements: ['3.1'] },",
					"    { when: { 'typography.isLargeText': true }, requirements: ['3.2'] }",
					"  ]",
					"}",
				]}
			/>
			<p>
				比べるのは、ルールが安定して保つフィールドだけにしてください。すべてのルールの<code>reasonCode</code>と、GitHub上のコアの<a href={`${core}/docs/API_STABILITY.md`}>APIの安定性ポリシー</a>が挙げる少数のフィールド（<code>contrast-minimum</code>のコントラスト比、しきい値、文字組みなど）です。変わったりなくなったりしたフィールドは何にも一致せず、検出結果は理由コードか行に従います。各ルールの理由コードは、GitHub上のコアの<a href={`${core}/docs/RULE_CATALOG.md`}>ルールカタログ</a>の「<span lang="en">What a finding reports</span>」に一覧があります。
			</p>
			<p>
				要件の判定方法を変えるフィールドがさらに2つあります。EN 301 549の第9章のように、要件がWCAGの達成基準を1対1で再掲する規格は、<code>ruleMappedStandard</code>に<code>applicability: 'wcag'</code>を渡します。すると要件の集約は、その達成基準のWCAGの集約がそうなる場合にだけ<code>notApplicable</code>や<code>pass</code>になり、1つのレポートの中で両者が一致します。達成基準を再掲してはいないものの、コアのルールでは完全には検査できない要件は、要件の表で<code>partial: true</code>とします。すると、その集約は、ルールがすべて合格した場合も、すべて何も見つけなかった場合も<code>cantTell</code>になります。ルールが検査したのはその一部だけだからです。独自の集約を書く規格は、各集約の<code>meta</code>で両方を示し、<code>meta.contributions</code>で検出結果を振り分けます。形は<code>pack.d.ts</code>の<code>StandardRollup</code>が示し、GitHub上のコアの<a href={`${core}/docs/PACKS.md`}>パックのガイド</a>が順を追って説明しています。どれもcore 1.14.0が必要です。
			</p>

			<h3 id="rules">ルール</h3>
			<p>
				ルールはコアのルールモジュールと同じ形です。<code>{"{ id, meta, runInPage }"}</code>に、一部の場合にだけ適用されるときは<code>applicability</code>を加え、同じ<code>ctx</code>を受け取ります。<code>runInPage(ctx)</code>はページ内で実行されるため、<code>ctx</code>だけを使い、その外の変数やモジュールは決して使いません。また、読み取りしか行いません。パックのルールはコアのルールの後に実行され、渡されるヘルパーとオプションは読み取り専用です。読み取り専用は決まりであって、サンドボックスではありません。ルールのコードがそれ以上のことをするのを止めるものはないため、信頼できるパックだけを読み込んでください（GitHub上のコアの<a href={`${core}/SECURITY.md`}>セキュリティポリシー</a>を参照）。コードがほとんど、またはまったく要らない近道が3つあります。<strong>バリアント</strong>はコアのルールを別の設定で実行し（<code>{"{ id, from: 'contrast-minimum', config: { normalTextRatio: 7 }, meta }"}</code>。しきい値は0より大きい有限の数、選択肢は列挙された値のいずれかを取り、<code>definePack</code>はそれ以外を拒否します）、<strong>上書き</strong>はコアのルールを置き換え（<code>overrides</code>に列挙し、結果の<code>overriddenBuiltinIds</code>にも示されます）、<strong>そのままのコアのルール</strong>はプロファイルや集約にIDを書くだけで済みます。ルールの書き方は、GitHub上のコアの<a href={`${core}/docs/RULE_AUTHORING.md`}>ルール作成ガイド</a>にあります。
			</p>
			<p>
				GitHub上のコアの<a href={`${core}/docs/RULE_SETTINGS.md`}>ルール設定の一覧</a>は、コアのルールがバリアントに提供するすべての設定を、デフォルト値、取りうる値、変わる内容とともに示します。<code>getChecksCatalog()</code>は同じものを各ルールの<code>variantSettings</code>として返します。別の規格における要件の版や、WCAGが評価者に委ねる選択は、こうしてコアのコードの上で実行されます。core 1.14から、<code>contrast-minimum</code>はロゴのように見えるテキスト（<code>logoText</code>）、より高いコントラストに切り替えるスイッチがあるページ（<code>contrastSwitch</code>）、セミボールドのテキスト（<code>semiBold</code>）についての選択肢を、<code>valid-lang</code>は、RGAAのようにISO 639のあらゆる言語コードを認める規格のための<code>codes: 'iso639'</code>を提供します。
			</p>

			<h3 id="review-steps">人が<code>cantTell</code>を確認する方法</h3>
			<p>
				検出結果を未判定のまま残すことがあるルールは、コアのルールと同じように、人がそれにどう答えるかを理由コードごとに示せます（出力スキーマの<a href="/results-reports/output-schema/#how-to-check">「確認方法」</a>を参照）。検出結果が示す要素から始まるいくつかの手順と、合格の場合と不合格の場合にそれぞれ何が見えるかです。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"meta.review = {",
					"  GENERIC_LINK_NAME: {",
					"    steps: ['Find the link the report names.', 'Read the text around it.'],",
					"    passWhen: 'The text around the link says where it goes.',",
					"    failWhen: 'Nothing near the link says where it goes, which fails WCAG 2.4.4.'",
					"  }",
					"};",
				]}
			/>
			<p>
				<code>definePack</code>は形を確認します。理由コードごとに1〜6の手順と、空でない<code>passWhen</code>と<code>failWhen</code>が必要です。<code>meta.reasonCodes</code>で理由コードを宣言したルール（<code>['GENERIC_LINK_NAME']</code>）は、そこで宣言したか<code>runInPage</code>で使うコードにだけ手順を示せるため、書き間違えたコードは拒否されます。この確認のために宣言する価値があります。手順は英語で書き（パックの辞書で翻訳することもできます。後述）、ページには入りません。<code>engineOptions.packs</code>を指定した<code>runDomRulesInPage</code>は結果に手順を追加し、ページから得た結果には<code>{"addHowToCheck(result, { packs })"}</code>が追加します。バリアントはコアのルールの翻訳済みの手順を持つため、自分の手順は要りません。上書きは、カスタムルールと同じく手順を持ちません。core 1.14.0以降です。
			</p>
			<p>
				core 1.15.0以降、パックの辞書はその手順を翻訳でき（<a href="#messages">後述</a>）、手順は検出結果が見つけたものを名指しできます。<code>{"{{role|none}}"}</code>は、検出結果の<code>i18n.params</code>または<code>data.details</code>にある<code>role</code>として読まれ、検出結果がないテスト手順のページでは<code>none</code>として読まれます。<code>definePack</code>は、テキストのないプレースホルダーを拒否します。
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"meta.review = {",
					"  PRESENTATIONAL_ATTRIBUTE_UNSUPPORTED: {",
					"    steps: ['Find the element the report names, and read its {{attributes|aria-* attributes}}.'],",
					"    passWhen: 'The element is only for layout, and {{attributes|the attribute}} can be removed.',",
					"    failWhen: 'The element stands for a control, which role {{role|none}} hides.'",
					"  }",
					"};",
				]}
			/>
			<p>
				ルールは、達成基準のどのファセットをテストするかを<code>meta.coverage.facetsBySc</code>（<code>{"{ '2.4.4': ['link-text-descriptive-evidence'] }"}</code>）で示し、その手順はコアのものと同じように、その達成基準の<a href="/conformance/procedures/">テスト手順</a>に加わります。コアのルールを理由コードで判定する規格は、<code>standard.review</code>で、コアのルールのコードに独自の手順を与えることもできます。その規格のプロファイルだけが問いにする検出結果は、WCAGを名指しするコアの手順の代わりにそれを読みます。
			</p>

			<h3 id="procedures">人がどう評価するか：テスト手順</h3>
			<p>
				コアは、そのルールが評価するすべてのWCAGの達成基準を人が手作業でどう評価するかを、ファセットごとに示しています（<a href="/conformance/procedures/">テスト手順</a>を参照）。core 1.15.0以降、規格パックは自身の要件について同じものを<code>standard.procedures</code>で、バージョンと要件ごとに、それぞれの<code>title</code>とともに、次の4つの形のいずれかで提供します。
			</p>
			<DataTable
				label="要件のテスト手順の形"
				rowKey="id"
				columns={[
					{ key: "form", label: "形", width: "38%", wrap: true },
					{ key: "means", label: "意味", wrap: true },
				]}
				rows={procedureFormRows}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"standard: {",
					"  // ...",
					"  procedures: {",
					"    '1.0': {",
					"      '4.2': { title: 'Images have a text alternative', wcag: '1.1.1' },",
					"      '7.1': {",
					"        title: 'Every form has a text version',",
					"        facets: [{",
					"          id: 'text-version',",
					"          label: 'Each form can be had as a text document',",
					"          automation: 'manual',              // full, partial or manual (the default)",
					"          tools: ['keyboard'],               // keyboard, pointer, screen-reader, zoom, contrast-theme, devtools",
					"          steps: ['Find each form on the page.', 'Look next to it for a link to a text version.'],",
					"          passWhen: 'Every form has a text version.',",
					"          failWhen: 'A form has no text version, which fails {{requirement}}.'",
					"        }]",
					"      }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				手順は、ページ全体について、アクセシビリティの訓練を受けていない人に向けて書いてください。ブラウザー、その開発者ツール、キーボード、必要な場合はスクリーンリーダーを使う1〜8個の短い手順と、合格の場合と不合格の場合にそれぞれ何が見えるかです。<code>{"{{requirement}}"}</code>には、規格の名前と、それとして読まれる要件（「City Standard 7.1」）が入ります。<code>surea11y-pack new --kind standard</code>は、各形の例を含む<code>procedures.js</code>と、すべてのバージョンのすべての要件がその各ファセットについて手順を持つことを確かめるテストを書き出します。WCAGを1対1で再掲する規格は、<code>ruleMappedStandard</code>から、すべての要件について最初の形を得ます。
			</p>
			<p>
				規格は、<code>groups</code>（バージョンごとのテーマや章）、独自の要件に対する<code>relatesTo</code>（再掲はせずに関連するWCAGの達成基準）、<code>notes</code>（あるバージョンのテスト手順を使う前に読み手が知っておくべきこと）も提供できます。規格自身のテキストは1つの言語<code>lang</code>（デフォルトは英語）で書き、<code>translations</code>がそれをほかの言語で、翻訳元のテキストをキーにして提供するので、翻訳が元のテキストより長く残ることはありません。言語を宣言した規格は、コアのテスト手順も含めて最初から最後までそのいずれかの言語で読まれるので、ページに2つの言語が混ざることはありません。<code>packTranslationCoverage(pack)</code>は、各翻訳がどこまでそろっているかを示します。すべてのフィールドと<code>definePack</code>が確認する内容は、GitHub上のコアの<a href={`${core}/docs/PACKS.md#how-a-person-assesses-it-procedures`}>パックのガイド</a>にあります。
			</p>

			<h3 id="messages">メッセージと言語</h3>
			<p>
				ルールが表示する各テキストはキーを持ち、ロケールごとに<code>i18n/&lt;locale&gt;.json</code>に置かれ、パックの<code>dictionaries</code>に列挙されます。<code>engineOptions.locale: 'fr'</code>でのスキャンはフランス語のテキストを表示し、パックに辞書がないロケールでは英語が表示されます。パックのキーは名前空間で始まるパック独自のもので、パックがコアの同梱するロケールのコアのメッセージを変更することはできません。
			</p>
			<p>
				core 1.15.0以降、ルールの手順も同じように、コアの手順が使うキーで翻訳します。ルールの接頭辞（<code>_title</code>を除いた<code>titleKey</code>）、<code>_review_</code>、理由コード、そして<code>{"step<n>"}</code>、<code>pass</code>、<code>fail</code>のいずれかです。
			</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					"  \"acmeLinkTextSpecific_review_GENERIC_LINK_NAME_step1\": \"Trouvez le lien que le rapport désigne.\",",
					"  \"acmeLinkTextSpecific_review_GENERIC_LINK_NAME_pass\": \"Le texte autour du lien dit où il mène.\",",
					"  \"acmeLinkTextSpecific_review_GENERIC_LINK_NAME_fail\": \"Rien près du lien ne dit où il mène, ce qui enfreint le critère 2.4.4 des WCAG.\"",
					"}",
				]}
			/>
			<p>
				検出結果の<code>howToCheck</code>とテスト手順は、それらをそのロケールで示し、ロケールにないテキストは英語で示します。コアが同梱しないロケール（<code>pt</code>）では、パックの辞書がコアのキーも提供でき、それによってそこでコアのルールとそのテスト手順が翻訳されます。
			</p>

			<h3 id="test-lint-document">テスト、lint、ドキュメント</h3>
			<ul>
				<li>
					<strong>テスト</strong>には、コア自身のルールのテストが使う<code>@surea11y/core/testing</code>を使います。<code>runa11yCoreOnHtml(html, {"{ engineOptions }"})</code>はHTMLをjsdomでスキャンし、<code>assertRule(result, ruleId, outcome)</code>はルールを確認します。パックがある場合、スキャンはパックのオブジェクトからと、ページが持つ形の両方でパックを実行するため、関数の外の変数を読むルールはテストで失敗します。開発用の依存関係としてjsdomが必要です。
				</li>
				<li>
					<strong>確認</strong>：<code>definePack</code>は問題をそれぞれ示して例外を投げるため、パック自身のテストが失敗します。<code>checkPack(pack)</code>は例外を投げずに同じ一覧を返し、インストールされたコアのバージョンも確認します。どちらも、スキャンと同じように、規格が持つ表の確認（<code>validate</code>）をコアとパックのルールに対して実行するため、<code>wcagVersion</code>のないバージョンや、表にない要件に振り分けた検出結果は、すべてのスキャンでパックがスキップされる代わりに、そこで拒否されます。core 1.14.0以降です。
				</li>
				<li>
					<strong>lint</strong>（<code>npm run lint</code>、<code>@surea11y/core/eslint-plugin</code>）は、パックのルールに、コアのルールと同じlintルールを適用します。
				</li>
				<li>
					<strong>ドキュメント</strong>（<code>npm run docs</code>、<code>surea11y-pack docs</code>）は、パックの<code>docs/RULE_CATALOG.md</code>を書き出し、その<code>docs/RULE_EXAMPLES.md</code>のすべての例をChromiumで実行します（<code>CHROMIUM_EXECUTABLE_PATH</code>で別のChromiumビルドを指定できます）。<code>--check</code>は、どちらかが古くなっていれば失敗するので、パックのCIで使えます。
				</li>
			</ul>

			<h3 id="publish">公開する</h3>
			<p>
				生成されたパッケージは<code>private</code>です。ライセンスを選び、<code>package.json</code>で<code>license</code>を設定して<code>private</code>を削除し、<code>npm publish</code>してください。<code>@surea11y/core</code>は<span lang="en">peer dependency</span>のままにし、範囲は<code>core</code>に合わせます。パックが土台にするものはセマンティックバージョニングの対象です。コア1.11向けに書いたパックは、それ以降の1.xのバージョンでも動作し続けます。パックの利用者にとって、ルールのIDとその理由コードはベースラインが保持するものです。名前の変更や削除は、パックのメジャーバージョンでだけ行ってください。
			</p>
			<p>
				空のフォルダーから公開済みのパックまでの完全なガイドは、GitHub上のコアの<a href={`${core}/docs/PACKS.md`}><code>PACKS.md</code></a>にあり、すべてのフィールドは<a href={`${core}/docs/ENGINE_OPTIONS.md#packs--rules-and-standards-from-outside-core`}><code>ENGINE_OPTIONS.md</code></a>のパックのリファレンスにあります。
			</p>
		</>
	);
}
