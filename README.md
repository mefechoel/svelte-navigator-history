# Svelte Navigator History

[![npm package](https://img.shields.io/npm/v/@svelte-navigator/history.svg?style=flat-square)](https://npmjs.com/package/@svelte-navigator/history)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@svelte-navigator/history?style=flat-square)](https://bundlephobia.com/result?p=@svelte-navigator/history)
[![NPM](https://img.shields.io/npm/l/@svelte-navigator/history?style=flat-square)](https://github.com/mefechoel/svelte-navigator-history/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/mefechoel/svelte-navigator-history?style=flat-square)](https://github.com/mefechoel/svelte-navigator-history/commits/main)
[![Code Style Prettier](https://img.shields.io/badge/code%20style-prettier-ff7fe1.svg?style=flat-square)](https://github.com/prettier/prettier#readme)
[![Build Status](https://img.shields.io/github/workflow/status/mefechoel/svelte-navigator-history/Test?style=flat-square)](https://github.com/mefechoel/svelte-navigator-history/actions?query=workflow%3ATest)

History module for
[svelte-navigator](https://github.com/mefechoel/svelte-navigator). It abstracts
the management of the apps location using either the HTML5 History API, the hash
fragment of the URL or an in-memory mode.

⚠️⚠️⚠️ This is an **_experimental_** package, that will be used for the next
version of svelte-navigator. ⚠️⚠️⚠️

## Table of Contents

- [Build requirements](#build-requirements)
- [API](#api)
  - [`NavigatorHistory`](#navigatorhistory)
  - [Browser History](#browser-history)
    - [`createBrowserHistory`](#createbrowserhistory)
  - [Hash History](#hash-history)
    - [`createHashHistory`](#createhashhistory)
  - [Memory History](#memory-history)
    - [`createMemoryHistory`](#creatememoryhistory)
  - [`parsePath`](#parsepath)
  - [`stringifyPath`](#stringifypath)
  - [`createNavigate`](#createnavigate)
- [License](#license)

## Build requirements

Svelte Navigator History depends on a build process in which certain environment
variables are replaced. This is necessary in order to provide descriptive error
message in development, while keeping the production bundles lean.

If you're using rollup you can use
[`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace)
like so:

```js
// rollup.config.js
import replace from "@rollup/plugin-replace";

const isDev = Boolean(process.env.ROLLUP_WATCH);
const nodeEnv = isDev ? "development" : "production";

export default {
	// ...
	plugins: [
		// ...
		replace({ "process.env.NODE_ENV": JSON.stringify(nodeEnv) }),
	],
};
```

If you're using webpack you can use
[`webpack.DefinePlugin`](https://webpack.js.org/plugins/define-plugin/):

```js
// webpack.config.js
const webpack = require("webpack");

module.exports = {
	// ...
	plugins: [
		// ...
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),
	],
};
```

If you don't have access to your build pipeline, `@svelte-navigator/history`
provides pre-built development and production bundles you can use. Each are
available as es-module and umd bundle. Import the desired format from the `dist`
folder:

```js
import * as History from "@svelte-navigator/history/dist/history.development.mjs";
import * as History from "@svelte-navigator/history/dist/history.production.mjs";
import * as History from "@svelte-navigator/history/dist/history.development.umd.js";
import * as History from "@svelte-navigator/history/dist/history.production.umd.js";
```

## API

### `NavigatorHistory`

Each History implements the following interface:

```ts
interface NavigatorHistory<State = unknown> {
	push: (uri: string, state?: State | null) => void;
	replace: (uri: string, state?: State | null) => void;
	go: (delta: number) => void;
	navigate: NavigateFn<State>;

	readonly location: NavigatorLocation<State>;
	readonly action: Action;

	subscribe: (subscriber: Subscriber<HistoryUpdate<State>>) => () => void;
	createHref: (to: string) => string;
	release: () => void;
}
```

#### `push`

Calling `history.push` navigates to a new URL and optionally pushes a value to
the history stack. The state is an arbitrary (serializable) value. It can be
thought of as something like the message body of an http post request. It
contains details which are not visible in the URL, but are bound to the specific
request.

```js
// Navigate to "/blog?id=123"
history.push("/blog?id=123");

// Navigate to "/about" and push an object to the stack, which can
// be read by accessing `history.location.state`
history.push("/about", { from: "/blog" });
```

#### `replace`

Calling `history.replace` replaces the current URL and optionally the value of
the history stack.

```js
// Replace current entry, which could be a protected route, with "/login"
history.replace("/login");

// Save the location we're coming from, so we can navigate back, when
// login was successfull
history.replace("/login", { from: history.location });
```

#### `go`

`history.go` allows you to navigate the history stack, similar to using the back
and forward buttons of the browser.

```js
const goBack = () => history.go(-1);
const goForward = () => history.go(1);
```

#### `navigate`

`history.navigate` is a convenience method, that combines the functionality of
`push`, `replace` and `go`.

```js
// Go to "/blog?id=123"
history.navigate("/blog?id=123");

// Replace current entry and go to "/login".
// Save the location we're coming from, so we can navigate back,
// when login was successfull
history.navigate("/login", {
	state: { from: history.location },
	replce: true,
});

// Go back one entry in the history stack
history.navigate(-1);
```

#### `location`

The location represents the current state of the URL. It is very similar to the
built-in `window.location`, in that it has properties for the `pathname`,
`search` and `hash` of the URL. It can however also carry a state, that can be
set when changing location.

A location looks like this:

```ts
interface NavigatorLocation<State = unknown> {
	pathname: string;
	// `search` and `hash` are `""`, when they are not present in the URL.
	// When they are, they begin with a `"?"` or a `"#"` respectively
	search: string;
	hash: string;
	state: State | null;
	// `key` is a unique id for each location entry. It can be used to
	// reference a location entry elsewhere, e.g. when storing entries
	// in `localStorage`
	key: string;
}
```

#### `action`

The action represents what event lead to the change in location. Possible values
are:

- `"POP"`: The default value. It is caused by hitting the back or forward button
  of the browser, or by calling `history.go`.
- `"PUSH"`: A new entry has been pushed to the history stack, by calling
  `history.push`. This is what you want to use when navigating programmatically
  in your app.
- `"REPLACE"`: An entry of the history stack has been replaced with another one.
  This is caused when `history.replace` has been called.

#### `subscribe`

You can register an event handler by calling `history.subscribe`. The handler
you pass to `subscribe` is called with the location and action of the latest
navigation. It is also called when the subscriber is registered. `subscribe`
returns an `unsubscribe` function, which when called removes the event
subscriber.

```js
const unsubscribe = history.subscribe(({ location, action }) => {
	const url = `${location.pathname}${location.search}${location.hash}`;
	console.log(`Action: ${action}; Url: ${url}`);
});

// ... do something ...

// Remove the subscriber
unsubscribe();
```

#### `createHref`

`history.createHref` takes a path and returns a string, you can use as a `href`
attribute of an `<a>` element. For hash routing for example, a `"#"` has to be
prepended to the beginning of a path.

#### `release`

A history might need to attach some global event handlers to be able to react to
changes in location. If you're for whatever reason creating lots of history
instances (which is probably a bad idea...), you should call `history.release`
when you don't need the instance anymore. It will unregister all event handlers
and allow the instance to be garbage collected, preventing memory leaks.

### Browser History

Browser history uses the
[HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History) to
store app's location and state in the URL. This is probably the best choice for
most apps, as it enables best CEO possibilities and will be most intuitive for
most users. This setup however needs some additional work because you need to
configure your server to always serve your index.html file when a request
doesn't match a file. You can read more about it in
[vue-routers docs about history routing](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations).

#### `createBrowserHistory`

Create an instance of a browser history. It will update the URL when the app's
location changes. It will also listen to navigation events dispatched by the
browser after the back and forward buttons have been clicked.

When using `createBrowserHistory` **don't interact with the browsers `history`
object yourself**. It will lead to inconsistent states and you won't have a good
time debugging that... Also, always use the created history instance to read the
current location, and **don't use the browsers `location` object**. Again
inconsistent location states aren't fun.

```js
import { createBrowserHistory } from "@svelte-navigator/history";

const history = createBrowserHistory();

history.subscribe(console.log);

history.navigate("/blog?id=123");
```

### Hash History

Hash history uses the hash fragment of the URL to simulate routing via URL. This
approach is great if you want to get started quickly or if you don't have access
to your server's configuration.

#### `createHashHistory`

Create an instance of a hash history. It will change the hash of the URL when
the app's location changes.

Again, you should not interact with the global `history` or `location` objects
yourself.

```js
import { createHashHistory } from "@svelte-navigator/history";

const history = createHashHistory();

history.subscribe(console.log);

history.navigate("/blog?id=123");
```

### Memory History

Memory history keeps the location state of your app in memory. This is mainly
useful for testing if you don't run your tests in a browser. You could also use
a memory history if you want to control the state of a widget you embed in
another app using a router.

#### `createMemoryHistory`

Create an instance of a hash history. It will change the hash of the URL when
the app's location changes.

Again, you should not interact with the global `history` or `location` objects
yourself.

```js
import { createMemoryHistory } from "@svelte-navigator/history";

const history = createMemoryHistory();

history.subscribe(console.log);

history.navigate("/blog?id=123");
```

### `parsePath`

Create a location object from a URL string.

```js
import { parsePath } from "@svelte-navigator/history";

const path = "/search?q=falafel#result-3";
const location = parsePath(path);
// -> {
//   pathname: "/search",
//   search: "?q=falafel",
//   hash: "#result-3",
// };
```

### `stringifyPath`

Joins a location object to one path string.

```js
import { stringifyPath } from "@svelte-navigator/history";

const location = {
	pathname: "/search",
	search: "?q=falafel",
	hash: "#result-3",
};
const path = stringifyPath(location);
// -> "/search?q=falafel#result-3"
```

### `createNavigate`

Create the `createNavigate` convenience method expected in the
`NavigatorHistory` interface. Pass a Partial `NavigatorHistory` object, which
implements the `push`, `replace` and `go` methods, to the factory function.

```js
import { createNavigate } from "@svelte-navigator/history";

const customHistory = {
	push(uri, state) {
		console.log("PUSH");
	},
	replace(uri, state) {
		console.log("REPLACE");
	},
	go(delta) {
		console.log("GO");
	},
};

customHistory.navigate = createNavigate(customHistory);
```

## License

MIT
