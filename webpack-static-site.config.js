module.exports = [
    require("./make-webpack-config")({
        longTermCaching: true,
        separateStylesheet: true,
        minimize: true,
        staticSite:true
    }),
    require("./make-webpack-config")({
        prerender: true,
        minimize: true,
        staticSite:true
    })
];