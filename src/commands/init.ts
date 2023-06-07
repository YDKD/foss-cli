
import { program } from "commander";

import { handleApi, handleView, handleRoute } from '../services'


import { PROJECT_DIR } from '../../config'

import { toHumpName } from '../utils'

const init = (name: string) => {

  // 获取选项
  const options = program.opts();

  // 定义当前应该定义到那一个模板下
  // TIPS:这里默认选择了网站，如果需要创建到 admin 时，则就不需要创建到 website 了
  const isWebsite = options.admin ? false : options.website
  const isAdmin = options.admin

  // 定义文件创建路径
  let createPath = isAdmin ? '/admin' : isWebsite ? '/website' : ''

  if (createPath === '') {
    throw new Error('未配置目标创建模板')
  }

  const createFilePath = PROJECT_DIR + '/src/webapp' + createPath



  if (options.route) handleRoute(options.route, createFilePath);

  if (options.view) handleView(options.view, createFilePath);

  if (options.api) handleApi(toHumpName(options.api), createFilePath);

  if (name) {
    // 将获取到的name直接分发给对应的模块

    handleApi(toHumpName(name), createFilePath);
    handleView(name, createFilePath);
    handleRoute(name, createFilePath);
  }
}

export default init;
