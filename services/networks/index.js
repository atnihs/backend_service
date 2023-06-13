const fs = require('fs')
const _exports = {}
fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js') {
        const fileNoExt = file.replace('.js', '')
        _exports[fileNoExt] = require('./' + file)
    }
})

module.exports = _exports
