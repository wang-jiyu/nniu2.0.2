var NewsHandle = require('../../../handle/news/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({
    select: function(id) {
        this.props.onSelect(id);
    },
    showLoading: function () {
        switch (this.state.showLoading) {
            case 0:
                return <li style={{cursor: 'default'}}><div className="no_more">无更多数据</div></li>;
            case 1:
                return (
                    <li>
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                    </li>
                );
            default:
                return null;
        }
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

    selectArticle: function (id) {
        if (Url.getParam('ref_id')) return false;
        this.props.onSelectArticle(id);
    },

    load: function (flag, callback) {
        if (!flag) {
            this.setState({loading: true});
        }
        var params = {limit: 20, latest_stamp: this.state.latest, category_id: this.props.pointer};
        this.setState({showLoading: 1});
        NewsHandle.getMagazineList(params ,function(result){
            if(result.code == 200){
                if (result.data.length < 1)
                    return this.setState({showLoading: 0, loading:false, code: null});
                    Config.CACHE_DATA.isJournalScroll = false;

                var data = flag == false ? result.data.slice(0, params.limit) : this.state.data.concat(result.data.slice(0, params.limit));
                if(flag == false) this.selectArticle(result.data[0]['_id']);

                return this.setState({
                    data: data,
                    loading: false,
                    latest: result.data[result.data.length-1]._id,
                    code: null
                }, function () {
                    Config.CACHE_DATA.isJournalScroll = true;
                    if (result.data.length < params.limit) {
                        Config.CACHE_DATA.isJournalScroll = false;
                        this.setState({showLoading: 0});
                    }
                    if (typeof callback == 'function') callback();
                });
            }
            return this.setState({code: result.code, loading: false});
        }.bind(this));
    },

    scroll: function() {
        if (!Config.CACHE_DATA.isJournalScroll) return;
        if (Utils.isScrollBottom($(this.refs.box).closest('.news_widgets')[0], 10)) {
            Config.CACHE_DATA.isJournalScroll = false;
            this.load(true);
        }
    },

    init: function () {
        Config.CACHE_DATA.isJournalScroll = true;
        this.loadNav();
    },

    componentDidMount: function () {
        this.init();
    },

    componentWillUnmount: function() {
        $(this.refs.box).closest('.news_widgets').off('scroll', this.scroll);
    },

    loadNav: function () {
        NewsHandle.getCategorys(function (result) {
            if (result.code == 200 && result.data.length > 0) {
                var data = result.data.filter(function(item, index) {
                    return item.assort == 1;
                });
                Config.CACHE_DATA.COLOR = data;
                this.setState({navList: data, loading: false}, function () {
                    this.load(false, function () {
                        $(this.refs.box).closest('.news_widgets').on('scroll', this.scroll);
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this));
    },

    getList: function() {
        if (this.state.loading) return <Loading  />;
        if (this.state.code) return <Reload onReload={this.init} code={this.state.code} />;
        return (<ul className="news_tab_pane">
                {
                    this.state.data.map(function (item, index) {
                        return (
                            <li key={index}
                                onClick={function () {
                                    this.props.onSelectArticle(item._id);
                                }.bind(this)}>
                                        <span
                                            className="paper"
                                            style={{background: this.getCategoryColor(item.category_id)}}>
                                            {this.getCategoryName(item.category_id)}</span>
                                <div className="note">
                                    <h3 className="title">{item.title}</h3>
                                    <p className="meta">
                                                <span
                                                    className="time">{Utils.formatDate(item.pubdate, 'YYYY-MM-DD HH:mm')}</span>
                                        <span className="source">{item.source} - {item.author}</span>
                                    </p>
                                </div>
                            </li>
                        )
                    }.bind(this))
                }
                {
                    this.showLoading()
                }
            </ul>);
    },

    getInitialState: function () {
        return {
            data: [],
            loading: true,
            showLoading: 2,
            latest: '',
            code: null,
            navList: []
        };
    },

    render: function () {

        return (
        <div className="news_widgets">
            <ul className="news_nav_tab">
                <li
                    className={this.props.pointer == '' ? 'active' : null}
                    onClick={this.props.pointer == '' ? null: this.select.bind(this, '')}
                >全部</li>
                {
                    this.state.navList.map(function(item, index) {
                        return <li
                            key={index}
                            onClick={this.props.pointer == item.category_id ? null: this.select.bind(this, item.category_id)}
                            className={this.props.pointer == item.category_id ? 'active' : null}
                        >{item.name}</li>;
                    }.bind(this))
                }
            </ul>
            {this.state.code ? <Reload onReload={this.load} code={this.state.code} /> :
                <div className="news_widgets_content" ref="box">
                    {this.getList()}
                </div>
            }
        </div>

        );
    }
});
