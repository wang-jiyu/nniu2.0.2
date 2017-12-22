module.exports = React.createClass({
	timing: function() {
		if (this.state.second == 0) return Interface.setLogin(this.props.source.mobile, this.props.source.password, true);
		setTimeout(function() {
			if (this.isMounted()) this.setState({second: --this.state.second}, this.timing);
		}.bind(this), 1000);
	},
	componentDidMount: function() {
		this.timing();
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state != nextState;
	},
	getInitialState: function() {
		return {second: 5, error: null};
	},
	render: function() {
		return <div className="success">
					<i></i>
					<label>账户注册成功</label>
					<p>{this.state.second}秒后，系统自动登录</p>
				</div>;	
	}
});