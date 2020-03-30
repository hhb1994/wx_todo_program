// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  let con={};
  con.open_id = event.userInfo.openId;
  con.isDone = event.isDone == "所有" ? _.eq(true).or(_.eq(false)) : event.isDone == "已完成" ? true : false;
  if(event.inDate){
    con.date = _.gt(new Date())
  }
  let todoList = await db.collection("todos")
    .where(con)
    .get();
  return {
    todoList: todoList.data
  }

}