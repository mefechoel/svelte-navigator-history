import {
	addListener,
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
import type { CreateHref, HistoryActions, NavigatorHistory } from "./types";

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
 * @returns {NavigatorHistory} The history object
 */
export default function createHashHistory<State = unknown>({
	window = document.defaultView as Window,
}: HashHistoryOptions = {}): NavigatorHistory<State> {
	const { history, location } = window;

	const getHashPath = () => substr(location.hash, 1);

	const getHashLocation = () => ({
		...parsePath(getHashPath()),
		...getBrowserStateAndKey<State>(history),
	});

	const {
		listen,
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
			const fullUri = createHref(uri);
			try {
				history.pushState(createState(state), "", fullUri);
			} catch (e) {
				location.assign(fullUri);
			}
			setState(getHashLocation(), PUSH);
		},
		replace(uri, state) {
			history.replaceState(createState(state), "", createHref(uri));
			setState(getHashLocation(), REPLACE);
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
		createHref,
		navigate: createNavigate(actions),
		release() {
			popstateUnlisten();
			hashchangeUnlisten();
		},
		...actions,
	};
}
