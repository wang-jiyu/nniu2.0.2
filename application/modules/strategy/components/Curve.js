var BrokenLine = require('./BrokenLine');
var dates = [{
	name: '全部',
	param: 0
}, {
	name: '近半年',
	param: 1
}, {
	name: '近一个月',
	param: 2
}, {
	name: '近一周',
	param: 3
}]
module.exports = React.createClass({
	tabClick: function(index, type) {
		this.setState({
			currentIndex: index
		})
		this.props.curveApi(type)
			// console.log(sort);
	},
	check_tab_index:function(index) {
		return index === this.state.currentIndex ? "active" : "";
	},
	getInitialState: function() {
		return {
			currentIndex: 0,
			data: {}
		};
	},
	componentWillMount: function() {

	},
	componentDidMount: function() {

	},
	render: function() {
		var time,
			zsprofit = [],
			profits = [],
			zsprofits = [];
		var data = this.props.curveData.map(function(item, index) {
			var profit = [],
				zsprofit = []
			time = item.date.toString().substr(0, 4) + '-' + item.date.toString().substr(4, 2) + '-' + item.date.toString().substr(6, 2)
			profit.push(time, item.profit * 100)
			profits.push(profit)
			zsprofit.push(time, item.zsprofit * 100)
			zsprofits.push(zsprofit)
		});
		// console.log(profits);

		return (
			<div className="curve levelCenter mtop20">
				<div className="curve-title">
					<div className="curve-title-left">
						<span>收益曲线</span>
						<ul>
							{
								dates.map(function(item,index){
									return <li className={this.check_tab_index(index)} onClick={this.tabClick.bind(this,index,item.param)}>{item.name}</li>
								}.bind(this))
							}
						</ul>
					</div>
					<div className="curve-title-right">
						<span className="dot lan"></span>
						<span>沪深300</span>
						<span className="dot red"></span>
						<span>策略收益率</span>
					</div>
				</div>
				<div className="curve-pictrue">
					<BrokenLine profit={profits} zsprofit={zsprofits} />
				</div>
			</div>
		)
	}
})