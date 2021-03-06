import {
	PARSE_PATH_STARTS_WITH_SLASH,
	PARSE_PATH_TYPE,
	STRINGIFY_PATH_TYPE,
} from "./errorCodes";
import invariant from "./invariant";
import type { HistoryLocation, To } from "./types";

export const substr = (str: string, start: number, end?: number): string =>
	str.substr(start, end);

export const startsWith = (str: string, start: string): boolean =>
	substr(str, 0, 1) === start;

/**
 * Create a globally unique id
 *
 * @returns An id
 */
export const createGlobalId = (): string =>
	substr(Math.random().toString(36), 2);

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

export const isString = (maybeStr: unknown): maybeStr is string =>
	typeof maybeStr === "string";

export const isNumber = (maybeNum: unknown): maybeNum is number =>
	typeof maybeNum === "number";

const normalizeUrlFragment = (frag: string): string =>
	frag.length === 1 ? "" : frag;

/**
 * Creates a location object from an url.
 * It is used to create a location from the url prop used in SSR
 *
 * @param {string} url The url string (e.g. "/path/to/somewhere")
 * @returns {HistoryLocation} The location
 *
 * @example
 * ```js
 * const path = "/search?q=falafel#result-3";
 * const location = parsePath(path);
 * // -> {
 * //   pathname: "/search",
 * //   search: "?q=falafel",
 * //   hash: "#result-3",
 * // };
 * ```
 */
export const parsePath = (path: string): HistoryLocation => {
	invariant(
		!isString(path),
		PARSE_PATH_TYPE,
		process.env.NODE_ENV !== "production" && typeof path,
	);
	invariant(
		path !== "" &&
			!startsWith(path, "/") &&
			!startsWith(path, "?") &&
			!startsWith(path, "#"),
		PARSE_PATH_STARTS_WITH_SLASH,
		process.env.NODE_ENV !== "production" && path,
	);

	const searchIndex = path.indexOf("?");
	const hashIndex = path.indexOf("#");
	const hasSearchIndex = searchIndex !== -1;
	const hasHashIndex = hashIndex !== -1;
	const hash = hasHashIndex
		? normalizeUrlFragment(substr(path, hashIndex))
		: "";
	const pathnameAndSearch = hasHashIndex ? substr(path, 0, hashIndex) : path;
	const search = hasSearchIndex
		? normalizeUrlFragment(substr(pathnameAndSearch, searchIndex))
		: "";
	const pathname =
		(hasSearchIndex
			? substr(pathnameAndSearch, 0, searchIndex)
			: pathnameAndSearch) || "/";
	return { pathname, search, hash };
};

/**
 * Joins a location object to one path string.
 *
 * @param {HistoryLocation} location The location object
 * @returns {string} A path, created from the location
 *
 * @example
 * ```js
 * const location = {
 *   pathname: "/search",
 *   search: "?q=falafel",
 *   hash: "#result-3",
 * };
 * const path = stringifyPath(location);
 * // -> "/search?q=falafel#result-3"
 * ```
 */
export const stringifyPath = (location: HistoryLocation): string => {
	const { pathname, search, hash } = location;
	invariant(
		!isString(pathname) || !isString(search) || !isString(hash),
		STRINGIFY_PATH_TYPE,
		process.env.NODE_ENV !== "production" && JSON.stringify(location),
	);
	return pathname + search + hash;
};

export const getPathString = (to: To): string =>
	isString(to) ? to : stringifyPath(to);

export const getPathObject = (to: To): HistoryLocation =>
	isString(to) ? parsePath(to) : to;

export const addListener = (
	target: EventTarget,
	type: string,
	handler: () => void,
): (() => void) => {
	target.addEventListener(type, handler);
	return () => target.removeEventListener(type, handler);
};

export const POP = "POP";
export const PUSH = "PUSH";
export const REPLACE = "REPLACE";

export const assertPushReplaceArgs = (
	uri: string,
	isStringId: number,
	startsWithSlashId: number,
): void => {
	invariant(
		!isString(uri),
		isStringId,
		process.env.NODE_ENV !== "production" && typeof uri,
	);
	invariant(
		!startsWith(uri, "/"),
		startsWithSlashId,
		process.env.NODE_ENV !== "production" && uri,
	);
};

export const assertGoArgs = (
	delta: number,
	deltaIsNumId: number,
	deltaIsIntId: number,
): void => {
	invariant(
		!isNumber(delta),
		deltaIsNumId,
		process.env.NODE_ENV !== "production" && typeof delta,
	);
	invariant(
		// `number | 0` => short variant of `Math.floor(number)`
		delta !== (delta | 0), // eslint-disable-line no-bitwise
		deltaIsIntId,
		process.env.NODE_ENV !== "production" && delta,
	);
};
