import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Tag } from "./design-system/core/Tag.jsx";
import { t } from "../i18n/t";

export function RulesTable({ caption, rows, locale = "en" }) {
	const columns = [
		{
			key: "ruleId",
			label: t("rulesTable.ruleId", locale),
			mono: true,
			width: "26ch",
			render: (value) => <a href={`/rules/${value}/`}>{value}</a>,
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
			width: "12ch",
			render: (value) => (Array.isArray(value) && value.length ? value.join(", ") : "—"),
		},
		{
			key: "level",
			label: t("rulesTable.level", locale),
			width: "8ch",
			render: (value) => (value ? <Tag tone="accent2">{value}</Tag> : "—"),
		},
		{ key: "confidence", label: t("rulesTable.confidence", locale), width: "12ch" },
		{ key: "severity", label: t("rulesTable.severity", locale), width: "12ch" },
	];

	return <DataTable caption={caption} columns={columns} rows={rows} rowKey="ruleId" />;
}
