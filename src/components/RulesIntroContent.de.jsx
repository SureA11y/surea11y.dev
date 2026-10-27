import React from "react";
import engine from "../data/engine.generated.json";

export function RulesIntroContent() {
	return (
		<p>
			Die {engine.composites} zusammengesetzten Regeln pro WCAG-Erfolgskriterium sind hier nicht aufgeführt — sie sind
			keine einzeln konfigurierbaren Regeln und gehören stattdessen zu{" "}
			<a href="/conformance/wcag-mapping/">Konformität</a>. Unter{" "}
			<a href="/rules/organization/">Wie die Regeln aufgebaut sind</a> geht es um automatische und
			manuelle Regeln, den Aufbau der Regel-IDs und WCAG-Facetten. Die Spalte „Fragen“ zählt die Fragen, die eine Regel
			einer Person überlassen kann (<code>cantTell</code>); zu jeder nennt die Seite der Regel die
			Schritte, um sie zu beantworten.
		</p>
	);
}
