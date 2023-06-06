
const path = require('node:path')
const { generator } = require('../../utils')

// 创建的文件夹名称
const createFileDictatoryName = 'views'
const fileSuffix = '.vue'

const handleRoute = (fileName, filePath) => {
  // 模板路径
  const templatePath = path.join(__dirname, '../../templates', 'vue/index.js')

  const createFilePath = filePath + '/' + createFileDictatoryName + '/' + fileName

  // 全文件路径
  const fullFilePath = createFilePath + '/' + 'index' + fileSuffix

  generator(createFilePath, fullFilePath, templatePath)

}

module.exports = handleRoute
