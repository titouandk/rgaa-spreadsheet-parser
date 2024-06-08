/**
 * Represents a parser that extracts audit data from a source.
 */
export abstract class Parser {
	abstract getPages(): Promise<Page[]>;
	abstract getCriteria(): Promise<Criterion[]>;
	abstract getInfo(): Promise<Info>;
}

/**
 * Metadata of a page.
 */
export interface Page {
	id: string;
	title: string;
	url: string;
}

/**
 * Audit result of a criterion.
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

/**
 * Metadata of an audit.
 */
export interface Info {
	auditor: string;
	date: string;
	context: string;
	website: string;
}
