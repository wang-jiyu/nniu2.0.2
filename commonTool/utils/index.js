module.exports = {
	checkRegexp: function(value, key) {
		if (Config.RULE_LIST[key] && Config.RULE_LIST[key].regexp) {
			return Config.RULE_LIST[key].regexp.test(value);
		}
		return false;
	},

	getError: function(key, target) {
		if (target && target.attr('data-error')) return target.attr('data-error');

		if (Config.RULE_LIST[key] && Config.RULE_LIST[key].error) {
			return Config.RULE_LIST[key].error.replace(/{([^}]+)}/g, function(item, $1) {
				return target.attr($1) || '';
			});
		}

		return '未知的错误';
	},

	cookies: require('./cookies'),

	playQueue: function(arr, callback) {
		if (!$.isNumeric(arr._current)) arr._current = 0;
		if (arr._current >= arr.length) return typeof(callback) == 'function' && callback();

		if (typeof(arr[arr._current]) == 'function') {
			return arr[arr._current](function() {
						arr._current++;
						this.playQueue(arr, callback);
					}.bind(this));
		}
		arr._current++;
		this.playQueue(arr, callback);
	},
	toDate: function(datetime) {
		if (typeof(datetime) == 'string') return new Date(datetime.replace(/\-/g, '/'));
		if (typeof(datetime) == 'number') return new Date(datetime * 1000);
		if (!(datetime instanceof Date)) return new Date();
		return datetime;
	},
	formatDate: function(datetime, format) {
		if (!format) format = 'YYYY-MM-DD HH:mm';
		datetime = this.toDate(datetime);

		var week = ['日', '一', '二', '三', '四', '五', '六'];
		return format.replace(/YYYY|YY|MM|DD|HH|hh|mm|SS|ss|week/g, function(key) {
			switch (key) {
				case 'YYYY': return datetime.getFullYear();
				case 'YY': return (datetime.getFullYear() + '').slice(2);
				case 'MM': return datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
				case 'DD': return datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
				case 'HH':
				case 'hh': return datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
				case 'mm': return datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
				case 'SS':
				case 'ss': return datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
				case 'week': return week[datetime.getDay()];
			}
		});
	},
	getNeighborDate: function(addDayCount, datetime) {//获得几天之后的日期
		var dd = this.toDate(datetime);
		dd.setDate(dd.getDate() + addDayCount);
		return this.formatDate(dd, 'YYYY-MM-DD');
	},
	getFileIcon: function(filename, isExt) {
		var result;
		if (!isExt) filename = this.getFileExt(filename);

		if (filename) result = Config.FILE_EXT[filename.toUpperCase()];
		return Url.getAssets('/file_icons/' + (result || Config.FILE_EXT.DEFAULT));
	},
	getFileExt: function(filename) {
		if (filename.length > 0) {
			var files = filename.split('.');
			if (files.length > 0) return files[files.length - 1].toLowerCase();
		}
		return '';
	},
	// 日期显示
	showDate: function(datetime, showTime) {
		if (datetime <= 0) return null;
		var now = new Date();
		var nowDayOfWeek = now.getDay(); // 今天本周的第几天
		var nowDay = now.getDate(); // 当前日
		var nowMonth = now.getMonth(); // 当前月
		var nowYear = now.getFullYear(); // 当前年
		var date = new Date(datetime * 1000);
		var compareTimes = this.iniDateTime(date);
		var compareYear = date.getFullYear();
		var nowDayTimes = this.iniDateTime(now);

		if (compareTimes == nowDayTimes) {
			if (showTime) return this.formatDate(datetime, 'HH:mm');
 			return '今天';
		}

		now.setDate(now.getDate() + 1);
		var tomorrowTimes = now.getTime();

		if (compareTimes == tomorrowTimes) {
			if (showTime) return '明天' + '\t' + this.formatDate(datetime, 'HH:mm');
			return '明天';
		}
		now.setDate(now.getDate() - 2);
		var yesterdayTimes = now.getTime();

		if (compareTimes == yesterdayTimes) {
			if (showTime) return '昨天' + '\t' + this.formatDate(datetime, 'HH:mm');
			return '昨天';
		}

		var weekStartDateTimes = (new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)).getTime();
		var weekEndDateTimes = (new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))).getTime();

		if (weekStartDateTimes < compareTimes && compareTimes < weekEndDateTimes) {
			if (showTime) return '本周' + this.formatDate(datetime, 'week') + "\t" + this.formatDate(datetime, 'HH:mm');
			return '本周' + this.formatDate(datetime, 'week');
		}
		if (compareYear == nowYear) {
			if (showTime) return this.formatDate(datetime, 'MM月DD日') + "\t" + this.formatDate(datetime, 'HH:mm');
			return this.formatDate(datetime, 'MM月DD日');
		}
		if (showTime) return this.formatDate(datetime, 'YYYY年MM月DD日 HH:mm');
		return this.formatDate(datetime, 'YYYY年MM月DD日');
	},

	iniDateTime: function(today) {
		if (!(today instanceof Date)) today = new Date();
		return today.setHours(0, 0, 0, 0);
	},

	dataReplace: function(str, data) {
		return str.replace(/{([^}]+)}/g, function(item, $1) {
					if (data[$1]) return data[$1];
					return item
				});
	},

	formatBytes: function(bytes) {
		if (bytes <= 0) return '0KB';
		var s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
		var e = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + s[e];
	},
	
	formatCoin: function (number) {
		return (number.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	},

	validateBinary: function(limits, item) {
		if (limits == -1 || (limits & item) == item) return true;
		return false;
	},

	getPromptInfo: function(code) {
        if (Config.LOCALES && code) return Config.LOCALES.status[code];
		return '';
	},
	notify: function(data) {
		var options = {icon: '', body: ''};
		var title = data.title;
		$.extend(options, data);
		if (Notification.permission === 'granted') {
			var notification = new Notification(title, options);
			notification.onshow = function() {
				setTimeout(function() {
					notification.close();
				}, 10000);
			};
			notification.onclick = function () {
				window.focus();
				if (options.url) Event.trigger('SetUrl', options.url);
				notification.close();
			};
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function(permission) {
				if (permission === 'granted') {
					var notification = new Notification(title, options);
					notification.onshow = function() {
						setTimeout(function() {
							notification.close();
						}, 10000);
					};
					notification.onclick = function () {
						window.focus();
						if (options.url) Url.goto(options.url);
						notification.close();
					};
				}
			});
		}
	},
	setPosition: function(element, pos) {
		if (!element || typeof(element.focus) != 'function') return null;
		element.focus();
		if (!$.isNumeric(pos)) pos = 0;
		if (pos < 0) pos = element.value.length;

		if (element.setSelectionRange) {
			element.setSelectionRange(pos, pos);
		} else if (element.createTextRange) {
			var rng = element.createTextRange();
			rng.move('character', pos);
			rng.select();
		}
	},
	isScrollTop: function(domNode) {
        return domNode.scrollTop == 0 ;
	},
	isScrollBottom: function(domNode, offset) {
		if (!domNode) return false;
		if (!$.isNumeric(offset)) offset = 10;
        return domNode.scrollTop + domNode.offsetHeight >= domNode.scrollHeight - offset;
	},
	scrollBottom: function(domNode) {
		$(domNode).scrollTop(domNode.scrollHeight);
	},
	hasScroll: function(domNode) {
		var objDomNode = $(domNode);
		if (objDomNode.scrollTop() > 0) return true;
		objDomNode.scrollTop(1);
		if (objDomNode.scrollTop() > 0) {
			objDomNode.scrollTop(0);
			return true;
		}
		return false;
	},
	chenckDeadline: function(datetime, bool) {
		if (!datetime) return false;
		datetime = new Date(datetime * 1000);

		if (bool && datetime.getHours() == 0 && datetime.getMinutes() == 0) {
			datetime.setDate(datetime.getDate() + 1);
		}

		return datetime.getTime() < $.now();
	},
	createId: function() {
		return ++Config.ID;
	},
	getCaptcha: function(captcha) {
		if (captcha) return Config.SITE_URL.API + '/api/security/image/captcha?device_identity=' + Config.CACHE_DATA.DEVICE_IDENTITY + '&' + captcha;
		return Config.SITE_URL.API + '/api/security/image/captcha?device_identity=' + Config.CACHE_DATA.DEVICE_IDENTITY + '&' + Math.random();
	},
	getBase64: function (file, callback) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e) {
			typeof(callback) == 'function' && callback(e.currentTarget.result);
		}
	},
	getMessageState: function() {
		return this.md5(Config.CACHE_DATA.USER._id + Math.random().toString().substr(2, 8));
	},
	getAvatar: function(url, size) {
		if ($.isNumeric(size) && /^http/.test(url)) return url + '/' + size + (this.avatarExt ? ('?' + this.avatarExt) : '');
		return url + (this.avatarExt ? ('?' + this.avatarExt) : '');
	},
	md5: require('./md5'),
	setTitle: function(name) {
		document.title = name;
	},
	extend: function(nowData, oldData) {
		for (var key in nowData) {
			nowData[key] = oldData[key];
		}
		return nowData;
	},
	getChannelType: function(channelId) {
		for (var key in Config.CHANNEL) {
			if (channelId.indexOf(Config.CHANNEL[key].PREV) == 0) return Config.CHANNEL[key].TYPE;
		}
		return -1;
	},
	getChannelKey: function(channelId) {
		for (var key in Config.CHANNEL) {
			if (channelId.indexOf(Config.CHANNEL[key].PREV) == 0) return key;
		}
		return null;
	},
	getChannelId: function(id, type) {
		for (var key in Config.CHANNEL) {
			if (Config.CHANNEL[key].TYPE == type) return Config.CHANNEL[key].PREV + id;
		}
		return id;
	}
};