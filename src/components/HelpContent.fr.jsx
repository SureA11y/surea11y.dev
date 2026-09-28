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
				Les questions les plus fréquentes, avec des réponses claires : pourquoi <code>runOnly</code>{" "}
				a exécuté en silence toutes les règles au lieu de celle demandée, pourquoi une règle
				personnalisée renvoie sans cesse <code>cantTell</code> sans cause évidente, pourquoi une
				règle dépendant de la géométrie indique <code>notApplicable</code> sous jsdom, et ce
				qu’une analyse sans erreur signifie vraiment, ou pas. Quinze minutes ici vous épargnent
				l’essentiel du débogage que la plupart des gens finissent par faire de toute façon. Voir la{" "}
				<a href="/help/faq/">FAQ</a>.
			</p>

			<h2>Limites connues</h2>
			<p>
				Chaque limite de l’architecture de ce moteur, fondée sur l’analyse statique du DOM, est
				nommée explicitement plutôt que découverte par surprise : ce qu’il ne peut structurellement
				pas faire, ce qui dépend de l’environnement dans lequel vous l’exécutez, et ce qu’il refuse
				délibérément de deviner, parce qu’une mauvaise supposition serait pire qu’un{" "}
				<code>cantTell</code> honnête. Les connaître d’avance, c’est ce qui vous permet de faire
				confiance au reste des résultats. Voir{" "}
				<a href="/help/known-limitations/">Limites connues</a>.
			</p>
		</>
	);
}
