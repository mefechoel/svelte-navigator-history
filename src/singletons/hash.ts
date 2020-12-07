import createHashHistory from "../hash";
import type { HashHistory } from "../types";

/**
 * A hash history singleton you can use as the default history instance.
 *
 * @type {HashHistory}
 */
const hashHistory: HashHistory = createHashHistory();

export default hashHistory;
