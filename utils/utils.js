/**
 * Title: Utilities
 * Description: All utilities related funcs
 * Author: Marzuk Zarir
 * Date: 23-07-2021
 *
 */

const mimeType = require('mime-types').lookup

const utils = {}

/**
 * Write Content to the response object
 * @param {object} responseObj
 * @param {number} statusCode
 * @param {array|object} file
 * @param {object} errObj
 */
utils.writeContent = (responseObj, statusCode = 200, file, errObj = null) => {
    if (!errObj) {
        // Auto mime-type as file name using 'mime-types' package
        responseObj.writeHead(statusCode, { 'Content-type': mimeType(file) })
        responseObj.end(file)
    } else {
        responseObj.writeHead(statusCode, { 'Content-type': 'Application/json' })
        responseObj.end(JSON.stringify(errObj))
    }
}

/**
 * Parse json to js object
 * @param {JSON} json
 * @returns {object}
 */
utils.parseJSON = (json) => {
    let object
    try {
        object = JSON.parse(json)
    } catch (e) {
        object = {}
    } finally {
        return object
    }
}

/**
 * Check object is empty or not: https://stackoverflow.com/a/59787784/15116934
 * @param {object} obj
 * @returns {boolean}
 */
utils.isEmptyObj = (obj) => {
    let isEmpty = true
    for (let i in obj) isEmpty = false
    return isEmpty
}

/**
 * Exact RegExp match
 * @param {RegExp} regex regular expression for string match
 * @param {string} string string want to match
 * @returns {boolean} is exactly match?
 */
utils.regexMatch = (regex, string) => {
    const match = string.match(regex)
    console.log({ string, match })
    return match && string === match[0]
}

module.exports = utils
