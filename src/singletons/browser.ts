import createBrowserHistory from "../browser";
import type { BrowserHistory } from "../types";

/**
 * A browser history singleton you can use as the default history instance.
 *
 * @type {BrowserHistory}
 */
const browserHistory: BrowserHistory = createBrowserHistory();

export default browserHistory;
