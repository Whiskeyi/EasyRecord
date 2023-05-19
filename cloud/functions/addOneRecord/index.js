const dayjs = require('dayjs')
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const { OPENID } = wxContext
  const { recordTime, amount, type, amountType, remark, image } = event

  if (!recordTime || !amount || !type || !amountType) {
    return {
      code: 400,
      msg: '参数错误',
    }
  }

  const collection = db.collection('amount_records')

  // 根据openid在user集合中recordCount字段自增1
  await db.collection('user').where({
    openid: OPENID,
  }).update({
    data: {
      recordCount: db.command.inc(1),
    },
  })

  // 根据openid判断是否在amount_records集合中相邻记录时间是否不在同一天，如是则在user集合中continueRecord字段自增1或重置为1
  await db.collection('amount_records').where({
    openid: OPENID,
  }).orderBy('recordTime', 'desc').limit(1).get().then(res => {
    if (res.data.length === 0) {
      db.collection('user').where({
        openid: OPENID,
      }).update({
        data: {
          continueRecord: 1,
        },
      })
    }
    if (res.data.length === 1) {
      const last = res.data
      const lastDate = dayjs(last.recordTime).format('YYYY-MM-DD')
      const nowDate = dayjs().format('YYYY-MM-DD')
      // 如果相邻记录时间刚好隔一天，则在user集合中continueRecord字段自增1
      if (dayjs(lastDate).diff(dayjs(nowDate), 'day') === 1) {
        db.collection('user').where({
          openid: OPENID,
        }).update({
          data: {
            continueRecord: db.command.inc(1),
          },
        })
      }
      if (dayjs(lastDate).diff(dayjs(nowDate), 'day') > 1) {
        db.collection('user').where({
          openid: OPENID,
        }).update({
          data: {
            continueRecord: 1,
          },
        })
      }
    }
  })

  const result = await collection.add({
    data: {
      openid: OPENID,
      recordTime,
      amount,
      type,
      amountType,
      remark,
      createTime: db.serverDate(),
      image,
    },
  })

  return result
}