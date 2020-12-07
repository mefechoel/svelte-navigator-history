import createMemoryHistory from "../memory";
import type { MemoryHistory } from "../types";

/**
 * A memory history singleton you can use as the default history instance.
 *
 * @type {MemoryHistory}
 */
const memoryHistory: MemoryHistory = createMemoryHistory();

export default memoryHistory;
