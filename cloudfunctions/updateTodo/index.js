// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.newUpdateTodo._id;
  delete event.newUpdateTodo._id;
  await db.collection("todos").doc(id)
  .set({
    data: event.newUpdateTodo
  })
  .then(res=>{
    return res
  })
}