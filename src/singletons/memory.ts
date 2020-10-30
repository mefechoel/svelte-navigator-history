import createMemoryHistory from "../memory";
import type { NavigatorHistory } from "../types";

/**
 * A memory history singleton you can use as the default history instance.
 *
 * @type {NavigatorHistory}
 */
const memoryHistory: NavigatorHistory = createMemoryHistory();

export default memoryHistory;
