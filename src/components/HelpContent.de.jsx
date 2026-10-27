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
				Die häufigsten Fragen, klar beantwortet: warum eine Auswahl aus Tags und Regel-IDs keine
				Regel ausführen und trotzdem ohne Befunde aussehen kann, warum eine Web Component{" "}
				<code>cantTell</code> ergibt, was sich nach dem Update auf core 1.14 in Ihren Ergebnissen
				ändert, warum jedes WCAG-Kriterium <code>cantTell</code> ergibt, auch wenn alle Prüfungen{" "}
				<code>pass</code> ergeben, warum eine geometrieabhängige Regel unter jsdom <code>notApplicable</code> meldet und was ein Scan ohne Befunde tatsächlich
				bedeutet und was nicht. Eine Viertelstunde hier erspart den Großteil der Fehlersuche, die die
				meisten ohnehin irgendwann betreiben. Siehe <a href="/help/faq/">FAQ</a>.
			</p>

			<h2>Bekannte Einschränkungen</h2>
			<p>
				Jede Grenze dieser Engine, ausdrücklich benannt, statt überraschend entdeckt: was ein Scan
				eines einzigen Seitenzustands nicht sehen kann, was davon abhängt, wo Sie ihn ausführen
				(jsdom, ein Browser, die eigenen Skripte der Seite), und wo sie bewusst nicht rät, weil eine
				falsche Vermutung schlimmer wäre als ein ehrliches <code>cantTell</code>, jeweils mit dem, was
				dagegen zu tun ist. Wer diese Grenzen vorher kennt,
				kann den übrigen Ergebnissen vertrauen. Siehe{" "}
				<a href="/help/known-limitations/">Bekannte Einschränkungen</a>.
			</p>
		</>
	);
}
