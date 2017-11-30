var OrderConfirm = require('./register/OrderConfirm');
var OrderId = require('./register/OrderId');
var OrderEvaluate = require('./register/OrderEvaluate');
var OrderPay = require('./register/OrderPay');
var OrderSuccess = require('./register/OrderSuccess');
var CommonEvent = require('../../../../components/CommonEvent');
var Progress = require('../../../../components/common/Progress');
var UserOrderHandle = require('../../../../handle/usercenter/UserOrder');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');
module.exports = React.createClass({
    gotoModule: function(step, param) {
        if (param) {
            this.state.product = param;
            if (param.paymethod == 0) this.state.progress[3].text = '线下支付';
        }

        for (var i = 0; i < step; i++) {
            this.state.progress[i].selected = true;
        }

        this.setState({step: step});
    },
    load: function () {
        var progress = [{text: '订单确认', selected: true}, {text: '实名认证', selected: false, module: OrderId}, {text: '风险测评', selected: false, module: OrderEvaluate}, {text: '在线支付', selected: false, module: OrderPay}, {text: '订购完成', selected: false}];
        var orderId = Url.getParam('order_id');
        var param = {ref_id: Url.getParam('id'), ref_type: Url.getParam('type')};
        if (orderId) param = {order_id: orderId};

        UserOrderHandle.getProduct(param, function(result) {
            if (result.code == 200 && this.isMounted()) {
                if (result.data.paymethod || result.data.paymethod == 0) this.state.paymethod = result.data.paymethod;
                this.state.type = param.ref_type;
                if (result.data.ref_type) this.state.type = result.data.ref_type;
                return this.setState({source: result.data, loading: false, progress: progress, code: null});
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this))
    },
    getModule: function() {
        if (this.state.step == 1) return <OrderConfirm onChange={this.gotoModule} source={this.state.source} paymethod={this.state.paymethod} />;
        if (this.state.step == this.state.progress.length) return <OrderSuccess source={this.state.source} product={this.state.product} type={this.state.type} />;

        var VirtualModule = this.state.progress[this.state.step - 1].module;
        return <VirtualModule onChange={this.gotoModule} product={this.state.product} paymethod={this.state.paymethod} />
    },
    componentDidMount: function() {
        var orderSuccess = Url.getParam('extra_common_param');
        var progress = [{text: '订单确认', selected: true}, {text: '实名认证', selected: false, module: OrderId}, {text: '风险测评', selected: false, module: OrderEvaluate}, {text: '在线支付', selected: false, module: OrderPay}, {text: '订购完成', selected: false}];

        if (orderSuccess) {
            this.state.progress = progress;
            this.state.loading = false;
            this.gotoModule(5);
        } else {
            this.load();
        }
    },

    getInitialState: function() {
        return {step: 1, loading: true, paymethod: null, type: 7, code: null};
    },
    render: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load} code={this.state.code} />;
        return <div  className="user_order_box">
            <div className="order_progress">
                <Progress source={this.state.progress} />
            </div>
            {this.getModule()}
            <CommonEvent />
        </div>;
    }
});