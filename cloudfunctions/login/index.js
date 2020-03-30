// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  console.log(wxContext.OPENID);
  // const user = await db.collection("users").get().then(res=>{return res.data});
  await db.collection("login").add({
    data: {
      openid: wxContext.OPENID,
      date: new Date()
    }
  }).then(res => console.log(res))
  return {
    // wxContext: wxContext
    OPENID:wxContext.OPENID

  }
}