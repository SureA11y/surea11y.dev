import React from "react";
import engine from "../data/engine.generated.json";

export function RulesIntroContent() {
	return (
		<p>
			Les {engine.composites} règles composites d’agrégation par critère de succès WCAG ne figurent pas ici : ce ne
			sont pas des règles configurables individuellement, elles relèvent de la section{" "}
			<a href="/conformance/wcag-mapping/">Conformité</a>. Consultez{" "}
			<a href="/rules/organization/">l’organisation des règles</a> pour la distinction entre
			automatique et manuel, la structure des identifiants de règle et les facettes WCAG. La colonne Questions compte les
			questions qu’une règle peut laisser à une personne (<code>cantTell</code>) ; chacune est
			accompagnée, sur la page de la règle, des étapes pour y répondre.
		</p>
	);
}
