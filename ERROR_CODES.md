# Error Codes

In production Svelte Navigator History does not print full error messages to
keep the library size lean.

Find more detailed descriptions here:

### 0

> First argument to `navigate` is expected to be a string or a number.

`history.navigate` was called with an incorrect type. Make sure to only call it
with values of type string or number.

### 1

> First argument to `navigate` must start with "/", "?" or "#".

Calling `history.navigate` with relative paths is not supported. Make sure to
call it with absolute paths only. Search or hash only paths are also supported.

### 2

> First argument to `parsePath` is expected to be a string.

`parsePath` can only parse path strings into location objects. Make sure to only
call it with values of type string.

### 3

> First argument to `parsePath` must start with "/", "?" or "#".

`parsePath` can only parse absolute paths. For search or hash only paths a
pathname of `"/"` will be asumed.

### 4

> First argument to `stringifyPath` is expected to be a location object with
> `pathname`, `search` and `hash` properties of type string.

`stringifyPath` can only join full location objects to path strings. Sample
location objects: `{ pathname: "/about", search: "", hash: "" }`,
`{ pathname: "/search", search: "?q=falafel", hash: "#result-3" }`
