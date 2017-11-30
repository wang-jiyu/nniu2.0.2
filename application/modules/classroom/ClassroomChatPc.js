var ChatList = require('../../components/common/ChatList');
var Editor = require('../../components/editor/Message');
var DialogUploader = require('../../components/attachment/Uploader');
var MessagesHandle = require('../../handle/messages/Index');
var LiveHandle = require('../../handle/live/Index');
module.exports = React.createClass({
	submit: function(type, target, html) {
		var refTarget = type == 1 ? this.refs.liveChat : this.refs.talkChat;
		var md5Key = Utils.getMessageState();

		var param = {
			content: MessagesHandle.formatToServer(html).replace(/^&gt;@/g, '>@'),
			type: type,
			target: target,
			state: md5Key
		};
		// refTarget.scrollBottom();
		LiveHandle.newSendMassage(this.props.data._id, param, function(result) {
			if (result.code == 200) {
				result.data.sending = true;
				refTarget ? refTarget.state.sendMessage[md5Key] = result.data : null;
				refTarget ? refTarget.appendMessage(result.data) : null;
			} else if (result.code == 47017) {
				var data = {
					_id: Utils.createId(),
					body: {
						attachment: null,
						content: param.content,
						inline: null
					},
					create_time: result.data.create_time,
					from: Config.CACHE_DATA.USER,
					is_favorite: 0,
					is_star: 0,
					is_unread: 0,
					type: 2
				};
				refTarget.appendMessage(data);
			}
		}.bind(this));
	},
	reply: function(item) {
		var content = item.body.content;
		content = content.replace(/^>@.+/g, '');
		var editor = this.refs.editText.editor;
		var oldValue = editor.getValue();
		oldValue = oldValue.replace(/^\<p\>&gt;.+/g, '');
		oldValue = oldValue.replace(/^>@.+/g, '');
		oldValue = oldValue == '' ? '<br/>&nbsp;' : oldValue;
		editor.setValue('>@' + item.from.name + ': ' + content + oldValue);
		editor.focus();
	},
	appendEvent: function(refTarget, data, md5) {
		if (Config.CACHE_DATA.BANNED_LIST[data.from._id]) delete Config.CACHE_DATA.BANNED_LIST[data.from._id];
		refTarget.appendMessage(data, md5);
	},
	getRoomComplete: function(result) {
		if (result.code == 200) {
			Config.CACHE_DATA.ROOM = result.data;
			try {
				Config.CACHE_DATA.ROOM.schedule = JSON.parse(Config.CACHE_DATA.ROOM.schedule);
			} catch (e) {
				Config.CACHE_DATA.ROOM.schedule = null;
			}

			if (Config.CACHE_DATA.ROOM.chat_channel_id) {
				this.subscribe = [{
					channel: Config.CACHE_DATA.ROOM.chat_channel_id,
					type: Config.CHANNEL_TYPE.CHANNEL
				}];
				Interface.pushMessage('Subscribe', this.subscribe);
				Event.on('LiveStateChange' + Config.CACHE_DATA.ROOM.chat_channel_id, this.liveState);
			}


			Event.on('UpdateUser', this.updateView);
			if (Config.CACHE_DATA.ROOM.type != 2 && $.isArray(Config.CACHE_DATA.ROOM.advisor)) Config.CACHE_DATA.ROOM.advisor = Config.CACHE_DATA.ROOM.advisor[0];
			this.getBannedList();
			return this.setState({
				code: null,
				loading: false,
				room: Config.CACHE_DATA.ROOM,
				isFollow: Config.CACHE_DATA.USER.follow_ids.indexOf(Config.CACHE_DATA.ROOM.advisor._id) != -1
			}, this.route);
		}
		return this.setState({
			code: result.code,
			loading: false
		});
	},
	getRoomInfo: function() {
		var roomId = Url.getParam('room');
		if (roomId) return LiveHandle.getRoom(roomId, this.getRoomComplete);
		LiveHandle.getAdviserRoom(Url.getParam('adviser'), this.getRoomComplete);
	},
	getChatList: function(paramObj) {
		LiveHandle.getNewChatList(paramObj, function(result) {
			if (result.code === 200) {
				this.setState({
					messages: result.data.messages.reverse()
				});
			}
		}.bind(this));
	},
	componentWillMount: function() {
		var info = {};
		info.lesson_guid = this.props.data._id;
		info.ref_id = this.props.data.channels_id;
		info.limit = 20;
		info.direction = -1;
		// info.latest_stamp = null;
		console.log(Config.TOOL.getCurrentAllDate());
		info.begin_stamp = Config.TOOL.getCurrentAllDate().startTime * 1000000;
		info.end_stamp = Config.TOOL.getCurrentAllDate().endTime * 1000000;
		this.getChatList(info);
		this.timer = setInterval(function() {
			this.getChatList(info);
		}.bind(this), 5000);
	},
	componentWillUnmount: function() {
		this.timer && clearTimeout(this.timer);
	},
	componentDidMount: function() {
		Interface.pushMessage('Subscribe', [{
			channel: Config.CACHE_DATA.ROOM.channel_id,
			type: Config.CHANNEL_TYPE.CHANNEL
		}]);
		this.liveEvent = this.appendEvent.bind(this, this.refs.liveChat);
		this.talkEvent = this.appendEvent.bind(this, this.refs.talkChat);
		Event.on('LiveMessage' + Config.CACHE_DATA.ROOM.channel_id + Config.CHANNEL_TYPE.CHANNEL, this.liveEvent);
		Event.on('LiveMessage' + Config.CACHE_DATA.ROOM.chat_channel_id + Config.CHANNEL_TYPE.CHANNEL, this.talkEvent);
		Event.on('JoinWebLive' + Config.CACHE_DATA.ROOM.chat_channel_id, this.updataUser);
		this.getRoomInfo();
	},
	getInitialState: function() {
		return {
			messages: []
		};
	},
	render: function() {
		$('.privateStringContent').scrollTop($('.privateStringUl').height());
		return (
			<div className="chatRoomSection">
				<div className="roomList" ref="liveChat">
					<div className="privateStringHeader clearfix">
						<span className="privateStringTitle">2017年02月18日 | 直播主题：节后介入卖出的票大幅复利没有最好只有更好</span>
						<a href="javascript:void(0)" className="roomListClosed" onClick={this.props.close.bind(this,{switch:'off'})}>×</a>
						<span className="Participants">参与人数：50,126 人</span>
					</div>
					<div className="privateStringContent">
						<ul className="privateStringUl">
						{
							this.state.messages.map(function(elem, index) {
								return <li className={elem.from._id===Config.CACHE_DATA.USER._id?"rightSideChat":"leftSideChat"}>
								<span className="chatterFace"><img src={elem.from.avatar} alt=""/></span>
								<div className="chatterTop">
									<span className="chatterName">{elem.from.name}</span>
									{/*<span className="chatterIdentity">老师</span>*/}
									<span className="sendtime">{Config.TOOL.formatter(parseInt(elem.create_time*1000), 'H M')}</span>
								</div>
								<div className="chatterMessage clearfix">
									<p dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(elem.body.content)}}></p>
								</div>
							</li>
							})
						}
						
						</ul>
					</div>
				</div>
	
				
				<div className="SendChatBox">
					{/*<div className="SendChatContentTop">
						<span><img src="./assets/images/classroomPc/face.png" alt=""/></span><span><img src="./assets/images/classroomPc/A.png" alt=""/></span><span><img src="./assets/images/classroomPc/file.png" alt=""/></span><span><img src="./assets/images/classroomPc/pic.png" alt=""/></span>
					</div>
					<div className="SendChatContent">
						<textarea name="" id="SendChatContentTextarea" placeholder="我也说两句。。。" className="SendChatContentTextarea" maxlength="500" onkeyup="checkLen(this)"></textarea>
						<a href="javascript:void(0)" onclick="" className="sendBtn">发送</a>
						<span className="remainingWords">可输入<em id="count">500</em>个字</span>
					</div>*/}
					<Editor ref="editText" maxLength="1000"  onSubmit={this.submit.bind(this, 2, this.props.data.channels_id)} />
				</div>
			</div>

		)
	}
})