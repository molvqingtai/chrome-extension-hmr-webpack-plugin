import chalk from 'chalk'
let prefix = '[WCER]: '

export const log = (message) => console.log(prefix + message)
export const info = (message) => console.info(chalk.green(prefix + message))
export const warn = (message) => console.warn(chalk.yellow(prefix + message))
export const error = (message) => console.error(chalk.red(prefix + message))
export const debug = (message) => console.debug(chalk.white(prefix + message))
