const path = require('path')
const fs = require('fs')
const selfConf = require('./cdnConf/index')
// 设置默认活动页的路径，优先级：命令中参数 > currentProject配置 ，如果都不存在，则打包project中第一个活动

const currentProject = 'test'
const use = 'ali' // ali 或 qiniu
const isUpload = true // 是否需要上传至cdn

/* 获取所有模块的文件夹名*/
const modules = fs.readdirSync(path.join(__dirname, '..', 'src/project'))
const argvPath = process.argv.splice(2)[0]
let realProject
if (modules.indexOf(argvPath) !== -1) {
  realProject = argvPath
} else {
  if (modules.indexOf(currentProject) !== -1) {
    realProject = currentProject
  } else {
    realProject = modules[0]
  }
}

// 未设置则置空
const defaultConf = { title: '请配置title', css: {}, js: [] }
if (typeof selfConf[realProject] === 'object') {
  selfConf[realProject] = Object.assign(defaultConf, selfConf[realProject])
} else {
  selfConf[realProject] = defaultConf
}

// 生成externals配置
const externalsConf = {}
const tempjs = selfConf[realProject].js

tempjs.forEach(item => {
  externalsConf[item.packageName] = item.variableName
})

console.log(`您正在操作 ${realProject} 页面`)

const config = {
  currentProject: `project/${realProject}`,
  use,
  isUpload,
  qiNiuCdn: {
    host: '',
    bucket: '',
    ak: '',
    sk: '',
    zone: '',
    prefix: ''
  },
  aLiOss: {
    accessKeyId: 'LTAIop8DUZrSMEMn',
    accessKeySecret: 'Yi8BUqh44mEsqZNGi9x77942FLNOUM',
    bucket: 'hpvip',
    region: 'oss-cn-hangzhou',
    prefix: '/cdn/test/'
  },
  selfConf: selfConf[realProject],
  externalsConf: externalsConf
}
config.aLiOss.host = `https://${config.aLiOss.bucket}.${config.aLiOss.region}.aliyuncs.com`.replace(/\/+/, '/')
config.uploadPath = use === 'ali' ? config.aLiOss : config.qiNiuCdn
// console.log(config)
module.exports = config
