# Q&A Why

Design choices explained

## What was the argument for using items-store?

> I didn't want to write a new module. I actually tried using Reflux.js, but couldn't find a good workflow for pre-rendering, optimistic updates and merging of multiple writes. You could do it manually but that is something I would expect from a flux implementation. items-store is a very simple store base class that coordinate this behavior (the repo actually also contains a simple helper for actions and a react mixin, but these are theoretically independent and you don't have to use them with the store).

> items-store allows to serialize and deserialize the store data to inject the data after pre-rendering. It manages optimistic updates and merges multiple writes. But items-store only offers a simple key-value store API and forces you to map more complex operations (via store-helpers) to this model. It's just a caching layer with events to the remote API (which need to be provided in the constructor).

> items-store basically provides a "raw data" store, while other implementations give you the ability to write higher level stores. In items-store you need to put this higher-level behavior in store-helpers. The advantage is that this way basic functionality is already provided by items-store.

> Now there is an alternative to items-store, which could provide "pre-rendering" part too: http://fluxible.io/ they use dehydrate and rehydrate to (de)serialize to data from the stores and provide it to the client stores.

([source](https://github.com/webpack/react-starter/pull/49))


## How is the server refresh triggered?

> `config/mainApp.jsx` invalidates store data when you change the page. When the pages read the data again it is invalid and will be refetched.

([source](https://github.com/webpack/react-starter/pull/51))

## How does it propagate changes when the user edits items?

> The component fires an action (from `app/actions.jsx`) on edit. The action is handled in `app/mainStores.jsx` and writes some items on stores. The stores update their internal cache (which is displayed on the page as optimistic update) and do server requests (through their registered handlers in `app/mainStores.jsx`.

([source](https://github.com/webpack/react-starter/pull/51))

## How do values travel before ending up in some components render()?
> A: component requests values from store in getProps() -> `app/mainStores.jsx` read (unavailable or invalidated) data from server -> internal `items-store` cache for the store -> getProps() -> components this.props -> render()

([source](https://github.com/webpack/react-starter/pull/51))

## How does the queue combine multiple requests?

> A: items-store store a single update per entry. Any subsequent updateItem() call causes both updates to be merged (mergeUpdates from items-store). Requests from stores to the server are queued (queueRequest in app/mainStores.jsx). Here only a single ongoing request is allowed. All writes that happen in the meantime are merged into a single write.

([source](https://github.com/webpack/react-starter/pull/51))
