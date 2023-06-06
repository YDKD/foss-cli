
const path = require('node:path')
const { generator } = require('../../utils')

// 创建的文件夹名称
const createFileDictatoryName = 'router'
const fileSuffix = '.ts'

const handleRoute = (fileName, filePath) => {

  // 模板路径
  const templatePath = path.join(__dirname, '../../templates', 'router/index.js')

  const createFilePath = filePath + '/' + createFileDictatoryName

  // 全文件路径
  const fullFilePath = createFilePath + '/' + fileName + fileSuffix

  generator(createFilePath, fullFilePath, templatePath)

}

module.exports = handleRoute
