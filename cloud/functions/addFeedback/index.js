// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 根据用户 openid 提交反馈图片和意见描述到feedback集合中
  const db = cloud.database()
  const _ = db.command
  const feedback = db.collection('feedback')
  const { images, content, type } = event
  const result = await feedback.add({
    data: {
      openid: wxContext.OPENID,
      images,
      content,
      type,
      createTime: new Date(),
    }
  })

  return result
}