export const NAVIGATE_TO_TYPE = 0;
export const NAVIGATE_STARTS_WITH_SLASH = 1;
export const PARSE_PATH_TYPE = 2;
export const PARSE_PATH_STARTS_WITH_SLASH = 3;
export const STRINGIFY_PATH_TYPE = 4;

export const errorMessages: { [key: number]: string } = {
	[NAVIGATE_TO_TYPE]:
		"First argument to `navigate` is expected to be a string or a number.",
	[NAVIGATE_STARTS_WITH_SLASH]:
		'First argument to `navigate` must start with "/", "?" or "#".',
	[PARSE_PATH_TYPE]:
		"First argument to `parsePath` is expected to be a string.",
	[PARSE_PATH_STARTS_WITH_SLASH]:
		'First argument to `parsePath` must start with "/", "?" or "#".',
	[STRINGIFY_PATH_TYPE]:
		"First argument to `stringifyPath` is expected to be a location object " +
		"with `pathname`, `search` and `hash` properties of type string.",
};
