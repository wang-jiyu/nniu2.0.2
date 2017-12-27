var ChatList = require('../../../../components/common/ChatList');
// var SetLive = require('./SetLive');
var SetLive = require('./liveRevision/LiveSetting');

var Editor = require('../../../../components/editor/Message');

var DialogUploader = require('../../../../components/attachment/Uploader');
var MessagesHandle = require('../../../../handle/messages/Index');
var LiveHandle = require('../../../../handle/live/Index');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            replyId:null
        }
    },
    submit: function (type, target, html) {
        //如果禁言
        if (Config.CACHE_DATA.BANNED_LIST[Config.CACHE_DATA.USER._id]) {
            console.log("您已被禁言！！");
            return;
        }
        var isVip = this.props.isVip;
        type = 2;//改版后全部为2类型
        var refTarget = this.refs.liveChat;
        var md5Key = Utils.getMessageState();
        var prefixCont = MessagesHandle.formatToServer(html);
        var param = {
            content: MessagesHandle.formatToServer(html).replace(/^&gt;@/g, '>@'),
            type: type,
            // target: target,
            target: isVip ? Config.CACHE_DATA.ROOM.vip_channel_id : Config.CACHE_DATA.ROOM.chat_channel_id,
            state: md5Key
        };
        if(prefixCont.indexOf('&gt;@')!= -1) {
            param.at_user_id = this.state.replyId;
        }else{
            delete param.at_user_id;
        }

        // refTarget.scrollBottom();
        LiveHandle.sendMessage(Config.CACHE_DATA.ROOM._id, param, function (result) {
            if (result.code == 200) {
                result.data.sending = true;
                refTarget.state.sendMessage[md5Key] = result.data;
                refTarget.appendMessage(result.data);
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
    currentChannel: function () {
        var isVip = this.props.isVip;
        var channel = isVip ? Config.CACHE_DATA.ROOM.vip_channel_id : Config.CACHE_DATA.ROOM.chat_channel_id;
        return channel;
    },
    //接口-开始直播
    startRoom: function () {
        Forms.disableButton(this.refs.switchButton);
        LiveHandle.startRoom(Config.CACHE_DATA.ROOM._id, function (result) {
            if (result.code == 200) {
                Config.CACHE_DATA.ROOM.status = 1;
                return this.forceUpdate();
            }
            Forms.activeButton(this.refs.switchButton)
        }.bind(this));
    },

    endRoom: function () {
        LiveHandle.endRoom(Config.CACHE_DATA.ROOM._id, function (result) {
            if (result.code == 200) {
                Config.CACHE_DATA.ROOM.status = 0;
                return this.forceUpdate();
            }
        }.bind(this));
    },
    setLiveData: function () {
        this.forceUpdate();
        location.reload();
    },

    //弹出“直播室设置”
    setRoom: function () {
        Event.trigger('OpenDialog', {
            module: <SetLive onChange={this.setLiveData} info={1} isVip={this.props.isVip}/>,
            title: '直播室设置',
            width: 662,
            height: 568
        });
    },
    historyLive: function () {
        this.props.onChange();
    },

    onSendBtnClick: function () {
        this.submit(1, Config.CACHE_DATA.ROOM.chat_channel_id, this.refs.chatInput.getValue());
        this.refs.chatInput.clear();
    },

    videoStatus:function () {
        return this.props.isVip ? Config.CACHE_DATA.ROOM.vip_status : Config.CACHE_DATA.ROOM.status;
    },
    //聊天输入框
    getAdviser: function () {
        // if (!LiveHandle.isRoomOwner() || this.props.history)
        // 	return (<div className="live_operate">
        // 		{/* <input type="button" value="开始直播" onClick={this.startRoom} ref="switchButton" /> */}
        // 		<input type="button" value="暂未开始" className="dark_blue" />
        // 	</div>);
        if (this.props.history) return null;
        if (LiveHandle.isRoomOwner() && this.videoStatus() != 1)
            return <div className="live_operate">
                {/* <input type="button" value="开始直播" onClick={this.startRoom} ref="switchButton" /> */}
                <input type="button" value="设置" className="dark_blue" onClick={this.setRoom}/>
            </div>
        //如果开启直播，则显示输入框
        // if (Config.CACHE_DATA.ROOM.status == 1) {
        return <div>
            <div className="editor">
                <Editor ref="chatInput" maxLength="1000" placeholder="请输入11~1000个字符，按(Enter)发送信息"
                        onSubmit={this.submit.bind(this, 1, this.currentChannel())}
                        toolbar={['bold', 'underline', 'attachment']}
                        fileParam={{
                            id: this.currentChannel(),
                            dialogUploader: DialogUploader,
                            refType: 1
                        }}
                />
                {/* <div className="living">
								<a href="javascript:;" onClick={this.endRoom}>结束直播</a>
								<a href="javascript:;" onClick={this.setRoom}>设置</a>
							</div> */}
            </div>
            <div className="editor_btn">
                {LiveHandle.isRoomOwner() && <span className='curr-chat-setting-btn' onClick={this.setRoom}>设置</span>}
                {/* <span className='curr-chat-setting-btn' onClick={this.setRoom}>设置</span> */}
                <span className="curr-chat-send-btn" onClick={this.onSendBtnClick}>发送</span>
            </div>
        </div>
        // }

    },

    //聊天信息
    liveList: function (lastMessageId, callback) {
        var isVip = this.props.isVip;
        var params = {
            ref_id: isVip ? Config.CACHE_DATA.ROOM.vip_channel_id : Config.CACHE_DATA.ROOM.chat_channel_id,
            latest_stamp: lastMessageId
        };
        if (this.props.history) {
            params = $.extend(params, {
                direction: 1,
                begin_stamp: this.props.history.start * 1000000000,
                end_stamp: this.props.history.end * 1000000000
            });
        }
        LiveHandle.getMessageList(Config.CACHE_DATA.ROOM._id, params, callback);
    },
    chatList: function (lastMessageId, callback) {
        var params = {
            ref_id: Config.CACHE_DATA.ROOM.chat_channel_id,
            latest_stamp: lastMessageId
        };
        if (this.props.history) {
            params = $.extend(params, {
                direction: 1,
                begin_stamp: this.props.history.start * 1000000000,
                end_stamp: this.props.history.end * 1000000000
            });
        }
        LiveHandle.getMessageList(Config.CACHE_DATA.ROOM._id, params, callback);
    },
    appendEvent: function (refTarget, data, md5) {
        var refTarget = this.refs.liveChat;
        if (!refTarget)
            return;
        if (Config.CACHE_DATA.BANNED_LIST[data.from._id]) delete Config.CACHE_DATA.BANNED_LIST[data.from._id];
        refTarget.appendMessage(data, md5);
    },

    //显示禁言
    getShutup: function (item, refTarget) {
        if (!LiveHandle.isRoomOwner() || LiveHandle.isRoomOwner(item.from._id)) return null;
        if (Config.CACHE_DATA.BANNED_LIST[item.from._id]) return <a href="javascript:;"
                                                                    onClick={this.cancelBanned.bind(this, item.from._id, refTarget)}>取消禁言</a>
        return <a href="javascript:;" onClick={this.banned.bind(this, item.from._id, refTarget)}>禁言</a>
    },
    //回复
    reply: function (item) {
        this.setState(
            {
                replyId:item.from._id
            }
        )
        var content = item.body.content;
        content = content.replace(/^>@.+/g, '');
        var editor = this.refs.chatInput.editor;
        var oldValue = editor.getValue();
        oldValue = oldValue.replace(/^\<p\>&gt;.+/g, '');
        oldValue = oldValue.replace(/^>@.+/g, '');
        oldValue = oldValue == '' ? '<br/>&nbsp;' : oldValue;
        editor.setValue('>@' + item.from.name + ': ' + content + oldValue);
        editor.focus();
    },
    //解析回复者信息
    parseMessage: function (message) {
        var quote;
        var content = message.replace(/^>@(.+)/, function (result, $1) {
            quote = $1;
            return '';
        });

        return <div className="message">
            <div className="message_box">
                <p dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(content)}}></p>


                {quote &&
                <blockquote dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(quote)}}></blockquote>}

            </div>
        </div>;
    },

    //聊天信息 回复、禁言
    expand: function (item, refTarget) {
        var tag = "用户";
        if (item.from.advisor_type == 2) tag = '投顾';
        if (LiveHandle.isRoomOwner(item.from._id)) tag = '老师';
        var isOwner = LiveHandle.isRoomOwner(item.from._id);
        var isOneselef = item.from._id == Config.CACHE_DATA.USER._id;

        return <dd key={item._id} className={isOwner ? 'teacher' : null} data-id={item._id}>
            <img src={item.from.avatar} className="avatar"/>
            <div className="info">
                <div className="info_head">
                    <a href="javascript:;" className="name">{item.from.name}</a>
                    <span className="identity">{tag}</span>
                    <time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>

                    <div className="operate_box">
                        {!!this.props.history || isOwner || isOneselef ? null :
                            <a href="javascript:;" onClick={this.reply.bind(this, item)}>回复</a>}
                        {this.getShutup(item, refTarget)}
                    </div>
                </div>
                {/* <div className="message">
					<p dangerouslySetInnerHTML={{ __html: MessagesHandle.formatToClient(item.body.content) }}></p>
				</div> */}
                {this.parseMessage(item.body.content)}
            </div>
        </dd>;


        return (
            <dd className={isOwner ? 'teacher' : null} key={item._id} data-id={item._id}>
                <img src={item.from.avatar} className="avatar"/>
                <div className="info">
                    <div className="info_head">
                        <a href="javascript:;" className="name">{item.from.name}</a>
                        <time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
                        {Config.CACHE_DATA.BANNED_LIST[item.from._id] ? <label></label> : null}
                        {tag ? <i className="tag">{tag}</i> : null}
                        <div className="operate_box">
                            {!!this.props.history ? null :
                                <a href="javascript:;" onClick={this.reply.bind(this, item)}>回复</a>}
                            {this.getShutup(item, refTarget)}
                        </div>
                    </div>
                    {this.parseMessage(item.body.content)}
                </div>
            </dd>
        );
    },
    cancelBanned: function (memberId, refTarget) {
        LiveHandle.cancelBanned({
            member_id: memberId
        }, Config.CACHE_DATA.ROOM._id, function (result) {
            if (result.code == 200) {
                delete Config.CACHE_DATA.BANNED_LIST[memberId];
                refTarget.forceUpdate();
            }
        });
    },
    banned: function (memberId, refTarget) {
        LiveHandle.bannedMember({
            member_id: memberId,
            expire_time: 604800
        }, Config.CACHE_DATA.ROOM._id, function (result) {
            if (result.code == 200 && refTarget.isMounted()) {
                Config.CACHE_DATA.BANNED_LIST[memberId] = true;
                refTarget.forceUpdate();
            }
        });
    },
    updataUser: function (result) {
        Config.CACHE_DATA.ROOM.visitor_count = result;
        this.forceUpdate();
    },
    componentDidMount: function () {
        if (this.props.history) return null;
        // Interface.pushMessage('Subscribe', [{
        //     channel: Config.CACHE_DATA.ROOM.channel_id,
        //     type: Config.CHANNEL_TYPE.CHANNEL
        // }]);
        var isVip = this.props.isVip;
        this.liveEvent = this.appendEvent.bind(this, this.refs.liveChat);
        // this.talkEvent = this.appendEvent.bind(this, this.refs.talkChat);
        if (isVip) {
            Event.on('LiveMessage' + Config.CACHE_DATA.ROOM.vip_channel_id + Config.CHANNEL_TYPE.CHANNEL, this.liveEvent);
        } else {
            // Event.on('LiveMessage' + Config.CACHE_DATA.ROOM.channel_id + Config.CHANNEL_TYPE.CHANNEL, this.liveEvent);
            Event.on('LiveMessage' + Config.CACHE_DATA.ROOM.chat_channel_id + Config.CHANNEL_TYPE.CHANNEL, this.liveEvent);
        }
        Event.on('JoinWebLive' + Config.CACHE_DATA.ROOM.chat_channel_id, this.updataUser);
    },
    componentWillUnmount: function () {
        if (this.props.history) return null;
        Interface.pushMessage('Unsubscribe', [{
            channel: Config.CACHE_DATA.ROOM.channel_id,
            type: Config.CHANNEL_TYPE.CHANNEL
        }]);
        Event.off('LiveMessage' + Config.CACHE_DATA.ROOM.channel_id + Config.CHANNEL_TYPE.CHANNEL, this.liveEvent);
        Event.off('LiveMessage' + Config.CACHE_DATA.ROOM.chat_channel_id + Config.CHANNEL_TYPE.CHANNEL, this.liveEvent);
        Event.off('JoinWebLive' + Config.CACHE_DATA.ROOM.chat_channel_id, this.updataUser);
    },
    render: function () {
        var time = this.props.history ? this.props.history.start : Config.CACHE_DATA.ROOM.update_time;

        var notLiveData = <div className="none_data">
            <i>&#xe87a;</i>
            <p>暂无直播</p>
        </div>;

        var notMessageData = <div className="none_data">
            <i>&#xe879;</i>
            <p>暂无聊天</p>
        </div>;

        return <div className="graphic_box">
            <div className="live_box">
                <div className="live_info">
                    <ul className="left">
                        <li className={Config.CACHE_DATA.ROOM.status == 1 ? null : 'over'}>{Config.CACHE_DATA.ROOM.status == 1 || this.props.history ? Utils.formatDate(time, 'YYYY年MM月DD日') : '结束直播'}</li>
                        <li>直播主题：{Config.CACHE_DATA.ROOM.topic}</li>
                    </ul>
                    <ul className="right">
                        {
                            this.props.history ?
                                null :
                                <li>参与人数：<label>{Config.CACHE_DATA.ROOM.visitor_count}</label> 人</li>
                        }
                        <li style={{borderRight: 0}}><a href="javascript:;" onClick={this.historyLive}>查看历史直播</a></li>
                    </ul>
                </div>

                <div className={!this.props.history ? 'chat_content' : 'chat_content full_box'}>
                    <ChatList onGetData={this.liveList} ref="liveChat" onExpand={this.expand}
                              isReverse={this.props.history} notData={notLiveData}>
                        {this.getAdviser()}
                    </ChatList>
                </div>
            </div>
        </div>
    }
});