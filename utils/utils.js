/**
 * Title: Utilities
 * Description: All utilities related funcs
 * Author: Marzuk Zarir
 * Date: 23-07-2021
 *
 */

const mimeType = require('mime-types').lookup

const utils = {}

// Write Content
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

// Parse json to js object
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

// Check object is empty or not
// fastest operation => https://stackoverflow.com/a/59787784/15116934
utils.isEmptyObj = (obj) => {
    let isEmpty = true
    for (let i in obj) isEmpty = false
    return isEmpty
}

module.exports = utils
