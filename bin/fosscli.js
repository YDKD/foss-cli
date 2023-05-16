#!/usr/bin/env node

const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const inquirer = require('inquirer');

const TEMPLATE_DIR = path.resolve(__dirname, '../templates');

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter project name:',
  },
  {
    type: 'list',
    name: 'technology',
    message: 'Select technology:',
    choices: ['React', 'Vue', 'Angular'],
  },
];

inquirer.prompt(questions).then((answers) => {
  const { projectName, technology } = answers;

  const projectDirectory = `${process.cwd()}/${projectName}`;
  console.log(projectDirectory)

  const templatePath = path.join(TEMPLATE_DIR, technology.toLowerCase());
  const files = fs.readdirSync(templatePath);

  // 判断是否已经存在此文件夹
  if (!fs.existsSync(projectDirectory)) {
    // Create project directory
    fs.mkdirSync(projectDirectory);
  }

  files.forEach(file => {
    const filePath = path.join(templatePath, file);
    const content = ejs.render(fs.readFileSync(filePath, 'utf-8'), { projectName });
    fs.writeFileSync(path.join(projectDirectory, `${projectName}.${technology}`), content);
  });



  // Create index.js file

  console.log(`Created ${projectName} project with ${technology} technology in ${projectDirectory} directory.`);
});
