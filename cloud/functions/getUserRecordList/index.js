// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  const $ = db.command.aggregate

  const userRecordList = await db.collection('amount_records')
    .aggregate()
    .match({
      openid: wxContext.OPENID,
    })
    .sort({
      createTime: -1,
    })
    .group({
      _id: {
        date: $.dateToString({
          date: '$createTime',
          format: '%Y-%m-%d',
          timezone: 'Asia/Shanghai',
        }),
      },
      recordList: $.push({
        _id: '$_id',
        openid: '$openid',
        type: '$type',
        amount: '$amount',
        recordTime: '$recordTime',
        amountType: '$amountType',
        remark: '$remark',
      }),
      totalExpend: { $sum: { $cond: [{ $eq: ['$type', 'expend'] }, '$amount', 0] } },
      totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
    })
    .project({
      _id: 0,
      date: {
        $dateFromString: {
          dateString: '$_id.date',
          format: '%Y-%m-%d',
          timezone: 'Asia/Shanghai',
        },
      },
      recordList: 1,
      totalExpend: 1,
      totalIncome: 1,
    })
    .sort({
      date: -1,
    })
    .end()

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