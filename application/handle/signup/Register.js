module.exports = {
	checkMobile: function(mobile, callback) {
		Forms.get({
			uri: '/api/member/mobile/check',
			params: {mobile: mobile},
			callback: callback
		})
	},
	siginup: function(params, callback) {
		Forms.post({
			uri: '/api/member/signup',
			params: params,
			callback: callback
		});
	},
};