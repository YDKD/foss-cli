'use strict';

const commander = require('commander');
const chalk = require('chalk');
const path = require('node:path');
const fs = require('node:fs');
const prompts = require('@posva/prompts');
const ora = require('ora');
const axios = require('axios');
const simpleGit = require('simple-git');
const figlet = require('figlet');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const chalk__default = /*#__PURE__*/_interopDefaultCompat(chalk);
const path__default = /*#__PURE__*/_interopDefaultCompat(path);
const fs__default = /*#__PURE__*/_interopDefaultCompat(fs);
const prompts__default = /*#__PURE__*/_interopDefaultCompat(prompts);
const ora__default = /*#__PURE__*/_interopDefaultCompat(ora);
const axios__default = /*#__PURE__*/_interopDefaultCompat(axios);
const figlet__default = /*#__PURE__*/_interopDefaultCompat(figlet);

const version = "1.0.2";

const log = (content, color) => {
  if (color.includes("#")) {
    console.log(chalk__default.hex(color)(content));
  } else {
    console.log(chalk__default[color](content));
  }
};

const commands = [
  {
    name: "create [command]",
    description: "create a new project",
    actionFileName: "create"
  },
  {
    name: "init [name]",
    description: "init a template",
    options: [
      {
        flags: "-r, --route <name>",
        description: "init route template",
        defaultValue: ""
      },
      {
        flags: "-v, --view <name>",
        description: "init view template",
        defaultValue: ""
      },
      {
        flags: "-a, --api <name>",
        description: "init api template",
        defaultValue: ""
      },
      {
        flags: "-admin, --admin",
        description: "init to admin",
        defaultValue: false
      },
      {
        flags: "-website, --website",
        description: "init to website",
        defaultValue: true
      }
    ],
    actionFileName: "init"
  }
];

path__default.resolve(process.cwd(), "templates");
const BANNER_TXT = `FOSS CLI`;
const PROJECT_DIR = process.cwd();
const REMOVE_REQUESTIONS = [
  {
    type: "confirm",
    name: "remove",
    message: "\u6B64\u6587\u4EF6\u5939\u5DF2\u7ECF\u5B58\u5728\uFF0C\u662F\u5426\u5220\u9664\u540E\uFF0C\u91CD\u65B0\u518D\u6B21\u521B\u5EFA\uFF1F",
    initial: true
  }
];
const PROJECT_CONFIG = {
  /**
  * 默认项目名
  */
  DEFAULT_PROJECT_NAME: "my-project",
  /**
   * 默认模板
   */
  DEFAULT_TEMPLATE: "foss-vue-template"
};
const REPO_CONFIG = {
  /**
   * 仓库地址 前缀
   */
  REPO_URL_PREFFIX: "https://api.github.com/orgs/foss-y/repos",
  /**
   * 仓库标签地址 前缀
   */
  REPO_TAGS_URL_PREFFIX: "https://api.github.com/repos/foss-y",
  /**
   * 默认分支
   */
  REPO_DEFAULT_BRANCH: "main"
};

const wrapLoading = async (fn, message, ...args) => {
  const spinner = ora__default(message);
  spinner.start();
  try {
    const result = await fn(...args);
    spinner.succeed("Request successful!");
    return result;
  } catch (error) {
    spinner.fail("Request failed, refetch ...");
  }
};

axios__default.interceptors.response.use((res) => {
  return res.data;
});
async function fetchRepoList() {
  return axios__default.get(REPO_CONFIG.REPO_URL_PREFFIX);
}
async function fetchTagList(repo) {
  return axios__default.get(`${REPO_CONFIG.REPO_TAGS_URL_PREFFIX}/${repo}/tags`);
}
async function downloadGitRepo(repo, dir, tag, branch) {
  try {
    const git = simpleGit.simpleGit();
    await git.clone(repo, dir);
    await git.cwd(dir);
    await git.checkout(branch);
    await git.cwd(dir);
    await git.checkout(tag);
    try {
      await git.cwd(dir);
      await git.raw(["remote", "remove", "origin"]);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
}

class Generator {
  constructor(selectTemplateName, targetDir) {
    this.selectTemplateName = "";
    this.targetDir = "";
    this.selectTemplateName = selectTemplateName;
    this.targetDir = targetDir;
  }
  async handleTag(tagsList) {
    const tagNameList = tagsList.map((item) => ({
      title: item.name
    })).filter((item) => item);
    const {
      tag
    } = await prompts__default({
      name: "tag",
      type: "autocomplete",
      choices: tagNameList,
      message: "Place choose a tag to create project"
    });
    return tag;
  }
  async download(repo, tag) {
    await wrapLoading(
      downloadGitRepo,
      "waiting download template",
      repo,
      this.targetDir,
      tag,
      REPO_CONFIG.REPO_DEFAULT_BRANCH
    );
  }
  async create(repoInstance, projectName) {
    const tagsList = await repoInstance.getTags(this.selectTemplateName);
    if (!tagsList)
      return;
    const selectTag = await this.handleTag(tagsList);
    console.log("selectTag", selectTag);
    const selectRepo = repoInstance.repoList.find((item) => item.name === this.selectTemplateName);
    await this.download(selectRepo.clone_url, selectTag);
    log(`\r
Successfully created project ${projectName}`, "blue");
  }
}

class Repo {
  constructor() {
    this.repoList = [];
    this.tagsList = [];
    this.repoList = [];
    this.tagsList = [];
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
    const repoList = await wrapLoading(fetchRepoList, "\u4ED3\u5E93\u83B7\u53D6\u4E2D...");
    if (!repoList)
      return [];
    this.repoList = repoList;
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
    const tagsList = await wrapLoading(fetchTagList, "waiting fetch tag", selectRepoName);
    if (!tagsList)
      return;
    this.tagsList = tagsList;
    return tagsList;
  }
}

const create = async () => {
  const questions = [
    {
      type: "text",
      name: "projectName",
      message: "Enter project name:",
      initial: PROJECT_CONFIG.DEFAULT_PROJECT_NAME
    },
    {
      type: "autocomplete",
      name: "template",
      message: "Select a template to create project",
      choices: [],
      initial: PROJECT_CONFIG.DEFAULT_TEMPLATE
    }
  ];
  const repoInstance = new Repo();
  const repoList = await repoInstance.getRepoList();
  const repoNames = repoList.map((item) => {
    if (item.name?.indexOf("template") != -1) {
      return {
        title: item.name
      };
    }
  }).filter((item) => item);
  questions[1].choices = repoNames;
  const templateResult = await prompts__default(questions);
  const { projectName, template: selectTemplateName } = templateResult;
  if (!projectName) {
    log("\u9879\u76EE\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A", "red");
    return;
  }
  const projectDirectory = `${PROJECT_DIR}/${projectName}`;
  const projectGenerator = new Generator(selectTemplateName, projectDirectory);
  if (!fs__default.existsSync(projectDirectory)) {
    fs__default.mkdirSync(projectDirectory);
    projectGenerator.create(repoInstance, projectName);
  } else {
    const removeDirResult = await prompts__default(REMOVE_REQUESTIONS).catch((error) => {
      log("\u521B\u5EFA\u5931\u8D25", "red");
    });
    const { remove } = removeDirResult;
    if (remove === true) {
      fs__default.rmSync = fs__default.rmSync || fs__default.rmdirSync;
      fs__default.rmSync(projectDirectory, { recursive: true });
      fs__default.mkdirSync(projectDirectory);
      projectGenerator.create(repoInstance, projectName);
    } else {
      log("\u521B\u5EFA\u5931\u8D25\uFF0C\u6587\u4EF6\u5939\u5DF2\u7ECF\u5B58\u5728", "red");
    }
  }
};

function banner() {
  return chalk__default.green(
    figlet__default.textSync(BANNER_TXT, {
      font: "3D-ASCII",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true
    })
  );
}

var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _registerCommand, registerCommand_fn;
const actionMap = /* @__PURE__ */ new Map();
actionMap.set("create", create);
class FossEntry {
  constructor() {
    __privateAdd(this, _registerCommand);
  }
  // 入口
  init() {
    const logoText = banner();
    log(logoText, "#16bbae");
    commander.program.version(version);
    __privateMethod(this, _registerCommand, registerCommand_fn).call(this);
    commander.program.parse(process.argv);
  }
}
_registerCommand = new WeakSet();
registerCommand_fn = function() {
  commands.forEach((item) => {
    try {
      commander.program.command(item.name).description(item.description).action(
        // 导入对应的命令
        async () => {
          const actionFn = actionMap.get(item.actionFileName);
          console.log("123123123", item.actionFileName, actionFn);
          actionFn && actionFn();
        }
      );
      if (item.options) {
        item.options.forEach((option) => {
          commander.program.option(option.flags, option.description, option.defaultValue);
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  });
};
const entry = new FossEntry();
entry.init();
