import React from "react";
import rules from "../data/rules.generated.json";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";

const familyRows = [
	{ id: "present", ruleId: <code>img-alt-present</code>, family: <code>img</code>, intent: <code>present</code>, type: "automatisch" },
	{ id: "quality", ruleId: <code>img-alt-quality</code>, family: <code>img</code>, intent: <code>quality</code>, type: "manuell" },
	{ id: "decorative", ruleId: <code>img-alt-decorative</code>, family: <code>img</code>, intent: <code>decorative</code>, type: "manuell" },
];

export function RuleOrganizationContent() {
	return (
		<>
			<p>
				Hier wird beschrieben, wie die {rules.length} Regeln im <a href="/rules/">Katalog</a> aufgebaut sind
				— nützlich, um ein Ergebnis einzuordnen oder die gesuchte Regel zu finden. Es gibt wieder,
				was im Regelwerk bereits existiert, kein abstraktes Konzept.
			</p>

			<h2>Automatisch vs. manuell</h2>
			<p>
				Der <code>type</code> jeder Regel ist eine von zwei Arten, und der Unterschied betrifft,
				was die Regel <em>entscheiden kann</em> — nicht, welches Ergebnis sie gerade meldet:
			</p>
			<ul>
				<li>
					<strong>automatisch</strong> — entscheidet deterministisch, ohne Heuristiken und ohne
					Raten. Kann <code>fail</code> melden. <code>cantTell</code> kommt hier trotzdem vor, in
					drei Situationen: Es gibt einen echten Verstoß, der aber für sich allein nicht belegt,
					dass das zugeordnete WCAG-Kriterium verletzt ist (eine ARIA-Anforderung an Autoren,
					bei der der bereitgestellte Name, die Rolle bzw. der Wert trotzdem erhalten bleibt); die Regel entscheidet
					deterministisch, beansprucht aber gar kein Erfolgskriterium (<code>aria-allowed-role</code>,
					als Best Practice getaggt); oder die Regel kann nur bestätigen, dass ein Mechanismus{" "}
					<em>vorhanden</em> ist, während die Frage, ob das Vorhandene tatsächlich gültig ist,
					einer Schwesterregel gehört (<code>aria-required-children</code>, gepaart mit{" "}
					<code>aria-prohibited-children</code>).
				</li>
				<li>
					<strong>manuell</strong> — zeigt an, dass ein Mensch entscheiden muss; die Regel kann
					die Frage anhand des Markups überhaupt nicht klären. Begrenzt auf{" "}
					<code>cantTell</code>/<code>notApplicable</code> — nie <code>fail</code>.
				</li>
			</ul>
			<p>
				<strong>Ein <code>cantTell</code> einer manuellen Regel ist nicht dasselbe Ereignis wie ein{" "}
				<code>cantTell</code> einer automatischen Regel, auch wenn der Wert identisch ist</strong>:
				Die automatische Regel hat entschieden und teilt Ihnen mit, was sie gefunden hat; die
				manuelle Regel teilt Ihnen mit, dass sich die Frage anhand des Markups überhaupt nicht
				entscheiden lässt. Die vollständige Referenz zu Ergebnis, Schweregrad und Konfidenz finden
				Sie unter <a href="/results-reports/output-schema/">Ergebnisse und Berichte</a>.
			</p>

			<h2>Wie Regel-IDs aufgebaut sind</h2>
			<p>
				Eine Regel-ID folgt in der Regel dem Muster <code>&lt;family&gt;-&lt;intent&gt;</code>:
				zuerst, auf welche Elemente bzw. welchen Mechanismus die Regel zielt, dann, welche Frage
				sie dazu stellt. Die Familie der Bildalternativen (WCAG 1.1.1) ist das deutlichste
				Beispiel:
			</p>
			<DataTable
				label="Beispiele für Regel-IDs"
				rowKey="id"
				columns={[
					{ key: "ruleId", label: "Regel-ID", mono: true },
					{ key: "family", label: "Familie", mono: true },
					{ key: "intent", label: "Absicht", mono: true },
					{ key: "type", label: "Typ" },
				]}
				rows={familyRows}
			/>
			<ul>
				<li><code>present</code> — prüft, ob ein erforderlicher Mechanismus vorhanden ist. In der Regel automatisch.</li>
				<li><code>quality</code> — prüft Angemessenheit, Korrektheit oder Aussagekraft. Immer manuell.</li>
				<li><code>decorative</code> — prüft die korrekte Behandlung rein dekorativer Inhalte. Immer manuell.</li>
			</ul>
			<p>
				Die Absicht bestimmt, ob eine Regel überhaupt automatisch sein <em>kann</em>: „Ist etwas
				vorhanden?“ lässt sich oft allein aus dem Markup entscheiden, „Ist es gut?“ fast nie.
				Nach derselben Logik funktionieren auch die Links unter <strong>Verwandte Regeln</strong>{" "}
				auf jeder Regelseite — dort werden Regeln derselben Familie (alles vor dem letzten{" "}
				<code>-</code>-Segment der ID) gruppiert. Das Regelwerk umfasst neben <code>img</code>{" "}
				Dutzende weiterer Familien — <code>aria-*</code>, <code>contrast-*</code>,{" "}
				<code>dialog-*</code>, <code>iframe-*</code>, <code>label-*</code>, <code>link-*</code>,{" "}
				<code>list-*</code>, <code>landmark-*</code> und mehr —, der{" "}
				<a href="/rules/">Katalog</a> ist die aktuelle, generierte Liste.
			</p>
			<p>
				Regeln mischen nie Familien: Jede fragt eine Art von Element ab, mit dafür geeigneten
				Helfern. Deshalb hat das Regelwerk auch {rules.length} eng gefasste Regeln statt eines Dutzends
				breiter — zwei Prüfungen, die sich darin unterscheiden, was sie entscheiden, worauf sie
				zielen oder welche WCAG-Facette sie abdecken, bleiben getrennte Regeln, statt
				zusammengelegt zu werden. So muss ein Ergebnis nie nachträglich entwirrt werden, um zu
				sagen, was genau gefunden wurde.
			</p>

			<h2>WCAG-Facetten</h2>
			<p>
				Ein WCAG-Erfolgskriterium ist meist größer, als eine einzelne Regel deterministisch
				entscheiden kann. Intern wird jedes Erfolgskriterium in benannte „Facetten“ zerlegt — bei
				1.1.1 Nicht-Text-Inhalt etwa, ob ein <code>alt</code>-Attribut vorhanden ist, ob sein Text
				aussagekräftig ist und ob dekorative Bilder korrekt mit leerem Alternativtext
				gekennzeichnet sind. Eine Regel ist einer oder mehreren Facetten zugeordnet, und oft
				decken mehrere Regeln verschiedene Facetten desselben Erfolgskriteriums ab — genau das
				macht die img-alt-Familie oben für 1.1.1.
			</p>
			<p>
				Das ist wichtig beim Lesen des Ergebnisses einer zusammengesetzten Regel
				(Zusammenfassung pro WCAG-Erfolgskriterium): Ein <ResultBadge lang="en" state="pass" size="sm" />{" "}
				einer zusammengesetzten Regel bedeutet, dass jede automatisierte Prüfung für dieses
				Erfolgskriterium ohne Befund blieb, aber <strong>wenn eine Facette überhaupt keine automatisierte
				Abdeckung hat, schweigt die zusammengesetzte Regel zu dieser Facette, statt zu behaupten,
				sie sei in Ordnung</strong>. Unter <a href="/conformance/wcag-mapping/">Konformität</a>{" "}
				finden Sie die drei Ebenen (atomare Regeln, Facetten, zusammengesetzte Regeln) und wie das
				Ergebnis einer zusammengesetzten Regel tatsächlich berechnet wird.
			</p>
		</>
	);
}
