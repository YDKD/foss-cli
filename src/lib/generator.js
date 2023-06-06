const chalk = require('chalk');
const util = require('util')
const inquirer = require('inquirer');
const downloadGitRepo = require('download-git-repo')

const { wrapLoading } = require('../utils');
const log = require('../log');


class Generator {
  constructor(selectTemplateName, targetDir) {
    this.selectTemplateName = selectTemplateName;
    this.targetDir = targetDir;

    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  async handleTag(tagsList) {

    const tagNameList = tagsList.map(item => item.name).filter(item => item)

    // 2）用户选择自己需要下载的 tag
    const {
      tag
    } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagNameList,
      message: 'Place choose a tag to create project'
    })

    // 3）return 用户选择的 tag
    return tag
  }

  async download(repo, tag) {
    const requestUrl = `direct:${repo}${tag ? '#' + tag : ''}`
    console.log('requestUrl', requestUrl, 'targetDir', this.targetDir)


    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template',
      requestUrl,
      this.targetDir,
      { clone: true },
      (err) => {
        spinner.fail(err);
      }
    )
  }


  async create(repoInstance, projectName) {
    const tagsList = await repoInstance.getTags(this.selectTemplateName)
    if (!tagsList) return;

    const selectTag = await this.handleTag(tagsList)
    console.log('selectTag', selectTag)
    const selectRepo = repoInstance.repoList.find(item => item.name === this.selectTemplateName)

    // 下载模板
    await this.download(selectRepo.clone_url, selectTag)

    log(`\r\nSuccessfully created project ${projectName}`, 'blue')

  }
}

module.exports = Generator;