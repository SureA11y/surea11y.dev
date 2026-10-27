import React from "react";
import engine from "../data/engine.generated.json";

export function RulesIntroContent() {
	return (
		<p>
			WCAG達成基準ごとの{engine.composites}件の複合集約ルールはここには載せていません。個別に設定できるルールではないため、
			<a href="/conformance/wcag-mapping/">適合性</a>
			のページで扱っています。自動ルールと手動ルールの違い、ルールIDの構成、WCAGのファセットについては
			<a href="/rules/organization/">ルールの構成</a>
			を参照してください。「質問」の列は、ルールが人の判断に委ねる質問（
			<code>cantTell</code>
			）の数です。それぞれの質問に答えるための手順を、ルールのページに示しています。
		</p>
	);
}
