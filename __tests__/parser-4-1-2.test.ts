import { beforeEach, describe, expect, test } from "@jest/globals";
import { createParser, parseRgaaSpreadsheet } from "../src/parser";

const nbCriteriaPerPage = 106;

describe("getMetadata", () => {
	test('should throw an error if the workbook does not contain the "Échantillon" sheet', async () => {
		expect(async () => {
			const audit = await parseRgaaSpreadsheet({
				rgaaVersion: "4.1.2",
				filepath: "test-data/rgaa-4-1-2/010-echantillon-sheet-missing.ods",
			});
		}).rejects.toThrowError('Missing "Échantillon" sheet in the workbook');
	});

	test("should return empty strings for missing metadata", async () => {
		const audit = await parseRgaaSpreadsheet({
			rgaaVersion: "4.1.2",
			filepath:
				"test-data/rgaa-4-1-2/020-echantillon-sheet-missing-metadata.ods",
		});

		expect(audit.metadata).toEqual({
			rgaaVersion: "",
			auditor: "",
			date: "",
			context: "",
			website: "",
		});
	});

	test("should return the metadata from the workbook", async () => {
		const audit = await parseRgaaSpreadsheet({
			rgaaVersion: "4.1.2",
			filepath: "test-data/rgaa-4-1-2/030-echantillon-sheet-valid-metadata.ods",
		});

		expect(audit.metadata).toEqual({
			rgaaVersion: "4.1.1" /* error in the official RGAA 4.1.2 spreadsheet */,
			auditor: "DUPONT Jean",
			date: "01/06/2024",
			context: "Visite initiale",
			website: "www.site.fr",
		});
	});
});

describe("getPages", () => {
	test('should not be sensitive to empty header rows in the "Échantillon" sheet', async () => {
		const audit = await parseRgaaSpreadsheet({
			rgaaVersion: "4.1.2",
			filepath:
				"test-data/rgaa-4-1-2/040-echantillon-sheet-empty-header-rows.ods",
		});

		expect(audit.pages).toEqual([
			{
				id: "P01",
				title: "Accueil",
				url: "http://www.site.fr/accueil.html",
			},
			{
				id: "P02",
				title: "Authentification",
				url: "http://www.site.fr/authentification.html",
			},
			{
				id: "P03",
				title: "Contact",
				url: "http://www.site.fr/contact.html",
			},
		]);
	});

	test("should return only the pages that have an id, and either a title or a URL", async () => {
		const audit = await parseRgaaSpreadsheet({
			rgaaVersion: "4.1.2",
			filepath: "test-data/rgaa-4-1-2/050-echantillon-sheet-page-list.ods",
		});

		expect(audit.pages).toEqual([
			{
				id: "P01",
				title: "Accueil",
				url: "http://www.site.fr/accueil.html",
			},
			// Page 2 has no title nor URL, it should not be included
			{
				id: "P03",
				title: "Contact",
				url: "",
			},
			{
				id: "P04",
				title: "",
				url: "http://www.site.fr/authentification.html",
			},
			{
				id: "P05",
				title: "Multiline title",
				url: "",
			},
			{
				id: "P06",
				title: "",
				url: "http://www.site.fr/multiline-url.html",
			},
		]);
	});
});

describe("getCriteria", () => {
	test("should throw an error if a sheet is missing for a page", async () => {
		expect(async () => {
			const audit = await parseRgaaSpreadsheet({
				rgaaVersion: "4.1.2",
				filepath: "test-data/rgaa-4-1-2/060-page-sheet-missing.ods",
			});
		}).rejects.toThrowError('Missing sheet for page "P02" in the spreadsheet');
	});

	test("should not be sensitive to empty header rows in a sheet", async () => {
		const parser = await createParser(
			"4.1.2",
			"test-data/rgaa-4-1-2/070-page-sheet-empty-header-rows.ods",
		);
		const criteria = parser.getCriteria();

		expect(criteria.length).toEqual(nbCriteriaPerPage);

		expect(criteria[0]?.topicId).toEqual(1);
		expect(criteria[0]?.id).toEqual(1);

		expect(criteria[nbCriteriaPerPage - 1]?.topicId).toEqual(13);
		expect(criteria[nbCriteriaPerPage - 1]?.id).toEqual(12);
	});

	test("should return all criteria from a spreadsheet", async () => {
		const parser = await createParser(
			"4.1.2",
			"test-data/rgaa-4-1-2/080-valid-criteria.ods",
		);
		const criteria = parser.getCriteria();

		/*
		 * Test if the number of criteria is correct
		 */
		expect(criteria.length).toEqual(20 * nbCriteriaPerPage);

		/*
		 * Test the values of some criteria
		 */

		expect(criteria[0]).toEqual({
			pageId: "P01",
			topicId: 1,
			id: 1,
			status: "C",
			correctionInstructions:
				"P01, topic 1, criterion 1, correction instructions, line 1.\n\nP01, topic 1, criterion 1, correction instructions, line 3.",
			derogation: "N",
			derogationComment:
				"P01, topic 1, criterion 1, derogation comment, line 1.\n\nP01, topic 1, criterion 1, derogation comment, line 3.",
		});

		expect(criteria[1]).toEqual({
			pageId: "P01",
			topicId: 1,
			id: 2,
			status: "NC",
			correctionInstructions:
				"P01, topic 1, criterion 2, correction instructions, line 1.\n\nP01, topic 1, criterion 2, correction instructions, line 3.",
			derogation: "N",
			derogationComment:
				"P01, topic 1, criterion 2, derogation comment, line 1.\n\nP01, topic 1, criterion 2, derogation comment, line 3.",
		});

		expect(criteria[2]).toEqual({
			pageId: "P01",
			topicId: 1,
			id: 3,
			status: "NC",
			correctionInstructions:
				"P01, topic 1, criterion 3, correction instructions, line 1.\n\nP01, topic 1, criterion 3, correction instructions, line 3.",
			derogation: "D",
			derogationComment:
				"P01, topic 1, criterion 3, derogation comment, line 1.\n\nP01, topic 1, criterion 3, derogation comment, line 3.",
		});

		expect(criteria[3]).toEqual({
			pageId: "P01",
			topicId: 1,
			id: 4,
			status: "NT",
			correctionInstructions:
				"P01, topic 1, criterion 4, correction instructions, line 1.\n\nP01, topic 1, criterion 4, correction instructions, line 3.",
			derogation: "N",
			derogationComment:
				"P01, topic 1, criterion 4, derogation comment, line 1.\n\nP01, topic 1, criterion 4, derogation comment, line 3.",
		});

		expect(criteria[nbCriteriaPerPage - 1]).toEqual({
			pageId: "P01",
			topicId: 13,
			id: 12,
			status: "NT",
			correctionInstructions:
				"P01, topic 13, criterion 12, correction instructions, line 1.\n\nP01, topic 13, criterion 12, correction instructions, line 3.",
			derogation: "N",
			derogationComment:
				"P01, topic 13, criterion 12, derogation comment, line 1.\n\nP01, topic 13, criterion 12, derogation comment, line 3.",
		});

		expect(criteria[nbCriteriaPerPage * 19]).toEqual({
			pageId: "P20",
			topicId: 1,
			id: 1,
			status: "NT",
			correctionInstructions:
				"P20, topic 1, criterion 1, correction instructions, line 1.\n\nP20, topic 1, criterion 1, correction instructions, line 3.",
			derogation: "N",
			derogationComment:
				"P20, topic 1, criterion 1, derogation comment, line 1.\n\nP20, topic 1, criterion 1, derogation comment, line 3.",
		});

		expect(criteria[nbCriteriaPerPage * 20 - 1]).toEqual({
			pageId: "P20",
			topicId: 13,
			id: 12,
			status: "NC",
			correctionInstructions:
				"P20, topic 13, criterion 12, correction instructions, line 1.\n\nP20, topic 13, criterion 12, correction instructions, line 3.",
			derogation: "N",
			derogationComment: "",
		});
	});

	test("should throw an error if a topic id is invalid", async () => {
		const parser = await createParser(
			"4.1.2",
			"test-data/rgaa-4-1-2/090-invalid-topic-id-number.ods",
		);

		expect(() => parser.getCriteria()).toThrowError(
			'Topic id should be contained in a string formated as "topicX.criterionY"',
		);
	});

	test("should throw an error if a criterion id is invalid", async () => {
		// 100-invalid-criterion-id-number.ods
		const parser = await createParser(
			"4.1.2",
			"test-data/rgaa-4-1-2/100-invalid-criterion-id-number.ods",
		);

		expect(() => parser.getCriteria()).toThrowError(
			'Cannot parse criterion id from string "1.A"',
		);
	});

	test("should throw an error if the status of a criterion is invalid", async () => {
		const parser = await createParser(
			"4.1.2",
			"test-data/rgaa-4-1-2/110-invalid-criterion-status.ods",
		);

		expect(() => parser.getCriteria()).toThrowError(
			'Invalid criterion status "X"',
		);
	});

	test("should throw an error if the derogation flag of a criterion is invalid", async () => {
		const parser = await createParser(
			"4.1.2",
			"test-data/rgaa-4-1-2/120-invalid-criterion-derogation-flag.ods",
		);

		expect(() => parser.getCriteria()).toThrowError(
			'Invalid criterion derogation "X"',
		);
	});
});
