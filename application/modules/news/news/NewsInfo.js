var NewsHandle = require('../../../handle/news/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({

    getArticles: function() {
        if (!this.state.id) return null;
        this.setState({loading: true});
        NewsHandle.getArticles(this.state.id, function (result) {
            if (result.code == 200)   return this.setState({loading: false, source: result.data, code: null});
            this.setState({loading: false, source: null, code: result.code});
        }.bind(this));
    },

    componentDidMount: function() {
        this.getArticles();
    },

    getInitialState: function() {
        return {id: this.props.articleId, loading: true, source: [], code: null};
    },

    render: function() {
        if (this.state.loading) return (
            <div className="news_info" style={{position: 'relative', minHeight: '500px'}}>
                <div className="news_info_main">
                    <Loading />
                </div>
            </div>
        );
        if (this.state.code) return (
            <div className="news_info" style={{position: 'relative', minHeight: '500px'}}>
                <div className="news_info_main">
                    <Reload onReload={this.getArticles} code={this.state.code} />
                </div>
            </div>
        );

        if (!this.state.source) return <div className="news_content_info">请选择文章</div>;
        var className = 'title';
        if (this.state.source.tags == 1) {
            className += ' hot';
        } else if (this.state.source.tags == 2) {
            className += ' alone';
        }

        return (

            <div className="news_info">
                <div className="news_info_title">
                    <h3 className={className}>{this.state.source.title}</h3>
                    <p className="meta">
                        <span className="time">{Utils.formatDate(this.state.source.pubdate, 'YYYY-MM-DD HH:mm')}</span>
                        <em className="source">{this.state.source.source}</em>
                    </p>
                </div>
                <div className="news_info_main" dangerouslySetInnerHTML={{__html: this.state.source.content}}>

                </div>
            </div>
        );
    }
});