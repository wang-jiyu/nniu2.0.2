var LiveHandle = require('../../../handle/live/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({
	gotoLive: function(url) {
		Event.trigger('UrlChange' + Config.MODULE_NAME.LIVE, url);
	},
    load: function () {
    	this.setState({loading: true});
        var params = {type: parseInt(this.props.type)};
        LiveHandle.getRank(params, function(result) {
            if (result.code == 200) {
                this.state.top1 = result.data.slice(0, 1);
                this.state.good = result.data.slice(1, 8);
                if (result.data.length > 0) {
                   return this.setState({loading: false, code: null});
                }
            }
            return this.setState({loading: false, code: result.code})
        }.bind(this));
    },
    componentDidMount: function() {
        this.load();
    },
    getInitialState: function() {
        return {top1: [], good: [], loading: true, code: null}
    },
	render: function() {
        if (this.state.loading)
            return <div  style={{position: 'relative', height: '448px'}}>
                        <Loading />
                    </div>;
        if (this.state.code)
            return <div  style={{position: 'relative', height: '448px'}}>
                        <Reload onReload={this.load} code={this.state.code} />
                    </div>;
		return (
                <div className="content">
                    <div className="teacher_item">
                        <img src={this.state.top1[0].type == 2 ? this.state.top1[0].thumbnail : this.state.top1[0].advisor.avatar} />
                        <div>
                            <a href="javascript:;" onClick={this.gotoLive.bind(this, '/live.html?adviser=' + this.state.top1[0].advisor._id)}>{this.state.top1[0].advisor.name}直播</a>
                            <p>
                                <i>人气：{this.state.top1[0].visitor_count}</i>
                                <b className={this.state.top1[0].ar > 0 ? 'up' : 'lower'}>{(this.state.top1[0].ar * 100).toFixed(2)}%</b>
                            </p>
                        </div>
                    </div>                
                    <ul className="good_live_list">
                    {this.state.good.map(function(item, i) {
                        return <li key={i}>
                                    <span>{i + 2}</span>
                                    <img src={item.type == 2 ? item.thumbnail : item.advisor.avatar} />
                                    <a href="javascript:;" onClick={this.gotoLive.bind(this, '/live.html?adviser=' + item.advisor._id)}>{item.advisor.name}直播</a>
                                    <div>
                                        <i>人气：{item.visitor_count}</i>
                                        <b className={item.ar > 0 ? 'up' : 'lower'}>{(item.ar * 100).toFixed(2)}%</b>
                                    </div>
                                </li>
                    }.bind(this))}
                    </ul>
                </div>)
	}
})