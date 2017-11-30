module.exports = {
	getStrategylist: function(param, callback) { //策略列表
		var data = {
			sort: param.sort || param.sort != undefined || param.sort != null ? param.sort : 1,
			page: param.page || 1,
			size: param.size || 6,
			profitnum: param.profitnum || 25,
			timestamp: Config.TOOL.timestamp('string', 'second')
		}
		data.signature = CryptoJS.HmacSHA256(data.sort + ':' + data.page + ':' + data.size + ':' + data.profitnum + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();
		// console.log(data.sort + ':' + data.page + ':' + data.size + ':' + data.profitnum + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29');
		// console.log(data);
		var params = $.extend(data, param);
		// console.log(data.sort + ':' + data.page + ':' + data.size + ':' + data.profitnum + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29');
		Forms.get({
			api: Config.SITE_URL.DEV_STRATEGY,
			// api: 'http://dev.0606.com.cn',
			uri: '/strategy/list',
			// uri: '/assets/data/strategyList.json',
			params: params,
			callback: callback
		});
	},
	getStrategyInfo: function(param, callback) { //列表详情
		var data = {
			timestamp: Config.TOOL.timestamp('string', 'second')
		}
		data.signature = CryptoJS.HmacSHA256(param._id + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();
		// console.log(data.signature);
		var params = $.extend(data, param);
		Forms.get({
			api: Config.SITE_URL.DEV_STRATEGY,
			// api: 'http://dev.0606.com.cn',
			uri: '/strategy/info',
			// uri: '/assets/data/strategyInfo.json',
			params: params,
			callback: callback
		});
	},
	getStrategyHasPay: function(param, callback) { //是否已经订阅
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/strategys/' + param._id + '/ispay?access_token=' + param.access_token,
			callback: callback
		});
	},
	getStrategyCurve: function(param, callback) { //曲线图API
		var data = {
				type: 0,
				timestamp: Config.TOOL.timestamp('string', 'second')
			}
			// console.log(param._id + ':' + data.type + ':' + Config.TOOL.timestamp('string', 'second'));
		data.signature = CryptoJS.HmacSHA256(param._id + ':' + param.type + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();
		// console.log(data.signature);
		var params = $.extend(data, param);
		Forms.get({
			api: Config.SITE_URL.DEV_STRATEGY,
			// api: 'http://dev.0606.com.cn',
			uri: '/strategy/profit',
			// uri: '/assets/data/curve.json',
			params: params,
			callback: callback
		});
	},
	// 获取今日调仓
	getStrategyTodayData: function(param, callback) {
		var data = {
			timestamp: Config.TOOL.timestamp('string', 'second')
		}
		data.signature = CryptoJS.HmacSHA256(param._id + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();
		var params = $.extend(data, param);
		Forms.get({
			api: Config.SITE_URL.DEV_STRATEGY,
			// api: 'http://dev.0606.com.cn',
			uri: '/strategy/today',
			// uri: '/assets/data/toDayData.json',
			params: params,
			callback: callback
		});
	},
	// 获取当前持仓
	getStrategyCurrentData: function(param, callback) {
		var data = {
			timestamp: Config.TOOL.timestamp('string', 'second')
		}
		data.signature = CryptoJS.HmacSHA256(param._id + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();
		var params = $.extend(data, param);
		Forms.get({
			api: Config.SITE_URL.DEV_STRATEGY,
			// api: 'http://dev.0606.com.cn',
			uri: '/strategy/position',
			// uri: '/assets/data/CurrentData.json',
			params: params,
			callback: callback
		});
	},
	// 获取过往交易(已订阅)
	getStrategyHistoryData: function(param, callback) {
		var time = Config.TOOL.timestamp();
		var timeFormat = Config.TOOL.formatter(time, 'YYYY MM');
		var timeString = Config.TOOL.getSplitString(timeFormat, '-');
		var data = {
			timestamp: Config.TOOL.timestamp('string', 'second'),
			month: param.month || timeString,
			page: param.page || 1,
			size: param.size || 20
		}
		data.signature = CryptoJS.HmacSHA256(param._id + ':' + data.month + ':' + data.page + ':' + data.size + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();

		// console.log(param._id + ':' + data.page + ':' + data.size + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29');

		var params = $.extend(data, param);
		Forms.get({
			api: Config.SITE_URL.DEV_STRATEGY,
			// api: 'http://dev.0606.com.cn',
			uri: '/strategy/histrader',
			// uri: '/assets/data/historyData.json',
			params: params,
			callback: callback
		});
	},
	// 获取过往交易（未订阅）
	getStrategyTwoHistoryData: function(param, callback) {
		var data = {
			timestamp: Config.TOOL.timestamp('string', 'second'),
			page: param.page || 1,
			size: param.size || 20
		}
		if (!param.sdate && !param.edate) {
			data.signature = CryptoJS.HmacSHA256(param._id + ':' + data.page + ':' + data.size + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();
		} else if (!param.sdate) {
			data.signature = CryptoJS.HmacSHA256(param._id + ':' + data.page + ':' + data.size + ':' + param.sdate + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();
		} else if (!param.edate) {
			data.signature = CryptoJS.HmacSHA256(param._id + ':' + data.page + ':' + data.size + ':' + param.edate + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();
		} else {
			data.signature = CryptoJS.HmacSHA256(param._id + ':' + data.page + ':' + data.size + ':' + param.sdate + ':' + param.edate + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29').toString();
		}
		// console.log(param._id + ':' + data.page + ':' + data.size + ':' + Config.TOOL.timestamp('string', 'second'), 'B5CE6EC82F9D474F845508E847B75F29');

		var params = $.extend(data, param);
		Forms.get({
			api: Config.SITE_URL.DEV_STRATEGY,
			// api: 'http://dev.0606.com.cn',
			uri: '/strategy/hissort',
			// uri: '/assets/data/historyData.json',
			params: params,
			callback: callback
		});
	},
	//获取已经订阅列表
	getAlreadySubscibeList: function(param, callback) {
		var data = {
			limit: 20,
			page: 1,
			access_token: ''
		}
		var params = $.extend(data, param);
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			// api: 'http://dev.0606.com.cn',
			uri: '/api/strategy/subscribe/list',
			params: params,
			callback: callback
		});
	}
};