var private = {
	trigger: function(error, target) {
		this.trigger('VerifyError', Utils.getError(error, target), target);
	}
};

module.exports = {
	disableButton: function() {
		for (var i = 0; i < arguments.length; i++) {
			var objItem = $(arguments[i]);
			if (objItem.prop('disabled')) continue;
			objItem.prop('disabled', true)
				.attr('data-value', objItem.val())
				.val('处理中…');
		}
	},
	activeButton: function() {
		for (var i = 0; i < arguments.length; i++) {
			var objItem = $(arguments[i]);
			if (!objItem.prop('disabled')) continue;
			objItem.prop('disabled', false)
				.val(objItem.attr('data-value'))
				.removeAttr('data-value');
		};
	},
	restrict: function(obj, callback) {
		var output = {};
		var dataType = obj.getAttribute('data-type');
		var name = obj.getAttribute('name');
		if (name) {
			if (obj.value.length && $.inArray(dataType, ['number', 'mobile', 'zip']) != -1) {
				if (!Utils.checkRegexp(obj.value, 'number')) {
					return false;
				}
			}
			output[name] = obj.value;
		}

		typeof(callback) == 'function' && callback(output);
	},
	serialize: function(objControl) {
		var params = objControl.find('input,select,textarea').serializeArray();
		var output = {};
		for (var i in params) {
			if (params[i].name) {
				if ($.isArray(output[params[i].name])) {
					output[params[i].name].push(params[i].value);
				} else if (typeof(output[params[i].name]) == 'string') {
					var _value = output[params[i].name]
					output[params[i].name] = [_value];
					output[params[i].name].push(params[i].value);
				} else {
					output[params[i].name] = params[i].value;
				}
			}
		}
		return output;
	},
	verify: function(objControl) {
		var result = true;
		objControl.find('input,textarea,select').each(function(i, obj) {
			var dataType = obj.getAttribute('data-type');
			var required = obj.getAttribute('required') || obj.getAttribute('data-required');
			var compare = obj.getAttribute('data-compare');
			var objTarget = $(obj);

			if (required != null && $.trim(obj.value).length == 0) {
				objTarget.addClass('error');
				private.trigger.call(objControl, 'required', objTarget);
				result = false;
				return true;
			}

			if (dataType) {
				if (obj.value.length > 0 && !Utils.checkRegexp(obj.value, dataType)) {
					objTarget.addClass('error');
					private.trigger.call(objControl, dataType, objTarget)
					result = false;
					return true;
				}
			}

			if (compare) {
				var that = objControl.find('[name="' + compare + '"]');
				if (obj.value != that.val()) {
					objTarget.addClass('error');
					private.trigger.call(objControl, 'compare', objTarget)
					result = false;
					return true;
				}
			}
		});
		return result;
	},
	submit: function(data) {
		var uri = data.uri || '';
		var that = this;
		var method = (data.method || 'GET').toUpperCase();

		var params;
		if (data.params) {
			if (method == 'GET' || (window.FormData && data.params instanceof window.FormData)) {
				params = data.params;
			} else {
				params = JSON.stringify(data.params);
			}
		}

		var _url;
		if (data.realUri) {
			_url = uri;
		} else {
			_url = (data.api || Config.SITE_URL.API) + uri;
		}

		if (Config.ACCESS_TOKEN) {
			var siginInfo = 'access_token=' + Config.ACCESS_TOKEN;
			if (_url.indexOf('?') == -1) {
				_url += '?' + siginInfo;
			} else {
				_url += '&' + siginInfo
			}
		}

		if (typeof(data.callback) != 'function') {
			data.callback = $.noop;
		}

		var request = {
			url: _url,
			data: params,
			type: method,
			contentType: false,
			processData: typeof(data.processData) == 'undefined' ? true : data.processData,
			/*xhrFields: {
				withCredentials: true
			},*/
			beforeSend: function(xhr) {
				typeof(data.beforeSend) == 'function' && data.beforeSend(xhr);

				if (data.header) xhr.setRequestHeader(data.header.name, data.header.value);

				if (data.button) that.disableButton(data.button);
			},
			success: function(result, fnType, xhr) {
				switch (result.code) {
					case 200:
						break;
					case 401:
						return Event.trigger('NotLogin', function(loginStatus) {
							if (loginStatus.code == 200) that.submit(data);
						});
						break;
					default:
						if (data.offError !== true) {
							Event.trigger('OpenPushMessage', {
								message: Utils.getPromptInfo(result.code),
								type: Config.PUSH_MESSAGE.PROMPT
							});
						}
						break;
				}

				if (data.header) {
					data.callback(result, xhr.getResponseHeader(data.header.name));
				} else {
					data.callback(result);
				}
			},
			error: function(xhr) {
				if (xhr.statusText != 'abort') {
					if (!$.isNumeric(data._connectionIndex)) data._connectionIndex = 0;
					if (++data._connectionIndex < 3) {
						that.submit(data);
					} else {
						if (data.offError !== true) Event.trigger('OpenPushMessage', {
							message: Utils.getPromptInfo(30000),
							type: Config.PUSH_MESSAGE.PROMPT
						});

						data.callback({
							code: 30000,
							data: xhr
						});
					}
					return false;
				}
				data.callback({
					code: 30001,
					data: xhr
				});
			},
			complete: function() {
				if (data.button) that.activeButton(data.button);
			}
		};

		if (typeof(data.xhr) == 'function') request.xhr = data.xhr;
		return $.ajax(request);
	},
	get: function(data) {
		data.method = 'GET';
		return this.submit(data);
	},
	post: function(data) {
		data.method = 'POST';
		return this.submit(data);
	},
	put: function(data) {
		data.method = 'PUT';
		return this.submit(data);
	}
};

module.exports['delete'] = function(data) {
	data.method = 'DELETE';
	return this.submit(data);
}