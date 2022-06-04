# 0.5.0

## Breaking:

- Use `symbol("historyType")` as a type marker instead of `@@historyType`

## Fix:

- Avoid `document is undefined` error in hash and browser history

## Other:

- Generate error codes info md from code

# 0.4.0

## Breaking:

- Remove singelton instances for `browserHistory`, `hashHistory` and
  `memoryHistory`

## Other:

- Update dev dependencies

# 0.3.2

## Other:

- Add note to readme, pointing to new package

# 0.3.1

## Other:

- Fix types for history instances

# 0.3.0

## Breaking:

- Rename `NavigatorHistory.listen` to `NavigatorHistory.subscribe`, to fulfill
  svelte store contract
- Require replace plugin in build process to reduce bundle size

## Features:

- Expose `@@historyType` property on history objects, to check for matching
  history types

## Other:

- Add more tests
- Add more warnings and errors

# 0.2.0

## Features:

- Expose `createNavigate` function to simplify the implementation of a custom
  history

## Fix:

- Normalize the `pathname` property extracted by `parsePath` to a `"/"`

# 0.1.1

- Build project

# 0.1.0

Initial Version 🎉
