import React from "react";

const core = "https://github.com/SureA11y/core";

export function AccessibilityStatementContent() {
	return (
		<>
			<p>
				Cette déclaration porte sur <strong>surea11y.dev</strong>, le site que vous lisez en ce
				moment, et non sur les résultats d’accessibilité que renvoie une analyse de votre propre
				site, traités dans la section <a href="/conformance/wcag-mapping/">Conformité</a>.
			</p>

			<h2>Objectif de conformité</h2>
			<p>
				Ce site vise la conformité au niveau AA des{" "}
				<a href="https://www.w3.org/TR/WCAG22/">WCAG 2.2</a>. Il suit les mêmes règles de marque
				que toutes les interfaces des produits SureA11y : la couleur n’est jamais le seul repère
				(les indicateurs d’état et d’élément actif associent toujours la couleur à un second
				signal, qu’il s’agisse d’un soulignement, d’un glyphe ou d’un mot), chaque contrôle
				interactif a un contour de focus visible et une cible d’au moins 44 px, et chaque icône
				qui n’est pas purement décorative a une alternative textuelle.
			</p>

			<h2>Comment ce site est testé</h2>
			<p>
				Ce site est construit par l’équipe qui développe <code>@surea11y/core</code> : ce serait
				un drôle d’endroit pour se passer de notre propre moteur. L’ensemble du site généré est
				périodiquement analysé avec <code>@surea11y/core</code> lui-même, le moteur d’analyse
				statique du DOM documenté tout au long de ce site, et chaque vrai problème relevé par
				cette analyse est corrigé, pas justifié. Cette analyse a ses propres limites, réelles et
				assumées (voir <a href="/help/known-limitations/">Limites connues</a>) : elle ne peut pas
				s’exécuter sur le CSS réellement calculé du site comme le ferait un vrai navigateur, donc
				les résultats de contraste issus de ce mode d’analyse ne prouvent rien, dans un sens
				comme dans l’autre.
			</p>
			<p>
				<strong>L’analyse automatisée n’est qu’un plancher, jamais un plafond</strong> : ce n’est
				donc pas la seule vérification que reçoit ce site. Les modifications font aussi l’objet de
				tests d’accessibilité manuels : navigation au clavier seul, un passage avec un lecteur
				d’écran, et une vérification des points qu’aucun outil automatisé ne peut juger (un titre
				décrit-il vraiment ce qui suit, l’ordre du focus correspond-il à l’ordre visuel, un
				contenu qui n’apparaît qu’après une interaction reste-t-il atteignable). C’est la même
				position, « les outils automatisés ne peuvent pas tout vous dire », sur laquelle repose
				tout ce projet.
			</p>

			<h2>Lacunes connues</h2>
			<ul>
				<li>
					La table des matières « Sur cette page » ne met pas en évidence votre position de
					défilement actuelle : il faudrait pour cela du JavaScript côté client, et ce site n’en
					utilise aucun, par choix. Les liens eux-mêmes fonctionnent normalement au clavier ou
					avec un lecteur d’écran ; seule la mise en évidence « vous êtes ici » pendant le
					défilement est absente.
				</li>
				<li>
					Les exemples de code sont volontairement affichés sur fond sombre alors que le reste du
					site est clair : c’est l’exception « un terminal reste un terminal » documentée dans le
					design system du site. Si cette combinaison de contraste vous est difficile à lire, le
					texte de chaque exemple de code reste entièrement sélectionnable et copiable en texte
					brut.
				</li>
			</ul>

			<h2>Signaler un problème</h2>
			<p>
				Si un élément de ce site est difficile à utiliser au clavier, avec un lecteur d’écran ou
				toute autre technologie d’assistance, merci d’
				<a href={`${core}/issues`}>ouvrir une issue sur GitHub</a>. Indiquez l’URL de la page, ce
				que vous essayiez de faire et ce qui s’est passé à la place : le même niveau de détail
				que celui que vous attendriez de quiconque signale un bug dans le moteur lui-même.
			</p>
		</>
	);
}
