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
