// lib dependencies
// const fs = require('fs');
import fs from 'node:fs';
import prompts from '@posva/prompts';

import { Generator, Repo } from '../lib'

// local dependencies
import log from '../log';
import { TEMPLATE_DIR, PROJECT_DIR, REMOVE_REQUESTIONS, PROJECT_CONFIG } from '../../config/index.js';
import { IRepoItem } from '../lib/generator';

export default async () => {
  const questions = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Enter project name:',
      initial: PROJECT_CONFIG.DEFAULT_PROJECT_NAME
    },
    {
      type: 'autocomplete',
      name: 'template',
      message: 'Select a template to create project',
      choices: [],
      initial: PROJECT_CONFIG.DEFAULT_TEMPLATE
    },
  ];

  // 获取当前有哪些模板可以选择
  const repoInstance = new Repo();

  const repoList = await repoInstance.getRepoList();

  // 处理模板名称
  const repoNames = repoList.map((item: IRepoItem) => {
    if (item.name?.indexOf('template') != -1) {
      return {
        title: item.name
      }
    }
  }).filter((item: IRepoItem) => item)

  questions[1].choices = repoNames

  const templateResult = await prompts(questions as any)

  const { projectName, template: selectTemplateName } = templateResult;

  // 校验项目名称是否合法
  if (!projectName) {
    log('项目名称不能为空', 'red');
    return;
  }

  const projectDirectory = `${PROJECT_DIR}/${projectName}`;

  // 项目生成器
  const projectGenerator = new Generator(selectTemplateName, projectDirectory);

  // 判断是否已经存在此文件夹
  if (!fs.existsSync(projectDirectory)) {
    // Create project directory
    fs.mkdirSync(projectDirectory);

    // 开始创建项目
    projectGenerator.create(repoInstance, projectName);
  } else {
    const removeDirResult = await prompts(REMOVE_REQUESTIONS as any).catch((error) => {
      log('创建失败', 'red');
    })

    const { remove } = removeDirResult as any;
    if (remove === true) {
      // 兼容 node 版本
      fs.rmSync = fs.rmSync || fs.rmdirSync;
      fs.rmSync(projectDirectory, { recursive: true });
      fs.mkdirSync(projectDirectory);

      // 开始创建项目
      projectGenerator.create(repoInstance, projectName);

    } else {
      log('创建失败，文件夹已经存在', 'red');
    }
  }
}
