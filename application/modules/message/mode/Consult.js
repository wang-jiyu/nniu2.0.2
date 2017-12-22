var MessagesHandle = require('../../../handle/messages/Index');
var NewsHandle = require('../../../handle/news/Index');
var ChatList = require('../../../components/common/ChatList');
var Loading = require('../../../components/common/Loading');

module.exports = React.createClass({
    categoryItem: function(id) {
        return ArrayCollection.getItem.call(this.state.category, id, '_id');
    },
    getCmsList: function(latestStamp, callback) {
        MessagesHandle.getConsultList({latest_stamp: latestStamp}, callback);
    },
    gotoModule: function(result, categoryItem) {
        var url = '/news.html?type=4abaa8740a819b2e7737f57b&ref_id=' + result.ref_id;
        if (categoryItem.assort == 0) url = '/news.html?type=43a58de05457647be46cf5ee&ref_id=' + result.ref_id;

        Interface.gotoLeftNavView(Config.MODULE_NAME.NEWS, url);
    },
    expand: function(item, refTarget) {
		if (item.body && item.body.inline) {
            var inline;
            try {
                inline = JSON.parse(item.body.inline);
            } catch(e) {
                return <div key={item._id}></div>;
            }

            var categoryItem = this.categoryItem(inline.category_id);

            return <dd className="message_remind_box" key={item._id} data-id={item._id}>
                        <i className="consult"></i>
                        <div className="messages_remind">
                            <div className="remind_head">
                                <a href="javascript:;" className="name">资讯推送</a>
                                <time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
                            </div>
                            {<div className="message">
                                <a href="javascript:;" onClick={this.gotoModule.bind(this, item, categoryItem)}>{inline.title}</a>
                                <div className="inform_content">
                                    {categoryItem.assort != 0 ?
                                        <span className="paper" style={{background: categoryItem.color}}>{categoryItem.category_name}</span> :
                                        <i><img src={inline.thumbnail} alt="" width="60" height="60" /></i>}
                                    <p dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(inline.intro)}}></p>
                                </div>
                            </div>}
                        </div>
                    </dd>;
        }
    },
    message: function(data) {
        this.refs.consult.appendMessage(data);
    },

    load: function() {
        NewsHandle.getCategoryList(function (result) {
            if (result.code == 200) {
                this.setState({loading: false, category: result.data});
            }
        }.bind(this));
    },

    componentDidMount: function() {
        this.load();
        Event.on('NewConsult', this.message);
    },
    componentWillUnmount: function() {
        Event.off('NewConsult', this.message);
    },

    getInitialState: function() {
        return {loading: true}
    },
    render: function() {
        if (this.state.loading) return <Loading />;

        var notData = <div className="none_data">
                            <i>&#xe879;</i>
                            <p>暂无消息</p>
                            <label>发布后，会有消息提示</label>
                       </div>;
        return <ChatList onGetData={this.getCmsList} onExpand={this.expand} ref="consult" notData={notData} style={{bottom: 0}} />;
    }
});