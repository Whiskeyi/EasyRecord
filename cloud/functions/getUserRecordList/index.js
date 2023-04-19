// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  const $ = db.command.aggregate

  const userRecordList = await db.collection('amount_records')
    .where({
      openid: wxContext.OPENID,
    })
    .orderBy('recordTime', 'desc')
    .get()

  // 获得amount_records集合中openid为当前用户，type为expend的amount总和
  const expend = await db.collection('amount_records')
    .aggregate()
    .match({
      openid: wxContext.OPENID,
      type: 'expend',
    })
    .group({
      _id: null,
      total: $.sum('$amount'),
    })
    .end()

  // 获得amount_records集合中openid为当前用户，type为income的amount总和
  const income = await db.collection('amount_records')
    .aggregate()
    .match({
      openid: wxContext.OPENID,
      type: 'income',
    })
    .group({
      _id: null,
      total: $.sum('$amount'),
    })
    .end()

  return {
    userRecordList,
    expend,
    income,
  }
}