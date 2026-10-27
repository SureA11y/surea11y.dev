import React from "react";
import { wordSeparator } from "../i18n/locales";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Tag } from "./design-system/core/Tag.jsx";
import { t } from "../i18n/t";
import { RuleText } from "./RuleText.jsx";

// Break long ids only at their hyphens ("presentational-children-…"), never
// mid-word; <wbr> adds a break opportunity without changing the link text.
function breakableId(id) {
	return id.split("-").map((part, i, parts) => (
		<React.Fragment key={i}>
			{part}
			{i < parts.length - 1 ? (
				<>
					-<wbr />
				</>
			) : null}
		</React.Fragment>
	));
}

export function RulesTable({ caption, rows, locale = "en" }) {
	const columns = [
		{
			key: "ruleId",
			label: t("rulesTable.ruleId", locale),
			mono: true,
			wrap: true,
			width: "12rem",
			render: (value) => (
				<a href={`/rules/${value}/`} translate="no">
					{breakableId(value)}
				</a>
			),
		},
		{
			key: "title",
			label: t("rulesTable.title", locale),
			wrap: true,
			render: (value, row) => (
				<>
					<RuleText text={value} />
					{row.deprecated ? (
						<>
							{wordSeparator(locale)}
							<Tag tone="accent">{t("common.deprecated", locale)}</Tag>
						</>
					) : null}
				</>
			),
		},
		{
			key: "wcagSc",
			label: t("rulesTable.wcagSc", locale),
			width: "6.5rem",
			wrap: true,
			render: (value) => (Array.isArray(value) && value.length ? value.join(", ") : "—"),
		},
		{
			key: "level",
			label: t("rulesTable.level", locale),
			width: "4.5rem",
			render: (value) => (value ? <Tag tone="accent2">{value}</Tag> : "—"),
		},
		// How many cantTell questions the rule can ask, each with "How to check"
		// steps on its page; the column header names what the number counts.
		{
			key: "questions",
			label: t("rulesTable.questions", locale),
			width: "6rem",
			render: (value, row) => (value ? <a href={`/rules/${row.ruleId}/#how-to-check`}>{value}</a> : "—"),
		},
		// Engine vocabulary, English in every language.
		{
			key: "confidence",
			label: t("rulesTable.confidence", locale),
			width: "7.5rem",
			render: (value) => <span lang="en">{value}</span>,
		},
		{
			key: "severity",
			label: t("rulesTable.severity", locale),
			width: "7.5rem",
			render: (value) => <span lang="en">{value}</span>,
		},
	];

	// The fixed columns above add up to 44rem; a 60rem minimum keeps Title at
	// 16rem or more, and DataTable scrolls sideways (focusable, named by the
	// caption) when there isn't room.
	return <DataTable caption={caption} columns={columns} rows={rows} rowKey="ruleId" minWidth="60rem" />;
}
