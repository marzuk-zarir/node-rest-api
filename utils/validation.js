/**
 * Title: Validation
 * Description: Validate provide object field
 * Author: Marzuk Zarir
 * Date: 25-07-2021
 *
 */

const { regexMatch } = require('./utils')
const validate = {}

/**
 * Validate a single POST contact
 * @param {{name:string, email: string, phone: string}} contact
 * @returns {false|{name, email, phone}}
 */
validate.validatePostContact = (contact) => {
    let { name, email, phone } = contact
    name = validate._validateName(name)
    email = validate._validateEmail(email)
    phone = validate._validatePhone(phone)
    if (Object.keys(contact).length === 3 && name && email && phone) {
        return { name, email, phone }
    }
    return false
}

/**
 * Validate a single PUT contact
 * @param {{name:string, email: string, phone: string}} contact
 * @returns {false|{name, email, phone}}
 */
validate.validatePutContact = ({ name, email, phone }) => {
    name = validate._validateName(name)
    email = validate._validateEmail(email)
    phone = validate._validatePhone(phone)
    return { name, email, phone }
}

/**
 * Validate name
 * @private
 * @param {string} name
 * @return {string|false}
 */
validate._validateName = (name) => {
    return typeof name === 'string' && regexMatch(/([a-z]|\s){1,15}/gi, name.trim())
        ? name.trim()
        : false
}

/**
 * Validate email
 * @ref regex from https://stackoverflow.com/a/46181/15116934
 * @private
 * @param {string} email
 * @return {string|false}
 */
validate._validateEmail = (email) => {
    const regex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return typeof email === 'string' && regexMatch(regex, email.trim())
        ? email.trim()
        : false
}

/**
 * Validate phone
 * @private
 * @param {string} phone
 * @return {string|false}
 */
validate._validatePhone = (phone) => {
    return typeof phone === 'string' && regexMatch(/01[1-9]\d{8}/g, phone.trim())
        ? phone.trim()
        : false
}

module.exports = validate
