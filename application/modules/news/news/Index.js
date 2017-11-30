var Carousel = require('../components/Carousel');
var NewsList = require('./NewsList');
var NewsInfo = require('./NewsInfo');
var NewsHotList = require('./NewsHotList');
var NewsHandle = require('../../../handle/news/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
var Advert = require('../../../components/common/Advert');

module.exports = React.createClass({
    load: function() {
        this.setState({loading: true});
        NewsHandle.getAdvertisement(1, function (result) {
            if (result.code == 200) {
                var articleId = '';
                if (Url.getParam('ref_id')) articleId = Url.getParam('ref_id');
                return this.setState({loading: false, data: result.data, articleId: articleId, code: null})
            }
            return  this.setState({loading: false, code: result.code});
        }.bind(this));
    },
    selectPointer: function(id) {
        this.setState({pointer: id});
        Config.CACHE_DATA.isScroll = false;
    },
    selectArticle: function(id) {
        this.setState({articleId: id});
    },
    componentDidMount: function() {
        this.load();
    },

    getInitialState: function() {
        return {data: [], loading: true, pointer: '', code: null};
    },

    render: function() {
        if (this.state.loading) return <Loading  />;
        if (this.state.code) return <Reload onReload={this.load} code={this.state.code} />;

        return <div className="news_container">
                    <div ref="news" onScroll={this.scroll} className="news_content_list">
                        <Advert position="3" />
                        <div className="news_widgets">
                            <NewsList onSelectArticle={this.selectArticle} />
                        </div>
                    </div>
                    <div className="news_content_info">
                        <NewsInfo articleId={this.state.articleId} key={this.state.articleId} />
                        <NewsHotList onSelectArticle={this.selectArticle} />
                    </div>
                </div>;
    }
});