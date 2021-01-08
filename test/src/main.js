import {
	createBrowserHistory,
	createHashHistory,
	createMemoryHistory,
	parsePath,
	stringifyPath,
	createNavigate,
	HistoryType,
} from "../../src/index.ts";

window.NavigatorHistory = {
	createBrowserHistory,
	createHashHistory,
	createMemoryHistory,
	parsePath,
	stringifyPath,
	createNavigate,
	HistoryType,
	browserHistory: createBrowserHistory(),
	hashHistory: createHashHistory(),
	memoryHistory: createMemoryHistory(),
};
