import React from "react";

export function ConformanceContent() {
	return (
		<>
			<p>
				<strong>Une analyse sans erreur ne constitue pas, à elle seule, une déclaration de conformité WCAG</strong>{" "}
				et prétendre le contraire est précisément le genre d’excès que ce moteur refuse. Cette
				section explique comment les résultats de chaque règle s’agrègent en un verdict par critère
				de succès, ce que ce verdict couvre honnêtement et ce qu’il ne couvre pas, et comment
				conditionner un vrai pipeline de CI aux violations connues et déjà examinées, au lieu de
				bloquer chaque build jusqu’à ce que tout soit corrigé d’un coup.
			</p>

			<h2>Correspondance de conformité WCAG</h2>
			<p>
				Voyez précisément comment s’articulent les règles atomiques, les facettes de couverture et
				les règles composites d’agrégation par critère de succès WCAG, pour qu’un <code>pass</code>{" "}
				composite signifie quelque chose de précis plutôt qu’un vague « ça a l’air correct ». Ciblez
				un niveau de conformité (A, AA ou AAA) sur n’importe quelle version de WCAG avec un seul jeu
				de tags, et obtenez une réponse claire à la question qui compte vraiment : que peut vous
				dire ce type de résultat automatisé, et où s’arrête-t-il ? Voir{" "}
				<a href="/conformance/wcag-mapping/">Correspondance de conformité WCAG</a>.
			</p>

			<h2>Baseline / allowlist</h2>
			<p>
				Ne laissez pas une première analyse d’un site existant et imparfait bloquer tous les builds
				à venir : enregistrez une fois ce qui est déjà connu, et ne faites échouer la CI que sur les
				violations réellement nouvelles. C’est la différence entre « on ne peut rien livrer tant que
				ce n’est pas parfait » et « on peut détecter les régressions dès aujourd’hui », et c’est ce
				qui amène concrètement une équipe à activer le contrôle. Voir{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a>.
			</p>
		</>
	);
}
