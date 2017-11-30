module.exports = React.createClass({
	render: function() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12">
						<div className="topProgress">
							<div className="orderProgress">
								<div className="progressOne"></div>
								<div className="progressTwo"></div>
								<div className="progressThree"></div>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 text-center">
						<div className="order-status">
							订购成功
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 text-center">
						<div className="QRcode">
							
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 text-center">
						<div className="orderDesc">
							<p>支付完成，请返回到 “<a href="http://dev.0606.com.cn/">策略-我的</a>” 页面查看所购买策略的详情。</p>
							<p>下载手机APP,随时随地看策略！</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
});