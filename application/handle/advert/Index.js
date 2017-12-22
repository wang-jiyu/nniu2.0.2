module.exports = {
    getAdvert: function(position, callback) {
        Forms.get({
            api: Config.SITE_URL.CMS,
            uri: '/api/adverts',
            params: {position: position},
            callback: callback
        });
    }
};