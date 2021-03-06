import {
	assertGoArgs,
	assertPushReplaceArgs,
	getPathObject,
	getPathString,
	isString,
	noop,
	POP,
	PUSH,
	REPLACE,
} from "./util";
import createNavigate from "./navigate";
import { createHistoryContainer, createState } from "./shared";
import type {
	HistoryActions,
	MemoryHistory,
	NavigatorLocation,
	To,
} from "./types";
import HistoryType from "./HistoryType";
import {
	HISTORY_GO_DELTA_IS_INT,
	HISTORY_GO_DELTA_IS_NUM,
	HISTORY_PUSH_URI_IS_STRING,
	HISTORY_PUSH_URI_STARTS_WITH_SLASH,
	HISTORY_REPLACE_URI_IS_STRING,
	HISTORY_REPLACE_URI_STARTS_WITH_SLASH,
} from "./errorCodes";

interface MemoryHistoryObjectOptions {
	initialEntries?: To[];
	initialIndex?: number;
}

export type MemoryHistoryOptions = MemoryHistoryObjectOptions | string;

const createStackFrame = <State = unknown>(
	to: To,
	state?: State | null,
): NavigatorLocation<State> => {
	const { value, key } = createState(state);
	return { state: value, key, ...getPathObject(to) };
};

export function createMemoryHistory<State = unknown>(
	options?: MemoryHistoryObjectOptions,
): MemoryHistory<State>;
export function createMemoryHistory<State = unknown>(
	initialPath?: string,
): MemoryHistory<State>;

/**
 * Keep the location state of your app in memory.
 * This is mainly useful for testing if you don't run your tests
 * in a browser.
 * You could also use a memory history if you want to controll the
 * state of a widget you embed in another app using a router.
 *
 * @param {MemoryHistoryOptions} [options] Supply initial entries for
 * the history stack
 *
 * @returns {MemoryHistory} The history object
 */
export default function createMemoryHistory<State = unknown>(
	options?: MemoryHistoryOptions,
): MemoryHistory<State> {
	const initialEntries = isString(options)
		? [options]
		: (options && options.initialEntries) || ["/"];
	const initialIndex = isString(options)
		? 0
		: (options && options.initialIndex) || 0;

	let index: number = initialIndex;
	let stack: NavigatorLocation<State>[] = initialEntries.map((to) =>
		createStackFrame<State>(to, null),
	);

	const getMemoryLocation = () => stack[index];

	const {
		subscribe,
		set: setState,
		getAction,
		getLocation,
	} = createHistoryContainer<State>(getMemoryLocation());

	const actions: HistoryActions<State> = {
		push(uri, state) {
			assertPushReplaceArgs(
				uri,
				HISTORY_PUSH_URI_IS_STRING,
				HISTORY_PUSH_URI_STARTS_WITH_SLASH,
			);
			// eslint-disable-next-line no-plusplus
			index++;
			// Throw away anything in the stack with an index greater than the current index.
			// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
			// If we call `go(+n)` the stack entries with an index greater than the current index can
			// be reused.
			// However, if we navigate to a path, instead of a number, we want to create a new branch
			// of navigation.
			stack = stack.slice(0, index);
			stack.push(createStackFrame(uri, state));
			setState(getMemoryLocation(), PUSH);
		},
		replace(uri, state) {
			assertPushReplaceArgs(
				uri,
				HISTORY_REPLACE_URI_IS_STRING,
				HISTORY_REPLACE_URI_STARTS_WITH_SLASH,
			);
			stack[index] = createStackFrame(uri, state);
			setState(getMemoryLocation(), REPLACE);
		},
		go(delta) {
			assertGoArgs(delta, HISTORY_GO_DELTA_IS_NUM, HISTORY_GO_DELTA_IS_INT);
			const newIndex = index + delta;
			if (newIndex < 0 || newIndex > stack.length - 1) {
				return;
			}
			index = newIndex;
			setState(getMemoryLocation(), POP);
		},
	};

	return {
		get location() {
			return getLocation();
		},
		get action() {
			return getAction();
		},
		subscribe,
		createHref: getPathString,
		navigate: createNavigate(actions),
		release: noop,
		...actions,
		[HistoryType]: "memory",
	};
}
