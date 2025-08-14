const express = require('express')
const createtask = require('../controller/createtaskController')
const checkCookieAuth = require('../middleware/checkToken')
const gettask = require('../controller/gettaskController')
const updatetask = require('../controller/TaskStatusController')
const updatetaskdata = require('../controller/updatetaskController')
const deletetask = require('../controller/deletetaskcontroller')
const createRouter = express.Router()
createRouter.post('/createtask',checkCookieAuth,createtask),
createRouter.put('/updatestatustask',updatetask),
createRouter.put('/updatetask',updatetaskdata),
createRouter.delete('/deletetask',deletetask),
createRouter.get('/gettask',checkCookieAuth,gettask),
module.exports = createRouter