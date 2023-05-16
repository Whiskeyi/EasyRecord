// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 更新用户信息到user集合中
  const db = cloud.database()
  const _ = db.command
  const { username, intro, avatar, tel } = event

  await db.collection('user').where({
    openid: wxContext.OPENID
  }).update({
    data: {
      username,
      intro,
      avatar,
      tel,
      updateTime: new Date()
    }
  })

  const { data } = await db.collection('user').where({ openid: wxContext.OPENID }).get()

  return {
    ...data[0]
  }
}