var ChatList = require('../../../../components/common/ChatList');
var Program = require('./Program');
var Editor = require('../../../../components/editor/Message');
var Video = require('../../../../components/common/Video');
var MessagesHandle = require('../../../../handle/messages/Index');
var LiveHandle = require('../../../../handle/live/Index');
var SetLive = require('./SetLive');

module.exports = React.createClass({
	setModule: function(pointer) {
		this.setState({pointer: pointer});
	},
	submit: function(type, target, html) {
		var refTarget = this.refs.talkChat;
		var md5Key = Utils.getMessageState();
		var param = {
			content: MessagesHandle.formatToServer(html).replace(/^&gt;@/g, '>@'),
			type: type,
			target: target,
			state: md5Key
		};

		refTarget.scrollBottom();
		LiveHandle.sendMessage(Config.CACHE_DATA.ROOM._id, param, function(result) {
			if (result.code == 200) {
				result.data.sending = true;
				refTarget.state.sendMessage[md5Key] = result.data;
				refTarget.appendMessage(result.data);
			} else if (result.code == 47017) {
                var data = {
                    _id: Utils.createId(),
                    body: {attachment: null, content: param.content, inline: null},
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
	startRoom: function() {
		Forms.disableButton(this.refs.switchButton);
		LiveHandle.startRoom(Config.CACHE_DATA.ROOM._id, function(result) {
			if (result.code == 200) {
				Config.CACHE_DATA.ROOM.status = 1;
				return this.forceUpdate();
			}
			Forms.activeButton(this.refs.switchButton)
		}.bind(this));
	},
	endRoom: function() {
		LiveHandle.endRoom(Config.CACHE_DATA.ROOM._id, function(result) {
			if (result.code == 200) {
				Config.CACHE_DATA.ROOM.status = 0;
				this.forceUpdate();
			}
		}.bind(this));
	},
	setLiveData: function() {
		this.forceUpdate();
	},
	setRoom: function() {
		Event.trigger('OpenDialog', {module: <SetLive onChange={this.setLiveData} />, title: '直播室设置', width: 662, height: 568});
	},
	getLive: function() {
		if (Config.CACHE_DATA.ROOM.status == 0) {
			return	<div className="video">
								<div className="video_play">
									<div className="video_over">
										<i></i>
										<label>直播已结束</label>
										<p>{Config.CACHE_DATA.ROOM.live_time}</p>
										{
											LiveHandle.isRoomOwner() ?
											<div className="video_btn">
												<input type="button" value="开始直播" onClick={this.startRoom} ref="switchButton" />
												<input type="button" value="设置" className="dark_blue" onClick={this.setRoom} />
											</div> :
											null
										}
									</div>
								</div>
						</div>
		}
		if (!Interface.isFocus()) return null;
		return <div className="video">
					{/* <Video src="http://lessonv.0606.com.cn/Act-m3u8-segment/dceaf1ff11424cb8bc757834d47c02ca/longtou_public_class_0906_dvd.m3u8" /> */}
					{/* <Video rtmp="rtmp://live.hkstv.hk.lxdns.com/live/hks" /> */}
					<Video rtmp={Config.CACHE_DATA.ROOM.rtmp_url} />
				</div>
	},
	appendEvent: function(refTarget, data, md5) {
		if (Config.CACHE_DATA.BANNED_LIST[data.from._id]) delete Config.CACHE_DATA.BANNED_LIST[data.from._id];
		refTarget.appendMessage(data, md5);
	},
	chatList: function(lastMessageId, callback) {
		var parmas = {ref_id: Config.CACHE_DATA.ROOM.chat_channel_id, ref_type: 1, latest_stamp: lastMessageId};
		LiveHandle.getMessageList(Config.CACHE_DATA.ROOM._id, parmas, callback);
	},
	setPointer: function(pointer) {
		if (this.state.pointer == pointer) return null;
		this.setState({pointer: pointer});
	},
    getShutup: function (item, refTarget) {
		if (!LiveHandle.isRoomOwner() || LiveHandle.isRoomOwner(item.from._id)) return null;
		if (Config.CACHE_DATA.BANNED_LIST[item.from._id]) return <a href="javascript:;"  onClick={this.cancelBanned.bind(this, item.from._id, refTarget)}>取消禁言</a>
		return <a href="javascript:;" onClick={this.banned.bind(this, item.from._id, refTarget)}>禁言</a>
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
    parseMessage: function(message) {
       var quote;
		var content = message.replace(/^>@(.+)/, function(result, $1) {
							quote = $1;
							return '';
					});

		return <div className="message">
					{quote && <blockquote dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(quote)}}></blockquote>}
					<p dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(content)}}></p>
				</div>;
    },
    expand: function(item, refTarget) {
		var tag;
		if (item.from.advisor_type == 2) tag = '投顾';
		if (LiveHandle.isRoomOwner(item.from._id)) tag = '房主';

        return (
			<dd key={item._id} data-id={item._id}>
				<img src={item.from.avatar} className="avatar" />
				<div className="info">
					<div className="info_head">
						<a href="javascript:;" className="name">{item.from.name}</a>
						<time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
						{Config.CACHE_DATA.BANNED_LIST[item.from._id] ? <label className="tag"></label> : null }
						{tag ? <i className="tag">{tag}</i> : null}
						<div className="operate_box">
							<a href="javascript:;" onClick={this.reply.bind(this, item)}>回复</a>
							{this.getShutup(item, refTarget)}
						</div>

					</div>
					{this.parseMessage(item.body.content)}
				</div>
			</dd>
        );
    },
    cancelBanned: function(memberId, refTarget) {
        LiveHandle.cancelBanned({member_id: memberId}, Config.CACHE_DATA.ROOM._id, function (result){
            if (result.code == 200 ) {
                delete Config.CACHE_DATA.BANNED_LIST[memberId];
                refTarget.forceUpdate();
            }
        });
    },
    banned: function(memberId, refTarget) {
        LiveHandle.bannedMember({member_id: memberId, expire_time: 604800}, Config.CACHE_DATA.ROOM._id, function (result) {
            if (result.code == 200 && refTarget.isMounted()) {
                Config.CACHE_DATA.BANNED_LIST[memberId] = true;
                refTarget.forceUpdate();
            }
        });
    },
	updataUser: function(result) {
		Config.CACHE_DATA.ROOM.visitor_count = result;
		this.forceUpdate();
	},
	updateView: function() {
		this.forceUpdate();
	},
	componentDidMount: function() {
		this.talkEvent = this.appendEvent.bind(this, this.refs.talkChat);
		Event.on('LiveMessage' + Config.CACHE_DATA.ROOM.chat_channel_id + Config.CHANNEL_TYPE.CHANNEL, this.talkEvent);
		Event.on('JoinWebLive' + Config.CACHE_DATA.ROOM.chat_channel_id, this.updataUser);
		Event.on('FocusChange', this.updateView);
	},
	componentWillUnmount: function() {
		Event.off('LiveMessage' + Config.CACHE_DATA.ROOM.chat_channel_id + Config.CHANNEL_TYPE.CHANNEL, this.talkEvent);
		Event.off('JoinWebLive' + Config.CACHE_DATA.ROOM.chat_channel_id, this.updataUser);
		Event.off('FocusChange', this.updateView);
	},
	getInitialState: function() {
		return {pointer: 0};
	},
	render: function() {
		var notMessageData = <div className="none_data">
							<i>&#xe879;</i>
							<p>暂无聊天</p>
						</div>;

		return <div className="live_info_box">
					<div className="video_info">
						<div className="info">
							<ul className="left">
								<li className={Config.CACHE_DATA.ROOM.status == 1 ? null : 'over'}>{Config.CACHE_DATA.ROOM.status == 1 ? Utils.formatDate(Config.CACHE_DATA.ROOM.update_time, 'YYYY年MM月DD日') : '结束直播'}</li>
								<li>直播主题：{Config.CACHE_DATA.ROOM.topic}</li>
							</ul>
							<ul className="right">
								<li style={{borderRight: 0}}>{Config.CACHE_DATA.ROOM.visitor_count}人观看</li>
								{
									Config.CACHE_DATA.ROOM.status == 1 && LiveHandle.isRoomOwner() ?
									[
										<li key="0"><a href="javascript:;" onClick={this.endRoom}>结束直播</a></li>,
										<li key="1"><a href="javascript:;" onClick={this.setRoom}>设置</a></li>
									] :
									null
								}
							</ul>
						</div>
						{this.getLive()}
					</div>
					<div className="tab_view">
						<ul className="tab_nav">
							<li className={this.state.pointer == 0 ? 'selected' : null}><a href="javascript:;" onClick={this.setPointer.bind(this, 0)}>聊天</a></li>
							<li className={this.state.pointer == 1 ? 'selected' : null}><a href="javascript:;" onClick={this.setPointer.bind(this, 1)}>节目单</a></li>
						</ul>
						<div className="view_content">
							<div style={this.state.pointer != 1 ? {display: 'none'}: null}>
								<Program source={Config.CACHE_DATA.ROOM.schedule} />
							</div>
							<ChatList onGetData={this.chatList} onExpand={this.expand} ref="talkChat" style={this.state.pointer != 0 ? {display: 'none'}: null} notData={notMessageData} key={this.state.pointer}>
								<div className="editor">
									<Editor ref="editText" maxLength={1000} onSubmit={this.submit.bind(this, 2, Config.CACHE_DATA.ROOM.chat_channel_id)} />
								</div>
							</ChatList >
						</div>
					</div>
				</div>;
	}
});


