module.exports = function(callback) {
	Event.on('UpdateUser', function(data) {
		$.extend(Config.CACHE_DATA.USER, data);
	});

	Event.on('NotLogin', function(callback) {
		Interface.login(callback, true);
	});

	function getGroup() {
		var CommonHandle = require('../handle/Common');

		CommonHandle.getGroup(function(result) {
			Config.CACHE_DATA.GROUP_LIST = result.data;
			typeof(callback) == 'function' && callback(result);
		});
	}

	Interface.login(function(result) {
		if (result.code == 200) {
			return getGroup();
		}
		typeof(callback) == 'function' && callback(result);
	});
}
