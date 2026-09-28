import React from "react";

export function ConformanceContent() {
	return (
		<>
			<p>
				<strong>Ein Scan ohne Befunde ist für sich allein keine Aussage über WCAG-Konformität</strong> — und
				so zu tun, als wäre er es, ist genau die Art von Übertreibung, die diese Engine ablehnt. Dieser
				Abschnitt zeigt, wie sich einzelne Regelergebnisse tatsächlich zu einem Urteil über ein
				Erfolgskriterium zusammensetzen, was dieses Urteil ehrlicherweise abdeckt und was nicht, und wie
				Sie eine echte CI-Pipeline so steuern, dass bekannte, bereits geprüfte Verstöße sie nicht
				blockieren, statt jeden Build aufzuhalten, bis alles auf einmal behoben ist.
			</p>

			<h2>WCAG-Konformitätszuordnung</h2>
			<p>
				Sehen Sie genau, wie atomare Regeln, Abdeckungsfacetten und zusammengesetzte Regeln pro
				WCAG-Erfolgskriterium zusammenspielen, sodass ein zusammengesetztes <code>pass</code> etwas
				Bestimmtes bedeutet statt eines vagen „sieht gut aus“. Zielen Sie mit einem einzigen Tag-Set auf
				eine Konformitätsstufe (A, AA oder AAA) über jede WCAG-Version hinweg, und erhalten Sie eine klare
				Antwort auf die Frage, auf die es tatsächlich ankommt: Was kann ein solches automatisiertes
				Ergebnis Ihnen sagen, und wo hört es auf? Siehe{" "}
				<a href="/conformance/wcag-mapping/">WCAG-Konformitätszuordnung</a>.
			</p>

			<h2>Baseline / Allowlist</h2>
			<p>
				Lassen Sie nicht zu, dass ein erster Scan einer unvollkommenen, bestehenden Website jeden
				künftigen Build blockiert — erfassen Sie einmal, was bereits bekannt ist, und lassen Sie die CI
				nur an tatsächlich neuen Verstößen scheitern. Das ist der Unterschied zwischen „Wir können nichts
				ausliefern, bis alles perfekt ist“ und „Wir erkennen Regressionen ab heute“, und genau das bringt
				ein Team dazu, das Gate tatsächlich einzuschalten. Siehe{" "}
				<a href="/conformance/baseline/">Baseline / Allowlist</a>.
			</p>
		</>
	);
}
