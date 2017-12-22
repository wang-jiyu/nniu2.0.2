var Editor = require('../../../components/editor/Message');
var MessagesHandle = require('../../../handle/messages/Index');
var DialogUploader = require('../../../components/attachment/Uploader');

var ChatList = require('../../../components/common/ChatList');

module.exports = React.createClass({
	submit: function(html) {
		var md5 = Utils.getMessageState();
		var params = {content: MessagesHandle.formatToServer(html), type: this.props.source.type, target: this.props.source._id, state: md5};
		this.refs.chartRoom.scrollBottom();
		MessagesHandle.sendMessage(params, function(result) {
			if (result.code == 200 && this.isMounted()) {
				result.data.sending = true;
				this.refs.chartRoom.state.sendMessage[md5] = result.data;
				this.refs.chartRoom.appendMessage(result.data);
			}
		}.bind(this));
	},
	chatList: function(lastMessageId, callback) {
		var parmas = {ref_id: this.props.source._id, ref_type: this.props.source.type, latest_stamp: lastMessageId};
		MessagesHandle.getMessageList(parmas, callback);
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state != nextState;
	},
	
	componentDidMount: function() {
		Event.on('ChatMessage' + this.props.source._id + this.props.source.type, this.refs.chartRoom.appendMessage)
	},
	componentWillUnmount: function() {
		Event.off('ChatMessage' + this.props.source._id + this.props.source.type, this.refs.chartRoom.appendMessage);
	},
	render: function() {
		var canSendMessage = this.props.source.is_helper != 1;
		var noMessage = <div className="none_data">
							<i>&#xe879;</i>
							<p>暂无消息</p>
							<label>发布后，会有消息提示</label>
						</div>;

		return <div className="message_session_box">
						<div className="segmented">
							<h3>{this.props.source.name}</h3>
							<ul className="segmented_right">
								
							</ul>
						</div>
						<div className={canSendMessage ? 'message_content_box' : 'message_content_box full_box'}>
							<ChatList onGetData={this.chatList} ref="chartRoom" notData={noMessage} >
								{
									canSendMessage ? 
									<div className="editor">
										<Editor ref="editText" onSubmit={this.submit} toolbar={['attachment']} fileParam={{id: this.props.source._id, dialogUploader: DialogUploader, refType: this.props.source.type}}/>
									</div> :
									null
								}
							</ChatList>
						</div>
					</div>
	}
});