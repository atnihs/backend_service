const express = require('express')
const axios = require('axios')
const router = express.Router()

router.get('/:chain', async function (req, res) {
    const chain = req.params.chain
    let { address, asset, limit, end } = req.query
    if (address && asset) {
        let url = `https://api.trustwallet.com/v2/chains/${chain}/transactions?address=${address}&version=4&asset=${asset}`

        limit = parseInt(limit)
        if (limit < 1 || isNaN(limit)) limit = 10
        url += `&limit=${limit}`

        if (end) url += `&block_created_at_before=${end}`
        console.log({ url })
        try {
            var response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Trust/7.23 Android/29-REL'
                }
            })
            return res.send(response.data)
        } catch (e) {
            if (e.response) {
                return res.send(e.response.data).status(e.status)
            }
        }
    }

    return res.send({
        total: 0,
        docs: []
    })
})

module.exports = router

