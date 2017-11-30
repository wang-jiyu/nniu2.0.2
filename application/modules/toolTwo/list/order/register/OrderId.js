var UserCenterHandle = require('../../../../../handle/usercenter/UserCenter');
var UserOrderHandle = require('../../../../../handle/usercenter/UserOrder');

module.exports = React.createClass({
    submit: function(e) {
        Forms.disableButton(this.refs.submit);
        var params = {name: e.target.data.name, cardno: e.target.data.cardno};

        UserCenterHandle.authId(params, function(result) {
            if (result.code == 200) {
                Interface.getProfile(function() {
                    var product = this.props.product;
                    if (Config.CACHE_DATA.USER.risk_score > 0 && !product.discount_price) {
                        var param = {product_id: product._id, paymethod: product.paymethod};
                        UserOrderHandle.createOrder(param, function(result) {
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
                        var step = 3;
                        if (Config.CACHE_DATA.USER.risk_score > 0) step = 4;
                        this.props.onChange(step);
                    }
                }.bind(this), true);
            } else {
                this.setState({error: result.code}, function() {
                    Forms.activeButton(this.refs.submit);
                }.bind(this));
            }
        }.bind(this))
    },
    componentDidMount: function() {
        //Utils.setPosition(this.refs.title, -1);
        this.refs.name.focus();
    },

    getInitialState: function() {
        return {error: null};
    },
    render: function() {
        var userPay = Config.CACHE_DATA.USER.risk_score > 0;
        return (
            <div className="user_id_box">
                <p>应监管部门要求和对您合法权益的保障，请在购买产品前进行实名认证。</p>
                <p>如有问题请致电客服热线：400-156-6699</p>
                <form onSubmit={this.submit}>
                    <input name="name" data-required="required" type="text" placeholder="请输入姓名" ref="name" />
                    <input name="cardno" data-required="required" type="text" data-type="idcard" placeholder="请输入身份证号码" />
                    {typeof(this.state.error) == 'number' &&  <p className="prompt">{Utils.getPromptInfo(this.state.error)}</p>}
                    <input type="submit" value={userPay ? '立即订购' : '下一步'} ref="submit" />
                </form>
            </div>);
    }
});