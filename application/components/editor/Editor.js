var Simditor = require('simditor');
require('./simditor-attachment');
require('./simditor-emoji');

module.exports = React.createClass({
	formChange: function(e) {
		Forms.restrict(e.target, function(data) {
            this.setState(data);
        }.bind(this))
	},
	componentDidMount: function() {
		var textEditor = $(this.refs.editor);
		var _mention = null;
		var _toolbar = ['bold', 'italic', 'underline','strikethrough', 'color', '|',  'ol', 'ul', 'table', 'indent', 'outdent','blockquote', 'code', '|', 'link', 'image'];

		this.editor = new Simditor({
						ctrlKey: this.props.ctrlKey,
						textarea: textEditor,
						toolbar: _toolbar,
						fileParam: this.props.fileParam,
						defaultImage: '/assets/images/editor.png',
						upload: {
							url: Config.SITE_URL.ATTACHMENT +　'/api/upload',
							fileKey: 'upload_file',
							connectionCount: '3',
							params: null,
							leaveConfirm: '正在上传文件'
						},
						pasteImage: true
					});
		this.editor.focus();
		$(this.refs.editorBox).on('keydown', function(e) {
			//# 阻止加粗斜体等事件
			if ((e.ctrlKey || e.metaKey) && (e.keyCode == 66 || e.keyCode == 73 || e.keyCode == 85)) e.preventDefault();
		}.bind(this));
	},
	componentWillUnmount: function() {
		this.editor.destroy();
		$(this.refs.editorBox).off('keydown');
	},
	render: function() {
		return <div className="editor_box" ref="editorBox">
					<textarea ref="editor" placeholder={this.props.placeholder || '按(Enter)发送消息'} name={this.props.name} defaultValue={this.props.value}></textarea>
				</div>
	}
});