module.exports = {
	subscribe: function(params, callback) {
		params = $.extend({acc_key: Config.PUSHER.SAFETY_KEY}, params);
		Forms.post({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/session/auth',
			params: params,
			callback: function(result) {
				typeof(callback) == 'function' && callback(result, params);
			}
		});
	}
}