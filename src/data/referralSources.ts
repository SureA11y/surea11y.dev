export interface ReferralSource {
	/** URL segment: /from/<id>/ */
	id: string;
	/** Where the browser lands after the redirect. */
	target: string;
}

export const referralSources: ReferralSource[] = [
	{ id: "headingsmap", target: "/" },
];
