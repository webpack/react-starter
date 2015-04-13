module.exports = require("./make-webpack-config")({
	devServer: true,
	//devtool: "eval",
	devtool: "source-map",
	debug: true
});
