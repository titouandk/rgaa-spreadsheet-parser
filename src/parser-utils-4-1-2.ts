/*
 * This file contains the functions that are used to parse the data
 * from the .ods file. This functions handle the parsing of
 * RGAA 4.1.2 spreadsheets and above, until breaking changes are introduced.
 */

import * as xlsx from "xlsx";
import type { Criterion, Metadata, Page } from "./types";
import {
	parseCriterionDerogation,
	parseCriterionId,
	parseCriterionStatus,
	parseString,
	parseTopicId,
} from "./utils";

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
		range: 8 /* skip header rows */,
	});

	// trim the values
	const allPages = rawContent.map((page) => {
		return {
			id: page.id.trim(),
			title: page.title.trim(),
			url: page.url.trim(),
		};
	});

	// keep the pages that have an id, and either a title or a url
	const validPages = allPages.filter((page) => {
		return page.id !== "" && (page.title !== "" || page.url !== "");
	});

	return validPages;
}

type CriteriaRow = {
	topicTitle: unknown;
	criterionId: unknown;
	criterionTitle: unknown;
	status: unknown;
	correctionInstructions: unknown;
	derogation: unknown;
	derogationComment: unknown;
};

/**
 * Returns all criteria of all pages from the spreadsheet.
 * @param workbook A workbook object representing the content of the spreadsheet.
 * @returns The array of Criterion extracted from the spreadsheet.
 * @throws {Error} If the sheet for a page is missing in the workbook.
 */
export function getCriteria(workbook: xlsx.WorkBook): Criterion[] {
	const pagesToAudit = getPages(workbook);
	const criteria: Criterion[] = [];

	for (const page of pagesToAudit) {
		const sheet = workbook.Sheets[page.id];

		if (!sheet) {
			throw new Error(`Missing sheet for page "${page.id}" in the spreadsheet`);
		}

		const rows = xlsx.utils.sheet_to_json<CriteriaRow>(sheet, {
			header: [
				"topicTitle",
				"criterionId",
				"criterionTitle",
				"status",
				"derogation",
				"correctionInstructions",
				"derogationComment",
			],
			defval: "",
			range: 3 /* skip header rows */,
		});

		for (const row of rows) {
			const topicId = parseTopicId(row.criterionId);
			const criterionId = parseCriterionId(row.criterionId);
			const criterionStatus = parseCriterionStatus(row.status);
			const correctionInstructions = parseString(row.correctionInstructions);
			const criterionDerogation = parseCriterionDerogation(row.derogation);
			const derogationComment = parseString(row.derogationComment);

			criteria.push({
				pageId: page.id,
				topicId: topicId,
				id: criterionId,
				status: criterionStatus,
				correctionInstructions: correctionInstructions,
				derogation: criterionDerogation,
				derogationComment: derogationComment,
			});
		}
	}

	return criteria;
}

/**
 * This function extracts the metadata from the "Échantillon" sheet of the workbook.
 * The metadata contains the RGAA version of the spreadsheet, the auditor, the audit date,
 * the context of the audit, and the audited website.
 * @param workbook A workbook object representing a RGAA 4.1.2 spreadsheet.
 * @returns Metadata extracted from the workbook.
 * @throws {Error} If the workbook does not contain the "Échantillon" sheet.
 */
export function getMetadata(workbook: xlsx.WorkBook): Metadata {
	const metadataSheet = workbook.Sheets.Échantillon;

	if (!metadataSheet) {
		throw new Error('Missing "Échantillon" sheet in the workbook');
	}

	// regexp extracting the version number ("RGAA 4.1.1 – GRILLE D'ÉVALUATION")
	const rgaaVersion =
		metadataSheet.A1?.v?.match(/RGAA (\d+\.\d+\.\d+)/)?.[1] || "";

	// date, auditor and context have the key and the value contained in the same cell,
	// separated by a colon
	const date = metadataSheet.A3?.v?.split(":")[1]?.trim() || "";
	const auditor = metadataSheet.A4?.v?.split(":")[1]?.trim() || "";
	const context = metadataSheet.A5?.v?.split(":")[1]?.trim() || "";

	// website has the key and the value contained in 2 different cells
	// no need to split the value, as it is already in the B6 cell.
	const website = metadataSheet.B6?.v || "";

	const metadata = {
		rgaaVersion,
		auditor,
		date,
		context,
		website,
	};

	return metadata;
}
