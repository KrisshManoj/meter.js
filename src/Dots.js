const Canvas = require("../utils/Canvas");
const calculatePercentage = require("../utils/calculatePercentage");

/**
 * Creates a dots progress bar!
 * @class
 * @example
 * const bar = new Dots({ ...options })
 */
module.exports = class Dots {
    /**
     * The customization options
     * @param {Object} options - customization
     */
    constructor(options = {}) {
        if (!options.fillColor) options.fillColor = "lime";
        if (!options.bgColor) options.bgColor = "white";
        if (!options.dots) options.dots = 5;

        if (typeof options.fillColor !== "string") throw new TypeError("options.fillColor must be a string!");
        if (typeof options.bgColor !== "string") throw new TypeError("options.bgColor must be a string!");
        if (typeof options.dots !== "number") throw new TypeError("options.textColor must be a number!");

        this.options = options;
    }

    /**
     * Set the minimum value in bar
     * @param {number} n - value 
     */
    setMin(n) {
        if (!n) throw new Error("n should be provided!");
        if (typeof n !== "number") throw new Error("n must be a number!");
        if (n < 0) throw new Error("n should be greater or equal to 0!");
        this.min = n;
    }

    /**
     * Set the maximum value in bar
     * @param {number} n - value
     */
    setMax(n) {
        if (!n) throw new Error("n should be provided!");
        if (typeof n !== "number") throw new Error("n must be a number!");
        if (n < 0) throw new Error("n should be greater or equal to 0!");
        this.max = n;
    }

    /**
     * Set the current progress value in bar
     * @param {number} n - value 
     */
    setCurrent(n) {
        if (!n) throw new Error("n should be provided!");
        if (typeof n !== "number") throw new Error("n must be a number!");
        if (n < 0) throw new Error("n should be greater or equal to 0!");
        this.current = n;
    }

    /**
     * renders and returns the progress bar
     * @returns {Buffer} - png buffer
     */
    build() {
        if (!this.min) throw new Error("min not provided!");
        if (!this.max) throw new Error("max not provided!");
        if (!this.current) throw new Error("current not provided!")
        if (this.min === this.max) throw new Error("min and max cannot be the same!");
        if (this.min > this.max) throw new Error("min should not be greater than max!");
        if (this.current > this.max) throw new Error("current should not be higher than max!");
        if (this.current < this.min) throw new Error("current should not be lower than min!");
        const percentage = calculatePercentage(this.min, this.max, this.current);
        const FilledDots = Math.floor((percentage / 100) * this.options.dots)
        const radius = 10
        const spacing = 30
        const Image = Canvas.createCanvas(50 + (this.options.dots - 1) * spacing + 50, 100);
        const Context = Image.getContext("2d");
        
        for (let i = 0; i < this.options.dots; i++) {
            Context.beginPath();
            Context.arc(50 + i * spacing, 50, radius, 0, Math.PI * 2);
            Context.fillStyle = i < FilledDots ? this.options.fillColor : this.options.bgColor;
            Context.fill();
        }

        return Image.toBuffer("image/png")
    }
}