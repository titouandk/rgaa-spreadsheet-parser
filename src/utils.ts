import isString from "lodash/isString";
import type { CriterionDerogation, CriterionStatus } from "./types";

export function parseTopicId(value: unknown): number {
	if (!isString(value)) {
		throw new Error(
			'Topic id should be contained in a string formated as "topicX.criterionY"',
		);
	}

	/* For the moment, TypeScript forgets that the type of a variable
	 * has been narrowed down after a reassignment of the variable.
	 * We create duplicates of the variables each time the type changes.
	 * https://github.com/microsoft/TypeScript/issues/27706
	 */
	const parsedValueAsString = value.split(".")[0];
	const parsedValueAsNumber = Number.parseInt(parsedValueAsString);

	if (!Number.isInteger(parsedValueAsNumber)) {
		throw new Error(`Cannot parse topic id from string "${value}"`);
	}

	return parsedValueAsNumber;
}

export function parseCriterionId(value: unknown) {
	if (!isString(value)) {
		throw new Error(
			'Criterion id should be contained in a string formated as "topicX.criterionY"',
		);
	}

	/* For the moment, TypeScript forgets that the type of a variable
	 * has been narrowed down after a reassignment of the variable.
	 * We create duplicates of the variables each time the type changes.
	 * https://github.com/microsoft/TypeScript/issues/27706
	 */
	const parsedValueAsString = value.split(".")[1];
	const parsedValueAsNumber = Number.parseInt(parsedValueAsString);

	if (!Number.isInteger(parsedValueAsNumber)) {
		throw new Error(`Cannot parse criterion id from string "${value}"`);
	}

	return parsedValueAsNumber;
}

export function parseCriterionStatus(value: unknown): CriterionStatus {
	if (!isString(value)) {
		throw new Error("Criterion status should be a string");
	}

	const criterionStatus = value.toUpperCase();

	if (!isCriterionStatus(criterionStatus)) {
		throw new Error(`Invalid criterion status "${criterionStatus}"`);
	}

	return criterionStatus;
}

export function isCriterionStatus(value: unknown): value is CriterionStatus {
	return (
		isString(value) && ["NT", "C", "NC", "NA"].includes(value.toUpperCase())
	);
}

export function parseCriterionDerogation(value: unknown) {
	if (!isString(value)) {
		throw new Error("Criterion derogation should be a string");
	}

	const criterionDerogation = value.toUpperCase();

	if (!isCriterionDerogation(criterionDerogation)) {
		throw new Error(`Invalid criterion derogation "${criterionDerogation}"`);
	}

	return criterionDerogation;
}

export function isCriterionDerogation(
	value: unknown,
): value is CriterionDerogation {
	return isString(value) && ["N", "D"].includes(value.toUpperCase());
}

export function parseString(value: unknown): string {
	if (!isString(value)) {
		throw new Error("Value should be a string");
	}

	return value;
}
