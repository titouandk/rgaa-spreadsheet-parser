import isString from "lodash/isString";

export function parseTopicId(value: unknown): number {
	if (Number.isFinite(value)) {
		value = (value as number).toString();
	}

	if (!isString(value)) {
		throw new Error("Invalid topic id");
	}

	/* For the moment, TypeScript forgets that the type of a variable
	 * has been narrowed down after a reassignment of the variable.
	 * We create duplicates of the variables each time the type changes.
	 * https://github.com/microsoft/TypeScript/issues/27706
	 */
	const valueAsString = value.split(".")[0];
	const valueAsNumber = Number.parseInt(valueAsString);

	if (!Number.isFinite(valueAsNumber)) {
		throw new Error(`Cannot parse topic id from value "${value}"`);
	}

	return valueAsNumber;
}
