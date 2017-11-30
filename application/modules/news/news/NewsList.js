var NewsHandle = require('../../../handle/news/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({

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

	load: function (flag, callback) {
        if (!flag) {
            this.setState({loading: true});
        }
        var params = {limit: 20, latest_stamp: this.state.latest, category_id: this.props.pointer};
        this.setState({showLoading: 1});
        NewsHandle.getFinaceList(params ,function(result){
            if(result.code == 200){
                if (result.data.length < 1)
                    return this.setState({loading: false, showLoading: 0, code: null}, function () {
                        Config.CACHE_DATA.isNewsScroll = false;
                    }.bind(this));
                var data = flag == false ? result.data.slice(0, params.limit) : this.state.data.concat(result.data.slice(0, params.limit));
                if(flag == false) this.selectArticle(data[0]['_id']);
                return this.setState({
                    data: data,
                    loading: false,
                    code: null,
                    latest: result.data[result.data.length-1]._id
                }, function () {
                    Config.CACHE_DATA.isNewsScroll = true;
                    if (result.data.length < params.limit) {
                        Config.CACHE_DATA.isNewsScroll = false;
                        this.setState({showLoading: 0});
                    }
                    if (typeof callback == 'function') callback();
                });
            }
            return this.setState({code: result.code, loading: false});
        }.bind(this));
    },

    selectArticle: function (id) {
        if (Url.getParam('ref_id')) return false;
        this.props.onSelectArticle(id);
    },

    scroll: function() {
        if (!Config.CACHE_DATA.isNewsScroll) return;
        if (Utils.isScrollBottom($(this.refs.box).closest('.news_widgets')[0], 10)) {
            Config.CACHE_DATA.isNewsScroll = false;
            this.load(true);
        }
    },

    init: function () {
        Config.CACHE_DATA.isNewsScroll = true;
        this.load(false, function() {
            $(this.refs.box).closest('.news_widgets').on('scroll', this.scroll);
        }.bind(this));
    },

    componentDidMount: function () {
        this.init();
    },

    componentWillUnmount: function() {
        $(this.refs.box).closest('.news_widgets').off('scroll', this.scroll);
    },

    getInitialState: function () {
        return {
            data: [],
            loading: true,
            showLoading: 2,
            latest: ''
        };
    },

	render: function() {
		if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.init} code={this.state.code} />;
		return (
			<div className="news_widgets_content" ref="box">
				<ul  className="news_list">
                    {this.state.data.map(function(item){
                        var className = 'time';
                        if(item.tags == 1){
                            className += ' hot'
                        }else if(item.tags == 2){
                            className += ' alone'
                        }
                        return <li key={item._id} onClick={function() { this.props.onSelectArticle(item._id); }.bind(this)}>
                            <div className="avatar"><img src={item.thumbnail}  /></div>

							<div className="note">
								<h3 className="title">{item.title}</h3>
								<p className={className}>{Utils.formatDate(item.pubdate, 'YYYY-MM-DD HH:mm')}</p>
							</div>
						</li>
                    }.bind(this))}
                    {
                        this.showLoading()
                    }

				</ul>
			</div>
		);
	}
});