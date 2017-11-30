var Simditor = require('simditor');
var MessageHandle = require('../../handle/messages/Index');
require('./simditor-attachment');
require('./simditor-emoji');

module.exports = React.createClass({
	formChange: function (e) {
		Forms.restrict(e.target, function (data) {
			this.setState(data);
		}.bind(this))
	},
	componentDidMount: function () {
		var textEditor = $(this.refs.editor);
		var _mention = null;
		var _toolbar = ['emoji'];
		var max = this.props.maxLength || 200;

		if ($.isArray(this.props.toolbar))[].unshift.apply(_toolbar, this.props.toolbar);

		this.editor = new Simditor({
			submit: this.props.onSubmit,
			ctrlKey: this.props.ctrlKey,
			textarea: textEditor,
			toolbar: _toolbar,
			fileParam: this.props.fileParam
		});
		this.editor.focus();

		this.editor.on('valuechanged', function (e) {
			var str = MessageHandle.formatToServer(this.editor.getValue());
			if (str.length > max) {
				this.editor.setValue(str.substr(0, max));
				return true;
			}
			this.setState({ number: str.length });
		}.bind(this));

		this.editor.on('keydown', function (e) {
			var str = MessageHandle.formatToServer(this.editor.getValue());
			if (!(e.keyCode == 8 || e.keyCode == 46 || (e.keyCode >= 37 && e.keyCode <= 40))) {
				if (str.length >= max) return false;
			}
			//# 阻止加粗斜体等事件
			if ((e.ctrlKey || e.metaKey) && (e.keyCode == 66 || e.keyCode == 73 || e.keyCode == 85)) e.preventDefault();
		}.bind(this));

	},

	getValue: function () {
		return this.editor.getValue();
	},

	clear: function () {
		this.editor.setValue("");
	},

	componentWillUnmount: function () {
		this.editor.destroy();
		this.editor.off('valuechanged').off('keydown');
	},

	getInitialState: function () {
		return { number: 0 }
	},

	render: function () {
		var style = {
			position: 'absolute',
			right: '5px',
			bottom: '1px',
			color: "#9b9b9b",
			padding: '0 5px 0 10px',
			zIndex: 1000
		};
		var tips = this.props.placeholder ? this.props.placeholder : (this.props.maxLength ? '请输入1~' + this.props.maxLength + '个字符，按(Enter)发送消息' : '请输入1~200个字符，按(Enter)发送消息');
		return <div className="editor_box" ref="editorBox">
			<textarea data-require="require" ref="editor" placeholder={tips} name={this.props.name} defaultValue={this.props.value}></textarea>
			<div className="text_limit" style={style}>{this.state.number}/{this.props.maxLength || 200}</div>
		</div>
	}
});