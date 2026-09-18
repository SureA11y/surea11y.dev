import type { LocalizedOverride } from "./localize";

export interface ResultsReportsSection {
	href: string;
	label: string;
	i18n?: { es?: LocalizedOverride };
}

export const resultsReportsSections: ResultsReportsSection[] = [
	{
		href: "/results-reports/output-schema/",
		label: "Output schema",
		i18n: { es: { label: "Esquema de salida" } },
	},
	{
		href: "/results-reports/html-report/",
		label: "HTML report",
		i18n: { es: { label: "Informe HTML" } },
	},
	{
		href: "/results-reports/sarif-report/",
		label: "SARIF report",
		i18n: { es: { label: "Informe SARIF" } },
	},
	{
		href: "/results-reports/earl-report/",
		label: "EARL report",
		i18n: { es: { label: "Informe EARL" } },
	},
];
