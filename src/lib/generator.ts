import util from 'util';
import prompts from '@posva/prompts';

import { wrapLoading } from '../utils'
import log from '../log';
import { REPO_CONFIG } from '../../config';
import { downloadGitRepo } from './http'

interface ITagItem {
  name: string
}

interface IRepoItem {
  name: string
}


class Generator {
  selectTemplateName = ''
  targetDir = ''

  constructor(selectTemplateName: string, targetDir: string) {
    this.selectTemplateName = selectTemplateName;
    this.targetDir = targetDir;

  }

  async handleTag(tagsList: ITagItem[]) {

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

  async download(repo: string, tag: string) {
    await wrapLoading(
      downloadGitRepo,
      'waiting download template',
      repo,
      this.targetDir,
      tag,
      REPO_CONFIG.REPO_DEFAULT_BRANCH
    )
  }


  async create(repoInstance: any, projectName: string) {
    const tagsList = await repoInstance.getTags(this.selectTemplateName)
    if (!tagsList) return;

    const selectTag = await this.handleTag(tagsList)
    console.log('selectTag', selectTag)
    const selectRepo = repoInstance.repoList.find((item: IRepoItem) => item.name === this.selectTemplateName)

    // 下载模板
    await this.download(selectRepo.clone_url, selectTag)

    log(`\r\nSuccessfully created project ${projectName}`, 'blue')

  }
}

export default Generator;

export type { IRepoItem, ITagItem }
