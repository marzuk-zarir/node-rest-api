/**
 * Title: Contact book
 * Description: Customers contacts with rest api
 * Author: Marzuk Zarir
 * Date: 23-07-2021
 *
 */

const http = require('http')
const { handleReqRes } = require('./helper/handleReqRes')

// Main object
const app = {}

// App configuration
app.config = {
    name: 'Contact Book',
    port: process.env.PORT || 3000
}

// Create server
app.createServer = async () => {
    const server = http.createServer(await handleReqRes)
    server.listen(app.config.port, () => {
        console.log(`Server is running on port ${app.config.port}`)
    })
}

// Start the server
app.createServer()
