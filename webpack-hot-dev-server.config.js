module.exports = require("./make-webpack-config")({
	devServer: true,
	hotComponents: true,
	//devtool: "eval",
	devtool: "source-map",
	debug: true
});
