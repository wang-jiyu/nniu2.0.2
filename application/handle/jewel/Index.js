module.exports = {
    getList: function(params, callback) {
		Forms.get({
			api: Config.SITE_URL.ADVISOR,
			uri: '/api/treasure/boxlist',
            params: params,
			callback: callback
		});
	},

    //获取符合产品列表
    getAssemble: function(params, callback) {
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/assemble/list',
            params: params,
            callback: callback
        });
    }
};