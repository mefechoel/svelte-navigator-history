# Svelte Navigator History

[![npm package](https://img.shields.io/npm/v/svelte-navigator-history.svg?style=flat-square)](https://npmjs.com/package/svelte-navigator)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/svelte-navigator-history?style=flat-square)
![NPM](https://img.shields.io/npm/l/svelte-navigator-history?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/mefechoel/svelte-navigator-history?style=flat-square)

History module for
[svelte-navigator](https://github.com/mefechoel/svelte-navigator).

This is an **experimental** package, that will be used for the next version of
svelte-navigator. It abstracts the management of the apps location using either
the HTML5 History API, the hash fragment of the url or an in-memory mode.

## Table of Contents

- [API](#api)
  - [NavigatorHistory](#navigatorhistory)
  - [Browser History](#browser-history)
    - [createBrowserHistory](#createbrowserhistory)
    - [browserHistory](#browserhistory)
  - [Hash History](#hash-history)
    - [createHashHistory](#createhashhistory)
    - [hashHistory](#hashhistory)
  - [Memory History](#memory-history)
    - [createMemoryHistory](#creatememoryhistory)
    - [memoryHistory](#memoryhistory)
  - [parsePath](#parsepath)
  - [stringifyPath](#stringifypath)
- [License](#license)

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

	listen: (listener: Listener<HistoryUpdate<State>>) => () => void;
	createHref: (to: string) => string;
	release: () => void;
}
```

#### `push`

Calling `history.push` navigates to a new url and optionally pushes a value to
the history stack. The state is an arbitrary (serializable) value. It can be
thought of as something like the message body of an http post request. It
contains details which are not visible in the url, but are bound to the specific
request.

```js
// Navigate to "/blog?id=123"
history.push("/blog?id=123");

// Navigate to "/about" and push an object to the stack, which can
// be read by accessing `history.location.state`
history.push("/about", { from: "/blog" });
```

#### `replace`

Calling `history.replace` replaces the current url and optionally the value of
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

`history.navigate` ist a convenience method, that combines the functionality of
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

The location represents the current state of the url. It is very similar to the
builtin `window.location`, in that it has properties for the `pathname`,
`search` and `hash` of the url. It can however also carry a state, that can be
set when changing location.

A location looks like this:

```ts
interface NavigatorLocation<State = unknown> {
	pathname: string;
	// `search` and `hash` are `""`, when they are not present in the url.
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

#### `listen`

You can register an event handler by calling `history.listen`. The handler you
pass to `listen` is called with the location and action of the latest
navigation. It is also called when the listener is registered. `listen` returns
an `unlisten` function, which when called removes the event listener.

```js
const unlisten = history.listen(({ location, action }) => {
	const url = `${location.pathname}${location.search}${location.hash}`;
	console.log(`Action: ${action}; Url: ${url}`);
});

// ... do something ...

// Remove the listener
unlisten();
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
store app's loaction and state in the url. This is probably the best choice for
most apps, as it enables best ceo possibilities and will be most intuitive for
most users. This setup however needs some additional work because you need to
configure your server to always serve your index.html file when a request
doesn't match a file. You can read more about it in
[vue-routers docs about history routing](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations).

#### `createBrowserHistory`

Create an instance of a browser history. It will update the url when the app's
location changes. It will also listen to navigation events dispatched by the
browser after the back and forward buttons have been clicked.

When using `createBrowserHistory` **don't interact with the browsers `history`
object yourself**. It will lead to inconsistent states and you won't have a good
time debugging that... Also, always use the created history instance to read the
current location, and **don't use the browsers `location` object**. Again
inconsistent location states aren't fun.

```js
import { createBrowserHistory } from "svelte-navigator-history";

const history = createBrowserHistory();

history.listen(console.log);

history.navigate("/blog?id=123");
```

#### `browserHistory`

`browserHistory` is an instance of a BrowserHistory, that is created for
convenience. It can be used as the default history instance.

```js
import { browserHistory } from "svelte-navigator-history";

browserHistory.listen(console.log);

browserHistory.navigate("/blog?id=123");
```

### Hash History

Hash history uses the hash fragment of the url to simulate routing via url. This
approach is great if you want to get started quickly or if you don't have access
to your server's configuration.

#### `createHashHistory`

Create an instance of a hash history. It will change the hash of the url when
the app's location changes.

Again, you should not interact with the global `history` or `location` objects
yourself.

```js
import { createHashHistory } from "svelte-navigator-history";

const history = createHashHistory();

history.listen(console.log);

history.navigate("/blog?id=123");
```

#### `hashHistory`

`hashHistory` is an instance of a HashHistory, that is created for convenience.
It can be used as the default history instance.

```js
import { hashHistory } from "svelte-navigator-history";

hashHistory.listen(console.log);

hashHistory.navigate("/blog?id=123");
```

### Memory History

Memory history keeps the location state of your app in memory. This is mainly
useful for testing if you don't run your tests in a browser. You could also use
a memory history if you want to controll the state of a widget you embed in
another app using a router.

#### `createMemoryHistory`

Create an instance of a hash history. It will change the hash of the url when
the app's location changes.

Again, you should not interact with the global `history` or `location` objects
yourself.

```js
import { createMemoryHistory } from "svelte-navigator-history";

const history = createMemoryHistory();

history.listen(console.log);

history.navigate("/blog?id=123");
```

#### `memoryHistory`

`memoryHistory` is an instance of a MemoryHistory, that is created for
convenience. It can be used as the default history instance.

```js
import { memoryHistory } from "svelte-navigator-history";

memoryHistory.listen(console.log);

memoryHistory.navigate("/blog?id=123");
```

### `parsePath`

Create a location object from a url string.

```js
import { parsePath } from "svelte-navigator-history";

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
import { stringifyPath } from "svelte-navigator-history";

const location = {
	pathname: "/search",
	search: "?q=falafel",
	hash: "#result-3",
};
const path = stringifyPath(location);
// -> "/search?q=falafel#result-3"
```

## License

MIT
