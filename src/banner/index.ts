// 导出一个 banner 函数，用于生成 logo 文案
// 支持 esm 和 cjs 两种模块规范
//
// Path: src/banner/index.ts
import chalk from 'chalk'
import figlet from 'figlet'

import { BANNER_TXT } from '../../config'

export default function banner() {
  return chalk.green(
    figlet.textSync(BANNER_TXT, {
      font: '3D-ASCII',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })
  )
}
