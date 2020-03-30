/*
 * @Author: 韩宏斌
 * @Description: 主页
 * @version: 1.0.0
 * @LastEditors: 韩宏斌
 * @Date: 2020-03-16 10:32:41
 * @LastEditTime: 2020-03-27 10:52:33
 * @FilePath: /wx_cloud_serve_program/miniprogram/pages/index/index.js
 */
// miniprogram/pages/index/index.js
import Notify from "@vant/weapp/notify/notify";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    x: 100,
    currIndex: null,
    isPopUpShow: false,
    isTimePopUpShow: false,
    isDoneShow: false,
    todoList: [],
    isDoneFilterList: ["所有", "已完成", "未完成"],

    newTodo: {
      isDone: false,
      title: "新建待办事项",
      address: {
        address: " "
      },
      date: new Date().getTime() + 24 * 60 * 60 * 1000,
      remark: ""
    },
    filter: {
      isDone: "所有",
      inDate: false
    }
  },
  onReady: function() {
    this.getTodoList();
  },
  onPullDownRefresh() {
    this.getTodoList();
    wx.stopPullDownRefresh();
  },
  uploadFile() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths[0]);
        wx.cloud.uploadFile({
          cloudPath: "newfile/2.png", // 上传至云端的路径
          filePath: tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID);
            that.setData({
              url: res.fileID
            });
          },
          fail: console.error
        });
      }
    });
  },
  getWeRunData(cloudID) {
    wx.cloud
      .callFunction({
        name: "getWeRunData",
        data: {
          weRunData: wx.cloud.CloudID(cloudID)
        }
      })
      .then(res => {
        console.log(res.result.event);
        // console.log(res.result.event.weRunData.data);
      });
  },
  getSettingList() {
    wx.getSetting({
      success: result => {
        console.log(result);
      },
      fail: () => {},
      complete: () => {}
    });
    wx.openSetting({
      success: result => {},
      fail: () => {},
      complete: () => {}
    });
  },
  verifySetting(name) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: result => {
          resolve(result.authSetting[name]);
        }
      });
    });
  },
  recognize() {
    // wx.startSoterAuthentication({
    //   requestAuthModes: ["facial"],
    //   challenge: "123456",
    //   authContent: "请用指纹解锁",
    //   success(res) {
    //     console.log(res);
    //   },
    //   fail(res) {
    //     console.log(res);
    //   }
    // });
    let that = this;
    wx.getWeRunData({
      success(res) {
        console.log(res);
        that.getWeRunData(res.cloudID);
        // 拿 encryptedData 到开发者后台解密开放数据
        // const encryptedData = res.encryptedData;
        // 或拿 cloudID 通过云调用直接获取开放数据
        // const cloudID = res.cloudID;
      }
    });
  },
  getTodoList() {
    wx.showLoading({
      title: "获取列表中..."
    });
    wx.cloud
      .callFunction({
        name: "getTodoList",
        data: {
          isDone: this.data.filter.isDone,
          inDate: this.data.filter.inDate
        }
      })
      .then(res => {
        wx.hideLoading();
        res.result.todoList.forEach(item => {
          item.x = 0;
        });
        this.setData({
          todoList: res.result.todoList.reverse()
        });
      })
      .catch(err => {
        Notify({
          message: "获取失败",
          color: "white",
          background: "red"
        });
      });
  },

  //显示popUp
  showPopup() {
    this.setData({
      isPopUpShow: true
    });
  },
  //隐藏 popup
  onPopClose() {
    this.setData({
      isPopUpShow: false
    });
  },

  showIsDonePopup() {
    this.setData({
      isDoneShow: true
    });
  },
  //隐藏 popup
  onIsDoneClose() {
    this.setData({
      isDoneShow: false
    });
  },
  onTitleChange(event) {
    this.setData({
      "newTodo.title": event.detail
    });
  },
  onRemarkChange(event) {
    this.setData({
      "newTodo.remark": event.detail
    });
  },
  chooseAddress() {
    this.verifySetting("scope.userLocation").then(res => {
      if (res != false) {
        wx.chooseLocation({
          success: result => {
            this.setData({
              "newTodo.address": result
            });
          },
          fail: res => {
            Notify({
              message: "地址未选择",
              color: "white",
              background: "#38495c"
            });
          }
        });
      } else {
        Notify({
          message: "定位权限未开启,请在设置中开启",
          color: "white",
          background: "#38495c",
          duration: 3000
        });
      }
    });
  },
  //显示时间选择 popup
  showTimePopup() {
    this.setData({
      isTimePopUpShow: true
    });
  },

  /**
   * @Date: 2020-03-23 15:11:02
   * @Description: 关闭日期弹框
   * @param {type}
   * @return:
   */

  onDatePopClose() {
    this.setData({
      isTimePopUpShow: false
    });
  },
  /**
   * @Date: 2020-03-23 15:12:07
   * @Description: 确认日期操作
   * @param {type}
   * @return:
   */

  confirmDate(data) {
    this.onDatePopClose();
    // console.log(data.detail);
    this.setData({
      "newTodo.date": data.detail
    });
  },
  /**
   * @Date: 2020-03-23 17:03:30
   * @Description: 添加新的提醒事项
   * @param {type}
   * @return:
   */
  submitNewTodo() {
    if (!this.data.newTodo.title) {
      Notify({
        message: "待办事项标题不能为空",
        color: "white",
        background: "red"
      });
    } else {
      wx.showModal({
        content: "确定要添加一条待办事项吗?",
        success: res => {
          if (res.confirm) {
            this.setData({
              isPopUpShow: false
            });
            wx.cloud
              .callFunction({
                name: "addTodo",
                data: this.data.newTodo
              })
              .then(() => {
                Notify({
                  message: "添加成功",
                  color: "white",
                  background: "#38495c",
                  duration: 1000
                });
                this.getTodoList();
              });
          }
        }
      });
    }
  },
  /**
   * @Date: 2020-03-24 14:34:37
   * @Description: 删除一项 todo
   * @param {type}
   * @return:
   */
  deleteOneTodo(item) {
    // console.log(item.currentTarget.dataset);
    wx.showModal({
      content: "确定要删除一条待办事项吗?",
      success: res => {
        if (res.confirm) {
          wx.showLoading({ title: "请稍等..." });
          wx.cloud
            .callFunction({
              name: "deleteTodo",
              data: {
                id: item.currentTarget.dataset.id
              }
            })
            .then(res => {
              wx.hideLoading();
              Notify({
                message: "删除成功",
                color: "white",
                background: "#38495c",
                duration: 1000
              });
              this.getTodoList();
            });
        } else if (res.cancel) {
          this.setData({
            [`todoList[${item.currentTarget.dataset.index}].x`]: 0
          });
        }
      }
    });
  },
  // /**
  //  * @Date: 2020-03-24 14:59:46
  //  * @Description: todo 左滑触发的事件
  //  * @param {type}
  //  * @return:
  //  */
  onMoveViewChange(e) {
    // console.log(e);
    // this.setData({
    //   x: e.detail.x
    // });
  },

  /**
   * @Date: 2020-03-25 16:59:29
   * @Description: 更新一条 todo
   * @param {type}
   * @return:
   */

  updateTodo(item) {
    let content = item.currentTarget.dataset.isdone ? "将待办事项标记为已完成?" : "将待办事项标记为未完成?";
    wx.showModal({
      content: content,
      success: res => {
        if (res.confirm) {
          let newUpdateTodo = { ...this.data.todoList[item.currentTarget.dataset.index] };
          newUpdateTodo.isDone = item.currentTarget.dataset.isdone;
          wx.cloud
            .callFunction({
              name: "updateTodo",
              data: {
                newUpdateTodo: newUpdateTodo
              }
            })
            .then(res => {
              Notify({
                message: "操作成功",
                color: "white",
                background: "#38495c",
                duration: 1000
              });
              this.getTodoList();
            });
        } else if (res.cancel) {
          this.setData({
            [`todoList[${item.currentTarget.dataset.index}].x`]: 0
          });
        }
      }
    });
  },
  showMap(item) {
    wx.openLocation({
      latitude: item.currentTarget.dataset.address.latitude,
      longitude: item.currentTarget.dataset.address.longitude,
      name: item.currentTarget.dataset.address.name,
      address: item.currentTarget.dataset.address.address
    });
  },

  /**
   * @Date: 2020-03-26 15:23:31
   * @Description: 修改完成 isDone 的状态
   * @param {type}
   * @return:
   */
  isDoneChange(val) {
    this.setData({
      "filter.isDone": this.data.isDoneFilterList[val.detail.value[0]]
    });
    this.onIsDoneClose();
    this.getTodoList();
  },

  onSwitchChange({ detail }) {
    this.setData({
      "filter.inDate": detail
    });
    this.getTodoList();
  }
});
