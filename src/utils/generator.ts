import fs from 'node:fs'
import log from '../log'

const generator = (createFilePath: string, fullFilePath: string, templatePath: string) => {

  // 读取模板文件内容
  let fileContent = ''
  try {
    fileContent = fs.readFileSync(templatePath, { encoding: 'utf-8' })
  } catch (err: any) {
    throw new Error(err)
  }

  /**
   * @return {*}
   * @description: 文件写入
   * @author: YDKD
   */
  const writeFileFn = () => {
    // 写入文件
    fs.writeFile(fullFilePath, fileContent, (err: any) => {
      if (err) {
        console.error('写入文件时发生错误:', err);
      } else {
        log('文件创建成功:' + fullFilePath, 'green')
      }
    });
  }


  if (fs.existsSync(createFilePath)) {
    // 创建文件
    writeFileFn()
  } else {
    // 创建对应的文件
    fs.mkdirSync(createFilePath)
    // 创建文件
    writeFileFn()

  }
}

export { generator }
