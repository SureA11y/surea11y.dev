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
				WCAG-Erfolgskriterium zusammenspielen, und warum ein Kriterium, dessen Prüfungen alle ohne
				Befund blieben, <code>cantTell</code> ergibt, teilweise geprüft, statt eines vagen „sieht gut
				aus“: Eine zusammengesetzte Regel sagt, welche Teile geprüft wurden, und überlässt den Rest
				einer Person. Ein Scan, der einige Prüfungen statt
				eines Ziels nennt, meldet trotzdem die Kriterien, zu denen sie gehören, und sagt, welche er
				nur teilweise geprüft hat. Zielen Sie mit einem einzigen Tag-Set auf
				eine Konformitätsstufe (A, AA oder AAA) über jede WCAG-Version hinweg oder nutzen Sie ein
				benanntes Profil, ordnen Sie jedem Ergebnis die Klausel von EN 301 549 zu, die sein Kriterium
				wiedergibt, wenn Sie nach dieser Norm berichten, und erhalten Sie eine klare
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
				ein Team dazu, das Gate tatsächlich einzuschalten. Sie kann auch Befunde akzeptieren, die zu{" "}
				<code>fail</code> tendieren, und eine vor einem Upgrade geschriebene Baseline passt weiter,
				für ein Minor-Release, wenn der Reason-Code eines Befunds geteilt oder neu vergeben wird. Siehe{" "}
				<a href="/conformance/baseline/">Baseline / Allowlist</a>.
			</p>
		</>
	);
}
