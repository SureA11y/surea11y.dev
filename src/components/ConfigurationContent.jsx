import React from "react";

export function ConfigurationContent() {
	return (
		<>
			<p>
				Every runner takes the same plain <code>engineOptions</code> object — no config file to
				maintain, no separate CLI-only flag surface to keep in sync. The CLI and every binding just
				build that object for you from their own flags or builder methods, so what you learn here
				applies everywhere you run a scan. Four things are worth getting right early:
			</p>

			<h2>Engine options</h2>
			<p>
				Scope a scan to exactly the rules you want — by naming a WCAG version and level (WCAG 2.2
				AA in one option, best practices on top if you want them), by id, by tag, or by naming a
				conformance profile such as WCAG 2.2 AA, EN 301 549 or
				Section 508 — so a run reports what you're actually accountable for, nothing more
				and nothing less. Run only a few checks and still get the WCAG criteria they belong to, at
				the level you're held to, and list what a scan will report before it runs. Silence
				known-noisy widgets globally or for a single rule without losing
				coverage everywhere else, tune how aggressive the contrast checks are for a human auditor
				versus an unattended CI gate, and drop in an org-specific rule alongside the built-ins when
				the catalog doesn't cover something you care about, and hand the rules the CSS of a style
				sheet from another origin that the page can't read. See{" "}
				<a href="/configuration/engine-options/">Engine options</a> for the full reference.
			</p>

			<h2>Packs</h2>
			<p>
				Test against more than WCAG without forking the engine. A pack brings a national standard,
				your organisation's accessibility policy, or a few house rules from a package of its own,
				and the engine runs it as it runs its own rules: its profiles select what runs, its
				checklist items come back as one result each, and every report shows them beside the WCAG
				criteria. The same pack works from Node, every binding, the test matchers and the CLI, and{" "}
				<code>npx surea11y-pack new</code> writes one that passes its own tests as generated. A
				standard can file a rule's findings under the requirements they belong to, and a pack rule
				can tell a person how to answer what it leaves undecided. See{" "}
				<a href="/configuration/packs/">Packs</a> to use one or write one.
			</p>

			<h2>CI integration</h2>
			<p>
				Get a working accessibility gate into your pipeline without writing it from scratch —
				ready-to-paste GitHub Actions and Bitbucket Pipelines templates gate a build on the CLI's
				own exit code, baseline an existing site's pre-existing violations so you only fail on
				genuinely new ones, and upload SARIF results straight into GitHub Code Scanning where your
				team already looks. GitLab CI and Azure DevOps recipes put results in their own test views
				as JUnit, written by the CLI in the same step, and a JUnit report can turn the undecided
				findings that lean fail into failures, so a likely failure doesn't pass as a skipped test.
				See <a href="/configuration/ci-integration/">CI integration</a> for the
				full templates.
			</p>

			<h2>Locales</h2>
			<p>
				Ship findings your team can actually act on in the language they read fastest — every rule
				title and every occurrence's summary and hint resolve from a key-based dictionary, with
				graceful per-string fallback to English rather than a blank or an error. Five languages
				ship today (English, French, German, Spanish, Japanese), and a result always tells you exactly which
				locale it used, so nothing silently degrades without you knowing. The steps for answering
				an undecided finding ("How to check") come in the same five languages. See{" "}
				<a href="/configuration/locales/">Locales</a> for coverage and how to supply your own
				dictionary.
			</p>
		</>
	);
}
