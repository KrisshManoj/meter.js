const Canvas = require("@napi-rs/canvas");

Canvas.GlobalFonts.registerFromPath("./fonts/Poppins-Bold.ttf", "Poppins-Bold");

module.exports = Canvas;