const Canvas = require("../utils/Canvas");
const calculatePercentage = require("../utils/calculatePercentage");

/**
 * Creates a pie chart styled progress bar!
 * @class
 * @example
 * const bar = new Pie({ ...options })
 */
module.exports = class Pie {
    /**
     * The customization options
     * @param {Object} options - customization
     */
    constructor(options = {}) {
        if (!options.primaryColor) options.primaryColor = "lime";
        if (!options.secondaryColor) options.secondaryColor = "white";
        if (!options.textEnabled) options.textEnabled = true;
        if (!options.textColor) options.textColor = "black";

        if (typeof options.primaryColor !== "string") throw new TypeError("options.primaryColor must be a string!");
        if (typeof options.secondaryColor !== "string") throw new TypeError("options.secondaryColor must be a string!");
        if (typeof options.textEnabled !== "boolean") throw new TypeError("options.textEnabled must be a boolean!");
        if (typeof options.textColor !== "string") throw new TypeError("options.textColor must be a string!");

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
        const Image = Canvas.createCanvas(250, 250);
        const Context = Image.getContext("2d");
        const Contents = [
            { value: this.current, color: this.options.primaryColor },
            { value: this.max - this.current, color: this.options.secondaryColor }
        ]
        const TotalValue = Contents.reduce((sum, item) => sum += item.value, 0);
        var startAngle = -Math.PI / 2;
        const Radius = Math.min(Image.width, Image.height) / 2 - 10;

        Contents.forEach(item => {
            const SliceAngle = (item.value / TotalValue) * 2 * Math.PI;
            const endAngle = startAngle + SliceAngle;

            Context.beginPath();
            Context.moveTo(Image.width / 2, Image.height / 2);
            Context.arc(Image.width / 2, Image.height / 2, Radius, startAngle, endAngle);
            Context.closePath();
            Context.fillStyle = item.color;
            Context.fill();

            startAngle = endAngle;
        })

        if (this.options.textEnabled === true) {
            Context.font = "50px Poppins-Bold";
            Context.fillStyle = this.options.textColor;
            Context.textAlign = "center";
            Context.textBaseline = "middle";
            Context.fillText(`${Math.round(percentage)}%`, Image.width / 2, Image.height / 2);
        }


        return Image.toBuffer("image/png");
    }
}