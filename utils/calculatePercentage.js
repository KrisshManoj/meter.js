module.exports = (min, max, current) => {
    return ((current - min) / (max - min)) * 100
}