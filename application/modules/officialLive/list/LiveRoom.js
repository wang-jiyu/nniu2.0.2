var LiveHandle = require('../../../handle/live/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({
	gotoLive: function(url) {
		Event.trigger('UrlChange' + Config.MODULE_NAME.LIVE, url);
	},
    load: function () {
    	this.setState({loading: true});
        var params = {type: this.props.data._id};
        LiveHandle.getLive(params, function(result) {
            if (result.code == 200) {
                this.state.top3 = result.data.slice(0, 3);
                this.state.good = result.data.slice(3, 10);
                return this.setState({loading: false, code: null});
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this));
    },
    componentDidMount: function() {
        this.load();
    },
    getInitialState: function() {
        return {loading: true, top3: [], good: []}
    },
	render: function() {
        if (this.state.loading) return (
            <div className="detail" style={{position: 'relative',height: '320px'}}>
                <Loading  />
            </div>
        );

        if (this.state.code) return (
            <div className="detail" style={{position: 'relative',height: '320px'}}>
                <Reload onReload={this.load} code={this.state.code} />
            </div>
        );
		return (
                <div className="detail">
                    <ul className="top3">
                        {this.state.top3.map(function(item, i) {
                            var tag = item.advisor.tags.length > 0 ? item.advisor.tags.split(',') : [];
                            return  <li key={i} className="teacher_live">
                                        <span className="num">{i + 1}</span>
                                        <div className="header_pic">
                                            <img src={item.type == 2 ? item.thumbnail : item.advisor.avatar} />
                                        </div>
                                        <div className="info">
                                            <div className="name">
                                                <a href="javascript:;" onClick={this.gotoLive.bind(this, '/live.html?room=' + item._id )} title={item.type == 2 ? item.title : null}>{item.type == 2 ? item.title : (item.advisor.name + '直播')}</a>
                                                <i>人气：{item.visitor_count}</i>
                                                <b className={item.ar > 0 ? 'up' : 'lower'}>{(item.ar * 100).toFixed(2)}%</b>
                                            </div>
                                            <div className="tag">
                                                {tag.map(function(item1, i) {
                                                    return <label key={i}>{item1}</label>
                                                }.bind(this))}
                                            </div>
                                        </div>
                                    </li>
                        }.bind(this))}                       
                    </ul>
                    <div className="good">
                        <ul className="good_live_list">
                            {this.state.good.map(function(item, i) {
                                return <li key={i}>
                                            <span>{i + 4}</span>
                                            <img src={item.type == 2 ? item.thumbnail : item.advisor.avatar} />
                                            <a href="javascript:;" onClick={this.gotoLive.bind(this, '/live.html?room=' + item._id)} title={item.type == 2 ? item.title : null}>{item.type == 2 ? item.title : (item.advisor.name + '直播')}</a>
                                            <div>
                                                <i>人气：{item.visitor_count}</i>
                                                <b className={item.ar > 0 ? 'up' : 'lower'}>{(item.ar * 100).toFixed(2)}%</b>
                                            </div>
                                        </li>
                            }.bind(this))}
                            
                        </ul>
                    </div>             
                </div>)
	}
})