import React from "react";

export function HelpContent() {
	return (
		<>
			<p>
				Vous trouverez ici deux types de questions, et mieux vaut savoir lequel est le vôtre avant de
				chercher : « pourquoi le moteur a-t-il fait ça ? » trouve sa réponse ci-dessous, et
				« que ne fera-t-il jamais ? » reçoit une réponse tout aussi directe, énoncée d’emblée
				plutôt que découverte à vos dépens en production.
			</p>

			<h2>FAQ</h2>
			<p>
				Les questions les plus fréquentes, avec des réponses claires : pourquoi une sélection de
				tags et d’identifiants de règle peut n’exécuter aucune règle et paraître pourtant sans
				erreur, pourquoi un composant web revient en <code>cantTell</code>, ce qui change dans vos
				résultats après la mise à jour vers core 1.15,
				pourquoi les règles de titre et de langue sont <code>notApplicable</code> dans une frame,
				pourquoi chaque critère WCAG est{" "}
				<code>cantTell</code> même quand toutes les vérifications renvoient <code>pass</code>, pourquoi une règle dépendant de la géométrie indique <code>notApplicable</code> sous jsdom, et ce
				qu’une analyse sans erreur signifie vraiment, ou pas. Quinze minutes ici vous épargnent
				l’essentiel du débogage que la plupart des gens finissent par faire de toute façon. Voir la{" "}
				<a href="/help/faq/">FAQ</a>.
			</p>

			<h2>Limites connues</h2>
			<p>
				Les limites connues de ce moteur sont nommées explicitement plutôt que découverte par surprise : ce
				qu’une analyse d’un seul état de la page ne peut pas voir, ce qui dépend de l’endroit où
				vous l’exécutez (jsdom, un navigateur, les scripts de la page elle-même), et ce qu’il refuse
				délibérément de deviner, parce qu’une mauvaise supposition serait pire qu’un{" "}
				<code>cantTell</code> honnête, avec pour chacune ce qu’il faut faire. Les connaître d’avance, c’est ce qui vous permet de faire
				confiance au reste des résultats. Voir{" "}
				<a href="/help/known-limitations/">Limites connues</a>.
			</p>
		</>
	);
}
