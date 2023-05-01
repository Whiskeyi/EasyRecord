// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 更新用户消息推送状态，分为messNotice、autoNotice、dayNotice、weekNotice在message_notice集合中, true为开启，false为关闭, 若messNotice为false，则其他三个都为false
  const db = cloud.database()
  const _ = db.command
  const messNotice = event.messNotice
  const autoNotice = event.autoNotice
  const dayNotice = event.dayNotice
  const weekNotice = event.weekNotice

  // 如何此用户在message_notice集合中不存在，则创建一条记录
  const res1 = await db.collection('message_notice').where({
    _openid: wxContext.OPENID
  }).get()
  if (res1.data.length === 0) {
    await db.collection('message_notice').add({
      data: {
        _openid: wxContext.OPENID,
        messNotice:  false,
        autoNotice: false,
        dayNotice: false,
        weekNotice: false
      }
    })
  }

  if (!messNotice) {
    await db.collection('message_notice').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        messNotice: false,
        autoNotice: false,
        dayNotice: false,
        weekNotice: false
      }
    })
    return
  }

  if (!messNotice && (autoNotice || dayNotice || weekNotice)) {
    return
  }

  await db.collection('message_notice').where({
    _openid: wxContext.OPENID
  }).update({
    data: {
      messNotice: messNotice || false,
      autoNotice: autoNotice || false,
      dayNotice: dayNotice || false,
      weekNotice: weekNotice || false
    }
  })

  const rz = await db.collection('message_notice').where({
    _openid: wxContext.OPENID
  }).get()

  return {
    messNotice: rz.data[0].messNotice,
    autoNotice: rz.data[0].autoNotice,
    dayNotice: rz.data[0].dayNotice,
    weekNotice: rz.data[0].weekNotice
  }
}