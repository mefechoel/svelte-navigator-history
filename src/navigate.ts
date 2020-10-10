import { HistoryActions, NavigateFn, NavigateOptions } from "./types";
import { isNumber } from "./util";

export default function createNavigate<State = unknown>({
	go,
	push,
	replace: replaceState,
}: HistoryActions<State>): NavigateFn<State> {
	const navigate = (to: string | number, options?: NavigateOptions<State>) => {
		const { state = null, replace = false } = options || {};
		if (isNumber(to)) {
			if (options) {
				// eslint-disable-next-line no-console
				console.warn(
					"<navigate> Navigation options (state or replace) are not " +
						"supported, when passing a number as the first argument to " +
						"navigate. They are ignored.",
				);
			}
			go(to);
		} else {
			(replace ? replaceState : push)(to, state);
		}
	};
	return navigate;
}
