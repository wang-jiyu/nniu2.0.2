module.exports = {
	/// 获取
	get: function(key) {
		var arr = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'));
		return arr ? (unescape(arr[2])) : null;
	},
	/// 设置
	set: function(key, value, expires, path, domain) {
		if (typeof expires == 'undefined') {
			expires = new Date(new Date().getTime() + 24 * 3600 * 100);
		}
		document.cookie = key + '=' + escape(value) + ((expires) ? '; expires=' + expires.toGMTString() : '') + ((path) ? '; path=' + path: '; path=/') + ((domain) ? '; domain=' + domain: '');
	},
	/// 清除
	clear: function(key) {
		var cval = this.get(key);
		if (key != null) document.cookie = key + '=' + cval + ';expires=Fri, 02-Jan-1970 00:00:00 GMT';
	}
}