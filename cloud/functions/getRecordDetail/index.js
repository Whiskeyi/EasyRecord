const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

exports.main = async (event, context) => {
  const { recordId } = event

  // 根据_id获取amounts_records集合中的记录
  const db = cloud.database()
  const collection = db.collection('amount_records')
  const result = await collection.doc(recordId).get()

  return result
}