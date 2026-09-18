import type { LocalizedOverride } from "./localize";

export interface Section {
	href: string;
	label: string;
	description: string;
	i18n?: { es?: LocalizedOverride };
}

export const sections: Section[] = [
	{
		href: "/",
		label: "Overview",
		description:
			"What surea11y is and how it differs from other accessibility tools.",
		i18n: {
			es: {
				label: "Resumen",
				description:
					"Qué es surea11y y en qué se diferencia de otras herramientas de accesibilidad.",
			},
		},
	},
	{
		href: "/getting-started/",
		label: "Getting Started",
		description:
			"Install a binding, run a scan, and see what a result looks like.",
		i18n: {
			es: {
				label: "Primeros pasos",
				description:
					"Instala un binding, ejecuta un análisis y descubre cómo es un resultado.",
			},
		},
	},
	{
		href: "/rules/",
		label: "Rules",
		description:
			"Browse all rules — what each one checks, and a pass/fail example.",
		i18n: {
			es: {
				label: "Reglas",
				description:
					"Explora todas las reglas: qué comprueba cada una y un ejemplo de aprobado/fallido.",
			},
		},
	},
	{
		href: "/configuration/",
		label: "Configuration",
		description: "Select which rules run, wire up CI, and add a locale.",
		i18n: {
			es: {
				label: "Configuración",
				description: "Elige qué reglas se ejecutan, intégralo en tu CI y añade un locale.",
			},
		},
	},
	{
		href: "/results-reports/",
		label: "Results & Reports",
		description: "The result shape, plus HTML, SARIF, and EARL reports.",
		i18n: {
			es: {
				label: "Resultados e informes",
				description: "La forma del resultado, además de los informes HTML, SARIF y EARL.",
			},
		},
	},
	{
		href: "/conformance/",
		label: "Conformance",
		description: "How atomic rules roll up into a WCAG conformance verdict.",
		i18n: {
			es: {
				label: "Conformidad",
				description:
					"Cómo las reglas atómicas se combinan en un veredicto de conformidad con WCAG.",
			},
		},
	},
	{
		href: "/help/",
		label: "Help",
		description: "Common questions and known limitations.",
		i18n: {
			es: {
				label: "Ayuda",
				description: "Preguntas frecuentes y limitaciones conocidas.",
			},
		},
	},
];
