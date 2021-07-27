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
const { validatePostContact, validatePutContact } = require('../utils/validation')

const controller = {}
const contactsFile = path.resolve(__dirname, '../data/contacts.json')

/**
 * Get all contacts
 * @route GET api/contacts/
 */
controller.getContacts = async (req, res) => {
    try {
        const contacts = await fs.readFile(contactsFile, 'utf-8')
        writeContent(res, 200, contacts, false)
    } catch (e) {
        writeContent(res, 500, { status: 'Internal server error' })
    }
}

/**
 * Get a single contact by id
 * @route GET api/contact/:id
 */
controller.getContactById = async (req, res, contactId) => {
    try {
        const allContacts = await fs.readFile(contactsFile, 'utf-8')
        const parsedContacts = parseJSON(allContacts)

        if (!isEmptyObj(parsedContacts)) {
            const contact = parsedContacts.findIndex((contact) => contact.id == contactId)
            if (contact > -1) {
                writeContent(res, 200, parsedContacts[contact])
            } else {
                writeContent(res, 404, { status: '404 Contact not found' })
            }
        } else {
            writeContent(res, 500, { status: 'Internal server error' })
        }
    } catch (e) {
        writeContent(res, 500, { status: 'Internal server error' })
    }
}

/**
 * Get a single contact by querystring
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
                    writeContent(res, 200, contact)
                } else {
                    writeContent(res, 404, { status: 'Contact not found' })
                }
            } else {
                writeContent(res, 400, { status: 'More than one query is not accepted' })
            }
        } else {
            writeContent(res, 500, { status: 'Internal server error' })
        }
    } catch (e) {
        console.log(e.message)
        writeContent(res, 500, { status: 'Internal server error' })
    }
}

/**
 * Create a single contact
 * @route POST api/contacts
 */
controller.postContact = async (req, res, payload) => {
    try {
        // Payload come with json formate.so, we should parse it in js object
        let postedContact = parseJSON(payload)
        postedContact = validatePostContact(postedContact)
        // Validation check
        if (postedContact) {
            const allContacts = await fs.readFile(contactsFile, 'utf-8')
            const parsedContacts = parseJSON(allContacts)
            const isPhoneMatch = parsedContacts.findIndex((contact) => {
                return contact.phone === postedContact.phone
            })
            if (isPhoneMatch === -1) {
                const lastSavedContactId =
                    parsedContacts.length > 0
                        ? parsedContacts[parsedContacts.length - 1].id
                        : 0
                // Set new contact's id to last saved contacts (id + 1)
                postedContact.id = lastSavedContactId + 1
                // Read contact array and push new contact
                parsedContacts.push(postedContact)
                // Update whole array in database
                await fs.writeFile(contactsFile, JSON.stringify(parsedContacts))
                // Response new contact to user
                writeContent(res, 200, postedContact)
            } else {
                writeContent(res, 400, {
                    status: 'Phone number already saved in database'
                })
            }
        } else {
            writeContent(res, 400, { status: 'There was a problem in your request' })
        }
    } catch (e) {
        console.log(e.message)
        writeContent(res, 500, { status: 'Internal server error' })
    }
}

/**
 * Update a single contact
 * @route PUT api/contacts
 */
controller.putContact = async (req, res, id, payload) => {
    try {
        // Grab request payload and validate it
        const contact = parseJSON(payload)
        const { name, email, phone } = validatePutContact(contact)
        // Read and parse all exiting contacts
        const allContacts = await fs.readFile(contactsFile, 'utf-8')
        const parsedContacts = parseJSON(allContacts, [])
        // Checks if requested id was saved in database
        const findContact = parsedContacts.findIndex((contact) => contact.id == id)

        if (findContact > -1) {
            // Check at least one field is validate
            if (name || email || phone) {
                // Grab the updated contact object form parsed contacts array
                // todo: As object is muted, when we update property on 'updateContact' object automatically property updated in requested contact object of 'parsedContacts' array
                const updateContact = parsedContacts[findContact]
                // Update field as user's input
                if (name) updateContact.name = name
                if (email) updateContact.email = email
                if (phone) updateContact.phone = phone
                // Write all contacts in database
                await fs.writeFile(contactsFile, JSON.stringify(parsedContacts))
                // Response the updated contact to user
                writeContent(res, 200, updateContact)
            } else {
                writeContent(res, 400, { status: 'Invalid update field' })
            }
        } else {
            writeContent(res, 404, { status: 'Contact not found' })
        }
    } catch (e) {
        console.log(e.message)
        writeContent(res, 500, { status: 'Internal sever error!!' })
    }
}

/**
 * Delete a single contact
 * @route DELETE api/contacts
 */
controller.deleteContact = async (req, res, id) => {
    try {
        const allContacts = await fs.readFile(contactsFile, 'utf-8')
        const contacts = parseJSON(allContacts)
        const findRemoveContactIndex = contacts.findIndex((contact) => {
            return contact.id == id
        })
        if (findRemoveContactIndex > -1) {
            contacts.splice(findRemoveContactIndex, 1)
            await fs.writeFile(contactsFile, JSON.stringify(contacts))
            writeContent(res, 200, {})
        } else {
            writeContent(res, 404, { status: 'Contact not found' })
        }
    } catch (e) {
        console.log(e.message)
        writeContent(res, 500, { status: 'Internal sever error!!' })
    }
}

module.exports = controller
