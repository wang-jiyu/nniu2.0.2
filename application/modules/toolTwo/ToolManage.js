var Error = require('./Error');
var Signup = require('./list/signup/Index');
var MobilePay = require('./list/mobile_pay/Index');
var MobileAuth = require('./list/mobile_auth/Index');
var Forgot = require('./list/forgot/Index');
var Binduser = require('./list/Binduser');
var Evaluaterisk = require('./list/evaluaterisk/Index');
var Order = require('./list/order/Index');
var Vip = require('./list/vip/Index');
var Login = require('./list/Login');
var Desklive = require('./list/desklive/Index');

module.exports = {
	getModule: function(name, callback) {
		if (this.moduleList[name]) {
			return this.moduleList[name](callback);
		}
		return callback(Error);
	},
	moduleList: {
		signup: function(callback) {
			Load.loadCss(Url.getAssets('/css/view.signup.css'));
			Utils.setTitle('用户注册');
			typeof(callback) == 'function' && callback(Signup);
		},
		mobile_pay: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/mobilepay.css'));
			Utils.setTitle('订单详情');
			Load.loadScript(Url.getAssets('/lib/flexible.js'), function() {
				typeof(callback) == 'function' && callback(MobilePay);
			})
		},
		mobile_auth: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/mobileauth.css'));
			Utils.setTitle('实名认证');
			Load.loadScript(Url.getAssets('/lib/flexible.js'), function() {
				typeof(callback) == 'function' && callback(MobileAuth);
			})
		},
		forgot: function(callback) {
			Load.loadCss(Url.getAssets('/css/view.forgot.css'));
			Utils.setTitle('找回密码');
			typeof(callback) == 'function' && callback(Forgot);
		},
		binduser: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/binduser.css'));
			typeof(callback) == 'function' && callback(Binduser);
		},
		evaluaterisk: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/evaluate.risk.css'));
			typeof(callback) == 'function' && callback(Evaluaterisk);
		},
		order: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/order.css'));
			typeof(callback) == 'function' && callback(Order);
		},
		vip: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/order.css'));
			typeof(callback) == 'function' && callback(Vip);
		},
		login: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/binduser.css'));
			typeof(callback) == 'function' && callback(Login);
		},
		desklive: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/desklive.css'));
			typeof(callback) == 'function' && callback(Desklive);
		}
	}
};