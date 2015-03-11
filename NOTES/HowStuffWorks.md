# How Stuff Works
At first sight, it may not be immediately clear why/how certain things are called/triggered. The below explanation points you in the right direction, so you can research further.


## How the app is served.
A JS webserver is included. It can be run in two modes:

### development mode
Run the server using `npm start-dev`.
It wil use `/lib/server-development.js` which wil use `/lib/server.js` which wil use `/config/simple.js` which wil use `/app/simple.html`. A tiny HTML file is loaded, the JS is downloaded + executed + rendered, and ultimately output is shown.

### production mode
In this mode, the React HTML output is (pre)rendered (and populated) on the server (a.k.a. isomorphic).

Run the server using `npm start`.
It wil use `/lib/server-production.js` it wil use `/lib/server.js` which wil use `/config/prerender.jsx` which wil use `/app/prerender.html`. A big HTML file is loaded (and output is shown immediately), the JS is downloaded + executed + rendered, and output is updated.


## How a page updates while you are programming.
After running the app webserver in development mode (see above) you'd have to manually reload the page after changing a JSX file.
It is possible to automatically reload _or_ update the page to reflect your changes:

### page reloading
Ensure that you are running the app webserver in development mode.

Then run another server using `npm dev-server`.
It wil rebuild while watching for file changes, and it wil trigger your page to reload afterwards.

### hot reloading
Ensure that you are running the app webserver in development mode.

Then run another server using `npm hot-dev-server`.
It wil rebuild while watching for file changes, and it wil update the currently shown and affected component(s) while keeping their state.
Note this is experimental, and in some cases you'll need to refresh manually.


## How the routes work.
After opening the app and going to some page, there is no actual HTML loaded from the server. The React app just replaces a component.
But you'd like to have the URL reflect this, and allow user to use browser history (back/forward). A router takes care of these things.

In this case, the root of your app is not the Application React component.
This starts at `/lib/server.js` which wil use `/config/app.jsx` which instantiates the router and ultimately uses `/app/mainRoutes.jsx` to load routes.
You'll find that all pages are subroutes within the `app` route, which instantiates `/app/Application/index.jsx`, which contains a `RouteHander` component that inserts subroute output.


## How the stores work.
todo
