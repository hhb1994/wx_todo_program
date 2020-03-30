const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
exports.main = async(event, context) => {
  event.c_date = new Date();
  event.date = new Date(event.date);
  event.app_id = event.userInfo.appId;
  event.open_id = event.userInfo.openId;
  delete event.userInfo;
  await db.collection("todos").add({
    data: event
  }).then(res => {
    return res
  })

}