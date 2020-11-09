import type {
	KeyedState,
	StateContainer,
	NavigatorLocation,
	Action,
	Subscribable,
	Subscriber,
	HistoryContainer,
} from "./types";
import { createGlobalId, noop, POP } from "./util";

export const getBrowserStateAndKey = <State = unknown>(
	history: History,
): KeyedState<State> => {
	const { state } = history;
	return {
		state: (state && state.value) || null,
		key: (state && state.key) || "initial",
	};
};

export const createState = <State = unknown>(
	state?: State | null,
): StateContainer<State> => ({
	value: state === undefined ? null : state,
	key: createGlobalId(),
});

export function createSubscribable<StoreValue = undefined>({
	getState = noop as () => StoreValue,
	onInit = noop,
	onDestroy = noop,
}: {
	getState?: () => StoreValue;
	onInit?: () => void;
	onDestroy?: () => void;
} = {}): Subscribable<StoreValue> {
	const subscribers = new Set<Subscriber<StoreValue>>();
	return {
		subscribe(subscriber: Subscriber<StoreValue>): () => void {
			if (subscribers.size === 0) onInit();
			subscribers.add(subscriber);
			// Call subscriber when it is registered
			subscriber(getState());
			return () => {
				subscribers.delete(subscriber);
				if (subscribers.size === 0) onDestroy();
			};
		},
		notify: () => subscribers.forEach((subscriber) => subscriber(getState())),
		getSize: () => subscribers.size,
	};
}

export function createHistoryContainer<State = unknown>({
	initialLocation,
}: {
	initialLocation: NavigatorLocation<State>;
}): HistoryContainer<State> {
	let location = initialLocation;
	let action: Action = POP;
	const { subscribe, notify } = createSubscribable({
		getState: () => ({ location, action }),
	});

	return {
		getLocation() {
			return location;
		},
		getAction() {
			return action;
		},
		set(nextLocation, nextAction) {
			location = nextLocation;
			action = nextAction;
			notify();
		},
		subscribe,
	};
}
