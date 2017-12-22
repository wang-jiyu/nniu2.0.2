var ReactDOM = require('react-dom');
var AutoSignin = require('../../components/AutoSignin');
var CommonEvent = require('../../components/CommonEvent');
var LiveList = require('./list/Index');
var LiveAdviser = require('./adviser/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

var Main = React.createClass({
	setModule: function(result) {
		this.setState({
			pointer: result
		});
	},
	getModule: function() {
		console.log(Config);
			return this.setState({
				module: LiveAdviser,
				loading: false,
				key: Utils.createId()
			});
	},
	login: function() {
		this.setState({
			loading: true,
			code: null
		});
		AutoSignin(function(result) {
			if (result.code != 200){
                return this.getModule();
			}
			Interface.getProfile(this.getModule);

			Event.on('UrlChange' + Config.MODULE_NAME.LIVE, function(url) {
				$('body').scrollTop(0);
				if (url && Url.setUrl(url)) return this.getModule();
			}.bind(this));
		}.bind(this));
	},
	componentDidMount: function() {
		this.login();
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state != nextState;
	},
	componentWillReceiveProps: function(nextProps) {

	},
	getInitialState: function() {
		return {
			pointer: null,
			loading: true,
			code: null,
			module: null,
			key: Utils.createId()
		};
	},
	render: function() {
		if (this.state.loading) return <Loading />;
		if (this.state.code) return <Reload onReload={this.login} code={this.state.code} />;
		var VirtualModule = this.state.module;
		return <div className="live_wrap">
					<VirtualModule key={this.state.key} />
					<CommonEvent />
				</div>;
	}
});

ReactDOM.render(<Main />, document.getElementsByClassName('main_wrap')[0]);