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
 * When browser auto requested to css,ico,js then fileName or filePath wise mimetype will set
 * @param {object} responseObj - Response object
 * @param {number} statusCode - Success or error http status code
 * @param {*} fileContent - Html, css, js or json file content
 * @param {boolean} stringify - If false fileContent will not stringify
 * @param {*} file - File path or name. Default is json
 */
utils.writeContent = (
    responseObj,
    statusCode = 200,
    fileContent,
    stringify = true,
    file = 'json'
) => {
    const stringifyFile = stringify ? JSON.stringify(fileContent) : fileContent
    responseObj.writeHead(statusCode, { 'Content-type': mimeType(file) })
    responseObj.end(stringifyFile)
}

/**
 * Parse json to js object
 * @param {JSON} json
 * @param {object} defaultReturn
 * @returns {object|[]|string|false|null}
 */
utils.parseJSON = (json, defaultReturn = {}) => {
    let object
    try {
        object = JSON.parse(json)
    } catch (e) {
        object = defaultReturn
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
    return match && string === match[0]
}

module.exports = utils
