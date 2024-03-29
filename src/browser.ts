import {
	addListener,
	assertGoArgs,
	assertPushReplaceArgs,
	getPathString,
	POP,
	PUSH,
	REPLACE,
} from "./util";
import createNavigate from "./navigate";
import {
	createHistoryContainer,
	createState,
	getBrowserStateAndKey,
} from "./shared";
import type { HistoryActions, BrowserHistory } from "./types";
import HistoryType from "./HistoryType";
import {
	BROWSER_HISTORY_NEEDS_DOCUMENT,
	HISTORY_GO_DELTA_IS_INT,
	HISTORY_GO_DELTA_IS_NUM,
	HISTORY_PUSH_URI_IS_STRING,
	HISTORY_PUSH_URI_STARTS_WITH_SLASH,
	HISTORY_REPLACE_URI_IS_STRING,
	HISTORY_REPLACE_URI_STARTS_WITH_SLASH,
} from "./errorCodes";
import invariant from "./invariant";

export interface BrowserHistoryOptions {
	window?: Window;
}

/**
 * Use the HTML5 History API to store app loaction and state in the url.
 * This is probably the best choice for most apps, as it enables best ceo
 * possibilities and is probably most intuitive.
 * This setup however needs some additional work because you need to
 * configure your server to always serve your index.html file when a
 * request doesn't match a file.
 * You can read more about it in [vue-routers docs about history routing](
 * https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations).
 *
 * @param {BrowserHistoryOptions} [options] Supply a custom window object
 *
 * @returns {BrowserHistory} The history object
 */
export default function createBrowserHistory<State = unknown>({
	window: windowArg,
}: BrowserHistoryOptions = {}): BrowserHistory<State> {
	invariant(typeof document === "undefined", BROWSER_HISTORY_NEEDS_DOCUMENT);

	const window = windowArg || (document.defaultView as Window);
	const { history, location } = window;

	const getBrowserLocation = () => {
		const { pathname, search, hash } = location;
		return {
			pathname: encodeURI(decodeURI(pathname)),
			search,
			hash,
			...getBrowserStateAndKey<State>(history),
		};
	};

	const {
		subscribe,
		set: setState,
		getAction,
		getLocation,
	} = createHistoryContainer<State>(getBrowserLocation());

	const popstateUnlisten = addListener(window, "popstate", () =>
		setState(getBrowserLocation(), POP),
	);

	const actions: HistoryActions<State> = {
		push(uri, state) {
			assertPushReplaceArgs(
				uri,
				HISTORY_PUSH_URI_IS_STRING,
				HISTORY_PUSH_URI_STARTS_WITH_SLASH,
			);
			// try...catch iOS Safari limits to 100 pushState calls
			try {
				history.pushState(createState(state), "", uri);
			} catch (e) {
				location.assign(uri);
			}
			setState(getBrowserLocation(), PUSH);
		},
		replace(uri, state) {
			assertPushReplaceArgs(
				uri,
				HISTORY_REPLACE_URI_IS_STRING,
				HISTORY_REPLACE_URI_STARTS_WITH_SLASH,
			);
			history.replaceState(createState(state), "", uri);
			setState(getBrowserLocation(), REPLACE);
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
		createHref: getPathString,
		navigate: createNavigate(actions),
		release: popstateUnlisten,
		...actions,
		[HistoryType]: "browser",
	};
}
