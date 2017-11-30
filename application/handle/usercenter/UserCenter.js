module.exports = {
    setUser: function(params, callback) {
        Forms.put({
            uri: '/api/member/personal',
            params: params,
            callback: callback
        });
    },
    setPassword: function(params, callback) {
        Forms.put({
            uri: '/api/member/password',
            params: params,
            callback: callback
        });
    },
    //修改会员手机
    setMobile: function(params, callback) {
        Forms.put({
            uri: '/api/member/mobile',
            params: params,
            callback: callback
        });
    },
    //实名认证
    authId: function(params, callback) {
        Forms.post({
            uri: '/api/member/auth',
            params: params,
            callback: callback
        });
    },
    //获取实名认证后的真实姓名
    getRealname: function(params, callback) {
       Forms.get({
            uri: '/api/member/authinfo',
            params: params,
            callback: callback
        });     
    },
    //绑定邮箱
    bindEmail: function(params, callback) {
        Forms.post({
            uri: '/api/member/email/verified',
            params: params,
            callback: callback
        });
    },
    //更新邮箱
    updateEmail: function(params, callback) {
        Forms.post({
            uri: '/api/member/email/update',
            params: params,
            callback: callback
        });
    },
    //绑定社交账号
    bindSns: function(param, callback) {
        Forms.post({
            uri: '/api/member/bind/sns/' + param.sns + '?type=' + param.type,
            callback: callback
        });
    },

    //执行绑定账号
    bindUser: function(params, type, callback) {
        Forms.get({
            uri:'/api/member/bind/' + type,
            params: params,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //解除绑定账号
    unbindUser: function(type, callback) {
        Forms.post({
            uri:'/api/member/unbind/sns/' + type,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
 
    //获取风险评测问卷
    getEvaluateTest: function (callback) {
        Forms.get({
            uri: '/api/risk/testing/list',
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //获取用户风险评测信息
    getEvaluateInfo: function (callback) {
        Forms.get({
            uri: ' /api/member/risk',
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //提交用户风测问卷
    setEvaluateQuestion:  function(params, callback) {
        Forms.post({
            uri: '/api/member/risk',
            params: params,
            callback: callback
        });
    },
    //获取问题列表
    getAskList: function (page, limit, callback) {
        Forms.get({
            uri: '/api/advisor/:member_guid/question/list?page='+ page +'&limit=' + limit,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    // 获取消费明细
    getCostList: function (params, callback) {
        Forms.get({
            uri: '/api/member/consume/list',
            params: params,
            callback: callback
        });
    },
    // 获取会员升级信息
    getVipInfo: function (callback) {
        Forms.get({
            uri: '/api/member/upgrade',
            callback: callback
        });
    },
    // 获取指定类型的资产
    getProperty: function (params, callback) {
        Forms.get({
            uri: '/api/member/property',
            params: params,
            callback: callback
        });
    },
    //获取第三方登陆的用户名与密码
    thirdLogin: function(params, type, callback) {
        Forms.get({
            uri: '/api/member/tickets/' + type,
            params: params,
            callback: callback
        });
    }
};