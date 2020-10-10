import { addListener, getPathString } from "./util";
import createNavigate from "./navigate";
import {
	createHistoryContainer,
	createState,
	getBrowserStateAndKey,
} from "./shared";
import { Action, HistoryActions, NavigatorHistory } from "./types";

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
 * @returns {NavigatorHistory} The history object
 */
export default function createBrowserHistory<State = unknown>({
	window = document.defaultView as Window,
}: BrowserHistoryOptions = {}): NavigatorHistory<State> {
	const globalHistory = window.history;

	const getBrowserLocation = () => {
		const { pathname, search, hash } = window.location;
		return {
			pathname: encodeURI(decodeURI(pathname)),
			search,
			hash,
			...getBrowserStateAndKey<State>(window),
		};
	};

	const {
		listen,
		set: setState,
		getAction,
		getLocation,
	} = createHistoryContainer<State>({ initialLocation: getBrowserLocation() });

	const popstateUnlisten = addListener(window, "popstate", () =>
		setState(getBrowserLocation(), Action.Pop),
	);

	const actions: HistoryActions<State> = {
		push(uri, state) {
			try {
				globalHistory.pushState(createState(state), "", uri);
			} catch (e) {
				window.location.assign(uri);
			}
			setState(getBrowserLocation(), Action.Push);
		},
		replace(uri, state) {
			globalHistory.replaceState(createState(state), "", uri);
			setState(getBrowserLocation(), Action.Replace);
		},
		go(delta) {
			globalHistory.go(delta);
		},
	};

	return {
		get location() {
			return getLocation();
		},
		get action() {
			return getAction();
		},
		listen,
		createHref: getPathString,
		navigate: createNavigate(actions),
		release: popstateUnlisten,
		...actions,
	};
}
