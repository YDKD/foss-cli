import path from 'node:path'
import { generator } from '../../utils'

// 创建的文件夹名称
const createFileDictatoryName = 'api'
const fileSuffix = '.ts'

const handleApi = (fileName: string, filePath: string) => {

  // 模板路径
  const templatePath = path.join(__dirname, '../../templates', 'api/index.js')

  const createFilePath = filePath + '/' + createFileDictatoryName

  // 全文件路径
  const fullFilePath = createFilePath + '/' + fileName + fileSuffix

  generator(createFilePath, fullFilePath, templatePath)

}

export default handleApi
