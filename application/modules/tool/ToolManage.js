var Error = require('./Error');
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
			require.ensure([], function(require) {
				typeof(callback) == 'function' && callback(require('./list/signup/Index'));
			}, 'tool.signup');
		},
		mobile_pay: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/mobilepay.css'));
			require.ensure([], function(require) {
				Load.loadScript(Url.getAssets('/lib/flexible.js'), function() {
					typeof(callback) == 'function' && callback(require('./list/mobile_pay/Index'));
				})
			}, 'tool.mobile.pay');
		},
        mobile_auth: function(callback) {
            Load.loadCss(Url.getAssets('/css/tool/mobileauth.css'));
            require.ensure([], function(require) {
                Load.loadScript(Url.getAssets('/lib/flexible.js'), function() {
                    typeof(callback) == 'function' && callback(require('./list/mobile_auth/Index'));
                })
            }, 'tool.mobile.auth');
        },
		forgot: function(callback) {
			Load.loadCss(Url.getAssets('/css/view.forgot.css'));
			require.ensure([], function(require) {
				typeof(callback) == 'function' && callback(require('./list/forgot/Index'));
			}, 'tool.forgot');
		},
		binduser: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/binduser.css'));
			require.ensure([], function(require) {
				typeof(callback) == 'function' && callback(require('./list/Binduser'));
			}, 'tool.binduser');
		},
		evaluaterisk: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/evaluate.risk.css'));
			require.ensure([], function(require) {
				typeof(callback) == 'function' && callback(require('./list/evaluaterisk/Index'));
			}, 'tool.evaluate.risk');
		},
		order: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/order.css'));
			require.ensure([], function(require) {
				typeof(callback) == 'function' && callback(require('./list/order/Index'));
			}, 'tool.order');
		},
		vip: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/order.css'));
			require.ensure([], function(require) {
				typeof(callback) == 'function' && callback(require('./list/vip/Index'));
			}, 'tool.vip');
		},
		login: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/binduser.css'));
			require.ensure([], function(require) {
				typeof(callback) == 'function' && callback(require('./list/Login'));
			}, 'tool.login');
		},
		desklive: function(callback) {
			Load.loadCss(Url.getAssets('/css/tool/desklive.css'));
			require.ensure([], function(require) {
				typeof(callback) == 'function' && callback(require('./list/desklive/Index'));
			}, 'tool.desklive');
		}
	}
};
