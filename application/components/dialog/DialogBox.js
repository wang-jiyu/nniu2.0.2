module.exports = React.createClass({
	stopClose: function(e) {
		e.stopPropagation();
	},
	change: function(data) {
		if (data.title) this.state.title = data.title;
		if (data.width) this.state.width = data.width;
		if (data.height) this.state.height = data.height;
		if (data.closeEvent) this.state.closeEvent = data.closeEvent;
		this.forceUpdate();
	},
	open: function(data) {
		var objDialogBox = $(this.refs.dialogBox);
		var state = {width: 600, height: 400, title: data.title, closeEvent: null};
		if (data.width) state.width = data.width;
		if (data.height) state.height = data.height;
		if (data.closeEvent) state.closeEvent = data.closeEvent;
		if (data.module) state.module = data.module

		objDialogBox.off('transitionend').addClass('open_dialog').css('visibility', 'inherit');
		this.setState(state);
	},
	close: function() {
		if (typeof(this.state.closeEvent) == 'function') {
			if (this.state.closeEvent() === true) return false;
		}

		var objDialogBox = $(this.refs.dialogBox);
		if (objDialogBox.hasClass('open_dialog')) {
			objDialogBox.removeClass('open_dialog');
			objDialogBox.off('transitionend').one('transitionend', function() {
				objDialogBox.css('visibility', '');
				this.setState({module: null})
			}.bind(this))
		}
	},
	componentDidMount: function() {
		Event.on('OpenDialog', this.open);
		Event.on('ChangeDialog', this.change);
		Event.on('CloseDialog', this.close);
	},
	getInitialState: function() {
		return {module: null};
	},
	render: function() {
		var style = {width: this.state.width, height: this.state.height, marginLeft: -(this.state.width / 2) + 'px', marginTop: -(this.state.height / 2) + 'px'};
		return (<div className="dialog_wrap" ref="dialogBox" onClick={this.close}>
					<div className="dialog_box" style={style} onClick={this.stopClose}>
						{
							this.state.title ? 
							<div className="dialog_title">
								<h1>{this.state.title}</h1>
								<a href="javascript:;" onClick={this.close}></a>
							</div> :
							null
						}
						<div className="dialog_content">
							{this.state.module}
						</div>
					</div>
				</div>);
	}
});