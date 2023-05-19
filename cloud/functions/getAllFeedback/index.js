// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 获取feedback集合中匹配openid的所有记录
  const db = cloud.database()
  const feedback = db.collection('feedback')
  const res = await feedback.where({
    openid: wxContext.OPENID
  }).get()


  return {
    res
  }
}