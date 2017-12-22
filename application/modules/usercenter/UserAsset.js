var PageBox = require('../../components/common/PageBox');
var MenuList = require('../../components/listview/MenuList');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');
var UserHandle = require('../../handle/usercenter/UserCenter');
module.exports = React.createClass({
    goto: function(result) {
        console.log(this.state.type);
        console.log(result);
        if (this.state.type == 1) return Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, '/live.html?adviser=' + result.advisor._id + '&tactics=' + result.ref_id);
        if (this.state.type == 4) return Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, '/live.html?adviser=' + result.advisor._id + '&report=' + result.ref_id);
        if (this.state.type == 11) return Interface.gotoLeftNavView(Config.MODULE_NAME.STRATEGY, '/strategyNoInfo.html?_id=' + result.extra1);
        if (this.state.type == 12) return Interface.gotoLeftNavView(Config.MODULE_NAME.CLASSROOM, '/classroom.html?id=' + result.ref_id + '&advisorId=' + result.advisor._id + '&advisorType=' + result.advisor.advisor_type + '&status=' + result.status);
        return;
    },

    load: function(param) {
        this.setState({
            loading: true
        });
        param = param || {};
        var params = $.extend({
            type: this.state.type,
            page: 1,
            limit: 8
        }, param);
        UserHandle.getProperty(params, function(result) {
            if (result.code == 200 && this.isMounted()) {
                return this.setState({
                    source: result.data.rows,
                    loading: false,
                    nowPage: params.page,
                    pagination: result.data.pagination,
                    code: null
                });
            }
            return this.setState({
                code: result.code,
                loading: false
            })
        }.bind(this));
    },

    page: function(result) {
        this.load(result);
    },

    menuChange: function(result) {
        if (this.state.type == result._id) return null;
        this.setState({
            loading: true,
            type: result._id
        }, function() {
            this.load();
        }.bind(this))
    },
    getList: function() {
        if (this.state.loading)
            return (<tr height="300">
                        <td colSpan="5" style={{position: 'relative'}}><Loading /></td>
                    </tr>);

        if (this.state.code)
            return (<tr height="300">
                        <td colSpan="5" style={{position: 'relative'}}><Reload onReload={this.load.bind(this, {})} code={this.state.code} /></td>
                    </tr>);

        if (this.state.source.length == 0) {
            return <tr height="300">
                <td colSpan="6" className="info_order_data">暂无资产信息</td>
            </tr>;
        }

        return this.state.source.map(function(item, i) {
            return <tr height="40" key={item._id}>
                                <td>{item.batch_no}</td>
                                <td className="asset_name"><a href="javascript:;"  onClick={this.goto.bind(this, item)}>{item.product_name}</a></td>
                                <td>{Utils.formatDate(item.payment_time)}</td>
                                <td>{Utils.formatCoin(item.price)}</td>
                                <td>已签约</td>
                            </tr>
        }.bind(this));
    },

    componentDidMount: function() {
        this.load();
    },

    getInitialState: function() {
        return {
            loading: true,
            source: [],
            type: 11,
            code: null
        };
    },

    render: function() {

        return <div>
            <h3 className="info_title">我的资产</h3>
            <div className="info_content">
                <div className="info_content_header">
                    <MenuList onChange={this.menuChange} pointer="11" source={[{text: '策略', _id: 11},{text: '锦囊', _id: 1}, {text: '内参', _id: 4}, {text: '课堂', _id: 12}]} />
                </div>
                <table className="grid_box" width="100%">
                    <thead>
                    <tr height="40">
                        <td width="190">订单号</td>
                        <td>名称</td>
                        <td width="122">签约时间</td>
                        <td width="70">价格</td>
                        <td width="88">操作</td>
                    </tr>
                    </thead>
                    <tbody>
                        {this.getList()}
                    </tbody>
                </table>
                <div className="grid_page_box">
                    <PageBox nowPage={this.state.nowPage} pagination={this.state.pagination} onChange={this.page} />
                </div>
            </div>
        </div>
    }
});