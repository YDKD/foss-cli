import path from 'node:path';
import fs from 'node:fs';
import { program } from "commander";

import { ICommandItem } from "../config/commands";
// 获取 package.json 中的版本号
import { version } from '../package.json'
import log from "./log";
// 命令配置
import { commands } from '../config/index'
import { create } from './commands'
import banner from './banner';

const actionMap = new Map()
actionMap.set('create', create)

class FossEntry {

  // 入口
  init() {
    // 1、打印 logo
    const logoText = banner()
    log(logoText, '#16bbae')

    // 2、设置版本号
    program.version(version)

    // 3.注册命令
    this.#registerCommand()



    // end 解析用户输入命令
    program.parse(process.argv)

  }

  #registerCommand() {
    commands.forEach((item: ICommandItem) => {
      try {
        program
          .command(item.name)
          .description(item.description)
          .action(
            // 导入对应的命令
            async () => {

              // const command = await import(`./commands/${item.actionFileName}`)
              const actionFn = actionMap.get(item.actionFileName)
              console.log('123123123', item.actionFileName, actionFn)
              // command.default()
              actionFn && actionFn()
            }
          )

        // 注册options
        if (item.options) {
          item.options.forEach((option) => {
            program.option(option.flags, option.description, option.defaultValue)
          })
        }

      } catch (err: any) {
        throw new Error(err)
      }
    })
  }
}

const entry = new FossEntry();
entry.init()
