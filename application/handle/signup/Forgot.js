module.exports = {
    //重置密码
    resetPassword: function(params, callback) {
        params = $.extend({token: null, password: null}, params);
        Forms.post({
            uri: '/api/member/forget_password',
            params: params,
            callback: callback
        });
    }
};