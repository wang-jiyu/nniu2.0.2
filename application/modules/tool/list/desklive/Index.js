var LiveHandle = require('../../../../handle/live/Index');
var MessagesHandle = require('../../../../handle/messages/Index');
var Video = require('../../../../components/common/Video');
var ChatList = require('../../../../components/common/ChatList');
var CommonEvent = require('../../../../components/CommonEvent');

var DeskLive = React.createClass({
    gotoLive: function() {
        Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, '/live.html?room=' + Config.CACHE_DATA.ROOM._id);
    },
    appendEvent: function(refTarget, data, md5) {
		refTarget.appendMessage(data, md5);
    },
    chatList: function(lastMessageId, callback) {
        var parmas = {ref_id: Config.CACHE_DATA.ROOM.chat_channel_id, ref_type: 1, latest_stamp: lastMessageId};
        LiveHandle.getMessageList(Config.CACHE_DATA.ROOM._id, parmas, callback);
    },
    updataUser: function(result) {
        Config.CACHE_DATA.ROOM.visitor_count = result;
        this.forceUpdate();
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

        return (<dd key={item._id} data-id={item._id}>
					<img src={item.from.avatar} className="avatar" />
					<div className="info">
						<div className="info_head">
							<a href="javascript:;" className="name">{item.from.name}</a>
							<time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
							{tag ? <i className="tag">{tag}</i> : null}
						</div>
						<div className="message">
							<div className="message">
								{this.parseMessage(item.body.content)}
							</div>
						</div>
					</div>
				</dd>
        );
    },	
    getLive: function() {
        if (Config.CACHE_DATA.ROOM.status == 0) {
            return	<div className="video">
                        <div className="video_play">
                            <div className="video_over">
                                <i></i>
                                <label>直播已结束</label>
                                <p>{Config.CACHE_DATA.ROOM.live_time}</p>
                                <div className="video_btn">
                                    <input type="button" value="进入直播室" onClick={this.gotoLive} ref="switchButton" />
                                </div>
                            </div>
                        </div>
                    </div>
        }
        return <div className="video">
                    <Video rtmp={Config.CACHE_DATA.ROOM.rtmp_url} />
                    <ul className="video_tool">
                        <li>{Config.CACHE_DATA.ROOM.visitor_count}人观看</li>
                        <li><a href='javascript:;' onClick={this.gotoLive}>进入直播室</a></li>
                    </ul>
                </div>
    },
    componentDidMount: function() {
        if (!Url.getParam('room')) return window.location.href = '/tool.html?tool=desklive&room=4c96e9783ada87e434f5ee42';
        var roomId = Url.getParam('room');
        LiveHandle.getRoom(roomId, function(result) {
            if (result.code == 200) {
                Config.CACHE_DATA.ROOM = result.data;
                //订阅频道
                this.subscribe = [{channel: result.data.chat_channel_id, type: Config.CHANNEL_TYPE.CHANNEL}];
                Interface.pushMessage('Subscribe', this.subscribe);

                //接收消息
                Event.on('NewMessage', function(data) {
                    Event.trigger('LiveMessage' + data.ref_id + data.ref_type, data.messages[0], data.md5);
                });

                this.setState({loading: false}, function() {
                    this.talkEvent = this.appendEvent.bind(this, this.refs.talkChat);
                    Event.on('LiveMessage' + Config.CACHE_DATA.ROOM.chat_channel_id + Config.CHANNEL_TYPE.CHANNEL, this.talkEvent);
                    Event.on('JoinWebLive' + Config.CACHE_DATA.ROOM.chat_channel_id, this.updataUser);
                }.bind(this))
            }
        }.bind(this))
    },
	getNoMessage: function() {
		return <div className="none_data">
                                <i></i>
                                <p>暂无聊天</p>
                             </div>;
	},
    componentWillUnmount: function() {
        if (this.subscribe) Interface.pushMessage('Unsubscribe', this.subscribe);
        Event.off('NewMessage');
        Event.off('LiveMessage' + Config.CACHE_DATA.ROOM.chat_channel_id + Config.CHANNEL_TYPE.CHANNEL, this.talkEvent);
        Event.off('JoinWebLive' + Config.CACHE_DATA.ROOM.chat_channel_id, this.updataUser);
    },
    getInitialState: function() {
        return {loading: true};
    },
    render: function() {
        if (this.state.loading) return <div className="disk_live_box"></div>;

        return <div className="disk_live_box">
                    <div className="video_info">
                        {this.getLive()}
                    </div>
                    <div className="tab_view">
                        <div className="view_content full_box">
                            <ChatList onGetData={this.chatList} onExpand={this.expand} ref="talkChat" notData={this.getNoMessage()} />
                        </div>
                    </div>
                    <CommonEvent />
                </div>;
    }
});

module.exports = React.createClass({
    focus: function() {
        var isFocus = Interface.isFocus();
        if (!isFocus) {
			if (this.refs.deskLive && this.refs.deskLive.subscribe) Interface.pushMessage('Unsubscribe', this.refs.deskLive.subscribe);
		}
        this.setState({focus: isFocus})
    },
    componentDidMount: function() {
        this.focus();
        Event.on('FocusChange', this.focus)

    },
    componentWillUnmount: function() {
        Event.off('FocusChange', this.focus)
    },
    getInitialState: function() {
        return {focus: false};
    },
    render: function() {
        if (!this.state.focus) return null;
        return <DeskLive ref="deskLive" />;
    }
});