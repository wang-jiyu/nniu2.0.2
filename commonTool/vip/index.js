module.exports = {
	getWeightItem: function(weight, field) {
		if (!Config.CACHE_DATA.GROUP_LIST) return false;
		for (var i = 0; i < Config.CACHE_DATA.GROUP_LIST.length; i++) {
			var item = Config.CACHE_DATA.GROUP_LIST[i];
			if (item.weight == weight && item.assort == 0) {
				if (field) return item[field];
				return item;
			}
		}
		return null;
	},
	getIdItem: function(id, field) {
		if (!Config.CACHE_DATA.GROUP_LIST) return false;
		for (var i = 0; i < Config.CACHE_DATA.GROUP_LIST.length; i++) {
			var item = Config.CACHE_DATA.GROUP_LIST[i];
			if (item._id == id) {
				if (field) return item[field];
				return item;
			}
		}
		return null;
	},
	chechAuth: function(auth) {
		if (!Config.CACHE_DATA.USER) return false;

		var item = this.getIdItem(Config.CACHE_DATA.USER.group);
		if (!item) return false;
		return item.weight >= auth;
	}
};