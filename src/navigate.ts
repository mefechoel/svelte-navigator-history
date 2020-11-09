import { NAVIGATE_STARTS_WITH_SLASH, NAVIGATE_TO_TYPE } from "./errorCodes";
import invariant from "./invariant";
import type { HistoryActions, NavigateFn, NavigateOptions } from "./types";
import { isNumber, isString, startsWith } from "./util";

export default function createNavigate<State = unknown>({
	go,
	push,
	replace: replaceState,
}: HistoryActions<State>): NavigateFn<State> {
	const navigate = (to: string | number, options?: NavigateOptions<State>) => {
		const { state = null, replace = false } = options || {};
		if (isNumber(to)) {
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
			// Check typeof `to`
			invariant(
				!isString(to),
				NAVIGATE_TO_TYPE,
				process.env.NODE_ENV !== "production" && typeof to,
			);
			// Check if `to` starts with a slash
			invariant(
				!startsWith(to, "/") && !startsWith(to, "?") && !startsWith(to, "#"),
				NAVIGATE_STARTS_WITH_SLASH,
				process.env.NODE_ENV !== "production" && to,
			);

			(replace ? replaceState : push)(to, state);
		}
	};
	return navigate;
}
