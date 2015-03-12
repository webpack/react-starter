# How Stuff Works
This documentation is for grasping the overall design. No details by intention. To get up and running quickly see `/README.md`.

At first sight, it may not be immediately clear why/how certain things are called/triggered.
The below explanation points you in the right direction, so you can research further.


## How the app is served.
A JS webserver is included in the form of `/lib/server.js`. It can be run in two modes:

### development mode
Run the server using `npm run start-dev`.
It wil use `/lib/server-development.js` which wil use `/lib/server.js` which wil use `/config/simple.js` which wil use `/app/simple.html`. A tiny HTML file is loaded, the JS is downloaded + executed + rendered, and ultimately output is shown.

### production mode
In this mode, the React HTML output is (pre)rendered (and populated) on the server (a.k.a. isomorphic).

Run the server using `npm run start`.
It wil use `/lib/server-production.js` which wil use `/lib/server.js` which wil use `/config/prerender.jsx` which wil use `/app/prerender.html`. A big HTML file is loaded (and output is shown immediately), the JS is downloaded + executed + rendered, and output is updated.

This server side render (prerender) is possible because the React JS can be executed on the server.
In your browser the main `React.render(<Application />, document.getElementById("content"))` call (in `/config/app.jsx`) outputs to the browser DOM.
But when prerendering, the main `React.renderToString(<Application />)` call (in `/app/prerender.jsx`) outputs to a string, which is inserted into the HTML (including React component states) as content.
The browser now can show the HTML instantly in the DOM, but proceeds to run the React JS that resumes the usual DOM mutations.

Note: Routes that use `react-proxy!` can not be prerendered.


## How a page updates while you are programming.
After running the app webserver in development mode (see above) you'd have to manually reload the page after changing a JSX file.
It is possible to automatically reload _or_ update the page to reflect your changes:

### page reloading
Ensure that you are running the app webserver in development mode.

Then run another server using `npm run dev-server`.
It wil rebuild while watching for file changes, and it wil trigger your page to reload afterwards.

### hot reloading
Ensure that you are running the app webserver in development mode.

Then run another server using `npm run hot-dev-server`.
It wil rebuild while watching for file changes, and it wil update the currently shown and affected component(s) while keeping their state.
Note this is experimental, and in some cases you'll need to refresh manually.


## How the routes work.
After opening the app and going to some page, there is no actual HTML loaded from the server. The React app just replaces a component.
But you'd like to have the URL reflect this, and allow user to use browser history (back/forward). A router takes care of these things.

In this case, the root of your app is not the Application React component.
This starts at `/lib/server.js` which wil use `/config/app.jsx` which instantiates the router and ultimately uses `/app/mainRoutes.jsx` to load routes.
You'll find that all pages are subroutes within the `app` route, which instantiates `/app/Application/index.jsx`, which contains a `RouteHander` component that inserts subroute output.


## How the server JSON API works.
The `/lib/server.js` serves the application, but it also serves the API URLs that the stores talk with.
It initializes two databases once (one per todo list), and then continues to listen for GET/POST requests on specific URLs.


## How the stores work.
todo

Note on `Application.update()`: normally components should not access the stores except for reading in `getState()`. Everything else should be done with actions.


## How the actions work.
todo


## How the 'Random fail!' works.
This [Chaos Monkey](https://gigaom.com/2012/07/30/netflix-open-sources-cloud-testing-chaos-monkey/) lives in `/lib/server.js` and helps you experience realistic server-client retrieval times and errors while developing.
At some time your application is requesting 3 things from the server, and they return in the wrong order and incomplete. Wil it break?
Or a form could not be sent to the server. Wil it notify the user?
