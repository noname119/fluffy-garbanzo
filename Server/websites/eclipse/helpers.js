var exports = module.exports = {}

const path = require("path")

const util = require(path.join(global.rboxlo.root, "util"))

exports.titlecase = util.titlecase

exports.strcmp = (x, y, opt) => {
    return (x == y) ? opt.fn(this) : opt.inverse(this)
}

exports.strcicmp = (x, y, opt) => {
    return (x.toLowerCase() == y.toLowerCase()) ? opt.fn(this) : opt.inverse(this)
}

exports.substring = (str, start, end) => {
    return str.substring(start, end)
}

exports.def = (x) => {
    return x !== undefined
}

exports.undef = (...x) => {
    throw `Please use 'unless' helper`
}