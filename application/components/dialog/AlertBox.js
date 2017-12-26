module.exports = React.createClass({
	closeClick: function () {
		this.setState({open: false});
	},
	confirmClick: function(e) {
		typeof(this.state.event) == 'function' && this.state.event(e);
		this.setState({open: false});
	},
	open: function(data) {
		data.open = true;
		this.setState(data);
	},
	componentDidMount: function() {
		Event.on('OpenAlert', this.open);
	},
	shouldComponentUpdate: function(nextProps, nextStates) {
		return this.state != nextStates;
	},
	componentWillUnmount: function() {
		Event.off('OpenAlert', this.open);
	},
	getInitialState: function() {
		return {open: false}
	},
	render: function() {
		if (!this.state.open) return null;

		var buttonStyle = null;
		switch (this.state.button) {
			case Config.MESSAGE_BUTTON.OKCANCEL:
				buttonStyle = <div className="buttons"><a href="javascript:;" onClick={this.confirmClick}>{this.state.enter || '确认'}</a><span>|</span><a href="javascript:;" onClick={this.closeClick} className="alertClose">取消</a></div>;
				break;
			case Config.MESSAGE_BUTTON.EXIT:
				buttonStyle = <div className="buttons"><a href="javascript:;" className="delete" onClick={this.confirmClick}>{this.state.enter || '确定退出'}</a><span>|</span><a href="javascript:;" onClick={this.closeClick} className="alertClose">取消</a></div>;
				break;
			case Config.MESSAGE_BUTTON.DELETE:
				buttonStyle = <div className="buttons"><a href="javascript:;" className="delete" onClick={this.confirmClick}>{this.state.enter || '删除'}</a><span>|</span><a href="javascript:;" onClick={this.closeClick} className="alertClose">取消</a></div>;
				break;
			default:
				buttonStyle = <div className="buttons"><a href="javascript:;" onClick={this.confirmClick}>{this.state.enter || '确认'}</a></div>;

		}

		this.state.button = 0;
		return (<div className="alert_box">
					<div className="dialog_bg"></div>
					<div className="dialog_box">
						<div className="message">
							<div className="content">
								<h2>{this.state.title}</h2>
								{$.isArray(this.state.message) && this.state.message.map(function(result, i) {
									return <p key={i}>{result}</p>;
								}) || <p >{this.state.message}</p>}
							</div>
						</div>
						{buttonStyle}
					</div>
				</div>);
	}
});
