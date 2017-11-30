var MessagesHandle = require('../../../handle/messages/Index');
var ChatList = require('../../../components/common/ChatList');
var Editor = require('../../../components/editor/Message');

module.exports = React.createClass({
    success: function() {
        Forms.disableButton(this.refs.button);
        MessagesHandle.solveComplain(this.props.id, function(result) {
            if (result.code == 200) {
                this.props.onChange(this.props.id);
                Event.trigger('CloseNotify');
            } else {
                Forms.activeButton(this.refs.button);
            }
        }.bind(this));
    },
    category: function(id) {
        return ArrayCollection.getItem.call(this.props.category, id, '_id');
    },
    status: function(status) {
        switch (status) {
            case 1: return '处理中';
            case 2: return '已受理';
        }
        return '已解决';
    },
    chatList: function(lastMessageId, callback) {
        var params = {latest_stamp: lastMessageId};
        MessagesHandle.complainContent(this.props.id, params, callback);
    },
    expand: function(item, refTarget) {
        return <dd className={Config.CACHE_DATA.USER._id == item.from._id ? 'message_right' : null} data-id={item._id} key={item._id}>
                    <i><img src={item.from.avatar} width="40" height="40" /></i>
                    <div className="message_item">
                        <span>
                            <a href="javascript:;">{item.from.name}</a>
                            <time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
                        </span>
                        <div className="normal_message" dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(item.body.content)}}></div>
                    </div>
                </dd>
    },
    submit: function(type, target, html) {
        var refTarget = this.refs.complainChat;
        var md5Key = Utils.getMessageState();
        var param = {description: MessagesHandle.formatToServer(html).replace(/^&gt;@/g, '>@')};
        refTarget.scrollBottom();
        MessagesHandle.createDescription(this.props.id, param, function(result) {
            if (result.code == 200) {
                refTarget.state.sendMessage[md5Key] = result.data;
                refTarget.appendMessage(result.data);
            }
        }.bind(this));
    },

    componentDidMount: function() {
        MessagesHandle.complainItem(this.props.id, function(result) {
            if (result.code == 200) {
                this.setState({proposal: result.data, loading: false});
            }
        }.bind(this))
    },

    getInitialState: function() {
        return {loading: true}
    },

    render: function() {
        if (this.state.loading) return null;

        var category = this.category(this.state.proposal.category_id);
        var status = this.status(this.state.proposal.status);

        var notMessageData = <div className="none_data">
                                 <i>&#xe879;</i>
                                 <p>暂无聊天</p>
                             </div>;

        return <div className="info_complain">
                    <div className="info_complain_header">
                        <div>
                            <span>编号：{this.state.proposal._id}</span>
                            <span>提交时间：{Utils.formatDate(this.state.proposal.create_time, 'YYYY-MM-DD hh:mm')}</span>
                            <span>分类：<a href="javasctipt:;">{category.category_name}</a></span>
                            <span>当前状态：<a href="javascript:;">{status}</a></span>
                        </div>
                        {this.state.proposal.status == 0 ? null :
                            <input type="button" ref="button" value="确认解决" onClick={this.success} className="blue" />}
                    </div>
                    <div className={this.state.proposal.status == 0 ? 'chat_content chat_content_full' : 'chat_content'}>
                        <ChatList onGetData={this.chatList} onExpand={this.expand} notData={notMessageData} ref="complainChat">
                            {this.state.proposal.status == 0 ? null :
                                <div className="editor">
                                    <Editor onSubmit={this.submit.bind(this, 2, this.props.id)} />
                                </div>}
                        </ChatList >
                    </div>
               </div>
    }
});