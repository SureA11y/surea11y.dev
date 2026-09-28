import React from "react";

export function RulesIntroContent() {
	return (
		<p>
			Les 34 règles composites d’agrégation par critère de succès WCAG ne figurent pas ici : ce ne
			sont pas des règles configurables individuellement, elles relèvent de la section{" "}
			<a href="/conformance/wcag-mapping/">Conformité</a>. Consultez{" "}
			<a href="/rules/organization/">l’organisation des règles</a> pour la distinction entre
			automatique et manuel, la structure des identifiants de règle et les facettes WCAG.
		</p>
	);
}
