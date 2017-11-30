module.exports = {
	getAssets: function(url) {
		return (__webpack_require__.p == '' ? '/assets' : __webpack_require__.p) + url;
	},
	getParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
		return null;
    },
	paramSerialize: function(search) {
		var result = {};
		search.split('&').map(function(item) {
			var index = item.indexOf('=');
			var key  = item.substr(0, index);
			result[key] = item.substr(index + 1, item.length);
		});
		return result;
	},
	toSerialize: function (url) {
		var index = url.indexOf('?');
		if (index == -1) return {};
		return this.paramSerialize(url.substr(index + 1, url.length));
	},
	setUrl: function(href) {
		history.pushState(null, null, href);
		return true;
	}
};