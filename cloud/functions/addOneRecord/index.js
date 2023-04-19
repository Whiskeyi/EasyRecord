const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const { OPENID } = wxContext
  const { recordTime, amount, type, amountType, remark } = event

  if (!recordTime || !amount || !type || !amountType) {
    return {
      code: 400,
      msg: '参数错误',
    }
  }

  const collection = db.collection('amount_records')

  const result = await collection.add({
    data: {
      openid: OPENID,
      recordTime,
      amount,
      type,
      amountType,
      remark,
      createTime: db.serverDate(),
    },
  })

  return result
}