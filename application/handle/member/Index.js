module.exports = {
    setHeader: function(callback) {
        Forms.put({
            uri: '/api/member/avatar',
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }.bind(this)
        });
    }
};