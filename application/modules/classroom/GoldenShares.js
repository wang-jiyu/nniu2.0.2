module.exports = React.createClass({

	getInitialState: function() {
		return {

		}
	},
	componentDidMount: function() {

	},
	render: function() {
		console.log(this.props.recommendStock);
		return (
			<section className="courseGoldStock">
				<div className="classRoomHeader clearfix">
					<span className="classRoomTitle">课程金股</span>
					<span className="classRoomTime">2017-7-21 12:21</span>
				</div>
				<div className="courseGoldWrap clearfix">
					<div className="courseGoldWrapScroll" style={{'width':this.props.recommendStock.length*622}}>
						{
							this.props.recommendStock.length>0?this.props.recommendStock.map(function(elem, index) {
								return <div className="courseGoldPanel">
							<div className="curseGoldName">{elem.stock_name+'('+elem.stock_code+')'}</div>
							<div className="curseGoldInterval clearfix">
								<span>参考介入区间<em>{elem.min_price+'-'+elem.max_price}</em></span>
								<span>目标位<em>{elem.target_bit}</em></span>
								<span>止损<em>{elem.stop_bit}</em></span>
							</div>
							<div className="curseGoldDescribe">
								<p>{elem.reason}</p>
							</div>
						</div>
							}):null
						}
					</div>
				</div>
			</section>
		)
	}
})