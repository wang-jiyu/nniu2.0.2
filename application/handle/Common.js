module.exports = {
	getGroup: function(callback) {
		Forms.get({
			uri: '/api/group/info',
			callback: callback
		});
	}
};