module.exports = {
    getSuperlist: function(callback) {
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/super/list',
            callback: callback
        });
    },
    getVideo: function(callback) {
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/article/video',
            callback: callback
        });
    },

    //获取免费课堂列表
    getFreeCourseList: function(params, callback) {
        params = $.extend({
            limit: 20
        }, params);
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/course/free/list?limit=' + params.limit,
            callback: callback
        });
    },
    //获取精品课堂列表
    getGoodnessCourseList: function(params, callback) {
        params = $.extend({
            limit: 20,
            page: 1
        }, params);
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/course/list?limit=' + params.limit + '&page=' + params.page,
            callback: callback
        });
    },
    //获取单条免费课堂信息
    getFreeCourseInfo: function(id, callback) {
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/courses/' + id + '/free',
            callback: callback
        });
    },
    //获取付费课堂详情
    getGoodnessCourseDetail: function(id, callback) {
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/courses/' + id,
            callback: callback
        });
    },

    //获取付费课堂描述
    getGoodnessCourseDescription: function(id, callback) {
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/courses/' + id + '/description',
            callback: callback
        });
    },

    //获取付费课堂章节列表
    getGoodnessCharterList: function(params, callback) {
        params = $.extend({
            limit: 20,
            latest_stamp: ''
        }, params);
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/courses/' + params.id + '/lesson/list?type=' + params.type + '&latest_stamp=' + params.latest_stamp + '&limit=' + params.limit,
            callback: callback
        });
    },

    //开始直播
    startPlay: function(id, callback) {
        Forms.put({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/course/lessons/' + id + '/start',
            callback: callback
        });
    },

    //结束直播
    endPlay: function(id, callback) {
        Forms.put({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/course/lessons/' + id + '/end',
            callback: callback
        });
    },

    //开始观看视频
    watchPlay: function(id, callback) {
        Forms.put({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/course/lessons/' + id + '/play',
            callback: callback
        });
    },

    //创建订单
    createOrder: function(params, callback) {
        Forms.post({
            uri: '/api/order',
            params: params,
            callback: callback
        });
    },
    //课程金股列表
    getClassRecommendStock: function(param, callback) {
        var params = {
            course_guid: param.course_guid,
            access_token: param.access_token || Config.access_token
        }
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/course/lessons/' + param.lesson_guid + '/goldenshare/list',
            params: params,
            callback: callback
        });
    }

};