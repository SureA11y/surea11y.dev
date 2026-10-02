import React from "react";

export function ConfigurationContent() {
	return (
		<>
			<p>
				Every runner takes the same plain <code>engineOptions</code> object — no config file to
				maintain, no separate CLI-only flag surface to keep in sync. The CLI and every binding just
				build that object for you from their own flags or builder methods, so what you learn here
				applies everywhere you run a scan. Three things are worth getting right early:
			</p>

			<h2>Engine options</h2>
			<p>
				Scope a scan to exactly the rules you want — by id, by tag, by WCAG conformance version
				(2.0, 2.1, or 2.2), or by naming a conformance profile such as WCAG 2.2 AA, EN 301 549 or
				Section 508 — so a run reports what you're actually accountable for, nothing more
				and nothing less. Silence known-noisy widgets globally or for a single rule without losing
				coverage everywhere else, tune how aggressive the contrast checks are for a human auditor
				versus an unattended CI gate, and drop in an org-specific rule alongside the built-ins when
				the catalog doesn't cover something you care about. See{" "}
				<a href="/configuration/engine-options/">Engine options</a> for the full reference.
			</p>

			<h2>CI integration</h2>
			<p>
				Get a working accessibility gate into your pipeline without writing it from scratch —
				ready-to-paste GitHub Actions and Bitbucket Pipelines templates gate a build on the CLI's
				own exit code, baseline an existing site's pre-existing violations so you only fail on
				genuinely new ones, and upload SARIF results straight into GitHub Code Scanning where your
				team already looks. GitLab CI and Azure DevOps recipes put results in their own test views
				as JUnit. See <a href="/configuration/ci-integration/">CI integration</a> for the
				full templates.
			</p>

			<h2>Locales</h2>
			<p>
				Ship findings your team can actually act on in the language they read fastest — every rule
				title and every occurrence's summary and hint resolve from a key-based dictionary, with
				graceful per-string fallback to English rather than a blank or an error. Five languages
				ship today (English, French, German, Spanish, Japanese), and a result always tells you exactly which
				locale it used, so nothing silently degrades without you knowing. See{" "}
				<a href="/configuration/locales/">Locales</a> for coverage and how to supply your own
				dictionary.
			</p>
		</>
	);
}
