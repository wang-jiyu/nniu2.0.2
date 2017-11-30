module.exports = React.createClass({
	buy: function() {
		var id = this.props.ref_id;
		var uri = '/tool.html?tool=order&id=' + id + '&type=11';
		Interface.popWin('订单', uri, {
			width: 746,
			maxHeight: 790,
			top: 30,
			bottom: 30,
			align: 'center',
			valign: 0.4
		});
	},
	render: function() {
		return (
			<div className="no-subscription-state levelCenter mtop20">
				<div className="markedness-title">
					订阅后才能看到该策略的当前持股详情！
				</div>
				<div className="subscription-appreciation-info">
					<div className="subscription-info-ico">
						<img src="assets/images/strategy/subscription-info-ico.png" alt="" />
					</div>
					<div className="subscription-info-con">
						<div class="subscription-info-con-title">
							购买该策略后您可以享受如下服务
						</div>
						<ul>
							<li>1、随时查看当前持仓明细</li>
							<li>2、及时获取交易动态</li>
						</ul>
					</div>
				</div>
				<div className="subscriptionButton" onClick={this.buy}>
				<span className="subscription-buttonWz">立即订阅</span>
				<span className="subscription-button-num">{this.props.price}<i>元/{this.props.time+'天'}</i>
				</span></div>
			</div>
		)
	}
})