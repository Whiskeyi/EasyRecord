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

  const { date = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`, type = 'expend' } = event
  const startDate = new Date(date)
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999)

  const matchQuery = {
    openid: wxContext.OPENID,
  }
  if (type !== 'expend') {
    matchQuery.amountType = type
  }
  if (date) {
    matchQuery.createTime = {
      $gte: startDate,
      $lte: endDate,
    }
  }

  // 如果type是expend，获取当月总支出，同时返回支出类别排名前5和支出记录排名前10
  if (type === 'expend') {
    const $group = {
      _id: {
        amountType: '$amountType',
      },
      total: { $sum: { $cond: [{ $eq: ['$type', 'expend'] }, '$amount', 0] } },
    }

    const $project = {
      _id: 0,
      amountType: '$_id.amountType',
      total: 1,
    }

    const $sort = {
      total: -1,
    }

    const $limit = 5

    const userRecordList = await db.collection('amount_records')

    const expend = await userRecordList.aggregate()
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

    const expendTypeList = await userRecordList.aggregate()
      .match({
        openid: wxContext.OPENID,
        type: 'expend',
        createTime: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .group($group)
      .project($project)
      .sort($sort)
      .limit($limit)
      .end()

    // 获取当月支出记录前十项
    const expendRecordList = await userRecordList.aggregate()
      .match({
        openid: wxContext.OPENID,
        type: 'expend',
        createTime: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({
        amount: -1,
      })
      .limit(10)
      .end()

    let maxAmount = 0;

    if (expendTypeList.list.length) {
      maxAmount = expendTypeList.list.reduce((prev, cur) => {
        if (!prev.total || !cur.total) {
          return prev.total || cur.total
        }
        return prev.total > cur.total ? prev : cur
      }).total
    }

    return {
      totalAmount: expend.list.length ? expend.list[0].total : 0,
      typeList: expendTypeList.list,
      recordList: expendRecordList.list,
      maxAmount,
    }
  }

  // 如果type是income，获取当月总收入，同时返回收入类别排名前5和收入记录排名前10
  if (type === 'income') {
    const $group = {
      _id: {
        amountType: '$amountType',
      },
      total: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
    }

    const $project = {
      _id: 0,
      amountType: '$_id.amountType',
      total: 1,
    }

    const $sort = {
      total: -1,
    }

    const $limit = 5

    const userRecordList = await db.collection('amount_records')

    const income = await userRecordList.aggregate()
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

    const incomeTypeList = await userRecordList.aggregate()
      .match({
        openid: wxContext.OPENID,
        type: 'income',
        createTime: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .group($group)
      .project($project)
      .sort($sort)
      .limit($limit)
      .end()

    // 获取当月收入记录前十项
    const incomeRecordList = await userRecordList.aggregate()
      .match({
        openid: wxContext.OPENID,
        type: 'income',
        createTime: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({
        amount: -1,
      })
      .limit(10)
      .end()

    let maxAmount = 0;

    if (incomeTypeList.list.length) {
      maxAmount = incomeTypeList.list.reduce((prev, cur) => {
        if (!prev.total || !cur.total) {
          return prev.total || cur.total
        }
        return prev.total > cur.total ? prev : cur
      }).total
    }

    return {
      totalAmount: income.list.length ? income.list[0].total : 0,
      typeList: incomeTypeList.list,
      recordList: incomeRecordList.list,
      maxAmount,
    }
  }
}