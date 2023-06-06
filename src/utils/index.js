const cloneRepo = require('./clone')
const str = require('./str')
const generator = require('./generator')

module.exports = {
  cloneRepo,
  ...str,
  generator
}
