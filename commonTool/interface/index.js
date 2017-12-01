module.exports = {
	login: function(callback) {
		if ((window.webkit && window.webkit.messageHandlers) || (window.android && window.android.pushEvent)) {
			window.getAccessToken = function(result) {
				delete window.getAccessToken;
				try {
					result = JSON.parse(result);
				} catch (e) {
					result = {
						code: 3000
					};
				}

				if (result.code == 200) {
					Config.ACCESS_TOKEN = result.data.access_token;
				}
				return callback(result);
			}

			return this.jsCallNative('getAccessToken');
		} else if (typeof(window.getAccessToken) == 'function') {
			var result;
			try {
				result = JSON.parse(window.getAccessToken());
			} catch (e) {
				result = {
					code: 3000
				};
			}

			if (result.code == 200) {
				Config.ACCESS_TOKEN = result.data.access_token;
			}
			return callback(result);
		} else if (Config.REFRESH_TOKEN) {
			Forms.post({
				uri: '/api/token/smartcall',
				params: {
					code: Config.REFRESH_TOKEN
				},
				callback: function(result) {
					if (result.code == 200) {
						Config.ACCESS_TOKEN = result.data.access_token;
					}
					callback(result);
				}
			});
			return null;
		}
		// var username = window.prompt('请输入您的用户名');
		// var password = window.prompt('请输入您的密码');
		Config.CACHE_DATA.WEB_LOGIN = true;
		Forms.post({
			uri: '/api/token?id=500bb48bf6cf49a9',
			// uri: '/api/v2/user/login?client_id=500bb48bf6cf49a9&source=mobile&version=hn_nniu1.4',
			params: {
				//name: username,
				//password: Utils.md5(password, 16),
				// name: '13027769907',
				// password: Utils.md5('123456', 16),
				// name: '18636220314',
				// password: Utils.md5('123456', 16),
				name: '18810032646',
				password: Utils.md5('123456', 16),
				//name: '18795394072',
				// password: Utils.md5('123456', 16),
				// name: '13366232525',
				// password: Utils.md5('123456', 16),
				// name: '15369617299',
				// password: Utils.md5('123456', 16),
				// name: '15821257587',
				// password: Utils.md5('825123', 16),
				// name: '20170331000039',
				// password: Utils.md5('123456', 16),
				//name: '17321021868',
				//password: Utils.md5('825123', 16),
				//name: '18500611127',
				//password: Utils.md5('123456', 16),
				//name: '13581676430',
				//password: Utils.md5('123456', 16),
				//name: '15617573696',
				//password: Utils.md5('123456', 16),
				//name: '13641643383',
				//password: Utils.md5('123456', 16),
				//name: '18721867040',
				//password:  Utils.md5('qwe123', 16),
				//name: '13641643383',
				//password: Utils.md5('123456', 16),
				// name: '13849011364',
				// password: Utils.md5('123456', 16),
				// name: '18255178737',
				// password: Utils.md5('123456', 16),
				// name: "13641643382",
				// password: Utils.md5('780916', 16),
				device_token: '00e0704695cc',
				auth_signature: '47dd5d1fdf367862edcafb4d3d802c10',
			},
			callback: function(result) {
				if (result.code == 200) {
					Config.ACCESS_TOKEN = result.data.access_token;
				}
				callback(result);
			}
		});
	},
	jsCallNative: function(str, data) {
		var postData = JSON.stringify({
			nativeCallJS: str,
			messageBody: data
		});
		if (window.android && window.android.pushEvent) return window.android.pushEvent(postData);
		if (window.webkit && window.webkit.messageHandlers) return window.webkit.messageHandlers.jsCallNative.postMessage(postData);
	},
	getProfile: function(callback, bool) {
		if (typeof(window.getUserInfo) == 'function') {
			var result;
			try {
				result = JSON.parse(window.getUserInfo(!!bool));
			} catch (e) {
				result = {
					code: 3000
				};
			}

			if (result.code == 200) {
				Config.CACHE_DATA.USER = result.data;
				if (!!bool) this.pushMessage('UpdateUser', result.data);
			}
			return callback(result);
		}

		Forms.get({
			uri: '/api/member/profile',
			callback: function(result) {
				if (result.code == 200) {
					Config.CACHE_DATA.USER = result.data;
				}
				callback(result);
			}
		});
	},

	pushMessage: function(event, data) {
		if (typeof(data) == 'object') {
			try {
				data = JSON.stringify(data);
			} catch (e) {
				data = data;
			}
		}

		window.pushMessage(event, data);
	},
	getUrl: function(uri) {
		if (uri.indexOf('http') != 0) {
			if (uri.substr(0, 1) == '/') return location.origin + uri;
			return location.origin + location.pathname + uri;
		}
		return uri;
	},
	popWin: function(title, uri, left, top, height, width) {
		if (typeof(left) == 'object') {
			var obj = left;
			if (obj.left && obj.right) width = window.screen.width - obj.left - obj.right;
			if (obj.top && obj.bottom) height = window.screen.height - obj.top - obj.bottom;
			if (obj.top) top = obj.top;
			if (obj.left) left = obj.left;
			if (obj.width) width = obj.width;
			if (obj.height) height = obj.height;
			if (obj.maxWidth) width = Math.min(obj.maxWidth, width);
			if (obj.maxHeight) height = Math.min(obj.maxHeight, height);

			if (obj.align) {
				switch (obj.align) {
					case 'left':
						left = 0;
						break;
					case 'center':
						left = (window.screen.width - width) / 2;
						break;
					case 'right':
						left = window.screen.width - width;
						break;
					default:
						left = (window.screen.width - width) * obj.align;
				}
			}
			if (obj.valign) {
				switch (obj.valign) {
					case 'top':
						top = 0
						break;
					case 'center':
						top = (window.screen.height - height) / 2;
						break;
					case 'bottom':
						top = window.screen.height - height;
						break;
					default:
						top = (window.screen.height - height) * obj.valign;
				}
			}
		}

		if (typeof(window.popWin) == 'function') {
			uri = this.getUrl(uri);
			return window.popWin(title, uri, parseInt(left), parseInt(top), parseInt(height), parseInt(width));
		}
		return window.open(uri, '', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
	},

	closeWin: function() {
		if (typeof(window.closeWin) == 'function') {
			return window.closeWin();
		}
		window.close();
	},
	gotoLeftNavView: function(code, uri) {
		if (typeof(window.gotoLeftNavView) == 'function') {
			if (uri) {
				uri = this.getUrl(uri);
				this.pushMessage('UrlChange' + code, uri);
			}
			return window.gotoLeftNavView(code);
		}
		window.open(uri, code);
	},
	setLogin: function(username, password, isLogin, isThird) {
		if (typeof(window.setLogin) == 'function') {
			window.setLogin(username, password, isLogin, isThird);
			this.closeWin();
		}
	},
	openStockView: function(code, type) {
		if (typeof(window.openStockView) == 'function') {
			window.openStockView(code, type)
		}
	},
	setMessageBadge: function(num) {
		if (typeof(window.setMessageBadge) == 'function') {
			window.setMessageBadge(num);
		}
	},
	popNotify: function(icon, title, content, data, id) {
		try {
			data = JSON.stringify(data);
		} catch (e) {
			data = data
		}

		if (typeof(window.popNotify) == 'function') {
			return window.popNotify(icon, title, content, data, id);
		}
	},
	isFocus: function() {
		if (typeof(window.gotoLeftNavView) != 'function') return true;
		return Config.FOCUSIN;
	},
	getWindowState: function() {
		if (typeof(window.getWindowState) == 'function') return window.getWindowState();
		return 5;
	},
	bringWindowToTop: function() {
		if (typeof(window.bringWindowToTop) == 'function') return window.bringWindowToTop();
	}
};