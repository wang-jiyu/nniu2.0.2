module.exports = {

    //根据国家获取财经日历
    getCountryCalendar: function(country, callback) {
        country =  $.extend({country: '中国'}, {country: country});
        Forms.get({
            api: Config.SITE_URL.CMS,
            uri: '/api/finance/calendar/county',
            params: country,
            callback: callback
        });
    },
    //根据日期获取财经日历
    getDateCalendar: function(date, callback) {
        Forms.get({
            api: Config.SITE_URL.CMS,
            uri: '/api/finance/calendar/date',
            params: {date: date},
            callback: callback
        });
    },

};