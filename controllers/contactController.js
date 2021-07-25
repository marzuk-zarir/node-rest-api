/**
 * Title: Contact Controller
 * Description: Handler request for contacts
 * Author: Marzuk Zarir
 * Date: 25-07-2021
 *
 */

const path = require('path')
const fs = require('fs/promises')
const { writeContent, parseJSON, isEmptyObj } = require('../utils/utils')

const controller = {}
const contactsFile = path.resolve(__dirname, '../data/contacts.json')

/**
 * @description get all contacts
 * @route GET api/contacts/
 */
controller.getContacts = async (req, res) => {
    try {
        const contacts = await fs.readFile(contactsFile, 'utf-8')
        writeContent(res, 200, contacts)
    } catch (e) {
        writeContent(res, 500, null, { status: 'Internal server error' })
    }
}

/**
 * @description get a single contact by id
 * @route GET api/contact/:id
 */
controller.getContactById = async (req, res, contactId) => {
    try {
        const allContacts = await fs.readFile(contactsFile, 'utf-8')
        const parsedContacts = parseJSON(allContacts)

        if (!isEmptyObj(parsedContacts)) {
            const contact = parsedContacts.filter((contact) => contact.id == contactId)
            if (contact.length > 0) {
                writeContent(res, 200, JSON.stringify(contact))
            } else {
                writeContent(res, 404, null, { status: '404 Contact not found' })
            }
        } else {
            writeContent(res, 500, null, { status: 'Internal server error' })
        }
    } catch (e) {
        writeContent(res, 500, null, { status: 'Internal server error' })
    }
}

/**
 * @description get a single contact by querystring
 * @route GET api/contact?key=value
 */
controller.getContactByQuerystring = async (req, res, queryString) => {
    try {
        const allContacts = await fs.readFile(contactsFile, 'utf-8')
        const parsedContacts = parseJSON(allContacts)

        if (!isEmptyObj(parsedContacts)) {
            if (Object.keys(queryString).length === 1) {
                const queryKey = Object.keys(queryString)
                const queryValue = Object.values(queryString)
                let contact

                // Iterate every objects
                userContact: for (const singleContact of parsedContacts) {
                    // Iterate every field of and object
                    for (let field in singleContact) {
                        // If query field match with object field
                        if (field === queryKey[0]) {
                            // If query value match with object value
                            if (singleContact[field] == queryValue[0]) {
                                contact = singleContact
                                break userContact
                            }
                        }
                    }
                }

                // If contact is null, contact is not found in database
                if (contact) {
                    writeContent(res, 200, JSON.stringify(contact))
                } else {
                    writeContent(res, 404, null, { status: 'User not found :(' })
                }
            } else {
                writeContent(res, 400, null, {
                    status: 'More than one query is not accepted'
                })
            }
        } else {
            writeContent(res, 500, null, { status: 'Internal server error' })
        }
    } catch (e) {
        console.log(e.message)
        writeContent(res, 500, null, { status: 'Internal server error' })
    }
}

/**
 * @description create a single contact
 * @route POST api/contacts
 */
controller.postContact = () => {}

/**
 * @description update a single contact
 * @route PUT api/contacts
 */
controller.putContact = () => {}

/**
 * @description delete a single contact
 * @route DELETE api/contacts
 */
controller.deleteContacts = () => {}

module.exports = controller
