const { wrapLoading } = require('../utils');
const { fetchRepoList, fetchTagList } = require('./http')

class Repo {
  repoList = []
  tagsList = []

  constructor() {
    this.repoList = [];
    this.tagsList = []

  }
  /**
   * @return {*}
   * @description: 获取仓库列表
   * @author: YDKD
   */
  async getRepoList() {

    if (this.repoList.length) {
      return this.repoList;
    }

    const repoList = await wrapLoading(fetchRepoList, '仓库获取中...');
    if (!repoList) return [];

    this.repoList = repoList

    return repoList;
  }


  /**
   * @param {*} selectRepoName 选择的仓库名称
   * @return {*}
   * @description: 获取对应仓库的标签列表
   * @author: YDKD
   */
  async getTags(selectRepoName) {

    if (this.tagsList.length) {
      return this.tagsList;
    }

    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tagsList = await wrapLoading(fetchTagList, 'waiting fetch tag', selectRepoName);
    if (!tagsList) return;

    this.tagsList = tagsList

    return tagsList;

  }
}

module.exports = Repo;
