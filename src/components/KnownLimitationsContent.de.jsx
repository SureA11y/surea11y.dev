import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const remedyRows = [
	{
		id: "interaction",
		situation: "Inhalt erscheint erst nach einem Klick, einem Hover oder dem Laden von Daten",
		remedy: "Bringen Sie die Seite selbst in diesen Zustand und scannen Sie sie dann. Scannen Sie jeden Zustand, der zählt.",
	},
	{
		id: "layout",
		situation: "Eine Prüfung braucht Layout: Zielgröße, Textabstand, Kontrast gegen das, was unter dem Text gezeichnet wird",
		remedy: (
			<>
				Scannen Sie in einem echten Browser. jsdom hat kein Layout (im Ergebnis ist{" "}
				<code>engine.environment.layout</code> <code>false</code>), daher messen diese Regeln
				dort weniger oder melden <code>notApplicable</code>, wie die Abschnitte unten beschreiben.
			</>
		),
	},
	{
		id: "keyboard",
		situation: "Eine Anforderung betrifft die Bedienung per Tastatur, etwa eine Tastaturfalle",
		remedy: "Testen Sie sie mit einer Tastatur. Kein Scan deckt sie ab.",
	},
	{
		id: "canttell",
		situation: (
			<>
				Ein Ergebnis ist <code>cantTell</code>
			</>
		),
		remedy: (
			<>
				Lesen Sie <code>uncertainty.code</code> und <code>uncertainty.needed</code> des
				Vorkommens und entscheiden Sie von Hand.
			</>
		),
	},
	{
		id: "responsive",
		situation: "Die Seite ist responsiv",
		remedy: "Scannen Sie bei jeder Breite, die Ihnen wichtig ist.",
	},
	{
		id: "differ",
		situation: "Zwei Läufe derselben Seite weichen voneinander ab",
		remedy: (
			<>
				Vergleichen Sie <code>engine.version</code> und <code>engine.environment</code> (Viewport,
				noch ladende Schriften und Bilder), und laden Sie die Seite zwischen Scans neu.
			</>
		),
	},
	{
		id: "no-failures",
		situation: "Ein Scan meldet keine Verstöße",
		remedy: (
			<>
				Das ist keine Konformitätsaussage. Siehe{" "}
				<a href="/conformance/wcag-mapping/">WCAG-Konformitätszuordnung</a>.
			</>
		),
	},
];

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				Was die Engine nicht bewertet, was davon abhängt, wo ein Scan läuft (jsdom, ein Browser
				oder die eigenen Skripte der Seite), und was eine Person prüfen muss. Manche Punkte sind
				Designentscheidungen, jede mit ihrer Begründung; jeder Punkt sagt, was ein Scan nicht
				feststellen kann, und, wo es etwas gibt, was dagegen zu tun ist. Lesen Sie das, bevor Sie
				sich auf ein Ergebnis ohne Befunde verlassen.
			</p>

			<h2>Was dagegen zu tun ist</h2>
			<DataTable
				label="Was gegen jede Einschränkung zu tun ist"
				rowKey="id"
				columns={[
					{ key: "situation", label: "Wenn …", width: "40%" },
					{ key: "remedy", label: "Dann …" },
				]}
				rows={remedyRows}
			/>
			<p>Die Abschnitte unten nennen die Gründe.</p>

			<h2 id="outside-what-one-scan-can-see">Außerhalb dessen, was ein Scan sehen kann</h2>
			<p>
				Ein Scan liest die Seite zu einem Zeitpunkt, in einem Zustand, bei einem Viewport: das
				DOM, seine berechneten Styles und, in einem echten Browser, sein Layout. Er benutzt die
				Seite nicht so, wie eine Person es tut. Er bewegt sich nicht per Tastatur durch sie, öffnet
				keine Menüs, wartet nicht auf ihre Daten und ändert nicht ihre Größe. (Im Browser
				fokussieren einige Regeln ein Element oder fügen für die Dauer ihrer Prüfung ein
				Stylesheet hinzu und setzen es danach zurück; siehe den nächsten Abschnitt.) Die Punkte
				hier brauchen diese Art von Interaktion über die Zeit, daher kann keine weitere Regel sie
				schließen. Sie brauchen einen Interaktionstest oder eine Person:
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
					), aber sie ist nicht gebaut: Ein Scan erkundet keine Benutzerinteraktionen und nicht die
					Zustände, zu denen sie führen, und keine der Prüfungen, die die Seite kurz verändern,
					bewegt den Fokus so durch sie, wie es die Erkennung von Tastaturfallen täte. Bis dahin
					ersetzt nichts im statischen Markup sie.
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
					vor dem Scan selbst aus (z. B. Button klicken, <em>dann</em> scannen). Ein Scan des
					geöffneten Zustands prüft, was darin ist, nicht, ob Personen mit Tastatur oder
					Screenreader ihn öffnen, bedienen und schließen können.
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
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> <span lang="en">Pattern 2</span>), um von
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
					gewöhnlicher erzwungener Wert unter dem Grenzwert ergibt also weiterhin <code>fail</code>. Wo aus einem
					Grund, der <em>ohne</em> Layout erkennbar ist, kein Umbruch möglich ist (Text, der nicht
					umbrechen darf, oder ein Element mit fester Breite in einem horizontal scrollenden
					Vorfahren), meldet sie stattdessen <code>cantTell</code>. Text, der aus einem anderen
					Grund nie umbricht, wird weiterhin als Verstoß gemeldet.
				</li>
				<li>
					<strong>Die Engine läuft auf den eigenen JavaScript-Built-ins der Seite.</strong> Eine
					Seite, deren Skripte eines beschädigen, auf das sie sich verlässt
					(<code>Array.prototype.filter</code>, <code>Map</code>, <code>JSON.stringify</code>,{" "}
					<code>String.prototype.toLowerCase</code> und weitere), beendet den Scan mit einem Fehler
					mit dem Code <code>PAGE_BUILTINS_BROKEN</code>, der jedes davon nennt, statt ein Ergebnis zu
					liefern, das sich gut liest und falsch ist; ist eines schon beschädigt, bevor das Bundle
					eingefügt wird (<code>Object.keys</code>), lädt das Bundle nicht. Eine Seite, die{" "}
					<code>Object.prototype</code> um <code>then</code> ergänzt, wird wie jede andere gescannt.
					DOM-Methoden, die eine Seite ersetzt (<code>getComputedStyle</code>,{" "}
					<code>querySelectorAll</code>, <code>getBoundingClientRect</code>), werden nicht geprüft:
					Regeln lesen, was sie zurückgeben.
				</li>
				<li>
					<strong>Ein Name wird nicht aus Inhalt ermittelt, der mehr als 256 Ebenen tief
					verschachtelt ist.</strong>{" "}
					Der Durchlauf endet dort (Chrome ergibt aus Inhalt 100 Ebenen tiefer keinen Namen), daher
					fragen <a href="/rules/button-name-present/"><code>button-name-present</code></a>,{" "}
					<a href="/rules/link-name-present/"><code>link-name-present</code></a>, die Namensregeln
					für Menüeinträge, Optionen, summary, Tabs, Tooltips und Baumeinträge sowie{" "}
					<a href="/rules/empty-heading/"><code>empty-heading</code></a> bei einem Element, dessen
					einziger Name tiefer liegt, nach (<code>name_contentTooDeep</code>); andere Regeln, die
					Namen aus Inhalt bilden, lesen solchen Inhalt als leer.
				</li>
				<li>
					<strong>Inhalt in einem geschlossenen Shadow Root lässt sich nicht lesen.</strong> Kein
					Skript gelangt in <code>{"attachShadow({ mode: 'closed' })"}</code> oder ein deklaratives{" "}
					<code>shadowrootmode="closed"</code>, daher kann die Engine nicht sehen, was ein Browser
					von dort als Namen ermittelt. <code>button-name-present</code> und{" "}
					<code>link-name-present</code> sowie die Namensregeln für Menüeinträge, Optionen, Tabs,
					Baumeinträge, summary und Tooltips fragen bei einem Element nach, dessen Name von einem
					Custom Element stammen könnte, das gerendert wird, aber keinen lesbaren Inhalt zeigt, statt
					es scheitern zu lassen. Ein geschlossener Root an einem eingebauten Element (einem{" "}
					<code>&lt;span&gt;</code>) sieht aus wie ein leerer, etwa ein per CSS gezeichnetes Icon,
					daher scheitert ein Button darüber weiterhin. Prüfen Sie von Hand, was eine solche
					Komponente bereitstellt, etwa mit einem Screenreader.
				</li>
				<li>
					<strong>
						Ein Name oder Zustand, den ein Custom Element über <code>ElementInternals</code>{" "}
						setzt, lässt sich nicht lesen.
					</strong>{" "}
					<code>{"this.attachInternals().ariaLabel = 'Save'"}</code> benennt das Element in jedem
					Browser, aber kein Skript kann das zurücklesen. Wo eine Komponente ihre Internals in einer
					Eigenschaft hält (<code>_internals</code>, <code>internals</code>,{" "}
					<code>internals_</code>, <code>__internals</code>), liest die Engine sie darüber und lässt
					das Element nach dem bestehen oder scheitern, was sie sagen. Bei jedem anderen definierten
					Custom Element ohne Namen (oder ohne erforderlichen Zustand) fragen die Namensregeln und{" "}
					<a href="/rules/aria-required-attr/"><code>aria-required-attr</code></a> nach (
					<code>name_internals</code>, <code>state_internals</code>), statt es scheitern zu lassen.
					Prüfen Sie solche Elemente im Accessibility Tree des Browsers, oder installieren Sie den
					optionalen Internals-Hook, bevor die Skripte der Seite laufen:{" "}
					<code>installInternalsHook()</code> in jedem Binding (siehe{" "}
					<a href="/getting-started/">Erste Schritte</a>) und in test-matchers, oder{" "}
					<code>internalsHookScript()</code> aus core für eine eigene Seite (siehe{" "}
					<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, wo gezeigt wird, wo er zu installieren ist). Der Hook zeichnet für den Scan die
					Internals jedes Elements auf und erkennt so auch ein Element, das nie welche angehängt
					hat. Eine Rolle, die nur über Internals gesetzt ist (<code>internals.role</code>), wird
					dort gelesen, wo die Internals lesbar sind, über eine Eigenschaft oder den Hook, als
					Standardrolle des Elements; liegt sie ohne Hook in einem privaten Feld, wird sie nicht
					gesehen, und zum Element wird nicht nachgefragt, da fast jede Komponente eine haben
					könnte. Eingebaute Elemente und nicht definierte Custom Elements werden wie bisher
					beurteilt.
				</li>
				<li>
					<strong>
						Ein Scan bei geöffnetem modalem Dialog sieht den Dialog, nicht die Seite.
					</strong>{" "}
					Ein mit <code>showModal()</code> geöffnetes <code>&lt;dialog&gt;</code> (oder ein
					geöffnetes <code>&lt;dialog aria-modal="true"&gt;</code>) macht den Rest des Dokuments
					inert, und Browser geben assistiven Technologien nur den Dialog weiter. Die Engine folgt
					dem: Inhalt hinter dem Dialog bleibt bei allen Regeln außen vor, wie anderer verborgener
					Inhalt auch, und die Regeln zur Struktur der Seite selbst (
					<a href="/rules/page-has-heading-one/"><code>page-has-heading-one</code></a>,{" "}
					<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>,{" "}
					<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>,{" "}
					<a href="/rules/region/"><code>region</code></a>) melden <code>notApplicable</code>, da
					der Scan diese Struktur nicht sehen kann. Scannen Sie die Seite bei geschlossenem Dialog
					erneut, um zu beurteilen, was dahinter liegt. Zwei Grenzen: Ein modales{" "}
					<code>&lt;dialog&gt;</code> in einem Shadow Root wird nicht erkannt, und ein eigenes
					Modal aus einem Element mit <code>role="dialog"</code> und <code>inert</code> oder{" "}
					<code>aria-hidden</code> auf dem Rest der Seite wird nur über diese Attribute behandelt,
					die die Seite verbergen, den Strukturregeln aber nicht mitteilen, dass ein Dialog offen
					ist. Andere Engines verhalten sich hier unterschiedlich: Manche tun dasselbe, andere
					beurteilen die Seite hinter dem Dialog, als wäre nichts geöffnet.
				</li>
				<li>
					<strong>
						<code>&lt;dialog&gt;</code> und andere Elemente, die das Standard-Stylesheet des
						Browsers ausblendet
					</strong>{" "}
					(kein <code>open</code>-Attribut, laut Spezifikation <code>display: none</code>), sowie
					jeder andere Teilbaum, der über <code>display:none</code>, <code>visibility:hidden</code>,{" "}
					<code>[hidden]</code> oder ein geschlossenes <code>&lt;details&gt;</code> verborgen ist,
					und ein <code>[inert]</code>-Teilbaum (den Regeln zum Aussehen von Inhalt, etwa Kontrast
					und Textabstand, weiterhin beurteilen, da er gezeichnet wird), werden <strong>standardmäßig von der Regelauswertung ausgeschlossen</strong>, wie es auch
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
					<strong>jsdom hat keine Popover.</strong> Es bringt die HTML-Regel mit, die ein
					geschlossenes <code>[popover]</code> verbirgt, aber kein <code>showPopover()</code>, und
					liest <code>:popover-open</code> uneinheitlich. Wo das DOM kein <code>showPopover</code>{" "}
					hat, behandelt die Engine jedes <code>[popover]</code> außer einem geöffneten{" "}
					<code>&lt;dialog&gt;</code> als geschlossen und verborgen, sein Inhalt wird also nicht
					geprüft; auch ein Popover, das das CSS der Seite sichtbar hält, wird unter jsdom nicht
					geprüft. Im Browser liest die Engine, was angezeigt wird. Um den Inhalt eines Popovers zu
					prüfen, scannen Sie die Seite in einem Browser mit geöffnetem Popover.
				</li>
				<li>
					<strong>jsdom behält eine Schriftgröße so, wie sie geschrieben ist.</strong> Ein Browser
					meldet eine berechnete Schriftgröße in px; jsdom behält ein Schlüsselwort oder ein{" "}
					<code>calc()</code> so, wie es geschrieben ist. Die Engine liest die Schlüsselwörter mit
					den Größen eines Browsers bei einem Standard von 16px (<code>xx-large</code> ist 32px) und{" "}
					<code>calc()</code> aus Längen und Zahlen, sodass großer Text wie im Browser erkannt wird.{" "}
					<code>larger</code> und <code>smaller</code>, die von der Größe des Elternelements
					abhängen, werden unter jsdom nicht aufgelöst: Solcher Text wird am Verhältnis für normalen
					Text gemessen, und seine Meldung gibt seine Größe mit 0px an. Ein Browser löst beide auf.
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
						Ein zweiter Scan desselben jsdom-DOM kann einen Style verlieren, der eine
						Kurzschreibweise überschreibt.
					</strong>{" "}
					jsdom behält den berechneten Style eines Elements nach dem ersten Lesen, bis sich das DOM
					das nächste Mal ändert, und der Kopie, die es aus diesem Cache zurückgibt, fehlt eine
					Einzeleigenschaft, die eine Kurzschreibweise aus einer weniger spezifischen Regel
					überschreibt: Mit <code>{"*{background:#888}"}</code> und{" "}
					<code>style="background-image:url(hero.png)"</code> liefert das erste Lesen das Bild und
					jedes weitere <code>none</code>. Ein Scan behält den zuerst gelesenen Style und ist daher
					nicht betroffen, aber ein zweiter Scan desselben unveränderten DOM kann das Bild übersehen
					und Text bestehen lassen, zu dem der erste nachgefragt hat (
					<code>contrast-computable</code>). Scannen Sie ein frisch geparstes DOM, oder ändern Sie
					das DOM zwischen den Scans, was den Cache von jsdom leert;{" "}
					<code>@surea11y/core/testing</code> tut das für seinen eigenen zweiten Scan. Ein echter
					Browser hat diesen Fehler nicht.
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
					<strong>Unter jsdom wächst die Scan-Dauer auch mit der Größe des Stylesheets.</strong>{" "}
					jsdom berechnet einen Style, indem es jede CSS-Regel gegen das Element abgleicht. Die
					Engine ändert das DOM während eines Scans nicht, daher wird jedes Element einmal berechnet,
					aber dieses eine Mal kostet O(Regeln): Auf einer gespeicherten Nachrichtenseite (7.916
					Elemente, 2.683 CSS-Regeln, jsdom 29.1.1) braucht die erste Berechnung von 5.735 Elementen
					etwa 224 s eines Scans von 243 s. Das sind die Kosten von jsdom; ein echter Browser
					berechnet dieselbe Seite in einem Bruchteil einer Sekunde. jsdom setzt außerdem Custom
					Properties nicht ein, daher ist eine mit <code>var()</code> gesetzte Farbe dort nicht
					lesbar: Zum Text oder Hintergrund wird nachgefragt (<code>contrast-computable</code>),
					statt ihn zu messen. Verwenden Sie für große Produktionsseiten einen echten Browser.
				</li>
				<li>
					<strong>
						In einem echten Browser verändern einige Regeln die Seite für die Dauer ihrer Prüfung,
						und die Skripte der Seite können darauf reagieren.
					</strong>{" "}
					Um zu messen, was der Browser zeichnet, fokussiert <code>css-hidden-focus</code> Elemente
					wie die Tastatur und schaltet Übergänge an dem Element ab, das es misst;{" "}
					<code>aria-hidden-focus</code> fokussiert ein Element in einem{" "}
					<code>aria-hidden</code>-Teilbaum, um zu sehen, ob die Seite den Fokus sofort wegbewegt
					(ein Wächterelement einer Fokusfalle);{" "}
					<code>text-spacing-content-loss</code> fügt ein Stylesheet mit den Abständen aus WCAG
					1.4.12 hinzu. All das wird zurückgesetzt, bevor die Regel endet: Fokus,
					Scrollposition, style-Attribute und das hinzugefügte Stylesheet. Nicht zurücksetzen lässt
					sich, was die Skripte der Seite daraufhin tun, denn das Fokussieren eines Elements löst
					seine <code>focus</code>- und <code>focusin</code>-Handler aus: Ein Karussell springt
					vielleicht zur fokussierten Folie und verschiebt dabei <code>aria-hidden</code>, oder es
					aktiviert einen Button. Die Befunde dieses Scans sind die der Seite, wie sie vorgefunden
					wurde: <code>aria-hidden-focus</code> liest, welche Teilbäume verborgen sind, und das
					Markup, das es meldet, bevor es irgendetwas fokussiert. Die Seite bleibt aber so, wie ihre
					Skripte sie hinterlassen haben, daher kann ein zweiter Scan derselben Seite etwas anderes
					finden: Wenn Sie eine Seite scannen, die Sie weiter benutzen, oder eine Seite zweimal
					scannen, laden Sie sie dazwischen neu.
				</li>
				<li>
					<strong>Statisches Markup vs. Live-DOM bzw. Zustand nach der Hydration.</strong> Die
					Regellogik selbst ist unabhängig von der DOM-Quelle: Sie wertet das DOM aus, das sie
					bekommt, ob von jsdom geparstes statisches HTML (<span lang="en">Pattern 1</span>) oder ein bereits geladener,
					bereits hydrierter Tab in einem echten Browser (<span lang="en">Pattern 2</span>, siehe{" "}
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
					Bibliothek direkt über <span lang="en">Pattern 2</span> gegen eine bereits geladene Seite aus, nicht über die
					CLI mit statischem Abruf.
				</li>
				<li>
					<strong>Ein Layout wird bei einem einzigen Viewport gemessen, mit den Schriften, die die
					Seite in diesem Moment hat.</strong> Regeln, die messen, was der Browser zeichnet,{" "}
					<a href="/rules/text-spacing-content-loss/">
						<code>text-spacing-content-loss</code>
					</a>
					,{" "}
					<a href="/rules/target-size-minimum/">
						<code>target-size-minimum</code>
					</a>{" "}
					und{" "}
					<a href="/rules/skip-link/">
						<code>skip-link</code>
					</a>
					, gelten für den Viewport, bei dem die Seite gescannt wurde: Eine responsive Seite kann
					bei einer Breite Text abschneiden oder ein Ziel verkleinern und bei einer anderen nicht,
					und Text, der gemessen wird, bevor seine Webfont geladen ist, hat eine andere Breite. Das
					Ergebnis hält beides in{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>{" "}
					fest, und die Befunde dieser Regeln wiederholen ihren Viewport und nennen, was gemessen
					wurde (wie weit Text über den Rand hinausging, wie groß ein Ziel ist und wie nah sein
					Nachbar liegt), sodass sich ein Befund, der zwischen Läufen abweicht, auf die Bedingungen
					zurückführen lässt. Scannen Sie bei jeder Breite, die Ihnen wichtig ist, und warten Sie vor
					dem Scan, bis die Seite fertig geladen ist: <code>waitForPageReady()</code> wartet auf das
					load-Ereignis, die Webfonts und die Bilder (siehe{" "}
					<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}>
						<code>INTEGRATION.md</code>
					</a>
					, wie es vor einem Scan aufgerufen wird), und das Ergebnis hält in{" "}
					<code>engine.environment</code> fest, ob noch Schriften oder Bilder geladen wurden.
				</li>
				<li>
					<strong>
						Im Browser wird Kontrast gegen das gemessen, was unter dem Text gezeichnet wird, so
						wie die Seite in diesem Moment ist.
					</strong>{" "}
					Zu Text über einem Bild, einem Verlauf oder einer Fläche, die ihn nur teilweise abdeckt,
					wird nachgefragt (
					<a href="/rules/contrast-computable/"><code>contrast-computable</code></a>,{" "}
					<code>reasonCode</code> <code>BACKGROUND_OVERLAP</code>), statt ihn zu messen. Text, den
					eine Box mit <code>overflow: hidden</code> vollständig außer Sicht hält, etwa eine
					Karussellfolie außerhalb ihrer Spur, bleibt außen vor, bis er sichtbar ist; scannen Sie
					die Seite in diesem Zustand, um ihn zu prüfen. Feste und sticky Boxen über Text werden
					ignoriert. Unter jsdom wird Text nur gegen seine Vorfahren gemessen. Bei einem Scan unter
					Forced Colors (Windows-Kontrastdesign oder ein emuliertes{" "}
					<code>forced-colors: active</code>) behält die Seite beim Messen ihre eigenen Farben, die
					Ergebnisse sind also die ohne Forced Colors; wo das nicht geht (eine Content Security
					Policy, die das <code>&lt;style&gt;</code> der Engine in einem Browser blockiert, der kein
					Stylesheet übernehmen kann), stammen die gemessenen Farben teils vom Browser, und jedes
					Kontrast-Vorkommen sagt das (<code>details.forcedColors</code>). Wie die Messung Schritt
					für Schritt funktioniert:{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#contrast`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					, auf GitHub.
				</li>
				<li>
					<strong>
						Generierter Text wird nur im Browser gemessen, und nur dort, wo er sich lesen lässt.
					</strong>{" "}
					Der Text, den ein <code>content</code> in <code>::before</code> oder <code>::after</code>{" "}
					schreibt, und der <code>::marker</code> eines Listeneintrags werden in Farbe und Schrift
					des Pseudo-Elements gemessen; zu Inhalt, der sich nicht lesen lässt (ein Zähler in einem
					eigenen <code>@counter-style</code> der Seite), und zu einem <code>::before</code> oder{" "}
					<code>::after</code>, das ohne eigenen Hintergrund aus dem Fluss positioniert ist, wird
					stattdessen nachgefragt (<code>contrast-computable</code>). Marker werden nur an{" "}
					<code>&lt;li&gt;</code> gesucht. Unter jsdom, das keine Styles für Pseudo-Elemente
					berechnet, bleibt generierter Text außen vor.
				</li>
				<li>
					<strong>
						Text und Platzhalter eines Formularfelds werden so gemessen, wie das Feld sie zeichnet,
						mit Lücken.
					</strong>{" "}
					Der Text, den ein Browser in ein leeres Datums- oder Zeitfeld zeichnet, sowie Button und
					Dateiname eines Dateifelds werden nicht gemessen. Ein Dropdown-
					<code>&lt;select&gt;</code> wird so gemessen, wie das geschlossene Bedienelement es
					zeichnet, seine angezeigte Option in den eigenen Farben des select; eine andere seiner
					Optionen mit eigenen Farben erscheint nur in der Liste, die die Plattform beim Öffnen
					zeichnet, und ist <code>cantTell</code> (<code>SELECT_OPTION_COLOR</code>). Ein
					Platzhalter unter seinem Verhältnis ist <code>cantTell</code> (
					<code>PLACEHOLDER_BELOW_THRESHOLD</code>) statt eines Fehlschlags: WCAG misst
					Platzhaltertext am Verhältnis, zählt aber Farben, die die Seite ganz dem Browser überlassen
					hat, als erfüllt (Technik G148), und beides auf echten Seiten auseinanderzuhalten, ist noch
					nicht gelöst. Unter jsdom werden Platzhalter gar nicht gemessen. Details:{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#form-fields`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					.
				</li>
				<li>
					<strong>
						<a href="/rules/target-size-minimum/"><code>target-size-minimum</code></a> ermittelt
						die Trefferfläche aus dem Layout statt durch Hit-Testing.
					</strong>{" "}
					Ziele unterhalb des sichtbaren Bereichs oder in einer scrollenden Box werden ganz
					gemessen, als wären sie in den sichtbaren Bereich gescrollt; feste und sticky Boxen über
					einem Ziel werden ignoriert; 3D-Transformationen, die meisten <code>clip-path</code>
					-Formen und die abgerundete Beschneidung eines Vorfahren werden als umgebende Box
					gemessen; und Links, die nur durch Trennzeichen getrennt sind („
					<span lang="en">Edit | Delete</span>“) und einander zu nahe kommen, werden nachgefragt
					statt ausgenommen. Unter jsdom ist die Regel <code>notApplicable</code>. Details:{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#target-size`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					.
				</li>
				<li>
					<strong>Kontrast wird in sRGB berechnet.</strong> Farben in <code>oklch()</code>,{" "}
					<code>oklab()</code>, <code>lab()</code>, <code>lch()</code> oder <code>color()</code>{" "}
					(auch die berechnete Form von <code>color-mix()</code> und relativen Farben) werden nach
					sRGB umgerechnet, wie ein Standardbildschirm sie zeigt; eine Farbe außerhalb von sRGB,
					etwa ein gesättigtes <code>display-p3</code>-Rot, wird auf dessen Rand beschnitten, so
					wie Chromium sie auf einem sRGB-Bildschirm zeichnet. Ein Wide-Gamut-Bildschirm kann diese
					Farbe gesättigter zeigen, als das Verhältnis annimmt. Eine Hintergrundfarbe, die die
					Engine nicht umrechnen kann, ein <code>color()</code> in einem ihr unbekannten Farbraum,
					wird nicht als transparent behandelt: <code>contrast-computable</code> fragt zu diesem
					Text mit dem <code>reasonCode</code> <code>BACKGROUND_UNPARSABLE</code> nach, und die
					anderen Kontrastregeln lassen ihn aus.
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
					<strong>Feinere Teilprüfungen für zeitbasierte Medien</strong> (WCAG 1.2.x hat 13
					ACT-Regeln ohne Regel hier; siehe den Abschnitt zu den Lücken in{" "}
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#gaps-no-corresponding-rule`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					): Audio- und Videoinhalte selbst
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
					<strong>Betätigung durch Bewegung</strong> (WCAG 2.5.4): Nischig, in der Praxis selten;
					nicht priorisiert, aber nicht strukturell unmöglich.
				</li>
				<li>
					<strong>Die zwei ACT-Randfälle von <code>img-alt-decorative</code></strong>: Ein{" "}
					<code>&lt;img&gt;</code>, dessen aktueller Netzwerkstatus nicht „vollständig verfügbar“
					ist (lädt noch oder ist defekt), und ein vollständig transparentes{" "}
					<code>&lt;canvas&gt;</code> (auf dem tatsächlich nichts gezeichnet ist) sind beide von der
					Anwendbarkeit nach ACT ausgenommen. Keins von beiden lässt sich aus einem statischen
					DOM-Scan entscheiden (kein Dekodieren von Bildern, kein Auslesen von Canvas-Pixeln), daher
					bleiben beide im Umfang, statt ausgenommen zu werden: ein seltenes Falsch-Positiv, das eine
					prüfende Person auf einen Blick verwirft, ist sicherer, als ein echtes
					ausgeschlossenes oder nicht dekoratives Element stillschweigend zu übersehen.
				</li>
			</ul>

			<h2>Was das in der Praxis bedeutet</h2>
			<p>
				Das meiste davon ist nicht spezifisch für surea11y. Jedes Tool, das einen Zustand des DOM
				beurteilt, teilt die Grenzen aus{" "}
				<a href="#outside-what-one-scan-can-see">Außerhalb dessen, was ein Scan sehen kann</a>, und
				die meisten automatischen Tools überlassen die Ermessensfragen ebenfalls einer Person,
				auch wenn Tools sich darin unterscheiden, wie sie laufen, was sie prüfen und wie sie
				melden, was sie nicht entscheiden können. Der Grund, es hier ausdrücklich zu sagen:{" "}
				<strong>Ein <code>pass</code> dieser Engine (oder jedes anderen automatischen Tools) ersetzt
				nie die manuelle Prüfung, die WCAG selbst für die oben genannten Kriterien verlangt.</strong>{" "}
				Was ein <code>pass</code> bzw. das <code>pass</code> einer zusammengesetzten Regel genau aussagt und was
				nicht, steht in{" "}
				<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.
			</p>
		</>
	);
}
