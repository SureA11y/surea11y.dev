import React from "react";

const core = "https://github.com/SureA11y/core/blob/main";

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				Klar und vorab benannt, statt es Ihnen zu überlassen, es selbst herauszufinden. Jeder Punkt
				hier ist eine bewusste, begründete Entscheidung, kein Versehen. Aber „bewusst“ heißt nicht
				„unwichtig zu wissen, bevor Sie sich auf dieses Tool verlassen“.
			</p>

			<h2>Strukturell: Diese Architektur kann das grundsätzlich nicht</h2>
			<p>
				surea11y ist ein <strong>statischer DOM-Scan</strong>: Er liest den DOM-Baum und die
				berechneten Styles zu einem einzigen Zeitpunkt, ohne Benutzerinteraktion simulieren, auf
				asynchrone Zustandsänderungen warten oder echtes Layout bei beliebigen Viewport-Größen
				messen zu können. Das sind keine fehlenden Regeln: Keine Regelimplementierung, so
				geschickt sie auch ist, kann diese Lücken ohne eine grundlegend andere Architektur
				schließen (echte Browser-Automatisierung, die über die Zeit tatsächliche Tastatur- und
				Zeigerereignisse auslöst):
			</p>
			<ul>
				<li>
					<strong>Erkennung von Tastaturfallen</strong> (WCAG 2.1.2): Dafür muss man den Fokus über
					die Seite bewegen und beobachten, wo er landet, was kein einzelnes Lesen des DOM leisten
					kann. Eine Technik, die funktionieren würde, ist konzipiert (siehe den Abschnitt zu
					Tastaturfallen in{" "}
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#keyboard-trap-detection-scoping-notes`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					), aber sie wäre die erste Prüfung dieser Engine, die die untersuchte Seite verändert.
					Deshalb ist sie nicht gebaut und wäre, falls doch, nicht Teil eines normalen Scans. Bis
					dahin ersetzt nichts im statischen Markup sie.
				</li>
				<li>
					<strong>Reflow / Abschneiden beim Zoomen</strong> (WCAG 1.4.10): Erfordert echte
					Layout-Messung (<code>clientWidth</code>/<code>scrollWidth</code>) bei einem simulierten
					Viewport, der 320px entspricht. Anders als bei einigen Heuristiken dieser Engine, die auf
					CSS-Deklarationen beruhen, gibt es für „wird Inhalt bei 400 % Zoom abgeschnitten“
					überhaupt keinen Ersatz im statischen Markup.
				</li>
				<li>
					<strong>Dynamischer Zustand / Zustand nach Interaktion</strong>: Alles, was erst nach
					einem Klick, Hover oder asynchronen Datenladen existiert (der Inhalt eines Modals, die
					Optionen eines Dropdowns, Fehlermeldungen der Formularvalidierung), ist für einen Scan des{" "}
					<em>aktuellen</em> DOM der Seite unsichtbar. Rendert Ihr Framework es vorab (auch
					außerhalb des sichtbaren Bereichs oder mit <code>hidden</code>), lässt es sich scannen;
					existiert es erst nach einer Interaktion, nicht, es sei denn, Sie lösen diese Interaktion
					vor dem Scan selbst aus (z. B. Button klicken, <em>dann</em> scannen).
				</li>
			</ul>

			<h2>Umgebungsabhängig: hängt davon ab, wie Sie sie ausführen</h2>
			<ul>
				<li>
					<strong>jsdom (Node, kein echter Browser) hat keine CSS-Layout-Engine.</strong> Regeln,
					die echte Geometrie brauchen, allen voran <code>target-size-minimum</code> (WCAG 2.5.8,
					braucht ein echtes <code>getBoundingClientRect()</code>), melden unter reinem jsdom{" "}
					<code>notApplicable</code>, statt zu raten. Führen Sie sie in einem echten Browser aus
					(Puppeteer/Playwright, siehe{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Pattern 2), um von
					diesen Regeln echte Befunde zu bekommen.
				</li>
				<li>
					<strong>
						Ob Text umbricht, erfordert Layout, deshalb werden Befunde zum Textabstand bei nicht
						umbrechendem Text zur Prüfung gemeldet.
					</strong>{" "}
					WCAG 1.4.12 und die zugehörigen ACT-Regeln gelten nur für Text mit einem weichen
					Zeilenumbruch, was ein statischer Scan nicht feststellen kann.{" "}
					<code>avoid-inline-spacing</code> behandelt Text standardmäßig als umbrechend, ein
					gewöhnlicher erzwungener Wert unter dem Grenzwert scheitert also weiterhin. Wo aus einem
					Grund, der <em>ohne</em> Layout erkennbar ist, kein Umbruch möglich ist (Text, der nicht
					umbrechen darf, oder ein Element mit fester Breite in einem horizontal scrollenden
					Vorfahren), meldet sie stattdessen <code>cantTell</code>. Text, der aus einem anderen
					Grund nie umbricht, wird weiterhin als Fehler gemeldet.
				</li>
				<li>
					<strong>
						<code>&lt;dialog&gt;</code> und andere Elemente, die das Standard-Stylesheet des
						Browsers ausblendet
					</strong>{" "}
					(kein <code>open</code>-Attribut, laut Spezifikation <code>display: none</code>), sowie
					jeder andere Teilbaum, der über <code>display:none</code>, <code>visibility:hidden</code>,{" "}
					<code>[hidden]</code> oder ein geschlossenes <code>&lt;details&gt;</code> verborgen ist,
					werden <strong>standardmäßig von der Regelauswertung ausgeschlossen</strong>, wie es auch
					andere etablierte Engines tun, die Sichtbarkeit berücksichtigen. Das ist ein bewusster
					Standard (<code>engineOptions.includeHiddenElements: false</code>), kein Versehen:
					Verborgener Inhalt ist für assistive Technologien und die Tastatur erst erreichbar, wenn
					er angezeigt wird, daher wäre es oft nur Rauschen, einen Markup-Fehler darin
					standardmäßig zu melden. Setzen Sie <code>engineOptions.includeHiddenElements: true</code>,
					um verborgene oder eingeklappte Teilbäume trotzdem auszuwerten, etwa um einen
					Markup-Fehler (wie eine kaputte ARIA-ID-Referenz) zu finden, bevor ein Dialog je geöffnet
					wird. Die Option und genau welche Mechanismen zum Verbergen sie abdeckt, beschreibt{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>.
				</li>
				<li>
					<strong>
						Das berechnete <code>text-shadow</code> von jsdom ist beim zweiten Lesen desselben
						Elements unzuverlässig.
					</strong>{" "}
					Bestätigt in jsdom 29.1.1: Liest man einen berechneten <code>text-shadow</code>-Wert ein
					zweites Mal am selben Element, egal über welchen Accessor, aus einer frisch angeforderten{" "}
					<code>CSSStyleDeclaration</code> für dieses Element und unabhängig von Caching, kommt
					stillschweigend ein anderer, falscher Wert „kein Schatten“ zurück statt des tatsächlich
					deklarierten. Das erste Lesen ist immer korrekt. Die Engine umgeht das intern, indem sie{" "}
					<code>text-shadow</code> jedes Elements genau einmal pro Lauf liest und das Ergebnis
					zwischenspeichert (siehe <code>__textShadowInfoEl</code> in{" "}
					<code>src/core/contrast-helpers.js</code>), ein einzelner Scan ist also nicht betroffen.
					Das Problem tritt nur auf, wenn Sie <code>getComputedStyle(el).textShadow</code> selbst
					mehr als einmal am selben von jsdom geparsten Element lesen. Ein echter Browser hat diesen
					Fehler nicht.
				</li>
				<li>
					<strong>
						Unter jsdom wächst die Scan-Dauer mit dem Quadrat der DOM-Tiefe, nicht mit der Anzahl
						der Elemente.
					</strong>{" "}
					jsdom löst geerbtes CSS auf, indem es bei jedem Aufruf von <code>getComputedStyle</code>{" "}
					die Kette der Vorfahren eines Elements durchläuft; ein Aufruf pro Element kostet also
					O(Elemente x Tiefe). Gemessen mit jsdom 29.1.1 ohne jeglichen Engine-Code: 4000 Elemente
					in einer Kette brauchen allein für <code>getComputedStyle</code> 8,3 s, gegenüber 0,25 s
					für dieselben 4000 als Geschwister. Die eigenen Durchläufe der Engine über Vorfahren sind
					begrenzt und bleiben linear; das sind also die Kosten von jsdom, nicht die der Regeln.
					Betroffen sind <code>runDomRulesInPage</code> und alles, was darauf aufbaut, einschließlich{" "}
					<code>@surea11y/test-matchers</code>; ein echter Browser berechnet geerbte Styles nativ und
					zeigt dieses Verhalten nicht. Komponenten-Frameworks verschachteln üblicherweise 100 bis
					300 Ebenen tief, was problemlos schnell ist; spürbar wird es ab etwa 1000.
				</li>
				<li>
					<strong>Statisches Markup vs. Live-DOM bzw. Zustand nach der Hydration.</strong> Die
					Regellogik selbst ist unabhängig von der DOM-Quelle: Sie wertet das DOM aus, das sie
					bekommt, ob von jsdom geparstes statisches HTML (Pattern 1) oder ein bereits geladener,
					bereits hydrierter Tab in einem echten Browser (Pattern 2, siehe{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
					). Die CLI (<code>npx @surea11y/cli scan &lt;url&gt;</code>) holt dagegen ausschließlich
					statisches HTML, ohne JS-Ausführung; siehe{" "}
					<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md">die CLI-Dokumentation</a>.
					Bei einem von einem JS-Framework hydrierten Widget, dessen serverseitig gerendertes Markup
					absichtlich einen Zustand ausliefert, bevor Client-JS ihn synchronisiert (z. B.{" "}
					<code>&lt;input type="checkbox" aria-checked="true"&gt;</code>, ausgeliefert, bevor
					Client-JS bei der Hydration die native Eigenschaft <code>checked</code> passend setzt, ein
					sehr verbreitetes, völlig legitimes Muster), sieht ein CLI-Scan nur das Markup vor der
					Hydration. Ein Scan in einem tatsächlich geladenen Browser-Tab sieht dagegen den Zustand
					nach der Hydration; die beiden können sich also genau bei dieser Art von Element
					widersprechen, aus Gründen, die nichts mit der Korrektheit der Regeln zu tun haben.
					Deshalb ist <code>aria-checked-state-mismatch</code> auf <code>manual</code>/
					<code>cantTell</code> begrenzt statt auf ein hartes <code>fail</code>. Wenn Sie für
					hydrationsempfindliche Prüfungen die Genauigkeit des Live-DOM brauchen, führen Sie die
					Bibliothek direkt über Pattern 2 gegen eine bereits geladene Seite aus, nicht über die
					CLI mit statischem Abruf.
				</li>
			</ul>

			<h2>Nicht versucht: Ermessensfragen, die sich nicht sicher automatisieren lassen</h2>
			<p>
				Hierfür gibt es keine vergleichbar sichere Heuristik auf dem Niveau dieser Engine (
				<code>fail</code> bleibt deterministischen Verstößen vorbehalten, Punkt). Sie trotzdem zu
				bauen, würde entweder fast nichts finden (zu eng, um nützlich zu sein) oder echte
				Falsch-Positive riskieren (zu breit, um ihnen zu trauen):
			</p>
			<ul>
				<li>
					<strong>„Ist dieser Überschriften- oder Beschriftungstext aussagekräftig?“</strong>{" "}
					Echte Überschriften und Beschriftungen sind enorm vielfältig und oft zu Recht kurz („FAQ“,
					„Name“, „Übersicht“ sind alle in Ordnung), daher lässt sich am Markup nicht entscheiden,
					ob eine Überschrift den Abschnitt darunter beschreibt oder eine Beschriftung das Feld
					daneben. Entscheidbar <em>ist</em>, dass manche Strings gar nichts beschreiben können:{" "}
					<code>heading-quality</code> und <code>form-control-label-quality</code> markieren
					übrig gebliebene Platzhalter, nummerierte Vorlagen-Slots, Dateinamen und URLs anhand
					kuratierter Listen exakter Treffer, derselbe Kompromiss aus Präzision vor Vollständigkeit,
					den auch <code>link-name-quality</code> eingeht. Beide sind <code>manual</code>-Regeln,
					begrenzt auf <code>cantTell</code>: Sie melden einen Kandidaten zur Prüfung, behaupten aber
					nie, dass der Text falsch ist.
				</li>
				<li>
					<strong>„Beschreibt diese Fehlermeldung das Problem?“</strong> Was einen
					Validierungsfehler auslöst und was er enthält, wird fast immer von JS oder einer
					Validierungsbibliothek gesteuert und ist für einen statischen Scan von vornherein
					unsichtbar; das ist nicht nur eine Frage des Heuristik-Designs.
				</li>
				<li>
					<strong>Feinere Teilprüfungen für zeitbasierte Medien</strong> (WCAG 1.2.x umfasst etwa 8
					eigene Fälle auf ACT-Regel-Ebene über das Gebaute hinaus): Audio- und Videoinhalte selbst
					lassen sich aus statischem Markup grundsätzlich nicht überprüfen. Die zwei breitesten,
					sichersten Fälle sind abgedeckt (<code>media-alternative-transcript-evidence</code>,{" "}
					<code>video-caption</code>), die engeren bewusst nicht.
				</li>
				<li>
					<strong>Inhaltsanalyse von Schriftgrafiken</strong> (WCAG 1.4.5/1.4.9): Würde ein
					Bildverständnis auf OCR-Niveau erfordern; für eine Engine, die statisches Markup prüft,
					außerhalb des Umfangs.
				</li>
				<li>
					<strong>Bedienung durch Bewegung</strong> (WCAG 2.5.4): Nischig, in der Praxis selten;
					nicht priorisiert, aber nicht strukturell unmöglich.
				</li>
				<li>
					<strong>Die zwei ACT-Randfälle von <code>img-alt-decorative</code></strong>: Ein{" "}
					<code>&lt;img&gt;</code>, dessen aktueller Netzwerkstatus nicht „vollständig verfügbar“
					ist (lädt noch oder ist defekt), und ein vollständig transparentes{" "}
					<code>&lt;canvas&gt;</code> (auf dem tatsächlich nichts gezeichnet ist) sind beide von der
					Anwendbarkeit nach ACT ausgenommen. Keins von beiden lässt sich aus einem statischen
					DOM-Scan entscheiden (kein Dekodieren von Bildern, kein Auslesen von Canvas-Pixeln), daher
					bleiben beide im Umfang, statt ausgenommen zu werden: ein seltenes Falsch-Positiv, das ein
					menschlicher Prüfer auf einen Blick verwirft, ist sicherer, als ein echtes
					ausgeschlossenes oder nicht dekoratives Element stillschweigend zu übersehen.
				</li>
			</ul>

			<h2>Was das in der Praxis bedeutet</h2>
			<p>
				Nichts davon ist spezifisch für surea11y: Jedes Barrierefreiheits-Tool mit statischer
				Analyse (andere etablierte Engines eingeschlossen) teilt die strukturellen Einschränkungen,
				und die meisten auch die Ermessensfragen. Der Grund, es hier ausdrücklich zu sagen:{" "}
				<strong>Ein <code>pass</code> dieser Engine (oder jedes anderen automatischen Tools) ersetzt
				nie die manuelle Prüfung, die WCAG selbst für die oben genannten Kriterien verlangt.</strong>{" "}
				Was ein <code>pass</code> bzw. ein zusammengefasstes <code>pass</code> genau aussagt und was
				nicht, steht in{" "}
				<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.
			</p>
		</>
	);
}
