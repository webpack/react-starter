var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var loadersByExtension = require("./config/loadersByExtension");
var joinEntry = require("./config/joinEntry");

module.exports = function(options) {
	var entry = {
		main: options.server ? "./app/prerender" : "./app/app"
	};
	var loaders = {
		"coffee": "coffee-redux-loader",
		"jsx": options.hotComponents ? ["react-hot-loader", "jsx-loader?harmony"] : "jsx-loader",
		"json": "json-loader",
		"json5": "json5-loader",
		"png|jgp|jpeg|git|svg": "url-loader?limit=10000",
		"woff": "url-loader?limit=100000",
		"ttf": "file-loader",
		"wav|mp3": "file-loader",
		"html": "html-loader",
		"md|markdown": ["html-loader", "markdown-loader"],
	};
	var stylesheetLoaders = {
		"css": "css-loader",
		"less": "css-loader!less-loader",
		"styl": "css-loader!stylus-loader",
		"sass": "css-loader!sass-loader",
	}
	var additionalLoaders = [
		// { test: /some-reg-exp$/, loader: "any-loader" }
	];
	var alias = {
	
	};
	var aliasLoader = {
	
	};
	var externals = [
	
	];
	var modulesDirectories = ["web_modules", "node_modules"];
	var extensions = ["", ".web.js", ".js", ".jsx"];
	var root = path.join(__dirname, "app");
	var output = {
		path: path.join(__dirname, "build", options.server ? "prerender" : "public"),
		filename: "[name].js" + (options.longTermCaching && !options.server ? "?[hash]" : ""),
		chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.longTermCaching && !options.server ? "?[chunkhash]" : ""),
		libraryTarget: options.server ? "commonjs2" : undefined
	};
	var plugins = [
		function() {
			if(!options.server) {
				this.plugin("done", function(stats) {
					require("fs").writeFileSync(path.join(__dirname, "build", "stats.json"), JSON.stringify(stats.toJson()));
				});
			}
		}
	];
	if(options.server) {
		aliasLoader["react-proxy$"] = "react-proxy/unavailable";
		externals.push(/^react(\/.*)?$/, /^reflux(\/.*)?$/);
		plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
	}


	if(options.devServer) {
		if(options.hot) {
			entry = joinEntry("webpack/hot/dev-server", entry);
		}
		entry = joinEntry("webpack-dev-server/client?http://localhost:2992", entry);
	}
	Object.keys(stylesheetLoaders).forEach(function(ext) {
		var loaders = stylesheetLoaders[ext];
		if(Array.isArray(loaders)) loaders = loaders.join("!");
		if(options.separateStylesheet) {
			stylesheetLoaders[ext] = ExtractTextPlugin.extract("style-loader", loaders);
		} else {
			stylesheetLoaders[ext] = "style-loader!" + loaders;
		}
	});
	if(options.separateStylesheet) {
		plugins.push(new ExtractTextPlugin("[name].css"));
	}

	return {
		entry: entry,
		output: output,
		target: options.server ? "node" : "web",
		module: {
			loaders: loadersByExtension(loaders).concat(loadersByExtension(stylesheetLoaders))
		},
		devtool: options.devtool,
		resolveLoader: {
			root: path.join(__dirname, "node_modules"),
			alias: aliasLoader
		},
		externals: externals,
		resolve: {
			root: root,
			modulesDirectories: modulesDirectories,
			extensions: extensions,
			alias: alias,
		},
		plugins: plugins
	};
};