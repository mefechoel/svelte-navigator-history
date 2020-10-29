import {
	KeyedState,
	StateContainer,
	NavigatorLocation,
	Action,
	Subscribable,
	Listener,
	HistoryContainer,
} from "./types";
import { createGlobalId, noop } from "./util";

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
	const listeners = new Set<Listener<StoreValue>>();
	return {
		listen(listener: Listener<StoreValue>): () => void {
			if (listeners.size === 0) onInit();
			listeners.add(listener);
			// Call listener when it is registered
			listener(getState());
			return () => {
				listeners.delete(listener);
				if (listeners.size === 0) onDestroy();
			};
		},
		notify: () => listeners.forEach((listener) => listener(getState())),
		getSize: () => listeners.size,
	};
}

export function createHistoryContainer<State = unknown>({
	initialLocation,
}: {
	initialLocation: NavigatorLocation<State>;
}): HistoryContainer<State> {
	let location = initialLocation;
	let action: Action = Action.Pop;
	const { listen, notify } = createSubscribable({
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
		listen,
	};
}
