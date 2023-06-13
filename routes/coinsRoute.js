const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

router.route('/').get(function (req, res, next) {
    const fileJson = path.join(__dirname, '/../storage/coins.json')
    const data = JSON.parse(fs.readFileSync(fileJson).toString())
    res.send({data});
})

module.exports = router
