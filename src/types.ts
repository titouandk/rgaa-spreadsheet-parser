/**
 * Represents a parser that extracts audit data from a source.
 */
export abstract class Parser {
	abstract getPages(): Promise<Page[]>;
	abstract getCriteria(): Promise<Criterion[]>;
}

/**
 * Represents metadata of an audited page.
 */
export interface Page {
	id: string;
	title: string;
	url: string;
}

/**
 * Represents the audit result of a criterion.
 */
export interface Criterion {
	pageId: string;
	topicId: number;
	id: number;
	status: "NT" | "C" | "NC" | "NA";
	statusExplanation: string;
	derogation: "N" | "D";
	derogationReason: string;
}
