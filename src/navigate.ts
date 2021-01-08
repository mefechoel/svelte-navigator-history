import {
	NAVIGATE_GO_TO_IS_INT,
	NAVIGATE_STARTS_WITH_SLASH,
	NAVIGATE_TO_TYPE,
} from "./errorCodes";
import type { HistoryActions, NavigateFn, NavigateOptions } from "./types";
import { assertGoArgs, assertPushReplaceArgs, isNumber } from "./util";

/**
 * Create the navigate helper function needed in a `NavigatorHistory`.
 */
export default function createNavigate<State = unknown>({
	go,
	push,
	replace: replaceState,
}: HistoryActions<State>): NavigateFn<State> {
	const navigate = (to: string | number, options?: NavigateOptions<State>) => {
		const { state = null, replace = false } = options || {};
		if (isNumber(to)) {
			assertGoArgs(to, NAVIGATE_TO_TYPE, NAVIGATE_GO_TO_IS_INT);
			if (process.env.NODE_ENV !== "production" && options) {
				// eslint-disable-next-line no-console
				console.warn(
					"<navigate> Navigation options (state or replace) are not " +
						"supported, when passing a number as the first argument to " +
						"navigate. They are ignored.",
				);
			}
			go(to);
		} else {
			assertPushReplaceArgs(to, NAVIGATE_TO_TYPE, NAVIGATE_STARTS_WITH_SLASH);
			(replace ? replaceState : push)(to, state);
		}
	};
	return navigate;
}
