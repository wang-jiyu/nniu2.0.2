var ReactDOM = require('react-dom');
var ToolManage = require('./ToolManage');
var AutoSignin = require('../../components/AutoSignin');
var Loading = require('../../components/common/Loading');
var Main = React.createClass({
	load: function(Virtual) {
		this.setState({
			module: <Virtual />,
			loading: false
		});
	},
	getModule: function(callback) {
		var tool = Url.getParam('tool');
		var state = Url.getParam('state');
		if (state) tool = state;

		ToolManage.getModule(tool, function(Virtual) {
			switch (tool) {
				case 'signup':
				case 'forgot':
				case 'login':
					return this.setState({
						module: <Virtual />,
						loading: false
					});
			}
			AutoSignin(function() {
				Interface.getProfile(this.load.bind(this, Virtual))
			}.bind(this));
		}.bind(this))
	},
	componentDidMount: function() {
		this.getModule();
	},
	getInitialState: function() {
		return {
			module: null,
			loading: true
		};
	},
	render: function() {
		if (this.state.loading) return <Loading/>;
		return this.state.module
	}
});

ReactDOM.render(<Main />, document.getElementsByClassName('main_wrap')[0]);