
const express = require('express')
const ToolsController = require('./controllers/ToolsController')

const router = express.Router()

const apiV1 = require('./controllers/ApiRoute1')
const apiV2 = require('./controllers/ApiRoute2')
const ChatRoute = require('./controllers/ChatRoute')

router.use('/api', apiV1)
router.use('/api', apiV2)
router.use('/api', ChatRoute)

// router.get('/test-get', ToolsController.show)
// router.post('/test-post', store)
// router.delete('/test-delete/:id', ToolsController.delete)

function store(req, res) {
    const tools = {}
    return res.status(201).send({})
}

module.exports = router