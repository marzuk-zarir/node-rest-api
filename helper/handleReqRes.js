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
    postContact,
    putContact,
    deleteContact
} = require('../controllers/contactController')

const handler = {}

handler.handleReqRes = (req, res) => {
    const allowedMethods = ['get', 'post', 'put', 'delete']
    const reqMethod = req.method.toLowerCase()
    let reqBody = ''
    let parsedUrl = url.parse(req.url, true)
    const queryString = parsedUrl.query
    const parsedUrlWithQuery = parsedUrl.path.replace(/^\/+|\/+$|\??$/g, '')
    // Parse only route without unwanted slashes and question mark
    parsedUrl = parsedUrl.pathname.replace(/^\/+|\/+$|\??$/g, '')

    // Request payload come with buffer with 'data' event emit.we can push chunk in a variable
    req.on('data', (chunkData) => {
        reqBody += chunkData
    })

    // When full payload come then 'end' event emit on request
    req.on('end', async () => {
        // If client request with unwanted method throw error
        if (allowedMethods.indexOf(reqMethod) < 0) {
            writeContent(res, 405, { status: 'Requested method is not allowed' })
            return
        }

        // ! Get single contact - /api/contacts/:id
        if (parsedUrl.match(/api\/contacts\/([0-9]+)/) && reqMethod === 'get') {
            const id = parsedUrl.split('/')[2] // => ['api','contacts',':id']
            getContactById(req, res, id)
            return
        }

        // ! Get single contact - /api/contacts?key=value
        if (
            parsedUrlWithQuery.match(/api\/contacts\/?\?\w+=\w+/) &&
            reqMethod === 'get'
        ) {
            getContactByQuerystring(req, res, queryString)
            return
        }

        // ! Get all contacts - /api/contacts
        if (parsedUrl === 'api/contacts' && reqMethod === 'get') {
            getContacts(req, res)
            return
        }

        // ! Post single contact - /api/contacts
        if (parsedUrl === 'api/contacts' && reqMethod === 'post') {
            postContact(req, res, reqBody)
            return
        }

        // ! Put single contact - /api/contacts/:id
        if (parsedUrl.match(/api\/contacts\/([0-9]+)/) && reqMethod === 'put') {
            const id = parsedUrl.split('/')[2]
            putContact(req, res, id, reqBody)
            return
        }

        // ! Delete single contact - /api/contacts/:id
        if (parsedUrl.match(/api\/contacts\/([0-9]+)/) && reqMethod === 'delete') {
            const id = parsedUrl.split('/')[2]
            deleteContact(req, res, id)
            return
        }

        // If url is empty, load index html
        if (parsedUrl === '') {
            parsedUrl = 'index.html'
        }

        // Static site generation for application frontend
        try {
            // File path wise mimetype set.
            const filePath = path.resolve(__dirname, '../public', parsedUrl)
            const fileContent = await fs.readFile(filePath, 'utf-8')
            writeContent(res, 200, fileContent, false, filePath)
        } catch (e) {
            writeContent(res, 404, { status: '404 Route not found' })
        }
    })
}

module.exports = handler
