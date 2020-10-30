import createHashHistory from "../hash";
import type { NavigatorHistory } from "../types";

/**
 * A hash history singleton you can use as the default history instance.
 *
 * @type {NavigatorHistory}
 */
const hashHistory: NavigatorHistory = createHashHistory();

export default hashHistory;
