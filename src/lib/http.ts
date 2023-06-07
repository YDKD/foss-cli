import axios, { AxiosResponse } from "axios";
import { simpleGit } from "simple-git";
import { REPO_CONFIG } from "../../config";
import fs from 'node:fs'

axios.interceptors.response.use((res: AxiosResponse) => {
  return res.data;
})

/**
 * 获取模板列表
 * @returns Promise
 */
async function fetchRepoList() {
  return axios.get(REPO_CONFIG.REPO_URL_PREFFIX)
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function fetchTagList(repo: string) {
  return axios.get(`${REPO_CONFIG.REPO_TAGS_URL_PREFFIX}/${repo}/tags`)
}

async function downloadGitRepo(repo: string, dir: string, tag: string, branch: string) {
  try {
    const git = simpleGit()
    await git.clone(repo, dir)



    // 切换分支
    await git.cwd(dir)
    await git.checkout(branch)

    // 切换 tag
    await git.cwd(dir)
    await git.checkout(tag)



    try {
      // 删除 .git 文件
      await git.cwd(dir)
      fs.rmdirSync(`${dir}/.git`, { recursive: true });
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
}

export {
  fetchRepoList,
  fetchTagList,
  downloadGitRepo
}
