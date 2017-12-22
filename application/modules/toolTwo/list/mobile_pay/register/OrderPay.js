var UserOrderHandle = require('../../../../../handle/usercenter/UserOrder');
var UserCenterHandle = require('../../../../../handle/usercenter/UserCenter');

module.exports = React.createClass({
    timer: function() {
        setTimeout(function() {
            this.setState({
                error: null
            });
        }.bind(this), 2000);
    },

    paySuccess: function(obj) {
        Event.trigger('CloseDialog');
        this.props.onChange(5,obj);
        if (obj.type && obj.type === 'offline') {
            if (typeof window.webkit != 'undefined') {
                //ios    
                window.webkit.messageHandlers.jsCallNative.postMessage({
                    "jsCallNative": "alertMessage"
                });
            } else {
                //android
                window.android.alertMessage();

            }
        }

    },

    getOrderIsPay: function(id) {
        UserOrderHandle.orderItem(id, function(result) {
            if (result.code == 200) {
                if (result.data.status == 2) return this.paySuccess({order_id:id});
                if (result.data.status == 1)
                    return this.setState({
                        error: '订单未支付成功'
                    }, function() {
                        clearTimeout(this.timer);
                        this.timer();
                    }.bind(this));
            }
        }.bind(this));
    },

    pay: function() {
        if (Url.getParam('order_id')) {
            return UserOrderHandle.mobileOrderPayurl(Url.getParam('order_id'), function(result) {
                if (result.code == 200 && this.isMounted()) {
                    if (this.props.product.paymethod == 0) return this.setState({
                        pointer: 1,
                        source: result.data
                    });

                    Interface.jsCallNative('getPayInfo', result.data);
                    return this.state.source = result.data;
                } else if (result.code == 42903 && this.isMounted()) {
                    if (this.props.product.paymethod == 0) return this.setState({
                        pointer: 1,
                        source: result.data
                    });
                    return this.getOrderIsPay(result.data.order_id);
                }

                return this.setState({
                    error: '支付失败',
                    again: true
                }, function() {
                    clearTimeout(this.timer);
                    this.timer();
                }.bind(this));
            }.bind(this));
        }

        var param = {
            product_id: this.props.product._id,
            paymethod: this.props.product.paymethod,
            num:this.props.product.cycle,
            timeType:this.props.product.timeType,
            discountDetails:this.props.product.discountDetails,
            isExclusive:parseInt(Url.getParam('is_exclusive')),
            serviceType:parseInt(Url.getParam('serviceType'))

        };
        UserOrderHandle.createMobileOrder(param, function(result) {
            if (result.code == 200 && this.isMounted()) {
                if (this.props.product.paymethod == 0) return this.setState({
                    pointer: 1,
                    source: result.data
                });
                Interface.jsCallNative('getPayInfo', result.data);
                return this.state.source = result.data;
            } else if (result.code == 42903 && this.isMounted()) {
                if (this.props.product.paymethod == 0) return this.setState({
                    pointer: 1,
                });
                return this.getOrderIsPay(result.data.order_id);
            }

            return this.setState({
                error: '创建订单失败',
                again: true
            }, function() {
                clearTimeout(this.timer);
                this.timer();
            }.bind(this));
        }.bind(this))
    },
    edit: function() {
        this.setState({
            pointer: 2
        });
    },

    submit: function(e) {
        var params = e.target.data;
        if (!params.bank)
            return this.setState({
                error: '开户银行不能为空'
            }, function() {
                clearTimeout(this.timer);
                this.timer();
            }.bind(this));
        if (!params.bank_account)
            return this.setState({
                error: '银行卡号不能为空'
            }, function() {
                clearTimeout(this.timer);
                this.timer();
            }.bind(this));
        if (!params.amount)
            return this.setState({
                error: '付款金额不能为空'
            }, function() {
                clearTimeout(this.timer);
                this.timer();
            }.bind(this));
        params.amount = parseFloat(params.amount);
        if (params.amount != parseFloat(this.props.product.discount_price)-this.props.product.deduction) {
            return this.setState({
                error: '所填付款金额与实际需要付款金额不一致'
            }, function() {
                clearTimeout(this.timer);
                this.timer();
            }.bind(this));
        }
        UserOrderHandle.payoffOrder(this.state.source.order_id, params, function(result) {
            if (result.code == 200) {
                this.paySuccess({type:'offline'});
            } else if (result.code == 40021 || result.code == 40004) {
                return this.setState({
                    error: '银行卡号不正确'
                }, function() {
                    clearTimeout(this.timer);
                    this.timer();
                }.bind(this));
            } else {
                return this.setState({
                    error: Utils.getPromptInfo(result.code)
                }, function() {
                    clearTimeout(this.timer);
                    this.timer();
                }.bind(this));
            }
        }.bind(this));
    },

    componentDidMount: function() {
        UserCenterHandle.getRealname({}, function(result) {
            if (result.code == 200) {
                this.setState({
                    realname: result.data.name
                })
            }
        }.bind(this));

        window.appPayResults = function() {
            this.getOrderIsPay(this.state.source.order_id);
        }.bind(this);
        this.pay();
    },

    componentWillUnmount: function() {
        window.appPayResults = null;
    },

    getInitialState: function() {
        return {
            error: null,
            source: {},
            again: false,
            pointer: 1,
            realname: ''
        };
    },
    render: function() {
        if (this.state.pointer == 1 && this.props.product.paymethod == 0) return (
            <div className="authentication">
                <div className="content">
                    <p>请使用{this.state.realname}名下银行卡进行线下转账，如付款账户姓名不符将影响您产品的正常购买，我公司唯一指定收款账户信息如下:</p>
                    <p>如有问题请致电客服热线:<a href="tel:400-156-6699">400-156-6699</a></p>
                </div>
                <div className="bank_input">
                    <ul>
                        <li><div>账户名称： 北京首证投资顾问有限公司</div></li>
                        <li><div>收款账号： 0200 0537 1920 0138 464</div></li>
                        <li><div>开户银行： 工行北京首都体育馆支行</div></li>
                    </ul>
                </div>

                <div className="tips">
                    <div onClick={this.edit} className="agree_button">填写付款信息</div>
                </div>
            </div>
        );

        if (this.state.pointer == 2 && this.props.product.paymethod == 0) return (
            <form className="authentication offline" onSubmit={this.submit}>
                <div className="content">
                    <h3>尊敬的用户：</h3>
                    <p>为保障权限顺利开通，请您如实填写转账信息，付款人姓名与实名认证不一致，我司将不予开通并退款。</p>
                </div>
                <div className="offline_input">
                    <h3>付款账户信息</h3>
                    <ul>
                        <li><div>付款账户姓名： {this.state.realname}</div></li>
                        <li><input type="text" ref="bank" name="bank" placeholder="请输入付款银行"  /></li>
                        <li><input type="text" ref="bank_account" name="bank_account" placeholder="请输入银行卡卡号"  /></li>
                        <li><input type="text" ref="amount" name="amount" placeholder="请输入付款金额"  /></li>
                    </ul>
                </div>
                <div className="tips">
                    <div className={this.state.error ? 'shadow show' : 'shadow'}>
                        {this.state.error}
                    </div>
                    <input className="agree_button" type="submit" value="提交"  />
                </div>
            </form>
        );

        return <div className="alipay">
            <p>支付完成前，请不要关闭窗口</p>
            <br/>
            <p>请在24小时内支付，超时订单将自动取消</p>
            <p>可能是以下原因导致您支付失败，您可以对照进行排查</p>
            <p>您取消了支付，导致支付未能成功</p>
            <p>提示“过期，超时，错误”等问题时，您可以重新进行支付</p>
            <p>交易有支付上限，建议您登录网上银行提高最高上限额度</p>
            <p>支付遇到问题？联系客服获得帮助</p>
            { this.state.again ?
                <form onSubmit={this.pay} className="clearfix">
                    <input style={{width: '100%'}} type="submit" value="重新支付" />
                </form>  : null }
            <div className={this.state.error ? 'shadow show' : 'shadow'}>
                {this.state.error}
            </div>
        </div>;
    }
});