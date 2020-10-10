import createHashHistory from "../hash";
import { NavigatorHistory } from "../types";

/**
 * A hash history singleton you can use as the default history instance.
 *
 * @type {NavigatorHistory}
 */
const hashHistory: NavigatorHistory = createHashHistory();

export default hashHistory;
