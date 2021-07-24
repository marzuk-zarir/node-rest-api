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

const handler = {}

handler.handleReqRes = async (req, res) => {
    const contactsFile = path.resolve(__dirname, '../data/contacts.json')
    const allowedMethods = ['get', 'post', 'put', 'delete']
    let parsedUrl = url.parse(req.url, true)
    parsedUrl = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')

    // If client request unwanted request method throw error
    if (allowedMethods.indexOf(req.method.toLowerCase()) < 0) {
        writeContent(res, 405, null, { status: 'Requested method is not allowed' })
        return false
    }

    // If url is empty, load index html
    if (parsedUrl === '') {
        parsedUrl = 'index.html'
    } else if (parsedUrl === 'api/contacts') {
        try {
            const allContact = await fs.readFile(contactsFile, 'utf-8')
            writeContent(res, 200, allContact)
        } catch (e) {
            writeContent(res, 500, null, { status: 'Internal server error' })
        }
        return true
    }

    // Static site generation for application frontend
    try {
        const filePath = path.resolve(__dirname, '../public', parsedUrl)
        const file = await fs.readFile(filePath, 'utf-8')
        writeContent(res, 200, file)
    } catch (e) {
        writeContent(res, 404, null, { status: '404 Route not found :(' })
    }
}

module.exports = handler
