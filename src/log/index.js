const chalk = require('chalk');
const log = (content, color = 'green') => {
  if (color.includes('#')) {
    console.log(chalk.hex(color)(content))
  } else {
    console.log(chalk[color](content))
  }
};

module.exports = log;
