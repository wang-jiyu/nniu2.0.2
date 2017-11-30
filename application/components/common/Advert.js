var AdvertHandle = require('../../handle/advert/Index');
var Carousel = require('./Carousel');

module.exports = React.createClass({
    notUrl: function(type) {
        switch (type) {
            case 1: return {type: Config.MODULE_NAME.JEWEL, url: '/jewel.html?type=tips'};
            case 4: return {type: Config.MODULE_NAME.JEWEL, url: '/jewel.html?type=report'};
            case 6: return {type: Config.MODULE_NAME.CLASSROOM, url: '/classroom.html'};
            case 8: return {type: Config.MODULE_NAME.NEWS, url: '/news.html'};
            case 9: return {type: Config.MODULE_NAME.LIVE, url: '/live.html'};
        }
    },
    clickUrl: function(item) {
        if (item.link_url == '') return this.notUrl(item.ref_type);
        var obj = JSON.parse(item.link_url);
        switch(item.ref_type) {
            case 1: return {type: Config.MODULE_NAME.LIVE, url: '/live.html?adviser=' + obj.adviser + '&tactics=' + obj._id};
            case 4: return {type: Config.MODULE_NAME.LIVE, url: '/live.html?adviser=' + obj.adviser + '&report=' + obj._id};
            case 6: return {type: Config.MODULE_NAME.CLASSROOM, url: '/classroom.html'};
            case 8: return {type: Config.MODULE_NAME.NEWS, url: '/news.html?type=' + obj.category + '&ref_id=' + obj._id};
            case 9: return {type: Config.MODULE_NAME.LIVE, url: '/live.html?room=' + obj._id};
        }
    },
    clickCarousel: function(item) {
        if (item.link_type != 2) return Interface.popWin(item.title, item.link_url, {width: 1260, maxHeight: 642, top: 30, bottom: 30, align: 'center', valign: 0.4});

        var data = this.clickUrl(item);
        Interface.gotoLeftNavView(data.type, data.url);
    },
    componentDidMount: function() {
        AdvertHandle.getAdvert(parseInt(this.props.position), function(result) {
            if (result.code == 200) {
                this.setState({loading: false, source: result.data});
            }
        }.bind(this))
    },
    getInitialState: function() {
        return {loading: true}
    },
    render: function() {
        if (this.state.loading) return null;
        if (this.state.source.length == 0) return <div className="no_advert">
                                                        暂无广告
                                                  </div>;

        var getList = <Carousel data={this.state.source} clickCarousel={this.clickCarousel} width={this.props.width ? this.props.width : "100%"} height={this.props.height ? this.props.height : "100%"} src={this.props.src} />;

        if (this.state.source.length == 1) {
            getList = <div className="advert_item">
                          <a href="javascript:;" onClick={this.clickCarousel.bind(this, this.state.source[0])}><img src={this.state.source[0].image_url} /></a>
                          <p>{this.state.source[0].title}</p>
                      </div>;
        }

        return <div className="advert_box">
                    {getList}
               </div>;
    }
});
