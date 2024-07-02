import fs from "node:fs";
import * as xlsx from "xlsx";
import { getCriteria, getMetadata, getPages } from "./parser-utils-4-1-2";
import type { Audit, Criterion, Metadata, Page } from "./types";

/**
 * This function parses an RGAA audit spreadsheet, returning the audit data.
 */
export async function parseRgaaSpreadsheet({
	rgaaVersion,
	spreadsheetPath,
}: {
	rgaaVersion: string;
	spreadsheetPath: string;
}): Promise<Audit> {
	const parser = await createParser(rgaaVersion, spreadsheetPath);
	return {
		metadata: parser.getMetadata(),
		pages: parser.getPages(),
		criteria: parser.getCriteria(),
	};
}

async function createParser(
	spreadsheetRgaaVersion: string,
	spreadsheetPath: string,
): Promise<Parser> {
	const file = await fs.promises.readFile(spreadsheetPath);
	const workbook = xlsx.read(file);

	switch (spreadsheetRgaaVersion) {
		case "4.1.2":
			return new Parser_4_1_2(workbook);
		default:
			throw new Error(`Unsupported RGAA version: ${spreadsheetRgaaVersion}`);
	}
}

class Parser {
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

class Parser_4 extends Parser {
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

class Parser_4_1 extends Parser_4 {}

class Parser_4_1_1 extends Parser_4_1 {}

class Parser_4_1_2 extends Parser_4_1 {}
