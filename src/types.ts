import HistoryType from "./HistoryType";

export interface HistoryLocation {
	pathname: string;
	search: string;
	hash: string;
}

export type To = HistoryLocation | string;

export interface KeyedState<State = unknown> {
	state: State | null;
	key: string;
}

export interface StateContainer<State = unknown> {
	value: State | null;
	key: string;
}

export type NavigatorLocation<State = unknown> = HistoryLocation &
	KeyedState<State | null>;

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
	getSize: () => number;
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
	state?: State | null;
	replace?: boolean;
}

export type NavigateFn<State = unknown> = {
	(to: string, options?: NavigateOptions<State>): void;
	(to: number): void;
};

export interface NavigatorHistory<State = unknown>
	extends HistoryActions<State> {
	readonly location: NavigatorLocation<State>;
	readonly action: Action;
	subscribe: (subscriber: Subscriber<HistoryUpdate<State>>) => () => void;
	createHref: CreateHref;
	navigate: NavigateFn<State>;
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
