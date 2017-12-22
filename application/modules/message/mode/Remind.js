var MessagesHandle = require('../../../handle/messages/Index');
var ChatList = require('../../../components/common/ChatList');

module.exports = React.createClass({
    getNotifyList: function(latestStamp, callback) {
        MessagesHandle.getNotifyList({latest_stamp: latestStamp}, callback);
    },
    gotoModule: function(result) {
        if (result.ref_type == 1) return Interface.gotoLeftNavView( Config.MODULE_NAME.LIVE, '/live.html?adviser=' + result.from._id + '&tactics=' + result.ref_id );
        if (result.ref_type == 4) return Interface.gotoLeftNavView( Config.MODULE_NAME.LIVE, '/live.html?adviser=' + result.from._id + '&report=' + result.ref_id );
        if (result.ref_type == 9) return Interface.gotoLeftNavView( Config.MODULE_NAME.LIVE, '/live.html?adviser=' + result.from._id );
        if (result.ref_type == 11) return Interface.gotoLeftNavView( Config.MODULE_NAME.LIVE, '/strategys/strategyNoInfo.html?_id='+ result.body.inline.strategy_id +'&access_token=' +  Config.ACCESS_TOKEN );
        if (result.ref_type == 12) return Interface.gotoLeftNavView(Config.MODULE_NAME.CLASSROOM, '/classroom.html?id=' + result.ref_id +'&advisorId=' + result.from._id + '&advisorType=' + result.from.advisor_type + '&status=' + 2);
        Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, '/live.html?room=' + result.ref_id);
    },
	getExpandModule: function(item) {
		if (item.ref_type == 1 || item.ref_type == 4 ) {
			return <div className="message">
								<a href="javascript:;" onClick={this.gotoModule.bind(this, item)}>{item.body.inline.title}</a>
								<div className="inform_content">
									<p style={{margin: 0}} dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(item.body.inline.intro)}}></p>
								</div>
							</div>;
		}

        if (item.ref_type == 11) {
            return <div className="message">
                <a href="javascript:;" onClick={this.gotoModule.bind(this, item)}>{item.body.inline.title}</a>
                <div className="inform_content">
                    <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(item.body.inline.intro)}}></p>
                </div>
            </div>;
        }

        if (item.ref_type == 12 || item.ref_type == 13) {
            return <div className="message">
                <a href="javascript:;" onClick={this.gotoModule.bind(this, item)}>{item.body.inline.title}</a>
                <div className="inform_content">
                    <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(item.body.inline.intro)}}></p>
                </div>
            </div>;
        }

        if (item.ref_type == 9){
            return <div className="message">
                <a href="javascript:;" onClick={this.gotoModule.bind(this, item)}>{item.body.inline.topic}</a>
                <div className="inform_content">
                    <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(item.body.inline.content)}}></p>
                </div>
            </div>;
        }

            return <div className="message">
					<a href="javascript:;" onClick={this.gotoModule.bind(this, item)}>{item.body.inline.topic}</a>
					<div className="inform_content">
						<i><img src={item.body.inline.thumbnail} alt="" width="60" height="60" /></i>
						<p dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(item.body.inline.content)}}></p>
					</div>
				</div>;

	},
    expand: function(item, refTarget) {

        if (item.body.inline) {
            var inline;
			if (typeof(item.body.inline) == 'string') {
				try {
					item.body.inline = JSON.parse(item.body.inline);
				} catch(e) {
	
				}
			}

            return <dd className="message_remind_box" key={item._id} data-id={item._id}>
                <i className="remind"></i>
                <div className="messages_remind">
                    <div className="remind_head">
                        <a href="javascript:;" className="name">提醒</a>
                        <time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
                    </div>
                    {this.getExpandModule(item)}
                </div>
            </dd>;
        }
    },
    message: function(data, e) {
        this.refs.remind.appendMessage(data);
    },
	getNotData: function() {
		return <div className="none_data">
                            <i>&#xe879;</i>
                            <p>暂无提醒消息</p>
                            <label>发布后，会有消息提示</label>
                       </div>;
	},
    componentDidMount: function() {
        Event.on('NewNotify', this.message);
    },
    componentWillUnmount: function() {
        Event.off('NewNotify', this.message);
    },
    getInitialState: function() {
        return {loading: true, load: true}
    },
    render: function() {
        return <ChatList onGetData={this.getNotifyList} onExpand={this.expand} ref="remind" notData={this.getNotData()} style={{bottom: 0}} />;
    }
});