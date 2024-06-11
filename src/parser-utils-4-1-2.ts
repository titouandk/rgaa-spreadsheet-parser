/*
 * This file contains the functions that are used to parse the data
 * from the .ods file. This functions handle the parsing of
 * RGAA 4.1.2 spreadsheets and above, until breaking changes are introduced.
 */

import * as xlsx from "xlsx";
import type { Page } from "./types";

/**
 * A function that extracts the list of pages that were part of the "Sample" sheet.
 * The pages must have at least an id, and either a title or a url.
 * @param workbook A workbook object representing the content of the spreadsheet.
 * @returns An array of Page that were extracted from the spreadsheet.
 */
export function getPages(workbook: xlsx.WorkBook): Page[] {
	// get the "Échantillon" ("sample") sheet from the spreadsheet
	const sampleSheet = workbook.Sheets.Échantillon;

	// convert the sheet to a json object
	const rawContent = xlsx.utils.sheet_to_json<Page>(sampleSheet, {
		header: ["id", "title", "url"],
		defval: "",
	});

	// remove the header rows of the page
	const allPages = rawContent.slice(7);

	// keep the pages that have an id, and either a title or a url
	const validPages = allPages.filter((page) => {
		return page.id !== "" && (page.title !== "" || page.url !== "");
	});

	return validPages;
}
