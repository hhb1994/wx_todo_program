# wx_todo_program
 一个简单的使用了微信云开发的 todolist 小程序
 
 
 需要加项目根目录下添加  project.config.json如下
 
 ```js
 {
	"miniprogramRoot": "miniprogram/",
	"cloudfunctionRoot": "cloudfunctions/",
	"setting": {
		"urlCheck": true,
		"es6": true,
		"postcss": true,
		"minified": true,
		"newFeature": true,
		"enhance": true
	},
	"appid": "你的小程序 id",
	"projectname": "wx_cloud_serve_program",
	"libVersion": "2.8.1",
	"simulatorType": "wechat",
	"simulatorPluginLibVersion": {},
	"cloudfunctionTemplateRoot": "cloudfunctionTemplate",
	"condition": {
		"search": {
			"current": -1,
			"list": []
		},
		"conversation": {
			"current": -1,
			"list": []
		},
		"plugin": {
			"current": -1,
			"list": []
		},
		"game": {
			"list": []
		},
		"miniprogram": {
			"current": 0,
			"list": [
				{
					"id": -1,
					"name": "db guide",
					"pathName": "pages/databaseGuide/databaseGuide"
				}
			]
		}
	}
}

```
