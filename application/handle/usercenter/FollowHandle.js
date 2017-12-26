module.exports = {
    //获取会员关注列表
    getFollowList: function(params, callback) {
        params = $.extend({limit: 8, page: 1}, params);
        Forms.get({
            uri: '/api/member/follow/list',
            params: params,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //取消关注会员
    unFollow: function(id, callback) {
        Forms.post({
            uri: '/api/member/unfollow/'+id,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        })
    }
};