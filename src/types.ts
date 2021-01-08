import HistoryType from "./HistoryType";

export interface HistoryLocation {
	/**
	 * The current normalized pathname. Normalized meaning, that a potential
	 * `basepath` is removed, so your app alway behaves the same, regardeless
	 * if it's running locally without a basepath or in production, served a
	 * subroute of your domain.
	 */
	pathname: string;
	/**
	 * The current search string. Will be `""` if no search string is present.
	 * Otherwise it will begin with a `?`.
	 */
	search: string;
	/**
	 * The current hash. Will be `""` if no hash is present.
	 * Otherwise it will begin with a `#`.
	 */
	hash: string;
}

export type To = HistoryLocation | string;

export interface KeyedState<State = unknown> {
	/**
	 * An arbitrary object, that has been pushed to the history stack.
	 */
	state: State | null;
	/**
	 * A unique id that identifies a location entry.
	 */
	key: string;
}

export interface StateContainer<State = unknown> {
	value: State | null;
	key: string;
}

export type NavigatorLocation<State = unknown> = HistoryLocation &
	KeyedState<State | null>;

/**
 * Possible action types.
 *
 * A pop action is the default action.
 * It is dispatched, when the back or forward buttons of the browser
 * are clicked or when the history stack is navigated via a call
 * to `NavigatorHistory.navigate`, with a number as an argument.
 *
 * A push action is dispatched, when clicking a `Link` or calling the
 * `navigate` function (e.g. from a call to `useNavigate`).
 * A new entry, that may contain a state, is pushed to the history stack.
 *
 * A replace action is dispatched, when clicking a `Link` with a `replace`
 * prop or calling the `navigate` function with `replace: true`.
 * The current entry in the history stack is replaced.
 */
export type Action = "POP" | "PUSH" | "REPLACE";

export interface HistoryActions<State = unknown> {
	push: (uri: string, state?: State | null) => void;
	replace: (uri: string, state?: State | null) => void;
	go: (delta: number) => void;
}

export type Subscriber<StoreValue> = (value: StoreValue) => void;

export interface Subscribable<StoreValue> {
	subscribe(subscriber: Subscriber<StoreValue>): () => void;
	notify: () => void;
}

export interface HistoryUpdate<State = unknown> {
	location: NavigatorLocation<State>;
	action: Action;
}

export interface HistoryContainer<State = unknown> {
	getLocation: () => NavigatorLocation<State>;
	getAction: () => Action;
	set: (nextLocation: NavigatorLocation<State>, nextAction: Action) => void;
	subscribe: (subscriber: Subscriber<HistoryUpdate<State>>) => () => void;
}

export type CreateHref = (to: string) => string;

export interface NavigateOptions<State = unknown> {
	/**
	 * The state will be accessible through `location.state`
	 */
	state?: State | null;
	/**
	 * Replace the current entry in the history stack,
	 * instead of pushing on a new one
	 */
	replace?: boolean;
}

export type NavigateFn<State = unknown> = {
	/**
	 * Navigate to a new route.
	 * @param to The path to navigate to.
	 *
	 * If `to` is a number we will navigate to the stack entry index + `to`
	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
	 * @param options Navigation options
	 */
	(to: string, options?: NavigateOptions<State>): void;
	/**
	 * Navigate to a new route.
	 * @param delta Navigate to the stack entry index + `delta`
	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
	 */
	(delta: number): void;
};

export interface NavigatorHistory<State = unknown>
	extends HistoryActions<State> {
	/**
	 * The currentlocation of the Router.
	 */
	readonly location: NavigatorLocation<State>;
	/**
	 * The last action, that lead to a change in location.
	 * Default is `"POP"`.
	 */
	readonly action: Action;
	/**
	 * Listen to changes in location.
	 *
	 * @param listener The listener function will be called when the
	 * location changes.
	 * @returns The unlisten function, which can be used to unsubscribe
	 * the listener
	 */
	subscribe: (subscriber: Subscriber<HistoryUpdate<State>>) => () => void;
	/**
	 * Create a string from a path, that can be used in a `href` attribute
	 * of an `<a>` tag. Used internally for `Link` components and `use:link`
	 * actions.
	 */
	createHref: CreateHref;
	navigate: NavigateFn<State>;
	/**
	 * Clear all event listeners a history might have out in place.
	 */
	release: () => void;
	[HistoryType]?: string;
}

export interface BrowserHistory<State = unknown>
	extends NavigatorHistory<State> {
	[HistoryType]: "browser";
}

export interface HashHistory<State = unknown> extends NavigatorHistory<State> {
	[HistoryType]: "hash";
}

export interface MemoryHistory<State = unknown>
	extends NavigatorHistory<State> {
	[HistoryType]: "memory";
}
