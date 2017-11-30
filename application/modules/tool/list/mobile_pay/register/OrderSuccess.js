var UserOrderHandle = require('../../../../../handle/usercenter/UserOrder');

module.exports = React.createClass({
    load: function () {
        var id = Url.getParam('order_id') || this.props.source.order_id;
        UserOrderHandle.orderItem(id, function(result) {
            if (result.code == 200) this.setState({source: result.data})
        }.bind(this));
    },

    componentDidMount: function () {
        this.load();
    },

    getInitialState: function() {
        return {source: {}, loading: true};
    },
    render: function() {
        return this.state.source.length > 0 ? null :
            <div className="pay_success">
                <div className="title">
                    <i></i>
                    <h3>{this.props.source.paymethod == 0 ? '提交成功，等待审核' : '支付成功'}</h3>
                </div>
                <div className="mobile_order">
                    <ul className="order_info_list">
                        {
                            this.state.source.batch_no ?  <li className="clearfix">
                                <div className="left">订单编码</div>
                                <div className="right">{this.state.source.batch_no}</div>
                            </li> : null
                        }
                        {
                            this.state.source.product_name ? <li className="clearfix">
                                <div className="left">购买产品</div>
                                <div className="right">{this.state.source.product_name}</div>
                            </li> : null
                        }

                        {   this.state.source.create_time ?
                            <li className="clearfix">
                                <div className="left">下单时间</div>
                                <div className="right">{Utils.formatDate(this.state.source.create_time, 'YYYY-MM-DD')}</div>
                            </li> : null
                        }

                        {
                            this.state.source.payment_time == 0 ? null : <li className="clearfix">
                                <div className="left">支付时间</div>
                                <div className="right">{Utils.formatDate(this.state.source.payment_time, 'YYYY-MM-DD')}</div>
                            </li>
                        }

                    </ul>
                </div>

            </div>;
    }
});