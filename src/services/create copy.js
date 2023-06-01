// lib dependencies
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const inquirer = require('inquirer');

// local dependencies
const log = require('../log/index.js');
const { TEMPLATE_DIR, PROJECT_DIR, REMOVE_REQUESTIONS, PROJECT_CONFIG } = require('../../config/index.js');

module.exports = () => {
  const questions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter project name:',
      default: PROJECT_CONFIG.DEFAULT_PROJECT_NAME,
    },
    {
      type: 'list',
      name: 'technology',
      message: 'Select technology:',
      choices: ['React', 'Vue', 'Angular'],
      default: PROJECT_CONFIG.DEFAULT_TECHNOLOGY,
    },
  ];



  inquirer.prompt(questions).then((answers) => {
    const { projectName, technology } = answers;

    // 校验项目名称是否合法
    if (!projectName) {
      log('项目名称不能为空', 'red');
      return;
    }

    const projectDirectory = `${PROJECT_DIR}/${projectName}`;
    console.log(projectDirectory)

    const templatePath = path.join(TEMPLATE_DIR, technology.toLowerCase());
    const files = fs.readdirSync(templatePath);

    // 判断是否已经存在此文件夹
    if (!fs.existsSync(projectDirectory)) {
      // Create project directory
      fs.mkdirSync(projectDirectory);
    } else {
      inquirer.prompt(REMOVE_REQUESTIONS).then((answers) => {
        const { remove } = answers;
        if (remove === true) {
          // 兼容 node 版本
          fs.rmSync = fs.rmSync || fs.rmdirSync;
          fs.rmSync(projectDirectory, { recursive: true });
          fs.mkdirSync(projectDirectory);
        } else {
          log('创建失败，文件夹已经存在', 'red');
        }
      }, (error) => {
        console.log(error)
      }
      )
    }

    // files.forEach(file => {
    //   const filePath = path.join(TEMPLATE_DIR, file);
    //   const content = ejs.render(fs.readFileSync(filePath, 'utf-8'), { projectName });
    //   fs.writeFileSync(path.join(projectDirectory, `${projectName}.${technology}`), content);
    // });



    // Create index.js file

    // console.log(`Created ${projectName} project with ${technology} technology in ${projectDirectory} directory.`);
  });
}
