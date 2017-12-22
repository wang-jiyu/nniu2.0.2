var PageBox = require('../../components/common/PageBox');
var UserHandle = require('../../handle/usercenter/UserCenter');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({
    load: function(params) {
    	this.setState({loading: true});
        var params = $.extend({page: 1, limit: 8}, params);
        UserHandle.getCostList(params, function(result) {
            if (result.code == 200 && this.isMounted())
                return this.setState({source: result.data.rows, loading: false, nowPage: params.page, pagination: result.data.pagination, code: null});
            return this.setState({code: result.code, loading: false});
        }.bind(this));
    },

    status: function(assort, amount) {
        if (!amount) return {status: '', color: '', text: '消费'};
        if (assort) return {status: '-', color: 'pink', text: '消费'};
        return {status: '+', color: 'green', text: '充值'};
    },

    getList: function() {
        if (this.state.loading)
            return  (<tr height="300">
                        <td colSpan="6"  style={{position: 'relative'}}><Loading  /></td>
                    </tr>);

        if (this.state.code)
            return   (<tr height="300">
                        <td colSpan="6" style={{position: 'relative'}}><Reload onReload={this.load.bind(this, {})} code={this.state.code} /></td>
                    </tr>);
        if (this.state.source.length == 0) {
            return <tr height="300">
                <td colSpan="6" className="info_order_data">暂无消费明细</td>
            </tr>;
        }

        return this.state.source.map(function(item, i) {
            var _origin = 'PC端';
            if (item.origin == 2) _origin = 'Web端';
            if (item.origin == 3) _origin = '移动端';
            var _sign = this.status(item.assort, item.amount);
            return  (<tr height="40" key={i}>
                        <td>{item.transcation}</td>
                        <td>{Utils.formatDate(item.create_time)}</td>
                        <td>{_sign.text}</td>
                        <td>{item.descritption}</td>
                        <td className={_sign.color + ' price'}>{_sign.status + Utils.formatCoin(item.amount)}</td>
                        <td>{_origin}</td>
                    </tr>);
        }.bind(this));
    },

    page: function(result) {
        this.load(result);
    },

    componentDidMount: function() {
        this.load();
    },

    getInitialState: function() {
        return {source: [], loading: true, nowPage: 1};
    },

    render: function() {

        return <div>
					<h3 className="info_title">消费明细</h3>
					<div className="info_content">
						<table className="grid_box" width="100%">
							<thead>
							<tr height="40">
								<td width="133">流水号</td>
								<td width="130">日期</td>
								<td width="50">类型</td>
								<td>描述</td>
								<td width="88" className="price">金额</td>
								<td width="72">来源</td>
							</tr>
							</thead>
							<tbody>
								{this.getList()}
							</tbody>
						</table>

						<div className="grid_page_box">
							<PageBox onChange={this.page} pagination={this.state.pagination} nowPage={this.state.nowPage} />
						</div>
					</div>
				</div>
    }
});