import React from "react";

export function ConfigurationContent() {
	return (
		<>
			<p>
				Jeder Runner nimmt dasselbe einfache <code>engineOptions</code>-Objekt entgegen — keine
				Konfigurationsdatei, die gepflegt werden muss, keine separaten CLI-Flags, die synchron
				gehalten werden müssen. Die CLI und alle Bindings bauen dieses Objekt aus ihren eigenen
				Flags oder Builder-Methoden für Sie auf, sodass alles, was Sie hier lernen, überall gilt,
				wo Sie einen Scan ausführen. Drei Dinge sollten Sie früh richtig einstellen:
			</p>

			<h2>Engine-Optionen</h2>
			<p>
				Beschränken Sie einen Scan auf genau die Regeln, die Sie wollen — nach ID, nach Tag oder
				nach WCAG-Version (2.0, 2.1 oder 2.2) —, damit ein Lauf das meldet, wofür Sie tatsächlich
				verantwortlich sind, nicht mehr und nicht weniger. Bringen Sie bekanntermaßen
				problematische Widgets global oder für eine einzelne Regel zum Schweigen, ohne überall
				sonst Abdeckung zu verlieren, stellen Sie ein, wie streng die Kontrastprüfungen für einen
				menschlichen Auditor im Vergleich zu einem unbeaufsichtigten CI-Gate sein sollen, und
				ergänzen Sie eine organisationsspezifische Regel neben den eingebauten, wenn der Katalog
				etwas nicht abdeckt, das Ihnen wichtig ist. Die vollständige Referenz finden Sie unter{" "}
				<a href="/configuration/engine-options/">Engine-Optionen</a>.
			</p>

			<h2>CI-Integration</h2>
			<p>
				Bringen Sie ein funktionierendes Barrierefreiheits-Gate in Ihre Pipeline, ohne es von
				Grund auf zu schreiben: Vorlagen für <span lang="en">GitHub Actions</span> und <span lang="en">Bitbucket Pipelines</span> zum direkten
				Einfügen steuern einen Build über den Exit-Code der CLI, nehmen die bereits vorhandenen
				Verstöße einer bestehenden Website in eine Baseline auf, sodass nur tatsächlich neue zum
				Fehlschlag führen, und laden SARIF-Ergebnisse direkt in <span lang="en">GitHub Code Scanning</span> hoch, wo Ihr
				Team ohnehin hinschaut. Die vollständigen Vorlagen finden Sie unter{" "}
				<a href="/configuration/ci-integration/">CI-Integration</a>.
			</p>

			<h2>Locales</h2>
			<p>
				Liefern Sie Befunde, mit denen Ihr Team tatsächlich arbeiten kann, in der Sprache, die es
				am schnellsten liest — jeder Regeltitel sowie Zusammenfassung und Hinweis jedes
				Vorkommens werden aus einem schlüsselbasierten Wörterbuch aufgelöst, mit einem sauberen
				Fallback pro String auf Englisch statt einer Leerstelle oder eines Fehlers. Heute sind
				vier Sprachen verfügbar (Englisch, Französisch, Deutsch, Spanisch), und ein Ergebnis gibt
				immer genau an, welche Locale verwendet wurde, sodass nichts unbemerkt schlechter wird.
				Abdeckung und wie Sie ein eigenes Wörterbuch bereitstellen, finden Sie unter{" "}
				<a href="/configuration/locales/">Locales</a>.
			</p>
		</>
	);
}
