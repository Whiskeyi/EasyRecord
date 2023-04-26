// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  const { OPENID } = wxContext

  const { data } = await db.collection('user').where({ openid: OPENID }).get()

  let isRecord = false;

  // 检查该用户记账记录是否有当日的数据
  await db.collection('amount_records').where({
    openid: OPENID,
    recordTime: db.command.gte(new Date(new Date().toLocaleDateString()).getTime()),
  }).get().then(res => {
    if (res.data.length > 0) {
      isRecord = true
    }
  })

  return {
    ...data[0],
    continueRecord: isRecord ? data[0].continueRecord : 0,
  }
}