module.exports = {
	getInventory: function(callback){
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/session/inventory',
			callback: callback
		});
	},
	sendMessage: function(params, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/message',
			params: params,
			callback: callback
		});
	},
	getMessageList: function(params, callback) {
		params = $.extend({ref_id: null, ref_type: null, limit: 20, direction: -1, latest_stamp: null}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/messages',
			params: params,
			callback: callback
		});
	},
	getMessage: function(messageId, callback) {
		console.log("聊天：","及时刷新新消息");
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/messages/' + messageId,
			callback: callback
		});
	},
	formatToClient: function(str) {
		if (typeof(str) != 'string') return str;
		return str.replace(/\[([^\]]*)\]/g, function(result, $1) {
				var index = Config.EMOJI.indexOf($1);
				if (index == -1) return result;
				return '<img src="' + Url.getAssets('/emojis/' + index) + '.png" width="24" height="24" alt="[' + Config.EMOJI[index] + ']"  data-emoji="true" />';
			});
	},
	formatToServer: function(str) {
		if (typeof(str) != 'string') return str;
		str = str.replace(/<a[^>]*data-mention="([^"]*)"[^>]*>[^<]*<\/a>/g, function(result, $1) {
			return '[@'+ $1 + ']';
		});

		str = str.replace(/<img[^>]*alt="([^"]*)"[^>]*data-emoji="true"[^>]*>/g, function(result, $1) {
			return $1;
		});

		str = str.replace(/<\/p>/g, '\n');

		str = str.replace(/&nbsp;|<br>|<[^>|^b|^u]+>/g, function(result) {
			switch (result) {
				case '&nbsp;': return ' ';
				case '<br>': return '\n';
			}
			return '';
		});

		str = str.replace(/^\n+|\n+$/g, '');
		return str;
	},
	getWeekAdvisor: function(params, callback) {
		params = $.extend({limit: 6}, params);
		Forms.get({
			uri: '/api/advisor/recommend/week',
			params: params,
			callback: callback
		});
	},
	getAdvisor: function(callback) {
		Forms.get({
			uri: '/api/advisor/all',
			callback: callback
		});
	},
	getNotify: function(notifyId, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/notify/messages/' + notifyId,
			callback: callback
		});
	},
	//获取单条系统消息
    getSingleSystem: function(id, callback) {
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/notify/systems/' + id,
            callback: callback
        });
    },
	//获取消息提醒列表
	getNotifyList: function(params, callback) {
		params = $.extend({limit: 20, latest_stamp: ''}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/notify/message/list',
			params: params,
			callback: callback
		});
	},

	//获取资讯列表
	getConsultList: function(params, callback) {
		params = $.extend({limit: 20, latest_stamp: ''}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/notify/cms/list',
			params: params,
			callback: callback
		});
	},
	
	//获取消息提醒列表
	getSystemList: function(params, callback) {
		params = $.extend({limit: 20, latest_stamp: ''}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/notify/system/list',
			params: params,
			callback: callback
		});
	},

	getNotifyUnread: function(callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/notify/unread',
			callback: callback
		});
	},
	clearMessageUnread: function(refId, refType, callback) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/message/unread/clear?ref_id=' + refId + '&ref_type=' + refType,
			callback: callback
		});
	},
	clearSundryUnread: function(type, callback) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/notify/unread/clear?type=' + type,
			callback: callback
		});
	},
	//获取投诉建议类型
	complainCategory: function(callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/proposal/category',
			callback: callback
		});
	},
	//获取投诉建议列表
	complainList: function(params, callback) {
		params = $.extend({limit: 5, page: 1}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/proposal/list',
			params: params,
			callback: callback
		});
	},
	//新增投诉建议
	addComplain: function(params, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/proposal',
			params: params,
			callback: callback
		});
	},
	//删除投诉建议
	deleteComplain: function(complainId, callback) {
		Forms.delete({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/proposals/' + complainId,
			callback: callback
		});
	},
	//获取单条投诉建议
	complainItem: function(complainId, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/proposals/' + complainId,
			callback: callback
		});
	},
	//创建描述
	createDescription: function(complainId, params, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/proposals/' + complainId + '/description',
			params: params,
			callback: callback
		});
	},
	//确认解决该投诉建议
	solveComplain: function(complainId, callback) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/proposals/' + complainId + '/solve',
			callback: callback
		});
	},
	//获取投诉建议详细内容列表
	complainContent: function(complainId, params, callback) {
		params = $.extend({limit: 20, latest_stamp: ''}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/proposals/' + complainId + '/detail',
			params: params,
			callback: callback
		});
	}
};