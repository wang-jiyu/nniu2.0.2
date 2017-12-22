var PayRadio = require('../../../../../components/listview/PayRadio');
var UserOrderHandle = require('../../../../../handle/usercenter/UserOrder');
var Protocol = require('./Protocol');
var Prompt = require('./Prompt');
var UserMobile = require('../../../../usercenter/usersecurity/UserMobile');
var UserPassword = require('../../../../usercenter/usersecurity/UserPassword');

module.exports = React.createClass({
    prompt: function() {
        Event.trigger('OpenDialog', {module: <Prompt />, title: '风险提示书及确认书', width: 560, height: 680});
    },
    protocol: function() {
        Event.trigger('OpenDialog', {module: <Protocol />, title: '投资顾问服务协议', width: 560, height: 680});
    },
    submit: function(e) {
    	if (Config.CACHE_DATA.USER.advisor_type == 2) {
    	 	return Event.trigger('OpenAlert', {
			            title: '产品购买通知',
			            message: "投顾不能购买此产品",
			            button: Config.MESSAGE_BUTTON.OK
			        });
    	}
    	
		this.state.way = parseFloat(e.target.data.pay);
        var param = $.extend(this.props.source, {paymethod: this.state.way}); 
        if (Config.CACHE_DATA.USER.risk_score > 0 && !this.state.source.discount_price && Config.CACHE_DATA.USER.is_auth) {
            var _param = {product_id: this.state.source._id, paymethod: this.state.way};
            UserOrderHandle.createOrder(_param, function(result) {
                if (result.code == 42903) {
                    this.props.onChange(5);
                } else {
                    Event.trigger('OpenAlert', {
                        title: '产品购买通知',
                        message: Utils.getPromptInfo(result.code),
                        button: Config.MESSAGE_BUTTON.OK
                    });
                }
            }.bind(this))
        } else {
            var step = 2;
            if (Config.CACHE_DATA.USER.is_auth) step = 3;
            if (Config.CACHE_DATA.USER.is_auth && Config.CACHE_DATA.USER.risk_score > 0) step = 4;
            this.props.onChange(step, param);
        }
    },
    checked: function(e) {
        this.setState({checked: e.currentTarget.checked})
    },
    getShow: function () {
        if (!this.props.paymethod && this.props.paymethod != 0) {
            return (<div>
						<PayRadio images="/assets/images/pay.png" name="pay" value="2" defaultChecked={true}>支付宝</PayRadio>
						<PayRadio images="/assets/images/weixin.png" name="pay" value="1">微信</PayRadio>
						<PayRadio images="/assets/images/money.png" name="pay" value="0">线下支付</PayRadio>
					</div>);
		}

        switch (this.props.paymethod) {
            case 0:
                return <PayRadio images="/assets/images/money.png" name="pay" value="0" checked={true} >线下支付</PayRadio>;
            case 1:
                return <PayRadio images="/assets/images/weixin.png" name="pay" value="1" checked={true} >微信</PayRadio>
            default:
                return <PayRadio images="/assets/images/pay.png" name="pay" value="2" checked={true}>支付宝</PayRadio>
        }
    },
	
	bindPhone: function() {
	  	if (!Config.CACHE_DATA.USER.mobile && Config.CACHE_DATA.USER.advisor_type != 2) {
			return setTimeout(function() {
				var offClose = true
				Event.trigger('OpenDialog', {module: <UserMobile tootip={<div className="tootip">为了您的安全，购买产品时需要认证手机号码！</div>} onChange={function() {
						offClose = false;
						setTimeout(function() {
							Event.trigger('CloseDialog');
						}, 2000);
					}} />, width: 420, height: 330, closeEvent: function() {
							return offClose;
					}});
			});
		} 
		Event.trigger('CloseDialog');
	},
    componentDidMount: function() {
       if (Config.CACHE_DATA.USER.is_default_passwd == 1 && Config.CACHE_DATA.USER.advisor_type != 2) {
           return setTimeout(function() {
				var offClose = true;
			 	Event.trigger('OpenDialog', {module: <UserPassword tootip={<div className="tootip">为了您的安全，购买产品时需要设置密码！</div>} onChange={function() { 
					setTimeout(function() {
						offClose = false;
						this.bindPhone();
					}.bind(this), 2000);
					Interface.getProfile(function(){}, true);
				}.bind(this)} />, width: 420, height: 270, closeEvent: function() {
					return offClose;
				}});
			}.bind(this));
		}
      	this.bindPhone();
    },
    getInitialState: function() {
        return {checked: false, source: this.props.source, way: this.props.paymethod};
    },
    render: function() {
        var userPay = Config.CACHE_DATA.USER.risk_score > 0 && Config.CACHE_DATA.USER.is_auth;
        return <form onSubmit={this.submit}>
                    <div className="order_item">
                        <h5>订单信息</h5>
                        <table className="order_content">
                            <tbody>
                            <tr>
                                <td>产品名称：</td>
                                <td>{this.state.source.product_name}</td>
                            </tr>
                            <tr>
                                <td>服务周期：</td>
                                <td>{Math.ceil((this.state.source.end_time - this.state.source.begin_time) / 3600 / 24)}天</td>
                            </tr>
                            <tr>
                                <td>价格：</td>
                                <td>{this.state.source.price ? '￥' + Utils.formatCoin(this.state.source.price) : '免费'}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    {this.state.source.discount_price == 0 ? null :
                        <div className="order_item">
                            <h5>支付方式</h5>
                            <div className="pay_way">
                                {this.getShow()}
                            </div>
                        </div>}
                    {this.props.paymethod ? null :
                        <div className="order_item">
                            <h5>优惠信息</h5>
                            <table className="order_content">
                                <tbody>
                                <tr>
                                    <td>{this.state.source.counpon}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>}
                    <div className="order_count">
                        <table>
                            <tbody>
                            {this.state.source.discount_price == 0 ? null :
                                <tr>
                                    <td className="filed">优惠金额：</td>
                                    <td>{'￥' + Utils.formatCoin(this.state.source.price - this.state.source.discount_price)}</td>
                                </tr>
                            }
                            <tr>
                                <td className="filed">实付金额：</td>
                                <td>{'￥' + Utils.formatCoin(this.state.source.discount_price)}</td>
                            </tr>
                            </tbody>
                        </table>
                        <div>
                            <label className="checkbox">
                                <input type="checkbox" ref="checkbox" onChange={this.checked} />
                                <span>我已阅读并同意 《<a href="javascript:;" onClick={this.protocol}>投资顾问服务协议</a>》 和 《<a href="javascript:;" onClick={this.prompt}>风险提示书及确认书</a>》 </span>
                            </label>
                        </div>
                        <input type="submit" value={userPay ? '立即订购' : '下一步'} disabled={!this.state.checked} />
                    </div>
                </form>
    }
});