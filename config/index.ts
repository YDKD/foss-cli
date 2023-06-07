import path from 'node:path';

import commands from './commands';

// 模板文件夹
const TEMPLATE_DIR = path.resolve(process.cwd(), 'templates')

// banner txt
const BANNER_TXT = `FOSS CLI`

// 项目文件夹
const PROJECT_DIR = process.cwd()

// 移除选项参数配置
const REMOVE_REQUESTIONS = [
  {
    type: 'confirm',
    name: 'remove',
    message: '此文件夹已经存在，是否删除后，重新再次创建？',
    initial: true,
  }
]

// 项目创建配置
const PROJECT_CONFIG = {
  /**
  * 默认项目名
  */
  DEFAULT_PROJECT_NAME: 'my-project',
  /**
   * 默认模板
   */
  DEFAULT_TEMPLATE: 'foss-vue-template',
}

// 仓库配置
const REPO_CONFIG = {
  /**
   * 仓库地址 前缀
   */
  REPO_URL_PREFFIX: 'https://api.github.com/orgs/foss-y/repos',
  /**
   * 仓库标签地址 前缀
   */
  REPO_TAGS_URL_PREFFIX: 'https://api.github.com/repos/foss-y',
  /**
   * 默认分支
   */
  REPO_DEFAULT_BRANCH: 'main',
}

export {
  TEMPLATE_DIR,
  PROJECT_DIR,
  REMOVE_REQUESTIONS,
  PROJECT_CONFIG,
  commands,
  REPO_CONFIG,
  BANNER_TXT
}
