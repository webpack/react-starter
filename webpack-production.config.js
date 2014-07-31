module.exports = [
	require("./make-webpack-config")({
		longTermCaching: true,
		separateStylesheet: true,
	}),
	require("./make-webpack-config")({
		server: true,
		separateStylesheet: true,
	})
];