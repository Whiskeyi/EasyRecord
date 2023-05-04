// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  const $ = db.command.aggregate

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const { date = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`, type = '全部类型' } = event
  const startDate = new Date(date)
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999)

  const matchQuery = {
    openid: wxContext.OPENID,
  }
  if (type !== '全部类型') {
    matchQuery.amountType = type
  }
  if (date) {
    matchQuery.createTime = {
      $gte: startDate,
      $lte: endDate,
    }
  }

  const $group = {
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
  }

  const $project = {
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
  }

  const userRecordList = await db.collection('amount_records')
    .aggregate()
    .match(matchQuery)
    .sort({
      createTime: -1,
    })
    .group($group)
    .project($project)
    .sort({
      date: -1,
    })
    .end()

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

  const income = await db.collection('amount_records')
    .aggregate()
    .match({
      openid: wxContext.OPENID,
      type: 'income',
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

  return {
    userRecordList,
    expend,
    income,
  }
}