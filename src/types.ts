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

// False positive?
// eslint-disable-next-line no-shadow
export enum Action {
	Pop = "POP",
	Push = "PUSH",
	Replace = "REPLACE",
}

export interface HistoryActions<State = unknown> {
	push: (uri: string, state?: State | null) => void;
	replace: (uri: string, state?: State | null) => void;
	go: (delta: number) => void;
}

export type Listener<StoreValue> = (value: StoreValue) => void;

export interface Subscribable<StoreValue> {
	listen(listener: Listener<StoreValue>): () => void;
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
	listen: (listener: Listener<HistoryUpdate<State>>) => () => void;
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
	listen: (listener: Listener<HistoryUpdate<State>>) => () => void;
	createHref: CreateHref;
	navigate: NavigateFn<State>;
	release: () => void;
}
