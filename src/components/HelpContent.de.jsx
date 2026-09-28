import React from "react";

export function HelpContent() {
	return (
		<>
			<p>
				Hier landen zwei Arten von Fragen, und es lohnt sich zu wissen, welche Sie haben, bevor Sie
				anfangen zu suchen: „Warum hat die Engine das getan?“ wird unten beantwortet, und „Was wird
				sie nie tun?“ ebenso direkt — vorab offen gesagt, statt dass Sie es erst mühsam in der
				Produktion herausfinden.
			</p>

			<h2>FAQ</h2>
			<p>
				Die häufigsten Fragen, klar beantwortet: warum <code>runOnly</code> stillschweigend alle
				Regeln ausgeführt hat statt der einen, die Sie angegeben haben, warum eine eigene Regel ohne
				erkennbaren Grund immer wieder <code>cantTell</code> liefert, warum eine geometrieabhängige
				Regel unter jsdom <code>notApplicable</code> meldet und was ein Scan ohne Befunde tatsächlich
				bedeutet und was nicht. Eine Viertelstunde hier erspart den Großteil der Fehlersuche, die die
				meisten ohnehin irgendwann betreiben. Siehe <a href="/help/faq/">FAQ</a>.
			</p>

			<h2>Bekannte Einschränkungen</h2>
			<p>
				Jede Grenze der Architektur dieser Engine, die statische DOM-Scans durchführt, ausdrücklich
				benannt, statt überraschend entdeckt: was sie strukturell überhaupt nicht leisten kann, was von
				der Umgebung abhängt, in der Sie sie ausführen, und wo sie bewusst nicht rät, weil eine falsche
				Vermutung schlimmer wäre als ein ehrliches <code>cantTell</code>. Wer diese Grenzen vorher kennt,
				kann den übrigen Ergebnissen vertrauen. Siehe{" "}
				<a href="/help/known-limitations/">Bekannte Einschränkungen</a>.
			</p>
		</>
	);
}
