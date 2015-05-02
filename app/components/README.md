# components

> These components are used by `../containers` or by other components.

A component doesn't do any data fetching and expects data pass via `props`. It represents a reusesable component that can be used in different contexts. A component can have state. A component expects high-level data.

A component can have styles for layouting. It should not have styles for visual stuff.

A component is allowed to import the following stuff:
* `components/*`
* `elements/*`

Don't import:
* `store-helpers/*` -> do it from the container instead and pass data via `props`.
* `actions` -> pass a callback via `props` and call the action in the container instead.
* external styles and components -> wrap the style or component in an element
* `route-handlers/*`
