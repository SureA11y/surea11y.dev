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
					diesen Situationen: Es gibt einen echten Verstoß, der aber für sich allein nicht belegt,
					dass das zugeordnete WCAG-Kriterium verletzt ist (eine ARIA-Anforderung an Autoren,
					bei der der bereitgestellte Name, die Rolle bzw. der Wert trotzdem erhalten bleibt); die Regel entscheidet
					deterministisch, dass eine Best Practice verletzt ist, beansprucht kein Erfolgskriterium,
					und das Gefundene muss niemandem schaden, da die Rolle oder das Element assistive
					Technologien so erreicht, wie es ist (<code>aria-allowed-role</code>,{" "}
					<code>landmark-role-name-present</code>, als Best Practice getaggt); oder die Regel kann nur bestätigen, dass ein Mechanismus{" "}
					<em>vorhanden</em> ist, während die Frage, ob das Vorhandene tatsächlich gültig ist,
					einer Schwesterregel gehört (<code>aria-required-children</code>, gepaart mit{" "}
					<code>aria-prohibited-children</code>); oder die Regel kann nicht ohne Raten entscheiden und
					fragt deshalb, statt fehlzuschlagen: ein Name, der aus einem geschlossenen Shadow Root, aus{" "}
					<code>ElementInternals</code>, die die Engine nicht lesen kann, oder aus zu tief
					verschachteltem Inhalt stammen kann (die <code>*-name-present</code>-Regeln),
					Text, der nach dem Erhöhen der Abstände abgeschnitten werden oder sich überlappen kann (
					<code>text-spacing-content-loss</code>), ein Orientierungs-Media-Block, der ein anderes
					Element als den Inhalt der Seite dreht (
					<code>css-orientation-lock</code>), ein Platzhalter unter seinem Verhältnis, bei dem sich
					nicht erkennen lässt, ob seine Farben die der Seite oder des Browsers sind, oder ein
					einzelnes Zeichen, das für den Namen seines Bedienelements steht, unter seinem Verhältnis
					(<code>contrast-minimum</code>) oder eine Farbe oder Größe, die sich nicht berechnen lässt
					(die Kontrastregeln, <code>target-size-minimum</code>). Eine Regel, die eine Ausnahme wirft,
					wird zur Absicherung ebenfalls als <code>cantTell</code> gemeldet.
				</li>
				<li>
					<strong>manuell</strong> — zeigt an, dass ein Mensch entscheiden muss; die Regel kann
					nicht entscheiden, ob das Gefundene ein Problem ist. Meldet <code>cantTell</code> oder{" "}
					<code>notApplicable</code>, und <code>pass</code> nur dann, wenn die Antwort gefunden wird,
					die keine Beurteilung braucht — nie <code>fail</code>.{" "}
					<a href="/rules/landmark-unique/"><code>landmark-unique</code></a> kann nicht entscheiden,
					ob zwei Landmarks mit demselben Namen ein Problem sind (die APG erlaubt das, wenn ihr
					Inhalt identisch ist), also ergibt das <code>cantTell</code>; „alle Namen unterscheiden
					sich“ ist dagegen eine Tatsache, also ergibt das <code>pass</code>. Eine Regel, die eine
					Person jedes gefundene Ziel beurteilen lässt, etwa ob die Textalternative eines Bildes
					zutrifft, meldet nie <code>pass</code>. Eine manuelle Regel, die nur dort fragt, wo eine
					Heuristik ein Anzeichen findet, und keines findet, meldet <code>notApplicable</code>,
					nicht <code>pass</code>: Sie gilt nur für das, was ihre Heuristik markiert, und dort nichts
					zu finden, zeigt nicht, dass alles in Ordnung ist.{" "}
					<a href="/rules/image-redundant-alt/"><code>image-redundant-alt</code></a> sucht Alternativtext, der den Text neben dem Bild
					wiederholt; keinen zu finden, sagt nichts darüber, ob der Alternativtext stimmt.{" "}
					<a href="/rules/form-control-label-quality/"><code>form-control-label-quality</code></a>, <a href="/rules/password-paste-enabled/"><code>password-paste-enabled</code></a>,{" "}
					<a href="/rules/scrollable-region-focusable/"><code>scrollable-region-focusable</code></a> und <a href="/rules/image-of-text/"><code>image-of-text</code></a> tun dasselbe.
				</li>
			</ul>
			<p>
				Eine als Best Practice getaggte Regel beansprucht kein Erfolgskriterium und meldet trotzdem{" "}
				<code>fail</code>, wenn das, was sie entscheidet, selbst eine Barriere ist: Eine leere
				Überschrift wird als Überschrift ohne Inhalt angesagt (
				<a href="/rules/empty-heading/"><code>empty-heading</code></a>, wie die ACT-Regel des W3C
				dafür es meldet). Ihr <code>fail</code> sagt, dass die eigene Erwartung der Regel nicht
				erfüllt ist, nicht die eines Kriteriums: Keine zusammengesetzte WCAG-Regel zählt es mit. Wo
				der Befund niemandem schaden muss, meldet sie stattdessen <code>cantTell</code>, wie oben.
			</p>
			<p>
				<strong>Ein <code>cantTell</code> einer manuellen Regel ist nicht dasselbe Ereignis wie ein{" "}
				<code>cantTell</code> einer automatischen Regel, auch wenn der Wert identisch ist</strong>:
				Die automatische Regel hat entschieden und teilt Ihnen mit, was sie gefunden hat; die
				manuelle Regel teilt Ihnen mit, dass sich die Frage anhand des Markups überhaupt nicht
				entscheiden lässt. Die vollständige Referenz zu Ergebnis, Schweregrad und Konfidenz finden
				Sie unter <a href="/results-reports/output-schema/">Ergebnisse und Berichte</a>. In beiden
				Fällen sagt das <code>cantTell</code> einer Core-Regel, wie es zu beantworten ist (
				<code>howToCheck</code>), und manche sagen, wohin die Hinweise der Seite deuten (
				<code>lean</code>, siehe{" "}
				<a href="/results-reports/output-schema/#leans">Ausgabeschema</a>).
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
				(Zusammenfassung pro WCAG-Erfolgskriterium): Eine zusammengesetzte Regel ergibt nur dann{" "}
				<code>pass</code>, wenn ihre Regeln alles prüfen, was das Kriterium verlangt, und das tut
				noch keine. Wo also jede automatisierte Prüfung für ein Erfolgskriterium ohne Befund bleibt,
				ist die zusammengesetzte Regel <ResultBadge lang="en" state="unknown" size="sm" />, teilweise
				geprüft: <strong>Die Facetten, die ihre Regeln abdecken, sind erfüllt, und den Rest prüft
				eine Person</strong>. Unter <a href="/conformance/wcag-mapping/">Konformität</a>{" "}
				finden Sie die drei Ebenen (atomare Regeln, Facetten, zusammengesetzte Regeln) und wie das
				Ergebnis einer zusammengesetzten Regel tatsächlich berechnet wird.
			</p>
		</>
	);
}
