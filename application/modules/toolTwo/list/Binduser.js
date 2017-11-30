var UserCenterHandle = require('../../../handle/usercenter/UserCenter');
		
module.exports = React.createClass({
	timing: function() {
		if (this.state.second == 0) Interface.closeWin();
		setTimeout(function() {
			if (this.isMounted()) this.setState({second: --this.state.second}, this.timing);
		}.bind(this), 1000);
	},
	componentDidMount: function() {
		var type = Url.getParam('type');
		var code = Url.getParam('code');
		UserCenterHandle.bindUser({code: code}, type, function(result) {
			if (result.code == 200) {
				this.setState({success: true}, function() {
					Interface.pushMessage('ChangeState', type);
					this.timing();
				}.bind(this))
			} else {
				this.setState({error: result.code});
			}
		}.bind(this))
	},

	getInitialState: function() {
		return {second: 3, success: false, error: false};
	},
	render: function() {
		if (this.state.error) return <div className="bind_user_box">
										 <span>绑定失败，原因： {Utils.getPromptInfo(this.state.error)}</span>
									 </div>;
		if (this.state.success) return <div className="bind_user_success">
											<i></i>
											<label>绑定账号成功</label>
											<p>{this.state.second}秒后，自动关闭页面</p>
										</div>;
		return <div className="bind_user_box">
					<span>正在绑定中，请稍候...</span>
				</div>;
	}
});