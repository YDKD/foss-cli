const gitDownload = require('download-git-repo')
const ora = require('ora')

const cloneRepo = (projectDirectory) => {
  ora('正在下载模板...').start()
  gitDownload('https://xngitlab.teleware.cn/product/front-end/tlw-vue3-project#main', projectDirectory, { headers: { 'PRIVATE-TOKEN': '1234' } }, function (err) {
    console.log(err ? 'Error' : 'Success', err)
    ora('下载失败').fail()
  })
}

module.exports = cloneRepo
