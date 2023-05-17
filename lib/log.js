const chalk = require('chalk');
const log = (content, color = 'green') => console.log(chalk[color](content));

module.exports = log;
