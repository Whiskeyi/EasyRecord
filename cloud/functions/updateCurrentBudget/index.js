// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  // 获取传参budget
  const { budget } = event
  // 查询数据库是否有当前用户的预算，如没有则创建
  const { data } = await db.collection('budget')
    .where({
      openid: wxContext.OPENID,
    })
    .get()
  if (data.length === 0) {
    await db.collection('budget')
      .add({
        data: {
          openid: wxContext.OPENID,
          budget,
          createTime: db.serverDate(),
          updateTime: db.serverDate(),
        },
      })
  } else {
    await db.collection('budget')
      .where({
        openid: wxContext.OPENID,
      })
      .update({
        data: {
          budget,
          updateTime: db.serverDate(),
        },
      })
  }
}