# containers

> These containers are used by `../route-handlers` or by other containers.

A container does the data fetching for a small part of the application. It can represent a page or a fragment of a page.

A container is allowed to import the following stuff:
* `containers/*`
* `components/*`
* `store-helpers/*`
* `actions`

Don't import:
* `elements/*` -> use a component instead
* `route-handlers/*`

Every container exposes a `getProps(stores, params)` method which can be used by the caller to fetch the  props` for the container. It's expected that `getProps` is called within dependency-tracker context (This is done by `items-store` `createContainer`).
