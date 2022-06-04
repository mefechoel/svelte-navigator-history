export const NAVIGATE_TO_TYPE = 0;
export const NAVIGATE_GO_TO_IS_INT = 1;
export const NAVIGATE_STARTS_WITH_SLASH = 2;
export const PARSE_PATH_TYPE = 3;
export const PARSE_PATH_STARTS_WITH_SLASH = 4;
export const STRINGIFY_PATH_TYPE = 5;
export const HISTORY_PUSH_URI_IS_STRING = 6;
export const HISTORY_PUSH_URI_STARTS_WITH_SLASH = 7;
export const HISTORY_REPLACE_URI_IS_STRING = 8;
export const HISTORY_REPLACE_URI_STARTS_WITH_SLASH = 9;
export const HISTORY_GO_DELTA_IS_NUM = 10;
export const HISTORY_GO_DELTA_IS_INT = 11;
export const BROWSER_HISTORY_NEEDS_DOCUMENT = 12;
export const HASH_HISTORY_NEEDS_DOCUMENT = 13;

export const errorMessages: { [key: number]: string } = {
	[NAVIGATE_TO_TYPE]:
		"`<navigate>` First argument is expected to be a string or a number.\n" +
		"`history.navigate` was called with an incorrect type. Make sure to " +
		"only call it with values of type string or number.",
	[NAVIGATE_GO_TO_IS_INT]:
		"`<navigate>` When supplying a number, the first argument is expected to " +
		"be a whole number.",
	[NAVIGATE_STARTS_WITH_SLASH]:
		'`<navigate>` First argument must start with "/".\n' +
		"Calling `history.navigate` with relative paths is not supported. Make " +
		"sure to call it with absolute paths only." +
		"Search/hash only navigation is also not supported.",
	[PARSE_PATH_TYPE]: "`<parsePath>` First argument is expected to be a string.",
	[PARSE_PATH_STARTS_WITH_SLASH]:
		'`<parsePath>` First argument must start with "/", "?" or "#".\n' +
		"`parsePath` can only parse absolute paths. For search or hash only " +
		'paths a pathname of `"/"` will be asumed.',
	[STRINGIFY_PATH_TYPE]:
		"`<stringifyPath>` First argument is expected to be a location object " +
		"with `pathname`, `search` and `hash` properties of type string.\n" +
		"`stringifyPath` can only join full location objects to path strings. " +
		'Sample location objects: `{ pathname: "/about", search: "", hash: "" }`, ' +
		'`{ pathname: "/search", search: "?q=falafel", hash: "#result-3" }`',
	[HISTORY_PUSH_URI_IS_STRING]:
		"`<History.push>` First argument is expected to be a string.",
	[HISTORY_PUSH_URI_STARTS_WITH_SLASH]:
		'`<History.push>` First argument must start with "/".\n' +
		"Calling `history.push` with relative paths is not supported. Make " +
		"sure to call it with absolute paths only." +
		"Search/hash only navigation is also not supported.",
	[HISTORY_REPLACE_URI_IS_STRING]:
		"`<History.replace>` First argument is expected to be a string.",
	[HISTORY_REPLACE_URI_STARTS_WITH_SLASH]:
		'`<History.replace>` First argument must start with "/".\n' +
		"Calling `history.replace` with relative paths is not supported. Make " +
		"sure to call it with absolute paths only." +
		"Search/hash only navigation is also not supported.",
	[HISTORY_GO_DELTA_IS_NUM]:
		"`<History.go>` First argument is expected to be a number.",
	[HISTORY_GO_DELTA_IS_INT]:
		"`<History.go>` First argument is expected to be a whole number.",
	[BROWSER_HISTORY_NEEDS_DOCUMENT]:
		"`<createBrowserHistory>` The browser history can only be used in a " +
		"browser environment, but no `document` object could be found. " +
		"Are you trying to create the history in a test environment? If " +
		"so, consider using a different history, such as the memory or auto " +
		"history or emulate the browser environment with a library, such as " +
		"jsdom. If you're using the history in an SSR context, consider " +
		"using the auto history.",
	[HASH_HISTORY_NEEDS_DOCUMENT]:
		"`<createHashHistory>` The hash history can only be used in a " +
		"browser environment, but no `document` object could be found. " +
		"Are you trying to create the history in a test environment? If " +
		"so, consider using a different history, such as the memory or auto " +
		"history or emulate the browser environment with a library, such as " +
		"jsdom. If you're using the history in an SSR context, consider " +
		"using the auto history.",
};
