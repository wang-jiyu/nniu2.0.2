module.exports = {
	getMobileCode: function(params, callback) {
		params = $.extend({captcha_code: null, mobile: null, type: null}, params);
		Forms.post({
			uri: '/api/security/sms/send?device_identity=' + Config.CACHE_DATA.DEVICE_IDENTITY,
			params: params,
			callback: callback
		});
	},
	//发送短信 返回token
	getMobileToken: function(params, callback) {
		Forms.post({
			uri: '/api/security/sms/sendcaptcha?device_identity=' + Config.CACHE_DATA.DEVICE_IDENTITY,
			params: params,
			callback: callback
		});
	},
	resend: function(mobile, callback) {
		Forms.post({
			uri: '/api/security/sms/resend',
			params: {mobile: mobile},
			callback: callback
		});
	},
	checkSms: function(params, callback) {
		params = $.extend({mobile: null, code: null}, params);
		Forms.post({
			uri: '/api/security/sms/check',
			params: params,
			callback: callback
		});
	},
}