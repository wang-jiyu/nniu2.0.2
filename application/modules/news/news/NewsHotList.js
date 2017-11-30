var NewsHandle = require('../../../handle/news/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({
    selectArticle: function(id) {
        this.props.onSelectArticle(id);
    },
    load: function() {
        this.setState({loading: true});
        NewsHandle.getFinaceHotList({limit: 10}, function (result) {
            if (result.code == 200) return  this.setState({data: result.data, loading: false, code: null});
            return this.setState({code: result.code, loading: false});
        }.bind(this));
    },

    componentDidMount: function() {
        this.load();
    },

    getList: function() {
      if (this.state.loading) return <Loading />;
      if (this.state.code) return <Reload  onReload={this.load} code={this.state.code} />;
      return (<ul>
                {this.state.data.map(function (item) {

                    var className = 'time';
                    if (item.tags == 1) {
                        className += ' hot';
                    } else if (item.tags == 2) {
                        className += ' alone';
                    }
                    return <li key={item._id} onClick={this.selectArticle.bind(this, item._id)}>
                        <img src={item.thumbnail} className="avatar"/>
                        <div className="note">
                            <h3 className="title">{item.title}</h3>
                            <p className={className}>{Utils.formatDate(item.pubdate, 'YYYY-MM-DD HH:mm')}</p></div>
                    </li>
                }.bind(this))}
            </ul>);
    },

    getInitialState: function() {
        return {data: [], loading: true, code: null};
    },

    render: function() {

        return (
            <div className="news_relates">
                <div className="news_relates_title"><h3>热点推荐</h3></div>
                <div className="news_widgets_content" style={{position:'relative', minHeight:'300px'}}>
                    {this.getList()}
                </div>
            </div>
        );
    }
});
