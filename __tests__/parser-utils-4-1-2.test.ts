import { beforeEach, describe, expect, test } from "@jest/globals";
import * as xlsx from "xlsx";
import { getMetadata, getPages } from "../src/parser-utils-4-1-2";

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
