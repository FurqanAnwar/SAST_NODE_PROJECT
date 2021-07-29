const path = require("path");
module.exports = {
    entry: "./public/js/index.js",
    output:{
        filename: "bundle.project.js",
        output: path.resolve(__dirname,"dist")
    }
};