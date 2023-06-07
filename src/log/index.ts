import chalk from "chalk";
import { Color } from "ora";

const log = (content: any, color: any) => {
  if (color.includes('#')) {
    console.log(chalk.hex(color)(content))
  } else {
    // @ts-ignore
    console.log(chalk[color](content))
  }
};

export default log;
