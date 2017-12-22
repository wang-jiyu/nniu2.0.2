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
            this.setState({
                param :$.extend(this.state.source,param)
            });
        }
        for (var i = 0; i < step; i++) {
            this.state.progress[i].selected = true;
        }
        this.state.step = step;
        this.setState({
            step: this.state.step
        });
    },
    getModule: function() {
        if (this.state.step == 1) return <OrderConfirm onChange={this.gotoModule} source={this.state.source} paymethod={this.state.paymethod} />;
        if (this.state.step == this.state.progress.length) return <OrderSuccess source={this.state.source} type={this.state.type} />;
        // console.log(this.state.product);
        var VirtualModule = this.state.progress[this.state.step - 1].module;
        return <VirtualModule onChange={this.gotoModule} product={this.state.product} paymethod={this.state.paymethod} />
    },
    load: function() {
        var progress = [{
            text: '订单确认',
            selected: true
        }, {
            text: '实名认证',
            selected: false,
            module: OrderId
        }, {
            text: '风险测评',
            selected: false,
            module: OrderEvaluate
        }, {
            text: '在线支付',
            selected: false,
            module: OrderPay
        }, {
            text: '订购完成',
            selected: false
        }];
        this.setState({
            loading: true
        });
        var orderId = Url.getParam('order_id');
        var param = {
            ref_id: Url.getParam('id'),
            ref_type: Url.getParam('type'),
            num:Url.getParam('num'),
            timeType:Url.getParam('timeType'),
            isExclusive:parseInt(Url.getParam('is_exclusive')),
            serviceType:parseInt(Url.getParam('serviceType'))
        };
        if (orderId) param = {
            order_id: orderId
        };
        UserOrderHandle.getProductTwo(param, function(result) {
                console.log(JSON.stringify(result));
                if (result.code == 200 && this.isMounted()) {
                    console.log(1111111111);
                if (result.data.paymethod) this.state.paymethod = result.data.paymethod;
                console.log(22222222222);
                var type = result.data.ref_type ? result.data.ref_type : param.ref_type;
                console.log(33333333333333);
                return this.setState({
                    source: result.data,
                    loading: false,
                    progress: progress,
                    type: type,
                    code: null
                })
            }
            return this.setState({
                loading: false,
                code: result.code
            });
        }.bind(this))


    },
    componentDidMount: function() {
        var orderSuccess = Url.getParam('extra_common_param');
        var progress = [{
            text: '订单确认',
            selected: true
        }, {
            text: '实名认证',
            selected: false,
            module: OrderId
        }, {
            text: '风险测评',
            selected: false,
            module: OrderEvaluate
        }, {
            text: '在线支付',
            selected: false,
            module: OrderPay
        }, {
            text: '订购完成',
            selected: false
        }];

        if (orderSuccess) {
            this.state.progress = progress;
            this.gotoModule(5);
            this.setState({
                loading: false,
                code: null
            });
        } else {
            this.load();
        }
    },

    getInitialState: function() {
        return {
            step: 1,
            loading: true,
            paymethod: null,
            type: 7,
            code: null
        };
    },
    render: function() {
        //安卓低版本兼容4.2以下系统
        if (Url.getParam('app_version') && parseInt(Url.getParam('app_version')) <= 18) {
            var version = true;
        };
        console.log(this.state.loading);
        if (this.state.loading) return <Loading  />;
        if (this.state.code) return <Reload onReload={this.load} code={this.state.code} />;
        return <div  className="user_order_box" style={version?{'width':'7rem'}:null}>
                    {this.getModule()}
                    <CommonEvent />
                </div>;
    }
});