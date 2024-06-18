import isString from "lodash/isString";

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
