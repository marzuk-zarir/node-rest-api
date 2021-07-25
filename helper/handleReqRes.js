/**
 * Title: Handle request & response
 * Description: Handle request & response for different routes
 * Author: Marzuk Zarir
 * Date: 23-07-2021
 *
 */

const path = require('path')
const fs = require('fs/promises')
const url = require('url')

const { writeContent } = require('../utils/utils')
const {
    getContacts,
    getContactById,
    getContactByQuerystring,
    postContact
} = require('../controllers/contactController')

const handler = {}

handler.handleReqRes = (req, res) => {
    const allowedMethods = ['get', 'post', 'put', 'delete']
    const reqMethod = req.method.toLowerCase()
    let reqBody = ''
    let parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.path
    const queryString = parsedUrl.query
    // Parse only route without unwanted slashes and question mark
    parsedUrl = parsedUrl.path.replace(/^\/+|\/+$|\??$/g, '')

    // Request payload come with buffer with 'data' event emit.we can push chunk in a variable
    req.on('data', (chunkData) => {
        reqBody += chunkData
    })

    // When full payload come then 'end' event emit on request
    req.on('end', async () => {
        // If client request unwanted request method throw error
        if (allowedMethods.indexOf(reqMethod) < 0) {
            writeContent(res, 405, null, { status: 'Requested method is not allowed' })
            return
        }

        // ! Get single contact - api/contacts/:id
        if (parsedUrl.match(/api\/contacts\/([0-9]+)/) && reqMethod === 'get') {
            const id = parsedUrl.split('/')[2] // => ['api','contacts',':id']
            getContactById(req, res, id)
            return
        }

        // ! Get single contact - api/contacts?key=value
        if (parsedUrl.match(/api\/contacts\/?\?\w+=\w+/) && reqMethod === 'get') {
            getContactByQuerystring(req, res, queryString)
            return
        }

        // ! Get all contacts - api/contacts
        if (parsedUrl === 'api/contacts' && reqMethod === 'get') {
            getContacts(req, res)
            return
        }

        // ! Post single contact - api/contacts
        if (parsedUrl === 'api/contacts' && reqMethod === 'post') {
            postContact(req, res, reqBody)
            return
        }

        // If url is empty, load index html
        if (parsedUrl === '') {
            parsedUrl = 'index.html'
        }

        // Static site generation for application frontend
        try {
            const filePath = path.resolve(__dirname, '../public', parsedUrl)
            const file = await fs.readFile(filePath, 'utf-8')
            writeContent(res, 200, file)
        } catch (e) {
            writeContent(res, 404, null, { status: '404 Route not found :(' })
        }
    })
}

module.exports = handler
