var UserOrderHandle = require('../../../../../handle/usercenter/UserOrder');
var UserCenterHandle = require('../../../../../handle/usercenter/UserCenter');
var QRCode = require('qrcode');

module.exports = React.createClass({
    payInfo: function(code) {
        Event.trigger('OpenAlert', {
            title: '产品购买通知',
            message: code == 40002 ? '支付过程出现错误，请重新进行支付' : Utils.getPromptInfo(code),
            button: Config.MESSAGE_BUTTON.OK
        });
    },
    paySuccess: function() {
        Event.trigger('CloseDialog');
        this.props.onChange(5);
    },
    offlinePay: function(e) {
        if (e == true) return this.setState({offlinePay: true, offline: false});
        var param = e.target.data;
        param.amount = parseFloat(param.amount);
        if (param.amount != parseFloat(this.props.product.discount_price)) {
            return Event.trigger('OpenAlert', {
                title: '错误通知',
                message: '所填付款金额与实际需要付款金额不一致，请重新输入！',
                button: Config.MESSAGE_BUTTON.OK
            });
        }
        UserOrderHandle.payoffOrder(this.state.orderId, param, function(result) {
            if (result.code == 200) {
                this.paySuccess();
            } else {
                this.payInfo(result.code)
            }
        }.bind(this))
    },
    submit: function() {
        UserOrderHandle.orderItem(this.state.orderId, function(result) {
            if (result.code == 200) {
                if (result.data.status == 2) return this.paySuccess();
                return Event.trigger('OpenAlert', {
                            title: '支付结果通知',
                            message: '支付尚未成功，请您支付后再次点击确认！',
                            button: Config.MESSAGE_BUTTON.OK
                        });
            } else {
                this.payInfo(result.code)
            }
        }.bind(this))
    },
    toPay: function() {
        Interface.popWin('订单', this.state.url,  {width: 990, maxHeight: 790, top: 30, bottom: 30, align: 'center', valign: 0.4});
    },
    closeWindow: function () {
        Interface.closeWin();
    },
    qrcode: function() {
        var qrcode = new QRCode(this.refs.qrcode, {
            width : 168,//设置宽高
            height : 168
        });
        qrcode.makeCode(this.state.url);
    },
    price: function(e) {
        if (parseInt(e.currentTarget.value) < 0) return this.setState({price: 0});
        if (!isNaN(e.currentTarget.value)) this.setState({price: e.currentTarget.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')});
    },
    load: function(result, param) {
        this.state.url = result.data.url;
        this.state.orderId = result.data.order_id || Url.getParam('order_id');
        if (param.paymethod == 1) return this.setState({wechat: true, loading: false}, function() {
            this.qrcode();
        }.bind(this));

        if (param.paymethod == 2) {
            this.toPay();
            return this.setState({alipay: true, loading: false});
        }

        this.setState({offline: true, loading: false});
    },

    componentDidMount: function() {
        var param = {product_id: this.props.product._id, paymethod: this.props.product.paymethod};
        UserCenterHandle.getRealname({access_token: Config.ACCESS_TOKEN}, function (result) {
            if (result.code == 200) {
                this.setState({realname: result.data.name})
            }
        }.bind(this));

        if (Url.getParam('order_id')) {
            return UserOrderHandle.orderPayurl(Url.getParam('order_id'), function(result) {
                        if (result.code == 200 && this.isMounted()) {
                            this.load(result, param);
                        } else {
                            this.payInfo(result.code)
                        }
                    }.bind(this))
        }
        UserOrderHandle.createOrder(param, function(result) {
            if (result.code == 200 && this.isMounted()) {
                this.load(result, param);
            } else {
                this.payInfo(result.code)
            }
        }.bind(this))
    },

    getInitialState: function() {
        return {wechat: false, offline: false, alipay: false, loading: true, price: '', realname: ''};
    },
    render: function() {
        if (this.state.loading) return null;

        //微信支付
        if (this.state.wechat) return <div className="qrcode_box">
                                            <div className="wechat_pay">
                                                <p>微信支付，扫一扫付款（元）</p>
                                                <h3>{Utils.formatCoin(this.props.product.discount_price)}</h3>
                                            </div>
                                            <div className="qrcode">
                                                <div ref="qrcode"></div>
                                                <p>请打开手机微信</p>
                                                <p>扫一扫继续付款</p>
                                            </div>
                                            <input type="button" value="支付完成" onClick={this.submit} />
                                        </div>;

        if (this.state.alipay) return <div className="alipay">
                                            <h3>支付完成前，请不要关闭窗口</h3>
                                            <p>请在24小时内支付，超时订单将自动取消</p>
                                            <p>可能是以下原因导致您支付失败，您可以对照进行排查</p>
                                            <p>1.您取消了支付，导致支付未能成功</p>
                                            <p>2.提示“过期，超时，错误”等问题时，您可以重新进行支付</p>
                                            <p>3.交易有支付上限，建议您登录网上银行提高最高上限额度</p>
                                            <h4>支付遇到问题？联系客服获得帮助</h4>
                                            <form onSubmit={this.submit}>
                                                <input type="submit" value="支付完成" />
                                                <input type="button" value="放弃支付" onClick={this.closeWindow} className="blue" />
                                            </form>
                                        </div>;

        //线下支付
        if (this.state.offline) return <div className="offline_box">
                                            <p>请使用 <span style={{color: '#566572'}}>{this.state.realname}</span> 名下银行卡进行线下转账，如付款姓名不符将影响您产品的正常购买，我公司唯一指定收款账户信息如下：</p>
                                            <p>如有问题请致电客服热线： <span>400-156-6699</span></p>
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td className="filed">账户名称：</td>
                                                    <td>北京首证投资顾问有限公司</td>
                                                </tr>
                                                <tr>
                                                    <td className="filed">收款账号：</td>
                                                    <td>0200 0537 1920 0138 464</td>
                                                </tr>
                                                <tr>
                                                    <td className="filed">开户银行：</td>
                                                    <td>工行北京首都体育馆支行</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <input type="button" value="填写付款信息" onClick={this.offlinePay.bind(this, true)} />
                                        </div>;

        return <div className="offline_box">
                    <p>尊敬的客户：</p>
                    <p style={{textIndent: '25px'}}>为保障权限顺利开通，请您如实填写转账信息，付款人姓名与实名认证不一致，我司将不予开通并退款。</p>
                    <form onSubmit={this.offlinePay}>
                        <dl>
                            <dt>付款账户信息</dt>
                            <dd>付款账户姓名： {this.state.realname}</dd>
                            <dd>
                                <select className="gray" name="bank" data-required="required">
                                    <option value="中国农业银行">中国农业银行</option>
                                    <option value="中国建设银行">中国建设银行</option>
                                    <option value="中国银行">中国银行</option>
                                    <option value="交通银行">交通银行</option>
                                    <option value="招商银行">招商银行</option>
                                    <option value="民生银行">民生银行</option>
                                </select>
                            </dd>
                            <dd><input type="text" placeholder="请输入银行卡号" name="bank_account" data-required="required" /></dd>
                            <dd><input type="text" placeholder="请输入付款金额" name="amount" onChange={this.price} value={this.state.price} data-required="required" /></dd>
                        </dl>
                        <input type="submit" value="提交" />
                    </form>
                </div>;
    }
});