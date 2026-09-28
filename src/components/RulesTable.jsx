import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Tag } from "./design-system/core/Tag.jsx";
import { t } from "../i18n/t";

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
			render: (value) => <a href={`/rules/${value}/`}>{breakableId(value)}</a>,
		},
		{
			key: "title",
			label: t("rulesTable.title", locale),
			wrap: true,
			render: (value, row) => (
				<>
					{value}
					{row.deprecated ? (
						<>
							{" "}
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
		{ key: "confidence", label: t("rulesTable.confidence", locale), width: "7.5rem" },
		{ key: "severity", label: t("rulesTable.severity", locale), width: "7.5rem" },
	];

	// The fixed columns above add up to 38rem; .rules-table in global.css gives
	// the table a minimum width so Title keeps at least 16rem, and the wrapper
	// scrolls horizontally (focusable, labelled) when the column is narrower.
	return (
		<DataTable
			caption={caption}
			columns={columns}
			rows={rows}
			rowKey="ruleId"
			className="rules-table"
			role="region"
			aria-label={caption}
			tabIndex={0}
		/>
	);
}
