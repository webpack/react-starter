# How Stuff Works
This documentation is for grasping the overall design. No details by intention. To get up and running quickly see `/README.md`.

At first sight, it may not be immediately clear why/how certain things are called/triggered.
The below explanation points you in the right direction, so you can research further.
Some (inconspicuously) used/relevant node modules are explicitly mentioned with package name.

*****

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
But you'd like to have the URL reflect this, and allow user to use browser history (back/forward). A router takes care of these things. (package react-router)

In this case, the root of your app is not the Application React component.
This starts at `/lib/server.js` which wil use `/config/app.jsx` which instantiates the router and ultimately uses `/app/mainRoutes.jsx` to load routes.
You'll find that all pages are subroutes within the `app` route, which instantiates `/app/Application/index.jsx`, which contains a `RouteHander` component that inserts subroute output.


## How the server JSON API works.
The `/lib/server.js` serves the application, but it also serves the API URLs that the stores talk with.
It initializes two databases (todolist and todoitem) once, and then continues to listen for GET/POST requests on specific URLs.


## How the stores work.
As in Flux; the Stores affect the React components. (package items-store)

todo :question: this section needs review and should be extended.

Note on `Application.update()`: normally components should not access the stores except for reading in `getState()`. Everything else should be done with actions.


## How the actions work.
As in Flux; the Actions affect the stores. (package items-store)

The actions are setup in `/app/mainStores.js` (bottom) from `/app/actions.js`, and triggered by the input fields in components, such as `/app/TodoPage/TodoList/index.jsx`.

The two stores (todolist and todoitem) are implemented in `/app/mainStores.js` and both based on `/app/mainStoresDescriptions.js` and both extended with the same custom client HTTP agent (package superagent) routines. 

todo :question: this section needs review and should be extended.


## How the 'Random fail!' works.
This [Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki) lives in `/lib/server.js` and helps you experience realistic server-client retrieval times and errors while developing.
At some time your application is requesting 3 things from the server, and they return in the wrong order and incomplete. Wil it break?
Or a form could not be sent to the server. Wil it notify the user?


## How the build works.
A build can compile your JS files into one big file, while applying some optimisations (to make it smaller, faster, or obfuscated).
Its also used to add files and features (otherwise not supported by JS in the browser) to your project, such as `JSX`, `markdown`, or `SASS`.

When you start run a dev-server (like `npm run dev-server` or `npm run hot-dev-server`) it does the builds for you, while it watches for changing files.
Or you can manually do a normal build using the `npm run build`. Note: these `npm run` scripts are defined in `/package.json`.

Depending on what way you used to do this build, a different build configuration is used. For example the normal build script as seen in `/package.json` starts webpack with custom config `/webpack-production.config.js` which uses shared config `/make-webpack-config.js`.
Most webpack configuration is in that shared config file, per entry. Only one main entry is defined. Prerendering happens depending on the custom config.
This is where a lot of node modules (packages) come into play: loaders add JSX support, debug options are set, and the output is set to `/build/` is set.
