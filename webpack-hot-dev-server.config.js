module.exports = require("./make-webpack-config")({
	hot: true,
	devServer: true,
	hotComponents: true,
	devtool: "eval",
	debug: true,
});
