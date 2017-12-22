{ /*今日调仓*/ }
var NoData = require('./NoData');
var StrategyListData = require('../../../handle/strategy/Index');
module.exports = React.createClass({
	getTodayData: function(_id) {
		var data = {
			_id: _id
		}
		StrategyListData.getStrategyTodayData(data, function(result) {
			result = JSON.parse(result);
			if (result.code == 200) {
				this.setState({
					data: result.data
				});
			}
		}.bind(this));
	},
	getInitialState: function() {
		return ({
			"date": Config.TOOL.formatter(Config.TOOL.timestamp(), 'YYYY MM DD'),
			data: []
		})
	},
	componentDidMount: function() {
		var _id = Url.getParam("_id")
		this.getTodayData(_id);
	},
	componentWillMount: function() {
		// var _id = Url.getParam("_id")
		// this.getTodayData(_id);
	},
	render: function() {
		var temp;
		if (this.state.data.length > 0) {
			temp =
				<div className="today_tc_main">
			 <div className="today_tc">
			 <div className="today_tc_date">{this.state.date}</div> 
			 <table className="today_tc_table">
						<tbody>
							<tr>
								<th>序号</th>
								<th>代码</th>
								<th>名称</th>
								<th>调仓</th>
								<th>时间</th>
								<th>价格</th>
								{/*<th>止盈价</th>
								<th>止损价</th>*/}
							</tr>
							{
									this.state.data.map(function(item,index){
										var colorStyle={};
										colorStyle.color = item.state == 0 ? '#FF0000' : '#129206';
											return <tr>
												<td>{++index}</td>
												<td>{item.code}</td>
												<td>{item.name}</td>
												<td className="red" style={colorStyle}>{item.state==0?"调入":"调出"}</td>
												<td>{item.time}</td>
												<td>{item.price && item.price !=0 ? (item.price).toFixed(2) : '--'}</td>
												{/*<td>item.price_max</td>*/}
												{/*<td>{item.price_min}</td>*/}
											</tr>
										
									})
							}
							
						</tbody>
					</table>
					</div>
					</div>
		} else {
			temp = <NoData />
		}
		return (
			<div>
				{temp}
			</div>
		)
	}
})