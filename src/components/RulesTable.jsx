import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Tag } from "./design-system/core/Tag.jsx";

const columns = [
	{
		key: "ruleId",
		label: "Rule ID",
		mono: true,
		width: "26ch",
		render: (value) => <a href={`/rules/${value}/`}>{value}</a>,
	},
	{
		key: "title",
		label: "Title",
		wrap: true,
		render: (value, row) => (
			<>
				{value}
				{row.deprecated ? (
					<>
						{" "}
						<Tag tone="accent">deprecated</Tag>
					</>
				) : null}
			</>
		),
	},
	{
		key: "wcagSc",
		label: "WCAG SC",
		width: "12ch",
		render: (value) => (Array.isArray(value) && value.length ? value.join(", ") : "—"),
	},
	{
		key: "level",
		label: "Level",
		width: "8ch",
		render: (value) => (value ? <Tag tone="accent2">{value}</Tag> : "—"),
	},
	{ key: "confidence", label: "Confidence", width: "12ch" },
	{ key: "severity", label: "Severity", width: "12ch" },
];

export function RulesTable({ caption, rows }) {
	return <DataTable caption={caption} columns={columns} rows={rows} rowKey="ruleId" />;
}
