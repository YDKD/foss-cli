const axios = require('axios');
const { REPO_CONFIG } = require('../../config');

axios.interceptors.response.use(res => {
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
async function fetchTagList(repo) {
  return axios.get(`${REPO_CONFIG.REPO_TAGS_URL_PREFFIX}/${repo}/tags`)
}

module.exports = {
  fetchRepoList,
  fetchTagList
}
