// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 根据openid获取message_notice集合中的字段数据
  const db = cloud.database()
  const _ = db.command
  const res = await db.collection('message_notice').where({
    _openid: wxContext.OPENID
  }).get()

  return {
    messNotice: res.data[0].messNotice,
    autoNotice: res.data[0].autoNotice,
    dayNotice: res.data[0].dayNotice,
    weekNotice: res.data[0].weekNotice
  }
}