var MessagesHandle = require('../../../handle/messages/Index');
var ChatList = require('../../../components/common/ChatList');
var AttachmentHandle = require('../../../handle/Attachment');
module.exports = React.createClass({
    getList: function(latestStamp, callback) {
        MessagesHandle.getSystemList({latest_stamp: latestStamp}, callback);
    },
    expand: function(item, refTarget) {
        if (item.body && item.body.inline) {
            var inline;
            try {
                inline = JSON.parse(item.body.inline);
            } catch(e) {
                return <div key={item._id}></div>;
            }

            return (
                <dd className="message_remind_box system_box" key={item._id} data-id={item._id}>
                    <i className="consult"></i>
                    <div className="messages_remind">
                        <div className="remind_head">
                            <a href="javascript:;" className="name">系统消息</a>
                            <time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
                        </div>
                        {<div className="message" style={{maxWidth: '500px'}}>
                            <a href="javascript:;" >{inline.title}</a>
                            <div className="system_content">
                                {inline.content ? <div dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(inline.content)}}></div> : null}
                                {inline.affix ?
                                    <img className="system_img" data-group={item._id} data-preview={inline.affix} src={inline.affix} onLoad={this.imgLoad} />
                                     : null
                                }
                            </div>
                        </div>}
                    </div>
                </dd>
            );
        }
    },
    imgLoad: function() {
        if (!Utils.isScrollBottom(this.refs.system.refs.messageBox, 10)) {
            this.refs.system.scrollBottom();
        }
    },
	getNotData: function() {
		return <div className="none_data">
                            <i>&#xe879;</i>
                            <p>暂无系统消息</p>
                            <label>发布后，会有消息提示</label>
                       </div>;
	},
    message: function(data) {
        this.refs.system.appendMessage(data);
    },
    componentDidMount: function() {
       Event.on('NewSystem', this.message);

    },
    componentWillUnmount: function() {
       Event.off('NewSystem', this.message);
    },
    getInitialState: function() {
        return {loading: true, load: true}
    },
    render: function() {
        return <ChatList onGetData={this.getList} onExpand={this.expand} ref="system" notData={this.getNotData()} style={{bottom: 0}} />;
    }
});