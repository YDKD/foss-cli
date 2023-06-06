// lib dependencies
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const inquirer = require('inquirer');
const { Generator, Repo } = require('../lib')

// local dependencies
const log = require('../log/index.js');
const { TEMPLATE_DIR, PROJECT_DIR, REMOVE_REQUESTIONS, PROJECT_CONFIG } = require('../../config/index.js');
const cloneRepo = require('../utils/clone.js');

module.exports = async () => {
  const questions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter project name:',
      default: PROJECT_CONFIG.DEFAULT_PROJECT_NAME,
    },
    {
      type: 'list',
      name: 'template',
      message: 'Select a template to create project',
      choices: [],
      default: PROJECT_CONFIG.DEFAULT_TEMPLATE,
    },
  ];

  // 获取当前有哪些模板可以选择
  const repoInstance = new Repo();

  const repoList = await repoInstance.getRepoList();

  // 处理模板名称
  const repoNames = repoList.map((item) => {
    if (item.name?.indexOf('template') != -1) {
      return item.name
    }
  }).filter((item) => item)

  questions[1].choices = repoNames

  inquirer.prompt(questions).then((answers) => {
    const { projectName, template: selectTemplateName } = answers;

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
      inquirer.prompt(REMOVE_REQUESTIONS).then((answers) => {
        const { remove } = answers;
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
      }, (error) => {
        console.log(error)
      })
    }


  });
}
