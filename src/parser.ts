import type * as xlsx from "xlsx";
import { getCriteria, getMetadata, getPages } from "./parser-utils-4-1-2";
import type { Criterion, Metadata, Page } from "./types";

export class Parser {
	protected _workbook: xlsx.WorkBook;

	constructor(workbook: xlsx.WorkBook) {
		this._workbook = workbook;
	}

	getPages(): Page[] {
		return [];
	}

	getCriteria(): Criterion[] {
		return [];
	}

	getMetadata(): Metadata {
		return {
			auditor: "",
			date: "",
			context: "",
			website: "",
			rgaaVersion: "",
		};
	}
}

export class Parser_4 extends Parser {
	getMetadata(): Metadata {
		return getMetadata(this._workbook);
	}

	getPages(): Page[] {
		return getPages(this._workbook);
	}

	getCriteria(): Criterion[] {
		return getCriteria(this._workbook);
	}
}

export class Parser_4_1 extends Parser_4 {}

export class Parser_4_1_1 extends Parser_4_1 {}

export class Parser_4_1_2 extends Parser_4_1 {}
