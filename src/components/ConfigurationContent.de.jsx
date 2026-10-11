import React from "react";

export function ConfigurationContent() {
	return (
		<>
			<p>
				Jeder Runner nimmt dasselbe einfache <code>engineOptions</code>-Objekt entgegen — keine
				Konfigurationsdatei, die gepflegt werden muss, keine separaten CLI-Flags, die synchron
				gehalten werden müssen. Die CLI und alle Bindings bauen dieses Objekt aus ihren eigenen
				Flags oder Builder-Methoden für Sie auf, sodass alles, was Sie hier lernen, überall gilt,
				wo Sie einen Scan ausführen. Vier Dinge sollten Sie früh richtig einstellen:
			</p>

			<h2>Engine-Optionen</h2>
			<p>
				Beschränken Sie einen Scan auf genau die Regeln, die Sie wollen — durch Angabe einer
				WCAG-Version und -Stufe (WCAG 2.2 AA in einer Option, auf Wunsch Best Practices dazu), nach
				ID, nach Tag oder über ein benanntes Konformitätsprofil wie
				WCAG 2.2 AA, EN 301 549 oder Section 508 —, damit ein Lauf das meldet, wofür Sie tatsächlich
				verantwortlich sind, nicht mehr und nicht weniger. Nehmen Sie Widgets, die
				bekanntermaßen störende Befunde liefern, global oder für eine einzelne Regel vom Scan
				aus, ohne überall sonst Abdeckung zu verlieren, stellen Sie ein, wie streng die Kontrastprüfungen für einen
				menschlichen Auditor im Vergleich zu einem unbeaufsichtigten CI-Gate sein sollen, und
				ergänzen Sie eine organisationsspezifische Regel neben den eingebauten, wenn der Katalog
				etwas nicht abdeckt, das Ihnen wichtig ist. Die vollständige Referenz finden Sie unter{" "}
				<a href="/configuration/engine-options/">Engine-Optionen</a>.
			</p>

			<h2>Packs</h2>
			<p>
				Prüfen Sie gegen mehr als WCAG, ohne die Engine zu forken. Ein Pack bringt einen nationalen
				Standard, die Barrierefreiheitsrichtlinie Ihrer Organisation oder ein paar hauseigene Regeln
				aus einem eigenen Paket mit, und die Engine führt es aus wie ihre eigenen Regeln: Seine
				Profile wählen aus, was läuft, seine Checklistenpunkte kommen jeweils als ein Ergebnis
				zurück, und jeder Bericht zeigt sie neben den WCAG-Kriterien. Dasselbe Pack funktioniert aus
				Node, in jedem Binding, mit den Test-Matchern und in der CLI, und{" "}
				<code>npx surea11y-pack new</code> erzeugt eines, das seine eigenen Tests direkt nach dem
				Erzeugen besteht. Unter <a href="/configuration/packs/">Packs</a> erfahren Sie, wie Sie
				eines verwenden oder schreiben.
			</p>

			<h2>CI-Integration</h2>
			<p>
				Bringen Sie ein funktionierendes Barrierefreiheits-Gate in Ihre Pipeline, ohne es von
				Grund auf zu schreiben: Vorlagen für <span lang="en">GitHub Actions</span> und <span lang="en">Bitbucket Pipelines</span> zum direkten
				Einfügen steuern einen Build über den Exit-Code der CLI, nehmen die bereits vorhandenen
				Verstöße einer bestehenden Website in eine Baseline auf, sodass nur tatsächlich neue zum
				Fehlschlag führen, und laden SARIF-Ergebnisse direkt in <span lang="en">GitHub Code Scanning</span> hoch, wo Ihr
				Team ohnehin hinschaut. Rezepte für GitLab CI und Azure DevOps bringen die Ergebnisse als
				JUnit in deren eigene Testansichten. Die vollständigen Vorlagen finden Sie unter{" "}
				<a href="/configuration/ci-integration/">CI-Integration</a>.
			</p>

			<h2>Locales</h2>
			<p>
				Liefern Sie Befunde, mit denen Ihr Team tatsächlich arbeiten kann, in der Sprache, die es
				am schnellsten liest — jeder Regeltitel sowie Zusammenfassung und Hinweis jedes
				Vorkommens werden aus einem schlüsselbasierten Wörterbuch aufgelöst, mit einem Fallback
				auf Englisch pro String statt einer Leerstelle oder eines Fehlers. Heute sind
				fünf Sprachen verfügbar (Englisch, Französisch, Deutsch, Spanisch, Japanisch), und ein Ergebnis gibt
				immer genau an, welche Locale verwendet wurde, sodass nichts unbemerkt schlechter wird.
				Abdeckung und wie Sie ein eigenes Wörterbuch bereitstellen, finden Sie unter{" "}
				<a href="/configuration/locales/">Locales</a>.
			</p>
		</>
	);
}
