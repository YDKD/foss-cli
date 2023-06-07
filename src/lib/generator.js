const ora = require('ora');
const util = require('util')
const prompts = require('@posva/prompts');
const downloadGitRepo = require('download-git-repo')

const { wrapLoading } = require('../utils');
const log = require('../log');
const { REPO_CONFIG } = require('../../config');


class Generator {
  constructor(selectTemplateName, targetDir) {
    this.selectTemplateName = selectTemplateName;
    this.targetDir = targetDir;

    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  async handleTag(tagsList) {

    const tagNameList = tagsList.map(item => ({
      title: item.name
    })).filter(item => item)

    // 2）用户选择自己需要下载的 tag
    const {
      tag
    } = await prompts({
      name: 'tag',
      type: 'autocomplete',
      choices: tagNameList,
      message: 'Place choose a tag to create project'
    })

    // 3）return 用户选择的 tag
    return tag
  }

  async download(repo, tag) {
    const requestUrl = `direct:${repo}${tag ? '#' + tag : ''}#${REPO_CONFIG.REPO_DEFAULT_BRANCH}`


    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template',
      requestUrl,
      this.targetDir,
      { clone: true }
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
