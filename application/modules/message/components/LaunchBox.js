var Loading = require('../../../components/common/Loading');

module.exports = React.createClass({
	close: function(isDriect) {
		if (this.state.open == 0) return true;
		if (isDriect !== true && typeof(this.state.closeEvent) == 'function') {
			if (this.state.closeEvent() === true) return false;
		}
		this.messagePushbar.off('keydown', this.keyClose);
		this.messagePushbar.off(Config.EVENT.TRANSITION_END).on(Config.EVENT.TRANSITION_END, function() {
			this.messagePushbar.off(Config.EVENT.TRANSITION_END);
			this.setState({title: null, module: null, open: 0, style: null});
		}.bind(this));
		this.setState({open: 2, closeEvent: null});
	},
	keyClose: function(e) {
		if (this.state.open != 0 && e.keyCode == 27) {
			this.close();
		}
	},
  	componentDidMount: function() {
		var scrollElement = $(this.refs.messagePushbarContent);
		this.messagePushbar = $(this.refs.messagePushbar);

		this.OpenLunch = Event.on(this.props.type == 'notify' ? 'OpenNotify' : 'OpenLaunch' + this.props.moduleName, function (data) {
			scrollElement.scrollTop(0);
			if (this.state.open == 1) return Event.trigger('ChangeLaunch' + this.props.moduleName, data);

			this.messagePushbar.off('keydown', this.keyClose).on('keydown', this.keyClose);
			this.messagePushbar.off(Config.EVENT.TRANSITION_END).on(Config.EVENT.TRANSITION_END, function() {
				this.setState({module: data.module});
			}.bind(this));

			var style = data.width ? {width: data.width, right: data.width * -1} : null;
			if (data.gap === true && data.width) {
				style = {width: 'calc(100% - ' + data.width + 'px)', right: 'calc(-100% + ' + data.width + 'px)'};
			}

			var virtualModule = <Loading />;
			if (JSON.stringify(this.state.style) == JSON.stringify(style)) virtualModule = data.module;


			this.setState({open: 1, module: virtualModule, title: data.title, style: style, closeEvent: data.closeEvent});
		}.bind(this));

		if (this.props.type != 'notify') {
			this.ChangeLaunch = Event.on('ChangeLaunch' + this.props.moduleName, function (data) {
				var style = data.width ? {width: data.width, right: data.width * -1} : null;
				if (data.gap === true && data.width) {
					style = {width: 'calc(100% - ' + data.width + 'px)', right: 'calc(-100% + ' + data.width + 'px)'};
				}
				if (data.closeEvent) {
					this.state.closeEvent = this.state.closeEvent;
				}
				if (data.module) {
					this.state.module = data.module;
				}
				if (data.width) {
					this.state.style = {width: data.width, right: data.width * -1}
				}
				if (data.title) {
					this.state.title = data.title;
				}

				this.setState({module: this.state.module, title: this.state.title, style: style || this.state.style, closeEvent: this.state.closeEvent});
			}.bind(this));
		}

		this.CloseLunch = Event.on(this.props.type == 'notify' ? 'CloseNotify' : 'CloseLaunch' + this.props.moduleName, function (data) {
			this.close(data);
		}.bind(this));
	},
	shouldComponentUpdate: function(nextProps, nextStates) {
		return this.state != nextStates;
	},
	componentWillUnmount: function() {
		Event.off(this.OpenLunch);
		if (this.props.type != 'notify') Event.off(this.ChangeLaunch);
		Event.off(this.CloseLunch);
		this.messagePushbar.off(Config.EVENT.TRANSITION_END);
	},
	getInitialState: function() {
		/**
		** open
		** 0 隐藏 
		** 1 显示 > 进场
		** 2 显示 > 退场
		**/
		return {title: null, module: null, open: 0, style: null, closeEvent: null};
	},
	render: function() {
		var VirtualModule = null;
		var _className = 'message_pushbar';

		if (this.state.open == 1) _className = 'message_pushbar actived';
		if (this.state.module) VirtualModule = this.state.module;
		
		return (<div className={this.props.className ? 'launch_box ' + this.props.className : 'launch_box'} style={{visibility: this.state.open == 0 ? 'hidden' : null}}>
					<div className={_className} style={this.state.style} ref="messagePushbar" tabIndex="-1">
						{this.state.title && <div className="message_pushbar_title">
							<h4>{this.state.title}</h4>
							<a className="close" href="javascript:;" onClick={this.close}></a>
						</div>}
						<div className="message_pushbar_content" ref="messagePushbarContent" style={this.state.title ? null : {top: 0}}>
							{VirtualModule}
						</div>
					</div>
					<div className="message_pushbar_bg" onClick={this.close}></div>
				</div>);
	}
});