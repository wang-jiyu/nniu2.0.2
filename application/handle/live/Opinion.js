module.exports = {
	// 获取投顾观点列表
	getOpinionList: function(id, params, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisors/' + id + '/opinion/list',
			params: params,
			callback: function(result) {
				typeof(callback) == 'function' && callback(result);
			}
		});
	},
	// 创建一条观点
	createOpinion: function(params, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/opinion',
			params: params,
			callback: function(result) {
				typeof(callback) == 'function' && callback(result);
			}
		});
	},
	// 编辑一条观点
	editorOpinion: function(id, params, callback) {
		Forms.put({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/opinions/' + id,
			params: params,
			callback: function(result) {
				typeof(callback) == 'function' && callback(result);
			}
		});
	},
	// 删除一条观点	
	deteleOpinion: function(id, callback) {
		Forms.delete({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/opinions/' + id,
			callback: function(result) {
				typeof(callback) == 'function' && callback(result);
			}
		});
	},
	// 获取一个观点
	getOpinion: function(id, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/opinions/' + id,
			callback: function(result) {
				typeof(callback) == 'function' && callback(result);
			}
		});
	},
	// 点赞
	praiseOpinion: function(id, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/opinions/' + id + '/praise',
			callback: function(result) {
				typeof(callback) == 'function' && callback(result);
			}
		});
	},
	// 点赞
	cancelPraise: function(id, callback) {
		Forms.delete({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/opinions/' + id + '/praise',
			callback: function(result) {
				typeof(callback) == 'function' && callback(result);
			}
		});
	},
	//获取观点评论列表
	commentList: function(params, id, callback) {
		var _params = $.extend({limit: 20, latest_stamp: ''}, params);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/opinions/' + id + '/comment/list',
			params: _params,
			callback: function(result) {
				typeof(callback) == 'function' && callback(result);
			}
		});
	},
	//创建一条评论
	commentCreate: function(params, id, callback) {
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/advisor/opinions/' + id + '/comment',
			params: params,
			callback: function(result) {
				typeof(callback) == 'function' && callback(result);
			}
		});
	}
};