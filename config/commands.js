/**
 * tips:
 * <name> 为必填项
 * [name] 为选填项
 */

const commands = [
  {
    name: 'create [command]',
    description: 'create a new project',
    actionFileName: 'create'
  },
  {
    name: 'init [name]',
    description: 'init a template',
    options: [
      {
        flags: '-r, --route <name>',
        description: 'init route template',
        defaultValue: "",
      },
      {
        flags: '-v, --view <name>',
        description: 'init view template',
        defaultValue: "",
      },
      {
        flags: '-a, --api <name>',
        description: 'init api template',
        defaultValue: "",
      },
      {
        flags: '-admin, --admin',
        description: 'init to admin',
        defaultValue: false,
      },
      {
        flags: '-website, --website',
        description: 'init to website',
        defaultValue: true,
      },
    ],
    actionFileName: 'init'
  }
]

module.exports = commands
