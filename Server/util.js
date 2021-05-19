var exports = module.exports = {}

const fs = require("fs")
const path = require("path")
const validator = require("validator")

/**
 * Converts a string to titlecase ("a super Duper cool Movie" -> "A Super Duper Cool Movie")
 * 
 * @param {string} text Text to titlecase
 * 
 * @returns {string} Titlecase-d text
 */
exports.titlecase = (text) => {
    text = text.toLowerCase().split(" ")
    for (var i = 0; i < text.length; i++) {
        text[i] = text[i].charAt(0).toUpperCase() + text[i].slice(1)
    }

    return text.join(" ")
}

/**
 * Synchronously reads a files data in utf8 and returns its contents
 * 
 * @param {string} path Exact path to file
 * 
 * @returns {string} Data of file at given path
 */
exports.readFile = (path) => {
    return fs.readFileSync(path, { encoding: "utf8", flag: "r" })
}

/**
 * Gets and returns the current application version in accordance with packaging set at build-time
 * 
 * @returns {string} Returns the full application version in proper form
 */
exports.getVersion = () => {
    let out = {
        name: exports.titlecase(global.rboxlo.env.NAME),
        version: exports.readFile(path.join(__dirname, "packaging", "version"))
    }

    if (fs.existsSync(path.join(__dirname, "packaging", "commit"))) {
        out.commit = exports.readFile(path.join(__dirname, "packaging", "commit")).replace(/^\s+|\s+$/g, "")
    }

    return out
}

/**
 * Validates and then normalizes an E-Mail address
 * 
 * @param {string} address Address to normalize
 * @param {boolean} stripSubAddress Whether to strip the "subaddress"-- e.g. the "+rboxlo" in "brighteyes+rboxlo@gmail.com"
 * 
 * @returns {(boolean|string)} Returns FALSE if it was not a valid E-Mail address, or the normalized E-Mail address
 */
exports.filterEmail = (address, stripSubAddress = true) => {
    address = address.trim()

    if (!validator.isEmail(address)) {
        return false
    }

    if (!stripSubAddress) {
        address = validator.normalizeEmail(address, {
            gmail_remove_subaddress: false,
            icloud_remove_subaddress: false,
            yahoo_remove_subaddress: false,
            outlookdotcom_remove_subaddress: false
        })
    } else {
        address = validator.normalizeEmail(address)
    }

    return address
}

// These two functions purposefully undocumented (used in .then-s while performing a 'fetch')

exports.fetchNet = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        let error = new Error(response.statusText)
        error.response = response

        throw error
    }
}

exports.parseFetchJson = (response) => {
    return response.json()
}