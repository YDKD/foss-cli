const cloneRepo = require('./clone')
const str = require('./str')
const generator = require('./generator')
const wrapLoading = require('./wrapLoading')

module.exports = {
  cloneRepo,
  ...str,
  generator,
  wrapLoading
}
