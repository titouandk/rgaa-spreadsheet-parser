/**
 * Represents a parser that extracts audit data from a source.
 */
export abstract class Parser {
	abstract getPages(): Promise<Page[]>;
	abstract getCriteria(): Promise<Criterion[]>;
	abstract getMetadata(): Promise<Metadata>;
}

/**
 * Metadata of an audit.
 */
export interface Metadata {
	auditor: string;
	date: string;
	context: string;
	website: string;
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
	status: "NT" | "C" | "NC" | "NA";
	correctionInstructions: string;
	derogation: "N" | "D";
	derogationComment: string;
}
