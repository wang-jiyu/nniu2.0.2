var PageBox = require('../../components/common/PageBox');
var MenuList = require('../../components/listview/MenuList');
var Reload = require('../../components/common/Reload');
var UserOrderHandle = require('../../handle/usercenter/UserOrder');
var Loading = require('../../components/common/Loading');

var DataPick = require(('amazeui-react'));
var DateTimeInput = DataPick.DateTimeInput;

module.exports = React.createClass({
    payStatus: function(type) {
        switch (type) {
            case 1:
                return {
                    text: '待支付',
                    className: 'pink'
                };
            case 2:
                return {
                    text: '已支付',
                    className: 'green'
                };
            case 4:
                return {
                    text: '提交退款',
                    className: ''
                };
            case 5:
                return {
                    text: '退款中',
                    className: ''
                };
            case 6:
                return {
                    text: '已退款',
                    className: ''
                };
            case 7:
                return {
                    text: '审核中',
                    class: ''
                };
            default:
                return {
                    text: '已取消',
                    className: ''
                };
        }
    },
    gotoModule: function(item) {
        var url;
        if (item.ref_type == 1) url = '/live.html?adviser=' + item.advisor._id + '&tactics=' + item.ref_id;
        if (item.ref_type == 4) url = '/live.html?adviser=' + item.advisor._id + '&report=' + item.ref_id;
        if (item.ref_type == 11) return Interface.gotoLeftNavView(Config.MODULE_NAME.STRATEGY, '/strategyNoInfo.html?_id=' + item.extra1);
        if (item.ref_type == 12) return Interface.gotoLeftNavView(Config.MODULE_NAME.CLASSROOM, '/classroom.html?id=' + item.ref_id + '&advisorId=' + item.advisor._id + '&advisorType=' + item.advisor.advisor_type + '&status=' + item.status);
        if (item.ref_type == 11) return Interface.gotoLeftNavView(Config.MODULE_NAME.STRATEGY, '/strategyNoInfo.html?_id=' + item.extra1);
        if (!!url) Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, url);
    },
    deleteOrder: function(result) {
        Event.trigger('OpenAlert', {
            title: '删除订单',
            message: '删除后订单将无法恢复，您确定要删除订单吗？',
            button: Config.MESSAGE_BUTTON.OKCANCEL,
            event: function() {
                UserOrderHandle.deleteOrder(result._id, function(item) {
                    if (item.code == 200) {
                        ArrayCollection.removeItem.call(this.state.source, result._id, '_id');
                        this.setState({
                            source: this.state.source
                        });
                    }
                }.bind(this));
            }.bind(this)
        });
    },
    closeOrder: function(result) {
        switch (result.status) {
            case 1:
                return Event.trigger('OpenAlert', {
                    title: '取消支付',
                    message: '您确定要放弃本次支付吗？',
                    button: Config.MESSAGE_BUTTON.OKCANCEL,
                    event: function() {
                        UserOrderHandle.closeOrder(result._id, function(item) {
                            if (item.code == 200) {
                                var index = ArrayCollection.indexOf.call(this.state.source, result._id, '_id');
                                this.state.source[index].status = 3;
                                this.setState({
                                    source: this.state.source
                                });
                            }
                        }.bind(this));
                    }.bind(this)
                });
        }
    },
    openOrder: function(result) {
        var uri = '/tool.html?tool=order&order_id=' + result._id;
        Interface.popWin('订单', uri, {
            width: 746,
            maxHeight: 790,
            top: 30,
            bottom: 30,
            align: 'center',
            valign: 0.4
        });
    },
    page: function(result) {
        this.state.page = result.page;
        this.load();
    },
    listChange: function(result) {
        if (this.state.status == result._id) return null;
        this.state.status = result._id;
        this.state.page = 1;
        this.load();
    },
    getList: function() {
        if (this.state.loading) {
            return <tr height="300">
						<td colSpan="6" style={{position: 'relative'}}><Loading  /></td>
					</tr>;
        }
        if (this.state.code) {
            return <tr height="300">
						 <td colSpan="6" style={{position: 'relative'}}><Reload onReload={this.load} code={this.state.code} /></td>
					</tr>;
        }
        if (this.state.source.length == 0) {
            return <tr height="300">
                        <td colSpan="6" className="info_order_data">暂无订单</td>
                   </tr>;
        }

        return this.state.source.map(function(item) {
            var status = this.payStatus(item.status);
            var refType = item.ref_type;
            return <tr height="40" key={item._id}>
                                                        <td>{item.batch_no}</td>
                                                        <td>{Utils.formatDate(item.create_time, 'YYYY-MM-DD hh:mm')}</td>
                                                        <td onClick={refType && refType != 7 && refType != 99 ? this.gotoModule.bind(this, item) : null} className={refType && refType != 7 && refType != 99 ? 'blue_name' : null}>{item.product_name}</td>
                                                        <td style={{textAlign: 'right'}}>{'￥' + Utils.formatCoin(item.price)}</td>
                                                        <td className={status.className}>{status.text}</td>
                                                        <td>
                                                            {item.status == 1 &&
                                                            <div>
                                                                <a href="javascript:;" onClick={this.openOrder.bind(this, item)}>支付</a>
                                                                <span style={{verticalAlign: 'top', lineHeight: '15px'}}>|</span>
                                                                <a href="javascript:;" onClick={this.closeOrder.bind(this, item)}>取消</a>
                                                            </div>}
                                                            {(item.status == 2 || item.status == 6) && <span>-</span>}
                                                            {item.status == 3 && <a href="javascript:;" onClick={this.deleteOrder.bind(this, item)}>删除</a>}
                                                            {(item.status == 4 || item.status == 5) && <a href="javascript:;" onClick={this.closeOrder.bind(this, item)}>取消</a>}
                                                        </td>
                                                    </tr>
        }.bind(this))
    },
    output: function(result) {
        return parseInt(new Date(result).getTime());
    },
    selectTime: function(data) {
        this.state.begin = data.start / 1000;
        this.state.end = data.end / 1000;
        this.state.page = 1;
        this.load();
    },
    load: function() {
        var param = {
            page: this.state.page,
            status: this.state.status,
            start_time: this.state.begin,
            end_time: this.state.end
        };
        if (param.status == 0) delete param.status;
        if (!param.start_time) delete param.start_time;
        if (!param.end_time) delete param.end_time;
        if (!this.state.loading) this.setState({
            loading: true
        });
        UserOrderHandle.getOrderList(param, function(result) {
            if (!this.isMounted()) return null;
            if (result.code == 200) return this.setState({
                loading: false,
                source: result.data.rows,
                pagination: result.data.pagination,
                code: null
            });
            return this.setState({
                code: result.code,
                loading: false
            });
        }.bind(this))
    },

    focusChange: function() {
        if (Interface.isFocus()) this.load();
    },

    componentDidMount: function() {
        this.load();
        Event.on('FocusChange', this.focusChange);
    },

    componentWillMount: function() {
        Event.off('FocusChange', this.focusChange);
    },

    getInitialState: function() {
        return {
            loading: true,
            page: 1,
            status: 0,
            source: [],
            code: null
        };
    },
    render: function() {
        return <div>
              <h3 className="info_title">我的订单 <span className="refund">如需帮助请拨打400-156-6699进行咨询</span></h3>
                    <div className="info_content">
                        <div className="info_content_header">
                            <div className="time">
                                <DateTimeInput name="begin_time" ref="begin" format="YYYY-MM-DD" data-required="required" placeholder="开始日期" onSelect={this.selectTime} className="time_input input_calendars"
                                               readOnly={true} showTimePicker={false} multiple={true} />

                            </div>
                            <MenuList onChange={this.listChange} source={[{text: '全部', _id: 0}, {text: '待支付', _id: 1}, {text: '已支付', _id: 2}, {text: '已取消', _id: 3}, {text: '提交退款中', _id: 4}, {text: '退款中', _id: 5}, {text: '已退款', _id: 6}]} />
                        </div>
                        <table className="grid_box" width="100%">
                            <thead>
                            <tr height="40">
                                <th>订单号</th>
                                <th style={{width: 120}}>创建时间</th>
                                <th style={{width: 120}}>名称</th>
                                <th style={{width: 80}}>金额</th>
                                <th style={{width: 70}}>状态</th>
                                <th style={{width: 80}}>操作</th>
                            </tr>
                            </thead>
                            <tbody>
								{this.getList()}
                            </tbody>
                        </table>
                        <div className="grid_page_box">
                            <PageBox onChange={this.page} pagination={this.state.pagination} nowPage={this.state.page} />
                        </div>
                    </div>
                </div>
    }
});