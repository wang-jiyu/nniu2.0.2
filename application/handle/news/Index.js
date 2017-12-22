module.exports = {
    //财经头条
	getFinaceList: function(params, callback) {
		params =  $.extend({limit: 5, latest_stamp: ''}, params);
		Forms.get({
			api: Config.SITE_URL.CMS,
			uri: '/api/cms/finace/list',
			params: params,
			callback: callback
		});
	},
    // 财经热点推荐
    getFinaceHotList: function(params, callback) {
        Forms.get({
            api: Config.SITE_URL.CMS,
            uri: '/api/cms/finace/hot',
            params: params,
            callback: callback
        });
    },
    // 首证期刊
    getMagazineList: function(params, callback) {
        Forms.get({
            api: Config.SITE_URL.CMS,
            uri: '/api/cms/magazine/list',
            params: params,
            callback: callback
        });
    },
    // 首证期刊热点推荐
    getMagazineHotList: function(params, callback) {
        Forms.get({
            api: Config.SITE_URL.CMS,
            uri: '/api/cms/magazine/hot',
            params: params,
            callback: callback
        });
    },
    // 资讯详情
    getArticles: function(id, callback) {
        Forms.get({
            api: Config.SITE_URL.CMS,
            uri: '/api/cms/articles/'+ id,
            //params: params,
            callback: callback
        });
    },
    //获取资讯分类
    getCategorys: function (callback) {
        Forms.get({
            api: Config.SITE_URL.CMS,
            uri: '/api/cms/category',
            callback: callback
        });
    },
    //获取指定位置广告
     getAdvertisement: function(id, callback) {
	    var params = $.extend({position: 1}, {position: id});
         Forms.get({
             api: Config.SITE_URL.CMS,
             uri: '/api/adverts',
             params: params,
             callback: callback
         });
     },
    //获取分类
    getCategoryList: function(callback) {
        Forms.get({
            api: Config.SITE_URL.CMS,
            uri: '/api/category',
            callback: callback
        });
    },
};