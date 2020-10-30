import { addListener, getPathString, POP, PUSH, REPLACE } from "./util";
import createNavigate from "./navigate";
import {
	createHistoryContainer,
	createState,
	getBrowserStateAndKey,
} from "./shared";
import type { HistoryActions, NavigatorHistory } from "./types";

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
		listen,
		set: setState,
		getAction,
		getLocation,
	} = createHistoryContainer<State>({ initialLocation: getBrowserLocation() });

	const popstateUnlisten = addListener(window, "popstate", () =>
		setState(getBrowserLocation(), POP),
	);

	const actions: HistoryActions<State> = {
		push(uri, state) {
			try {
				history.pushState(createState(state), "", uri);
			} catch (e) {
				location.assign(uri);
			}
			setState(getBrowserLocation(), PUSH);
		},
		replace(uri, state) {
			history.replaceState(createState(state), "", uri);
			setState(getBrowserLocation(), REPLACE);
		},
		go(delta) {
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
		listen,
		createHref: getPathString,
		navigate: createNavigate(actions),
		release: popstateUnlisten,
		...actions,
	};
}
