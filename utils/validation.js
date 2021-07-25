/**
 * Title: Validation
 * Description: Validate provide object
 * Author: Marzuk Zarir
 * Date: 25-07-2021
 *
 */

const { regexMatch } = require('./utils')
const validate = {}

/**
 * validate a single contact
 * @param {{name:string, email: string, phone: string}} contact
 * @returns {false|{name, email, phone}}
 */
validate.validateContact = (contact) => {
    let { name, email, phone } = contact
    name =
        typeof name === 'string' && regexMatch(/\w{1,10}/gi, name.trim())
            ? name.trim()
            : false
    email =
        typeof email === 'string' && regexMatch(/\w+\d?@[a-z]+\.[a-z]+/gi, email.trim())
            ? email.trim()
            : false
    phone =
        typeof phone === 'string' && regexMatch(/01[1-9]\d{8}/g, phone.trim())
            ? phone.trim()
            : false
    console.log({ name, email, phone })
    if (Object.keys(contact).length === 3 && name && email && phone) {
        return { name, email, phone }
    }
    return false
}

module.exports = validate
