// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取数据库引用
  const db = cloud.database()
  const _ = db.command

  // 获得传参更新对应recordId在amount_records集合中的数据
  const { amount, type, amountType, remark, recordId } = event
  const collection = db.collection('amount_records')

  // 更新集合数据
  const rz = await collection.doc(recordId).update({
    data: {
      amount,
      type,
      amountType,
      remark,
      updateTime: new Date()
    }
  })

  return rz;
}