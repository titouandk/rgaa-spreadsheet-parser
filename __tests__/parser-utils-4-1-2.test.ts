import { beforeEach, describe, expect, test } from "@jest/globals";
import * as xlsx from "xlsx";
import { getCriteria, getMetadata, getPages } from "../src/parser-utils-4-1-2";

const nbCriteriaPerPage = 106;

describe("getMetadata", () => {
	test('should throw an error if the workbook does not contain the "Échantillon" sheet', () => {
		const workbook = xlsx.readFile(
			"test-data/rgaa-4-1-2/01-missing-echantillon-sheet.ods",
		);

		expect(() => getMetadata(workbook)).toThrowError(
			'Missing "Échantillon" sheet in the workbook',
		);
	});

	test("should return empty strings for missing metadata", () => {
		const workbook = xlsx.readFile(
			"test-data/rgaa-4-1-2/02-missing-metadata.ods",
		);
		const metadata = getMetadata(workbook);

		expect(metadata).toEqual({
			rgaaVersion: "",
			auditor: "",
			date: "",
			context: "",
			website: "",
		});
	});

	test("should return the metadata from the workbook", () => {
		const workbook = xlsx.readFile(
			"test-data/rgaa-4-1-2/03-valid-metadata.ods",
		);
		const metadata = getMetadata(workbook);

		expect(metadata).toEqual({
			rgaaVersion: "4.1.1" /* error in the official RGAA 4.1.2 spreadsheet */,
			auditor: "DUPONT Jean",
			date: "01/06/2024",
			context: "Visite initiale",
			website: "www.site.fr",
		});
	});
});

describe("getPages", () => {
	test('should not be sensitive to empty header rows in the "Échantillon" sheet', () => {
		const workbook = xlsx.readFile("test-data/rgaa-4-1-2/tmp.ods");
		const pages = getPages(workbook);

		expect(pages).toEqual([
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

	test("should return only the pages that have an id, and either a title or a URL", () => {
		const workbook = xlsx.readFile("test-data/rgaa-4-1-2/04-pages.ods");
		const pages = getPages(workbook);

		expect(pages).toEqual([
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
	test("should throw an error if a sheet is missing for a page", () => {
		const workbook = xlsx.readFile("test-data/rgaa-4-1-2/05-missing-page.ods");

		expect(() => getCriteria(workbook)).toThrowError(
			'Missing sheet for page "P02" in the spreadsheet',
		);
	});

	test("should not be sensitive to empty header rows in a sheet", () => {
		const workbook = xlsx.readFile(
			"test-data/rgaa-4-1-2/06-missing-page-header.ods",
		);

		const criteria = getCriteria(workbook);

		expect(criteria.length).toEqual(nbCriteriaPerPage);

		expect(criteria[0]?.topicId).toEqual(1);
		expect(criteria[0]?.id).toEqual(1);

		expect(criteria[nbCriteriaPerPage - 1]?.topicId).toEqual(13);
		expect(criteria[nbCriteriaPerPage - 1]?.id).toEqual(12);
	});
});
