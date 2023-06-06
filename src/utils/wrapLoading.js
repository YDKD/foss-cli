const ora = require('ora');

const wrapLoading = async(fn, message, ...args) => {
  const spinner = ora(message);
  spinner.start();

  try {
    const result = await fn(...args);
    spinner.succeed("Request successful!");
    return result;
  } catch (error) {
    spinner.fail('Request failed, refetch ...');
  }
}

module.exports = wrapLoading;
