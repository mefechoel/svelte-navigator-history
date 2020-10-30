import createBrowserHistory from "../browser";
import type { NavigatorHistory } from "../types";

/**
 * A browser history singleton you can use as the default history instance.
 *
 * @type {NavigatorHistory}
 */
const browserHistory: NavigatorHistory = createBrowserHistory();

export default browserHistory;
