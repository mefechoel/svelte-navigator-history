# Error Codes

In production Svelte Navigator History does not print full error messages to
keep the library size lean.

Find more detailed descriptions here:

### 0

`<navigate>` First argument is expected to be a string or a number.
`history.navigate` was called with an incorrect type. Make sure to only call it
with values of type string or number.

### 1

`<navigate>` When supplying a number, the first argument is expected to be a
whole number.

### 2

`<navigate>` First argument must start with "/". Calling `history.navigate` with
relative paths is not supported. Make sure to call it with absolute paths
only.Search/hash only navigation is also not supported.

### 3

`<parsePath>` First argument is expected to be a string.

### 4

`<parsePath>` First argument must start with "/", "?" or "#". `parsePath` can
only parse absolute paths. For search or hash only paths a pathname of `"/"`
will be asumed.

### 5

`<stringifyPath>` First argument is expected to be a location object with
`pathname`, `search` and `hash` properties of type string. `stringifyPath` can
only join full location objects to path strings. Sample location objects:
`{ pathname: "/about", search: "", hash: "" }`,
`{ pathname: "/search", search: "?q=falafel", hash: "#result-3" }`

### 6

`<History.push>` First argument is expected to be a string.

### 7

`<History.push>` First argument must start with "/". Calling `history.push` with
relative paths is not supported. Make sure to call it with absolute paths
only.Search/hash only navigation is also not supported.

### 8

`<History.replace>` First argument is expected to be a string.

### 9

`<History.replace>` First argument must start with "/". Calling
`history.replace` with relative paths is not supported. Make sure to call it
with absolute paths only.Search/hash only navigation is also not supported.

### 10

`<History.go>` First argument is expected to be a number.

### 11

`<History.go>` First argument is expected to be a whole number.

### 12

`<createBrowserHistory>` The browser history can only be used in a browser
environment, but no `document` object could be found. Are you trying to create
the history in a test environment? If so, consider using a different history,
such as the memory or auto history or emulate the browser environment with a
library, such as jsdom. If you're using the history in an SSR context, consider
using the auto history.

### 13

`<createHashHistory>` The hash history can only be used in a browser
environment, but no `document` object could be found. Are you trying to create
the history in a test environment? If so, consider using a different history,
such as the memory or auto history or emulate the browser environment with a
library, such as jsdom. If you're using the history in an SSR context, consider
using the auto history.
