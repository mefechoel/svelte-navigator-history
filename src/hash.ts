import {
	addListener,
	assertGoArgs,
	assertPushReplaceArgs,
	getPathString,
	parsePath,
	POP,
	PUSH,
	REPLACE,
	stringifyPath,
	substr,
} from "./util";
import createNavigate from "./navigate";
import {
	createHistoryContainer,
	createState,
	getBrowserStateAndKey,
} from "./shared";
import type { CreateHref, HistoryActions, HashHistory } from "./types";
import HistoryType from "./HistoryType";
import {
	HISTORY_GO_DELTA_IS_INT,
	HISTORY_GO_DELTA_IS_NUM,
	HISTORY_PUSH_URI_IS_STRING,
	HISTORY_PUSH_URI_STARTS_WITH_SLASH,
	HISTORY_REPLACE_URI_IS_STRING,
	HISTORY_REPLACE_URI_STARTS_WITH_SLASH,
} from "./errorCodes";

export interface HashHistoryOptions {
	window?: Window;
}

/**
 * Use the hash fragment of the url to simulate routing via url.
 * This approach is great if you want to get started quickly or if
 * you don't have access to your server's configuration.
 *
 * @param {HashHistoryOptions} [options] Supply a custom window object
 *
 * @returns {HashHistory} The history object
 */
export default function createHashHistory<State = unknown>({
	window = document.defaultView as Window,
}: HashHistoryOptions = {}): HashHistory<State> {
	const { history, location } = window;

	const getHashPath = () => substr(location.hash, 1);

	const getHashLocation = () => ({
		...parsePath(getHashPath()),
		...getBrowserStateAndKey<State>(history),
	});

	const {
		subscribe,
		set: setState,
		getAction,
		getLocation,
	} = createHistoryContainer<State>({ initialLocation: getHashLocation() });

	const popstateListener = () => setState(getHashLocation(), POP);
	const popstateUnlisten = addListener(window, "popstate", popstateListener);
	const hashchangeUnlisten = addListener(window, "hashchange", () => {
		// Ignore extraneous hashchange events.
		if (getHashPath() !== stringifyPath(getLocation())) {
			popstateListener();
		}
	});

	const createHref: CreateHref = (to) => `#${getPathString(to)}`;

	const actions: HistoryActions<State> = {
		push(uri, state) {
			assertPushReplaceArgs(
				uri,
				HISTORY_PUSH_URI_IS_STRING,
				HISTORY_PUSH_URI_STARTS_WITH_SLASH,
			);
			const fullUri = createHref(uri);
			// try...catch iOS Safari limits to 100 pushState calls
			try {
				history.pushState(createState(state), "", fullUri);
			} catch (e) {
				location.assign(fullUri);
			}
			setState(getHashLocation(), PUSH);
		},
		replace(uri, state) {
			assertPushReplaceArgs(
				uri,
				HISTORY_REPLACE_URI_IS_STRING,
				HISTORY_REPLACE_URI_STARTS_WITH_SLASH,
			);
			history.replaceState(createState(state), "", createHref(uri));
			setState(getHashLocation(), REPLACE);
		},
		go(delta) {
			assertGoArgs(delta, HISTORY_GO_DELTA_IS_NUM, HISTORY_GO_DELTA_IS_INT);
			history.go(delta);
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
		createHref,
		navigate: createNavigate(actions),
		release() {
			popstateUnlisten();
			hashchangeUnlisten();
		},
		...actions,
		[HistoryType]: "hash",
	};
}
