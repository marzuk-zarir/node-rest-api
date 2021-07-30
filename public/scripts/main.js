/**
 * Title: Contact Book App
 * Description: contact book application frontend script
 * Author: Marzuk Zarir
 * Date: 29-07-2021
 *
 */

;(function () {
    const contactsWrapper = document.querySelector('#contacts-container')
    const alertWrapper = document.querySelector('#alert-wrapper')
    const addContactModal = new bootstrap.Modal(
        document.querySelector('#add-contact-modal')
    )
    const addContactForm = document.querySelector('#add-contact-form')
    const editContactModal = new bootstrap.Modal(
        document.querySelector('#edit-contact-modal')
    )
    const editContactForm = document.querySelector('#edit-contact-form')
    const editName = editContactForm.querySelector('#edit-name')
    const editPhone = editContactForm.querySelector('#edit-phone')
    const editEmail = editContactForm.querySelector('#edit-email')
    const app = {}

    /**
     * When browser loaded markup then load this script
     * @event
     */
    window.addEventListener('DOMContentLoaded', () => {
        app.init()
    })

    /**
     * Application main function
     */
    app.init = () => {
        app.getContacts()
        app.addContact()
        app.editContactForm()
    }

    /**
     * Get all contacts for first time load
     * @async
     */
    app.getContacts = async () => {
        try {
            const data = await fetch('/api/contacts')
            const contacts = await data.json()
            if (data.status === 200) {
                contacts.forEach((contact) => {
                    app.renderSingleContact(contact, contactsWrapper)
                })
            } else {
                throw Error(`Error ${data.status}: When fetching data 😢😢`)
            }
        } catch (e) {
            app.renderErrorMsg(e.message, contactsWrapper)
        }
    }

    /**
     * Add new contact
     */
    app.addContact = () => {
        const name = addContactForm.querySelector('#new-name')
        const email = addContactForm.querySelector('#new-email')
        const phone = addContactForm.querySelector('#new-phone')
        addContactForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const validateContact = app.validateContact(name, phone, email)

            if (validateContact) {
                try {
                    const data = await fetch('/api/contacts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'Application/json'
                        },
                        body: JSON.stringify(validateContact)
                    })
                    const newContact = await data.json()
                    if (data.status === 200) {
                        app.renderSingleContact(newContact, contactsWrapper)
                        app.renderAlert(
                            'Contact is created successfully 😇😇',
                            'alert-success',
                            alertWrapper
                        )
                    } else {
                        throw Error(
                            `Error ${data.status}: Contact is not created successfully 😢😢`
                        )
                    }
                } catch (e) {
                    app.renderAlert(e.message, 'alert-error', alertWrapper)
                } finally {
                    addContactModal.hide()
                    app.resetFormField(name, phone, email)
                }
            }
        })
    }

    /**
     * Edit contact form
     */
    app.editContactForm = () => {
        editContactForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            if (app.tempContactId === undefined) return false
            const validateContact = app.validateContact(editName, editPhone, editEmail)
            if (validateContact) {
                try {
                    const data = await fetch(`/api/contacts/${app.tempContactId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'Application/json' },
                        body: JSON.stringify(validateContact)
                    })
                    const { name, phone, email } = await data.json()

                    if (data.status === 200) {
                        app.renderAlert(
                            'Contact is updated successfully 😊😊',
                            'alert-success',
                            alertWrapper
                        )
                        for (let contactRow of [...contactsWrapper.children]) {
                            if (contactRow.children[0].innerText == app.tempContactId) {
                                contactRow.children[1].innerText = name
                                contactRow.children[2].innerText = phone
                                contactRow.children[3].innerText = email
                            }
                        }
                    } else {
                        throw Error(`Error ${data.status}: Contact was not updated 😭😭`)
                    }
                } catch (e) {
                    app.renderAlert(e.message, 'alert-error', alertWrapper)
                } finally {
                    editContactModal.hide()
                    app.resetFormField(editName, editPhone, editEmail)
                }
            }
        })
    }

    /**
     * Edit single contact
     * @param {number} id
     * @param {HTMLElement} name
     * @param {HTMLElement} phone
     * @param {HTMLElement} email
     */
    window.editContact = (id, name, phone, email) => {
        app.tempContactId = id
        editName.value = name
        editPhone.value = phone
        editEmail.value = email
        editContactModal.show()
    }

    /**
     * Delete single contact
     * @param {number} contactId
     */
    window.deleteContact = async (contactId) => {
        if (confirm('Are you sure you want to delete this contact ?')) {
            try {
                const contact = await fetch(`api/contacts/${contactId}`, {
                    method: 'Delete'
                })
                if (contact.status === 200) {
                    app.renderAlert(
                        'Contact is delete successfully 🤗🤗',
                        'alert-success',
                        alertWrapper
                    )
                    for (let contactRow of [...contactsWrapper.children]) {
                        if (contactRow.children[0].innerText == contactId) {
                            contactsWrapper.removeChild(contactRow)
                        }
                    }
                } else {
                    throw Error(
                        `Error ${contact.status}: Contact is not deleted successfully 😢😢`
                    )
                }
            } catch (e) {
                app.renderAlert(e.message, 'alert-error', alertWrapper)
            }
        }
    }

    /**
     * Render single contact
     * @param {{id:number,name:string,phone:string,email:string}} contact
     * @param {HTMLElement} wrapper
     */
    app.renderSingleContact = (contact, wrapper) => {
        const { id, name, phone, email } = contact
        const nameCell = 'this.parentNode.parentNode.parentNode.children[1].innerText'
        const phoneCell = 'this.parentNode.parentNode.parentNode.children[2].innerText'
        const emailCell = 'this.parentNode.parentNode.parentNode.children[3].innerText'

        wrapper.innerHTML += `
            <tr>
                <td>${id ? id : 'N/A'}</td>
                <td>${name ? name : 'N/A'}</td>
                <td>${phone ? phone : 'N/A'}</td>
                <td>${email ? email : 'N/A'}</td>
                <td>
                    <div class="btn-group">
                        <button
                            class="btn btn-sm btn-warning"
                            onclick="editContact(${id}, ${nameCell}, ${phoneCell}, ${emailCell})"
                        >
                            <i class="bi bi-pencil-square"></i>
                            <span class="d-none d-md-inline">Edit</span>
                        </button>
                        <button
                            class="btn btn-sm btn-danger"
                            onclick="deleteContact(${id})"
                        >
                            <i class="bi bi-trash"></i>
                            <span class="d-none d-md-inline">Delete</span>
                        </button>
                    </div>
                </td>
            </tr>
            `
    }

    /**
     * Render error message
     * @param {string} errMsg
     * @param {HTMLElement} wrapper
     */
    app.renderErrorMsg = (errMsg, wrapper) => {
        wrapper.innerHTML += `
            <tr>
                <td colspan="5" class="text-danger text-center h5">${errMsg}</td>
            </tr>
            `
    }

    /**
     * Render alert
     * @param {string} message
     * @param {string} alertClass
     * @param {HTMLElement} wrapper
     */
    app.renderAlert = (message, alertClass, wrapper) => {
        wrapper.innerHTML = ''
        wrapper.innerHTML = `
        <div class="alert ${alertClass} mb-0 position-fixed fade show" style="top:10px;right:10px" role="alert">
            ${message}
        </div>
        `
        setTimeout(() => (wrapper.innerHTML = ''), 3000)
    }

    /**
     * Validate single contact
     * @param {HTMLElement} name
     * @param {HTMLElement} phone
     * @param {HTMLElement} email
     * @returns {{name:string,phone:string,email:string}|false}
     */
    app.validateContact = (name, phone, email) => {
        const isValidName = app.regexMatch(/([a-z]|\s){5,15}/gi, name.value.trim())
        const isValidPhone = app.regexMatch(/01[1-9]\d{8}/g, phone.value.trim())
        const isValidEmail = app.regexMatch(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            email.value.trim()
        )
        if (!isValidName) name.classList.add('is-invalid')
        if (!isValidPhone) phone.classList.add('is-invalid')
        if (!isValidEmail) email.classList.add('is-invalid')

        if (isValidName && isValidPhone && isValidEmail) {
            name.classList.remove('is-invalid')
            email.classList.remove('is-invalid')
            phone.classList.remove('is-invalid')
            return {
                name: name.value.trim(),
                phone: phone.value.trim(),
                email: email.value.trim()
            }
        } else {
            return false
        }
    }

    /**
     * Exact regex match
     * @param {RegExp} regex - regex want to match
     * @param {string} value - which string want to compare with regex
     * @returns {boolean}
     */
    app.regexMatch = (regex, value) => {
        const match = value.match(regex)
        return match && value === match[0]
    }

    /**
     * Reset form field
     * @param {HTMLElement} name
     * @param {HTMLElement} phone
     * @param {HTMLElement} email
     */
    app.resetFormField = (name, phone, email) => {
        name.value = ''
        phone.value = ''
        email.value = ''
    }
})()
