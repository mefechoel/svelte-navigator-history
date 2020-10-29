import { HistoryLocation, To } from "./types";

export const substr = (str: string, start: number, end?: number): string =>
	str.substr(start, end);

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
	return location.pathname + location.search + location.hash;
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
