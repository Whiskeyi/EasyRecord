// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

  const { recordId } = event

  // 根据_id删除amounts_records集合中的记录
  const db = cloud.database()
  const collection = db.collection('amount_records')
  const result = await collection.doc(recordId).remove()

  // 更新user表中recordCount字段记账总数
  const { OPENID } = cloud.getWXContext()
  const { data } = await db.collection('user').where({ openid: OPENID }).get()
  const { recordCount } = data[0]
  await db.collection('user').doc(data[0]._id).update({
    data: {
      recordCount: recordCount - 1,
    },
  })

  return result
}