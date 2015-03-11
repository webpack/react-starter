# How Stuff Works
At first sight, it may not be immediately clear why/how certain things are called/triggered. The below explanation points you in the right direction, so you can research further.


## How the app is served.
A JS webserver is included.

### development mode
Run the server using `npm start-dev`.
It wil use `/lib/server-development.js` which wil use `/lib/server.js` which wil use `/config/simple.js` which wil use `/app/simple.html`. A tiny HTML file is loaded, the JS is downloaded + executed + rendered, and ultimately output is shown.

### production mode
In this mode, the React HTML output is (pre)rendered (and populated) on the server (a.k.a. isomorphic).

Run the server using `npm start`.
It wil use `/lib/server-production.js` it wil use `/lib/server.js` which wil use `/config/prerender.jsx` which wil use `/app/prerender.html`. A big HTML file is loaded (and output is shown immediately), the JS is downloaded + executed + rendered, and output is updated.


## How a page updates while you are programming.
After running the app webserver in development mode (see above) you'd have to manually reload the page after changing a JSX file.
It is possible to automatically reload or update the page to reflect your changes, within a second.

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
todo


## How the stores work.
todo
