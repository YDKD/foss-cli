const gitDownload = require('download-git-repo')
const ora = require('ora')

const cloneRepo = (projectDirectory) => {
  ora('正在下载模板...').start()
  console.log('projectDirectory', projectDirectory)

  gitDownload('direct:https://github.com/YDKD/foss-vue-tempalte.git#main', projectDirectory, { clone: true }, function (err) {
    console.log(err ? 'Error' : 'Success', err)
    ora('下载失败').fail()
  })
}

module.exports = cloneRepo
