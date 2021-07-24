const contactsContainer = document.querySelector('#contactsContainer')

// Main object
const app = {}

app.init = () => {
    app.getAllContacts()
}

// GET - get all contacts form rest api
app.getAllContacts = async () => {
    try {
        const res = await fetch('/api/contacts')
        const contacts = await res.json()
        // Iterate single contact and render in DOM
        contacts.forEach(contact => {
            app.renderSingleContact(contact, contactsContainer)
        })
    } catch (e) {
        console.log(e.message)
    }
}

// Render single contact on DOM
app.renderSingleContact = (contact, parent) => {
    const { id, name, email, phone } = contact

    parent.innerHTML += `
    <tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${email}</td>
        <td>${phone}</td>
    </tr>
    `
}

document.addEventListener('DOMContentLoaded', app.init)
