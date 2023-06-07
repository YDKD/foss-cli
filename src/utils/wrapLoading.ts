import ora from "ora";

type TFn = (...args: any) => Promise<any> | undefined


const wrapLoading = async (fn: TFn, message: string, ...args: any) => {
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
export {
  wrapLoading
}
