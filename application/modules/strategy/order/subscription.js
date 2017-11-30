module.exports = React.createClass({
	openModule: function() {
		typeof(this.props.onClick) == 'function' && this.props.onClick();
	},
	free: function() {
		this.openModule();
	},
	componentDidMount: function() {

	},
	getInitialState: function() {
		return {}
	},
	render: function() {
		return (
			<div className = "container-fluid">
				<div className="sibscription-box">
					<div className = "row sibscription">
					<div className = "col-md-2 text-right leftIco">
						<div className = "leftIcoCon"></div>
					</div>
					<div className="col-md-10 main-right">
						<div className="row">
							<div className="col-md-12">
								<h3 className="productTitle">金牛一号</h3>
							</div>
						</div>
						<div className="row">
							<div className="col-md-2 orderlabel">策略风格：</div>
							<div className="col-md-10 orderNormalValue">短线</div>
						</div>
						<div className="row">
							<div className="col-md-2 orderlabel">优惠信息：</div>
							<div className="col-md-10 favorableValue">
								无
							</div>
						</div>
						<div className="row">
							<div className="col-md-2 orderlabel">服务期限：</div>
		<div className="col-md-10 orderNormalValue">
								2017-02-01 至 2018-01-31
							</div>
						</div>
						<div className="row">
							<div className="col-md-2 orderlabel">价格：</div>
							<div className="col-md-10 orderNormalValue">￥19800.00</div>
						</div>
						<div className="row">
							<div className="col-md-2 orderlabel">订购价格：</div>
							<div className="col-md-10 orderNormalValue">￥<span>19,800.00元/年</span></div>
						</div>
						<div className="row">
							<div onClick={this.free.bind()} className="col-md-4 text-center orderButton">
								立即订购
							</div>
						</div>
					</div>
				</div>
				</div>
				<div className="orderBottom">
					<div className="row bottomWidth">
						<div className="col-md-2">
							<div className="order-risk-hint">
								股市有风险入市需谨慎
							</div>
						</div>
						<div className="col-md-9">
							<div className="order-risk-hink-content">用户应了解证券投资面临的各种市场风险和政策风险，了解证券业务的内涵和基本规则，用户应自主做出投资决策，并独立承担投资风险。网站不承担任何经济和法律责任。</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 text-center">
							<div className="order-copyright">
								本服务由北京首证投资咨询有限公司（证券投资咨询机构：ZX0013）投资研究中心提供			
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});