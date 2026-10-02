export interface ResultsReportsSection {
	href: string;
	label: string;
}

export const resultsReportsSections: ResultsReportsSection[] = [
	{ href: "/results-reports/output-schema/", label: "Output schema" },
	{ href: "/results-reports/html-report/", label: "HTML report" },
	{ href: "/results-reports/sarif-report/", label: "SARIF report" },
	{ href: "/results-reports/junit-report/", label: "JUnit report" },
	{ href: "/results-reports/earl-report/", label: "EARL report" },
];
