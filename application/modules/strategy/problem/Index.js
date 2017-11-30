require('../../../components/CommonEvent');
var AutoSignin = require('../../../components/AutoSignin');
var ReactDOM = require('react-dom');
var TopPostionUser = require('../components/TopPostionUser');
var Problem = require('../components/Problem');
var Main = React.createClass({
	componentWillMount: function() {
		AutoSignin(function(result) {
			if (result.code == 200) {
				return Interface.getProfile(function() {
					this.setState({
						userName: Config.CACHE_DATA.USER.name
					})
				}.bind(this))
			}
		}.bind(this));
	},
	getInitialState: function() {
		return {
			userName: ''
		}
	},
	render: function() {
		return (
			<div className="problem">
					<TopPostionUser postion="常见问题" userName={this.state.userName} />
                    <Problem />
		  </div>

		)
	}
})
ReactDOM.render(<Main />, document.getElementById('main_wrap'))