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

module.exports = utils
