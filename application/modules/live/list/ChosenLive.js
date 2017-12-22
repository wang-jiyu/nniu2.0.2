var LiveHandle = require('../../../handle/live/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({
	gotoLive: function(url) {
		Event.trigger('UrlChange' + Config.MODULE_NAME.LIVE, url);
	},
    updataUser: function() {
        Interface.getProfile(function(result) {
            Interface.pushMessage('UpdateUser', result.data);
            this.setState({users: Config.CACHE_DATA.USER});
        }.bind(this), true);
    },
    follow: function(item, e) {
        var objButton = $(e.target);
        objButton.attr('disabled', true);
        LiveHandle.follow(item.advisor._id, function(result) {
            if (result.code == 200) return this.updataUser();
            objButton.attr('disabled', false);
        }.bind(this));
    },
    wheel: function() {
        if ( this.state.lastData && Utils.isScrollBottom(this.refs.chosenList)) {                      
            this.state.nowPage++;
            this.setState({loadMore: true}, function() {
                this.getChosenList(this.state.nowPage);
            }.bind(this));
        }
    },
    getChosenList: function(nowPage) {
    	this.setState({loading: true});
        var params = {limit: 20, page: nowPage};
        this.state.lastData = null;
        LiveHandle.getChosen(params, function(result) {
            if (result.code == 200) {
                if (result.data.length > 20) this.state.lastData = result.data.pop();
                this.state.source.push.apply(this.state.source, result.data);               
                return this.setState({loading: false, loadMore: false, source: this.state.source, code: null});
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this));
    },
    getList: function() {
        if (this.state.loading) return (
            <Loading />
        );
        if (this.state.code) return (
            <Reload onReload={this.getChosenList.bind(this, 1)} code={this.state.code} />
        );

        return (
            <ul className="chosen_list" ref="chosenList" onScroll={this.wheel}>
                {this.state.source.map(function(item, i) {
                    var index = this.state.users.follow_ids.indexOf(item.advisor._id);
                    return  <li className="live_item" key={item._id}>
                        <img src={item.type == 2 ? item.thumbnail : item.advisor.avatar} className="header" />
                        <div className="detail">
                            <h5>
                                <a href="javascript:;" onClick={this.gotoLive.bind(this, '/live.html?room=' + item._id)}>{item.topic}</a>
                                {this.state.users._id == item.advisor._id ?
                                    null
                                    :
                                    <input type="button" value={index == -1 ? '关注' : '已关注'} disabled={index != -1} onClick={this.follow.bind(this, item)} />
                                }
                            </h5>
                            <div>
                                <a href="javascript:;" onClick={this.gotoLive.bind(this, '/live.html?adviser=' + item.advisor._id)}>{item.advisor.name}直播</a>
                                <label>
                                    <i>人气：{item.visitor_count}</i>
                                    <b className={item.ar > 0 ? 'up' : 'lower'}>{(item.ar * 100).toFixed(2)}%</b>
                                </label>
                            </div>
                            <p title={item.advisor.intro}>{item.advisor.intro}</p>
                        </div>
                    </li>

                }.bind(this))}
                {this.state.loadMore && <li className="load_more">
                    <p>加载更多...</p>
                </li>}
            </ul>
        );
    },
    componentDidMount: function() {
        this.getChosenList(1);
    },
    getInitialState: function() {
        return {loading: true, source: [], nowPage: 1, loadMore: false, lastData: null, users: Config.CACHE_DATA.USER, code: null}
    },
	render: function() {

		return (<div className="live_chosen" style={{position: 'relative', height: '703px'}}>
                    <h4>精选直播</h4>
                    {this.getList()}
                </div>)
	}
})