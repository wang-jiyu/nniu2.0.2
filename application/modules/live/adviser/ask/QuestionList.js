var AskHandle = require('../../../../handle/live/Ask');
var LiveHandle = require('../../../../handle/live/Index');
var EditAsk = require('./EditAsk');
var StockCode = require('stock-code');
var PageBox = require('../../../../components/common/PageBox');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');

module.exports = React.createClass({
    load: function(param) {
    	this.setState({loading: true});
        var params = param ? param : {};
        params = $.extend({limit: 5, page: 1}, param);
        AskHandle.getAskList(Url.getParam('adviser') ? Url.getParam('adviser') : Config.CACHE_DATA.ROOM.advisor._id, params, function(result) {
            if (result.code == 200 && this.isMounted()) {
                if (!!param)
                    return this.setState({
                            data: result.data.rows ? result.data.rows : [],
                            pagination: result.data.pagination,
                            nowPage:  params.page,
                            loading: false,
                            code: null
                        });
                return this.setState({
                    data: result.data.rows ? result.data.rows : [],
                    pagination: result.data.pagination,
                    nowPage:  params.page,
                    loading: false,
                    code: null,
                    askTotal: result.data.pagination.answer_size
                });
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this));
    },

    changePage: function(result) {
        this.load(result);
    },

    answerSuccess: function(id, params, time, flag) {
        var list = this.state.data.map(function(item, index) {
            if (typeof time != 'undefined') return item._id == id ? $.extend(item, {answer: params, answer_time: time}) : item;
            return item._id == id ? $.extend(item, {answer: params}) : item;
        }.bind(this));
        if (flag) this.setState({data: list, askTotal: this.state.askTotal + 1});
        this.setState({data: list});
    },

    getStockName: function(code) {
        var item = StockCode.getStockItem(code);
        return item == null ? '' : item[1] + '(' + item[0] + ')';
    },

    deleteAsk: function(id, e) {
        var target = e.target;
        Event.trigger('OpenAlert', {
            title: '删除问题',
            message: '确认要删除当前问题吗？',
            button: Config.MESSAGE_BUTTON.DELETE,
            event: function() {
                AskHandle.deleteAsk(id, function (result) {
                    if (result.code == 200) {
                        var list = this.state.data.filter(function (item, index) {
                            return item._id != id;
                        }.bind(this));
                        if ($(target).closest('.ask_item').closest('li').find('.answer_item').length == 1)
                            return this.setState({data: list, askTotal: this.state.askTotal - 1});
                        this.setState({data: list});
                    }
                }.bind(this));
            }.bind(this)
        });
    },

    deleteAnswer: function(id) {
        AskHandle.deleteQuestion(id, function (result) {
            if (result.code == 200) {
                var list = this.state.data.map(function (item, index) {
                    return item._id == id ? $.extend(item, {answer: ''}) : item ;
                }.bind(this));
                this.setState({data: list, askTotal: this.state.askTotal - 1});
            }
        }.bind(this));
    },

    editAsk: function(item, index, callback) {
        Event.trigger('OpenDialog', {module: <EditAsk onSuccess={callback} item={item}  index={index}  />, title: index == 0 ? '回答' : '编辑', width: 450, height: 380});
    },

    getList: function() {
        if (this.state.loading) return <div style={{position: 'relative', minHeight: '300px'}}><Loading /></div>;
        if (this.state.code) return <div style={{position: 'relative', minHeight: '300px'}}><Reload onReload={this.load.bind(this, {})} code={this.state.code} /></div>;
        if (this.state.data.length == 0)
            return (<div className="live_no_data">
                        <i>&#xe87b;</i>
                        <p>暂无问答</p>
                    </div>);
        return (<ul className="ask_live_list">
            {this.state.data.map(function(item, index) {
                return LiveHandle.isRoomOwner() ?
                    (
                        <li key={index}>
                            <div className="ask_item">
                                <div className="ask_live_question"><span>{this.getStockName(item.StockCode)} #</span> {item.question}</div>

                                <ul className="ask_live_operation">
                                    {
                                        item.answer != '' ? null :
                                            (<li className="answer_line"><a href="javascript:;" onClick={this.editAsk.bind(this, item, 0, this.answerSuccess)}>回答</a></li>)
                                    }
                                    <li><a className="ask_live_delete" href="javascript:;" onClick={this.deleteAsk.bind(this, item._id)}>删除</a></li>
                                </ul>
                            </div>
                            {
                                item.answer  != '' ?
                                    (
                                        <div>
                                            <div className="answer_item">
                                                <div>{item.answer}</div>
                                                <ul className="ask_live_operation">
                                                    <li className="answer_line"><a href="javascript:;" onClick={this.editAsk.bind(this, item, 1, this.answerSuccess)}>编辑</a></li>
                                                    <li><a className="ask_live_delete" href="javascript:;" onClick={this.deleteAnswer.bind(this, item._id)} >删除</a></li>
                                                </ul>
                                            </div>
                                            <div className="answer_live_time">回答时间： <time>{Utils.formatDate(item.answer_time, 'YYYY-MM-DD hh:mm')}</time></div>
                                        </div>
                                    )  :
                                    (
                                        <div className="answer_live_time">
                                            提问时间： <time> {Utils.formatDate(item.create_time, 'YYYY-MM-DD hh:mm')}</time>
                                        </div>
                                    )
                            }
                        </li>
                    ) : (
                        <li key={index}>
                            <div className="ask_item"><div className="ask_live_question"><span>{this.getStockName(item.StockCode)} #</span> {item.question}</div></div>
                            {
                                item.answer  != '' ?
                                    (
                                        <div>
                                            <div className="answer_item"><div>{item.answer}</div></div>
                                            <div className="answer_live_time">回答时间： <time>{Utils.formatDate(item.answer_time, 'YYYY-MM-DD hh:mm')}</time></div>
                                        </div>
                                    )  :
                                    (
                                        <div className="answer_live_time">提问时间： <time> {Utils.formatDate(item.create_time, 'YYYY-MM-DD hh:mm')}</time></div>
                                    )
                            }
                        </li>
                    )
            }.bind(this))}
        </ul>);
    },

    componentDidMount: function() {
        this.load();
        Event.on('AskSuccess', this.load);
    },

    componentWillUnmount: function() {
        Event.off('AskSuccess', this.load);
    },

    getInitialState: function() {
        return {
            data:[],
            pagination: null,
            nowPage: null,
            loading: true,
            askTotal: 0
        }
    },

    render: function() {
        return (
            <div className="ask_live_box">
                <div className="ask_live_header">
                    <h3>{LiveHandle.getAppellation()}的问答</h3>
                    <span><span>{this.state.askTotal}</span> 回答</span>
                </div>
                <div className="ask_live_content">
                    {this.getList()}
                    <div className="grid_page_box">
                        <PageBox onChange={this.changePage} pagination={this.state.pagination} nowPage={this.state.nowPage} maxLength="6" />
                    </div>
                </div>
            </div>
        );
    }
});
