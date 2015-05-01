# route-handlers

> These handlers are bound to Routes in `../mainRoutes`.

A route handler should do nothing, but only bind the handler to a technology.

A component is allowed to import the following stuff:
* `containers/*`

Don't import:
* `element/*`
* `components/*`
* `store-helpers/*`
* `route-handlers/*`
* `actions/*`

Currently all route handlers are implemented by `items-store` containers.

The technology can be easily replaced on per route handler level. This allow easy migration to a future technology.
