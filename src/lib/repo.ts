import { wrapLoading } from "../utils";
import { fetchRepoList, fetchTagList } from "./http";

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

    const repoList = await wrapLoading(fetchRepoList, '仓库获取中...') as any;
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
  async getTags(selectRepoName: string) {

    if (this.tagsList.length) {
      return this.tagsList;
    }

    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tagsList = await wrapLoading(fetchTagList, 'waiting fetch tag', selectRepoName) as any;
    if (!tagsList) return;

    this.tagsList = tagsList

    return tagsList;

  }
}

export default Repo;
