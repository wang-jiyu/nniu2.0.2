var NewsHandle = require('../../../handle/news/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({
    selectArticle: function(id) {
        this.props.onSelectArticle(id);
    },
    load: function () {
    	this.setState({loading: true});
        NewsHandle.getMagazineHotList({limit: 10, category_id: this.props.pointer}, function (result) {
            if (result.code == 200) {
                return this.setState({data: result.data || [], loading: false, code: null});
            }
            return this.setState({loading: false, code: result.code})
        }.bind(this));
    },

    getCategoryName: function (id) {
        var array = typeof Config.CACHE_DATA.COLOR == 'undefined' ? [] : Config.CACHE_DATA.COLOR;
        for (var i = 0; i < array.length; i++) {
            if (array[i]['category_id'] == id)  return array[i]['name'];
        }
        return '';
    },

    getCategoryColor: function (id) {
        var array = typeof Config.CACHE_DATA.COLOR == 'undefined' ? [] : Config.CACHE_DATA.COLOR;
        for (var i = 0; i < array.length; i++) {
            if (array[i]['category_id'] == id)  return array[i]['color'];
        }
        return '';
    },

    getList: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload  onReload={this.load} code={this.state.code} />;
        return <ul>
            {
                this.state.data.map(function(item, index) {
                    return <li key={index} onClick={this.selectArticle.bind(this, item._id)}>
                                    <span
                                        className="paper"
                                        style={{background: this.getCategoryColor(item.category_id)}}>
                                            {this.getCategoryName(item.category_id)}</span>
                        <div className="note">
                            <h3 className="title">{item.title}</h3>
                            <p className="time">{Utils.formatDate(item.pubdate, 'YYYY-MM-DD HH:mm')}</p>
                        </div>
                    </li>
                }.bind(this))
            }
        </ul>;
    },

    componentDidMount: function () {
        this.load();
    },

    getInitialState: function () {
        return {data: [], loading: true, code: null};
    },

    render: function () {

        return (
            <div className="news_relates">
                <div className="news_relates_title"><h3>热点推荐</h3></div>
                <div className="news_widgets_content"  style={{position:'relative', minHeight:'300px'}}>
                    {this.getList()}
                </div>
            </div>
        );
    }
});
