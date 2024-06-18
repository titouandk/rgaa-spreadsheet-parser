/**
 * Metadata of an audit.
 */
export interface Metadata {
	auditor: string;
	date: string;
	context: string;
	website: string;
	// RGAA version is currently provided by the user. The extraction
	// is useless for now, but it could be useful in the futur, when
	// the parser will be able to auto-determine the version.
	rgaaVersion: string;
}

/**
 * Metadata of an audited page.
 */
export interface Page {
	id: string;
	title: string;
	url: string;
}

/**
 * The result of a criterion evaluation.
 */
export interface Criterion {
	pageId: string;
	topicId: number;
	id: number;
	status: CriterionStatus;
	correctionInstructions: string;
	derogation: "N" | "D";
	derogationComment: string;
}

export type CriterionStatus = "NT" | "C" | "NC" | "NA";
