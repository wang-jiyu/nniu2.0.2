module.exports = {
    //获取问题列表
    getAskList: function(advisorsId, params,  callback) {
        Forms.get({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/advisors/' + advisorsId + '/question/list',
            params: params,
            callback: callback
        });
    },
    //创建一条问题
    setAskQuestion: function(advisorsId, params, callback) {
        Forms.post({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/advisors/' + advisorsId + '/question',
            params: params,
            callback: callback
        });
    },
    //回答一条问题
    answerQuestion: function(questionId, params, callback) {
        Forms.post({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/advisor/answers/' + questionId,
            params: params,
            callback: callback
        });
    },
    //编辑一条回复
    editAnswer: function(questionId, params, callback) {
        Forms.put({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/advisor/answers/' + questionId,
            params: params,
            callback: callback
        });
    },
    //删除一条问题
    deleteAsk: function(questionId, callback) {
        Forms.delete({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/advisor/questions/' + questionId,
            callback: callback
        });
    },
    //删除一条回复
    deleteQuestion: function(questionId, callback) {
        Forms.delete({
            api: Config.SITE_URL.ADVISOR,
            uri: '/api/advisor/answers/' + questionId,
            callback: callback
        });
    },
};