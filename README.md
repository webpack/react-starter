# webpack/react-starter

Starter template for react and webpack.

## Features

* Compilation with webpack
* React and jsx
* react-router
* Stylesheets can be CSS, LESS, SASS, Stylus or mixed
* Embedded resources like images or fonts use DataUrls if appropriate
* A simple flag loads a react component (and dependencies) on demand.
* Development
  * Development server
  * Optionally Hot Module Replacement development server (LiveReload for Stylesheets and React components enabled)
  * Uses SourceUrl for performance, but you may switch to SourceMaps easily
* Production
  * Server example for prerendering for React components
  * Initial data inlined in page
  * Long Term Caching through file hashes enabled
  * Generate separate css file to avoid FOUC
  * Minimized CSS and javascript
* Also supports coffee-script files if you are more a coffee-script guy.
* You can also require markdown or text files for your content.
* Just require the files...

## Installation

Just clone this repo and change the `origin` git remote.

``` text
npm install
```


## Development server

``` text
# start the webpack-dev-server
npm run dev-server
# wait for the first compilation is successful

# in another terminal/console
# start the node.js server in development mode
npm run start-dev

# open this url in your browser
http://localhost:8080/
```

The configuration is `webpack-dev-server.config.js`.

Static HTML is served from `config/dev-server-public`.

It automatically recompiles and refreshes the page when files are changed.


## Hot Module Replacement development server

``` text
# start the webpack-dev-server in HMR mode
npm run hot-dev-server
# wait for the first compilation is successful

# in another terminal/console
# start the node.js server in development mode
npm run start-dev

# open this url in your browser
http://localhost:8080/
```

The configuration is `webpack-hot-dev-server.config.js`.

Static HTML is served from `config/dev-server-public`.

It automatically recompiles when files are changed. When a hot-replacement-enabled file is changed (i. e. stylesheets or React components) the module is hot-replaced. If Hot Replacement is not possible the page is refreshed.

Hot Module Replacement has a performance impact on compilation.


## Production compilation and server

``` text
# build the client bundle and the prerendering bundle
npm run build

# start the node.js server in production mode
npm run start

# open this url in your browser
http://localhost:80/
```

The configuration is `webpack-production.config.js`.

The server is at `lib/server.js`

The production setting builds two configurations: one for the client (`build/public`) and one for the serverside prerendering (`build/prerender`).


## Build visualization

After a production build you may want to visualize you modules and chunks tree.

Use the [analyse tool](http://webpack.github.io/analyse/) with the file at `build/stats.json`.


## Loaders and file types

Many file types are preconfigured, but not every loader is installed. If you get an error like `Cannot find module "xxx-loader"`, you'll need to install the loader with `npm install xxx-loader --save` and restart the compilation.


## Common changes to the configuration

### Add more entry points

(for a multi page app)

1. Add an entry point to `make-webpack-config.js` (`var entry`).
2. Add a new top-level react component in `app`.
3. (Optional) Enable `commonsChunk` in `webpack-production.config.js` and add `<script src="COMMONS_URL"></script>` to `app/prerender.html`.
4. Add a new HTML file in `config/dev-server-public` that references the new output file.
5. Restart compilation.

### Switch devtool to SourceMaps

Change `devtool` property in `webpack-dev-server.config.js` and `webpack-hot-dev-server.config.js` to `"source-map"` (better module names) or `"eval-source-map"` (faster compilation).

SourceMaps have a performance impact on compilation.

### Enable SourceMaps in production

1. Uncomment the `devtool` line in `webpack-production.config.js`.
2. Make sure that the folder `build\public\debugging` is access controlled, i. e. by password.

SourceMaps have a performance impact on compilation.

SourceMaps contains your unminimized source code, so you need to restrict access to `build\public\debugging`.


## License

Copyright (c) 2012-2014 Tobias Koppers [![Gittip donate button](http://img.shields.io/gittip/sokra.png)](https://www.gittip.com/sokra/)

MIT (http://www.opensource.org/licenses/mit-license.php)
