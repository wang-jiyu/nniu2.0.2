module.exports = {
	follow: function (memberId, callback) {
		Forms.post({
			uri: '/api/member/follow/' + memberId,
			callback: callback
		});
	},
	unfollow: function (memberId, callback) {
		Forms.post({
			uri: '/api/member/unfollow/' + memberId,
			callback: callback
		});
	},
	// 获取直播分类
	getClass: function (callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/category',
			callback: callback
		});
	},
	// 获取指定类型直播列表
	getLive: function (params, callback) {
		params = $.extend({
			limit: 10
		}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/room/list',
			params: params,
			callback: callback
		});
	},
	// 获取排行榜
	getRank: function (params, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/top/list',
			params: params,
			callback: callback
		});
	},
	// 获取精选直播主题列表
	getChosen: function (params, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/room/hot',
			params: params,
			callback: callback
		});
	},
	// 获取直播聚焦信息
	getFocus: function (callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/focus',
			callback: callback
		});
	},
	getAdviserRoom: function (adviserId, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/members/' + adviserId,
			callback: callback
		});
	},
	//获取房间信息
	getRoom: function (roomId, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/rooms/' + roomId,
			callback: callback
		});
	},
	//修改直播室设置
	setRoom: function (roomId, params, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/rooms/start/' + roomId,
			params: params,
			callback: callback
		});
	},

    //直播室设置
    setRoom_old: function(roomId, params, callback) {
        Forms.put({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/weblive/room/' + roomId,
            params: params,
            callback: callback
        });
    },
	
	//关闭直播
	closeRoom: function (roomId, params, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/rooms/end/' + roomId,
			params: params,
			callback: callback
		});
	},
	
	// 获取历史图文直播列表
	historyList: function (roomId, params, callback) {
		params = $.extend({
			year: null,
			month: null,
			limit: 20,
			page: 1
		}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/room/schedule/' + roomId,
			params: params,
			callback: callback
		});
	},
	//获取指定条件锦囊包列表
	getTactic: function (params, callback) {
		params = $.extend({
			tf: 1,
			limit: 20,
			latest_stamp: ''
		}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/tactic/list',
			params: params,
			callback: callback
		});
	},
	//获取指定锦囊包的锦囊内容
	getTacticContent: function (tacticId, params, callback) {
		params = $.extend({
			limit: 20,
			latest_stamp: ''
		}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/tactics/' + tacticId + '/advises',
			params: params,
			callback: callback
		});
	},
	//创建一个锦囊包
	createTactic: function (param, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/tactic',
			params: param,
			callback: callback
		});
	},
	//获取单条锦囊包
	getTacticItem: function (id, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/tactics/' + id,
			callback: callback
		});
	},
	//金股列表
	getGoldStockList: function (id,adviserID, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/course/golden/stocks/'+adviserID+'/list?golden_stock_guid=' + id,
			callback: callback
		});
	},

	//创建金股
	goldStockCreate: function (id, param, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/course/golden/stock/' + id + '/add',
			params: param,
			callback: callback
		});
	},

	//修改金股
	goldStockEdit: function (id, param, callback) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/course/golden/stock/' + id + '/update',
			params: param,
			callback: callback
		});
	},


	//创建一个新研报
	createReport: function (param, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/report',
			params: param,
			callback: callback
		});
	},
	//获取单条研报
	getReportsItem: function (id, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/reports/' + id,
			callback: function (result) {
				typeof (callback) == 'function' && callback(result);
			}
		});
	},
	//获取指定条件研报附件列表
	reportsAttachment: function (params, id, callback) {
		var _params = $.extend({
			limit: 20,
			latest_stamp: ''
		}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/reports/' + id + '/affix/list',
			params: _params,
			callback: function (result) {
				typeof (callback) == 'function' && callback(result);
			}
		});
	},
	//获取研报单条附件列表
	reportsAttachmentItem: function (id, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/report/affix/' + id,
			callback: function (result) {
				typeof (callback) == 'function' && callback(result);
			}
		});
	},
	//创建研报附件
	createReportAttachment: function (params, id, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/reports/' + id + '/affix',
			params: params,
			callback: function (result) {
				typeof (callback) == 'function' && callback(result);
			}
		});
	},

	//消息列表
	getMessageList: function (roomId, params, callback) {
		params = $.extend({
			ref_id: null,
			limit: 20,
			direction: -1,
			latest_stamp: null,
			begin_stamp: undefined,
			end_stamp: undefined
		}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/messages/' + roomId,
			params: params,
			callback: callback
		});
	},

	//消息列表
	getMessageListII: function (roomId, params, callback) {
		params = $.extend({
			ref_id: null,
			limit: 20,
			direction: -1,
			latest_stamp: null,
			begin_stamp: undefined,
			end_stamp: undefined
		}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/messages/' + roomId,
			params: params,
			callback: callback
		});
	},

	//发送消息
	sendMessage: function (roomId, param, callback) {
		$.extend({
			content: null,
			type: null,
			target: null,
            at_user_id:null
		}, param);
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/message/' + roomId,
			params: param,
			callback: callback
		});
	},
	// 新发送消息 JDCourse 
	newSendMassage: function (lesson_guid, param, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/course/message/' + lesson_guid,
			params: param,
			callback: callback
		});
	},
	//new getChatListApi JDCourse  京东课堂
	getNewChatList: function (param, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/course/messages/' + param.lesson_guid,
			params: param,
			callback: callback
		});
	},
	startRoom: function (roomId, callback) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/rooms/start/' + roomId,
			callback: callback
		});
	},
	endRoom: function (roomId, callback) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/rooms/end/' + roomId,
			callback: callback
		});
	},
	//获取百宝箱列表
	boxlist: function (params, id, callback) {
		var _params = $.extend({
			limit: 20,
			page: 1
		}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisors/' + id + '/boxlist',
			params: _params,
			callback: function (result) {
				typeof (callback) == 'function' && callback(result);
			}
		});
	},
	//修改锦囊
	setTactic: function (params, id, callback) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/tactics/' + id,
			params: params,
			callback: function (result) {
				typeof (callback) == 'function' && callback(result);
			}
		});
	},
	//删除锦囊
	deleteTactic: function (id, callback) {
		Forms.delete({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/tactics/' + id,
			callback: callback
		})
	},
	//锦囊
	sendTacticMessage: function (tacticId, params, callback) {
		params = $.extend({
			content: null
		}, params)
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/tactics/' + tacticId + '/advise',
			params: params,
			callback: callback
		});
	},
	//编辑研报
	setReport: function (reportId, param, callback) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/reports/' + reportId,
			params: param,
			callback: callback
		});
	},
	//删除研报
	deleteReport: function (reportId, callback) {
		Forms.delete({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/reports/' + reportId,
			callback: callback
		})
	},
	//获取百宝箱分类列表
	getCategory: function (callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/treasure/category/list',
			callback: callback
		});
	},
	
	joinRoom: function (roomId) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/rooms/join/' + roomId
		});
	},
	isRoomOwner: function (userId) {
		// return true;
		userId = userId ? userId : Config.CACHE_DATA.USER._id;
		if ($.isArray(Config.CACHE_DATA.ROOM.advisor)) {
			return !!ArrayCollection.getItem.call(Config.CACHE_DATA.ROOM.advisor, userId, '_id');
		}
        if (!Config.CACHE_DATA.ROOM || !Config.CACHE_DATA.ROOM.advisor) {
            return false;
        }
		return userId == Config.CACHE_DATA.ROOM.advisor._id;
	},
	getAppellation: function () {
		return this.isRoomOwner() ? '我' : 'TA';
	},
	//获取禁言用户列表
	getBannedList: function (id, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/ban/list/' + id,
			callback: callback
		});
	},
	//禁言用户
	bannedMember: function (params, id, callback) {
		params = $.extend({
			member_id: null,
			expire_time: 1800
		}, params);
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/ban/message/' + id,
			params: params,
			callback: callback
		});
	},
	//取消禁言
	cancelBanned: function (params, id, callback) {
		params = $.extend({
			member_id: null
		}, params);
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/unban/message/' + id,
			params: params,
			callback: callback
		});
	},
	//获取访问限制
	limitMember: function (callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/groups',
			callback: callback
		});
	},
	addNotify: function (params, callback) {
		params = $.extend({
			ref_id: null,
			ref_type: null
		}, params);
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/notify',
			params: params,
			callback: callback
		});
	},
	removeNotify: function (params, callback) {
		params = $.extend({
			ref_id: null,
			ref_type: null
		}, params);
		Forms.delete({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/notify',
			params: params,
			callback: callback
		});
	},
	getNotifyList: function (callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/notify/list',
			callback: callback
		});
	},
	getDevelopments: function (callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/weblive/trend/total',
			callback: callback
		});
	},
	getType: function (callback) {
		Forms.get({
			api: Config.SITE_URL.CMS,
			uri: '/api/category',
			callback: callback
		});
	},
	//获取策略列表
	getStrategyList: function (params, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/strategy/list',
			params: params,
			callback: callback
		});
	},
};