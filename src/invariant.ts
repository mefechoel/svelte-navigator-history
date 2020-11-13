import { errorMessages } from "./errorCodes";

const invariant = (
	conditionFails: boolean,
	errorId: number,
	actual?: false | string | number,
): void => {
	if (conditionFails) {
		if (process.env.NODE_ENV !== "production") {
			let message = errorMessages[errorId];
			if (actual) {
				message += ` Got "${actual}"`;
			}
			throw new Error(message);
		}
		if (process.env.NODE_ENV === "production") {
			throw new Error(
				"<SvelteNavigatorHistory>: An error ocurred. Read more at " +
					`https://github.com/mefechoel/svelte-navigator-history/blob/main/ERROR_CODES.md#${errorId}`,
			);
		}
	}
};

export default invariant;
