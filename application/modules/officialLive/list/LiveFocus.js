var LiveHandle = require('../../../handle/live/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({
	gotoLive: function(url) {
		Event.trigger('UrlChange' + Config.MODULE_NAME.LIVE, url);
	},
    load: function () {
    	this.setState({loading: true});
        LiveHandle.getFocus(function(result) {
            if (result.code == 200)
                return this.setState({loading: false, source: result.data, code: null});
            return this.setState({loading: false, code: result.code});
        }.bind(this));
    },
    getList: function () {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load} code={this.state.code} />;
        return (
            <ul>
                {this.state.source.map(function(item, i) {
                    return <li key={item._id} className="clearfix">
                        <a href="javascript:;" onClick={this.gotoLive.bind(this, '/live.html?room=' + item._id)}>
                            <span>{item.name}：</span>
                            <span>{item.last_message}</span>
                        </a>
                    </li>
                }.bind(this))}
            </ul>
        );
    },
    componentDidMount: function() {
      this.load();
    },
    getInitialState: function() {
        return {loading: true, source: [], code: null}
    },
	render: function() {

		return (
		    <div className="live_focus" style={{position: 'relative', minHeight: '703px'}}>
                <h4>直播聚焦</h4>
                {this.getList()}
            </div>
        )
	}
})