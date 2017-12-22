module.exports = React.createClass({
    time: null,
    close: function() {
        clearInterval(this.time);
        Interface.gotoLeftNavView(Config.MODULE_NAME.USERCENTER, '/user_center.html?type=userOrder');
        Interface.closeWin();
    },
    componentDidMount: function() {
        Interface.pushMessage('PaySuccess');
		if (this.props.type == 7) {
			Interface.getProfile(function(result) {}, true);
		}
        this.time = setInterval(function() {
            this.setState({time: --this.state.time}, function() {
                if (this.state.time == 0) this.close();
            }.bind(this))
        }.bind(this), 1000)
    },

    getInitialState: function() {
        return {error: null, time: 5};
    },
    render: function() {
        var text = '订购成功';
        if (this.props.product && this.props.product.paymethod == 0) text = '您的订单提交成功，工作人员会在24小时内核实订单，如有疑问请您向客服咨询';

        return <div className="order_success">
                    <i></i>
                    <h2>{text}</h2>
                    <span>{this.state.time}秒后，系统自动打开 <a href="javascript:;" onClick={this.close}>我的订单</a> 页面</span>
                </div>
    }
});