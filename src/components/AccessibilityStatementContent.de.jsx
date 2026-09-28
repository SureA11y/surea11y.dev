import React from "react";

const core = "https://github.com/SureA11y/core/blob/main";

export function AccessibilityStatementContent() {
	return (
		<>
			<p>
				Diese Erklärung gilt für <strong>surea11y.dev</strong>, die Website, die Sie gerade lesen
				— nicht für die Barrierefreiheitsbefunde, die ein Scan Ihrer eigenen Website liefert;
				diese werden unter <a href="/conformance/wcag-mapping/">Konformität</a> behandelt.
			</p>

			<h2>Konformitätsziel</h2>
			<p>
				Diese Website soll{" "}
				<a href="https://www.w3.org/TR/WCAG22/">WCAG 2.2</a> auf Stufe AA erfüllen. Sie folgt
				denselben Markenregeln, die für jede Produktoberfläche von SureA11y gelten: Farbe ist nie
				das einzige Signal (Status- und Aktiv-Zustände kombinieren Farbe immer mit einem zweiten
				Hinweis — einer Unterstreichung, einem Symbol, einem Wort), jedes interaktive
				Bedienelement hat einen sichtbaren Fokusrahmen und eine Zielgröße von mindestens 44px, und
				jedes Icon, das nicht rein dekorativ ist, hat eine Textalternative.
			</p>

			<h2>Wie diese Website getestet wird</h2>
			<p>
				Diese Website wird vom selben Team gebaut, das <code>@surea11y/core</code> entwickelt —
				es wäre seltsam, gerade hier auf Tests mit der eigenen Engine zu verzichten. Die gesamte
				gebaute Ausgabe wird regelmäßig mit <code>@surea11y/core</code> selbst gescannt —
				derselben Engine für statische DOM-Scans, die auf dieser ganzen Website dokumentiert ist
				—, und jeder echte Befund dieses Scans wird behoben, nicht wegdiskutiert. Dieser Scan hat
				eigene, echte Grenzen (siehe{" "}
				<a href="/help/known-limitations/">Bekannte Einschränkungen</a>): Er kann nicht wie ein
				echter Browser gegen das tatsächlich berechnete CSS dieser Website laufen, daher sind
				Kontrastbefunde aus diesem Scan-Modus in keine Richtung ein aussagekräftiger Beleg.
			</p>
			<p>
				<strong>Automatisierte Scans sind immer nur eine Untergrenze, keine Obergrenze</strong>, deshalb sind sie
				nicht die einzige Prüfung, die diese Website erhält. Änderungen werden außerdem manuell
				auf Barrierefreiheit getestet — Navigation nur mit der Tastatur, ein Durchgang mit einem
				Screenreader und eine Prüfung der Dinge, die kein automatisiertes Werkzeug überhaupt
				beurteilen kann (ob eine Überschrift tatsächlich beschreibt, was folgt, ob die
				Fokusreihenfolge der visuellen Reihenfolge entspricht, ob Inhalte, die erst nach einer
				Interaktion erscheinen, trotzdem erreichbar sind) — dieselbe Haltung „automatisierte
				Werkzeuge können Ihnen nicht alles sagen“, auf der das ganze Projekt aufbaut.
			</p>

			<h2>Bekannte Lücken</h2>
			<ul>
				<li>
					Das Inhaltsverzeichnis „Auf dieser Seite“ hebt Ihre aktuelle Scroll-Position nicht
					hervor — dafür wäre clientseitiges JavaScript nötig, und diese Website liefert bewusst
					keines aus. Die Links selbst funktionieren mit Tastatur und Screenreader ganz normal;
					es fehlt nur die „Sie sind hier“-Hervorhebung beim Scrollen.
				</li>
				<li>
					Codebeispiele werden absichtlich auf dunklem Hintergrund dargestellt, obwohl der Rest
					der Website hell ist — dieselbe Ausnahme „ein Terminal ist ein Terminal“, die im
					Designsystem dieser Website dokumentiert ist. Wenn diese Kontrastkombination für Sie
					schwer lesbar ist: Der Text jedes Codebeispiels lässt sich vollständig als reiner Text
					markieren und kopieren.
				</li>
			</ul>

			<h2>Ein Problem melden</h2>
			<p>
				Wenn sich etwas auf dieser Website mit Tastatur, Screenreader oder einer anderen
				assistiven Technologie schwer bedienen lässt,{" "}
				<a href={`${core}/issues`}>eröffnen Sie bitte ein Issue auf GitHub</a>. Geben Sie die URL
				der Seite an, was Sie tun wollten und was stattdessen passiert ist — dieselben Details,
				die Sie von jedem erwarten würden, der einen Fehler in der Engine selbst meldet.
			</p>
		</>
	);
}
