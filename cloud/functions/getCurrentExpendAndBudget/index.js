// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const $ = db.command.aggregate

  // 获取当前月份的第一天和最后一天
  const startDate = new Date()
  startDate.setDate(1)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999)

  // 在amount_records获取当前用户当月的支出
  const expend = await db.collection('amount_records')
    .aggregate()
    .match({
      openid: wxContext.OPENID,
      type: 'expend',
      createTime: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .group({
      _id: null,
      total: $.sum('$amount'),
    })
    .end()

  // 在budget获取当前用户设置的预算
  const budget = await db.collection('budget')
    .where({
      openid: wxContext.OPENID,
    })
    .get()

    console.log(expend, budget)

  return {
    expend: expend.list[0] ? expend.list[0].total : 0,
    budget: budget.data[0].budget ? budget.data[0].budget : '',
  }
}