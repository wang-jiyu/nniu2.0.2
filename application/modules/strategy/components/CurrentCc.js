{ /*当前持仓*/ }
var NoData = require('./NoData');
var StrategyListData = require('../../../handle/strategy/Index');
module.exports = React.createClass({
	getCurrentData: function(_id) {
		var data = {
			_id: _id
		}
		StrategyListData.getStrategyCurrentData(data, function(result) {
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
			data: []
		})
	},
	componentDidMount: function() {
		var _id = Url.getParam("_id")
		this.getCurrentData(_id);
	},
	componentWillMount: function() {
		// var _id = Url.getParam("_id")
		// this.getCurrentData(_id);
	},
	render: function() {
		var temp;
		if (this.state.data.length > 0) {
			temp = <div className="CurrentCc_main">
						<div className="CurrentCc_box">
					<table className="CurrentCc_table">
								<tbody>
								<tr>
									<th>序号</th>
									<th>代码</th>
									<th>名称</th>
									<th>涨幅</th>
									<th>现价</th>
									<th>调仓时间</th>
									<th>调入价</th>
									<th>当前收益率</th>
									<th>止盈价</th>
									<th>止损价</th>
								</tr>
								{
									this.state.data.map(function(item,index){
										var zafColor = {},profitColor = {};
										zafColor.color = item.zaf >= 0 ? '#FF0000' : '#129206';
										profitColor.color = item.profit >= 0 ? '#FF0000' : '#129206';
										return <tr>
													<td>{++index}</td>
													<td>{item.code}</td>
													<td>{item.name}</td>
													<td className="red" style={zafColor}>{item.zaf && item.zaf != 0 ? (item.zaf*100).toFixed(2)+'%' :'--'}</td>
													<td>{item.price_now}</td>
													<td>{(item.position_in).toString().substr(0,4)+'-'+(item.position_in).toString().substr(4,2)+'-'+(item.position_in).toString().substr(6,2)}</td>
													<td>{item.price_in && item.price_in !=0 ? (item.price_in).toFixed(2) : '--'}</td>
													<td className="red" style={profitColor}>{item.profit && item.profit != 0 ? (item.profit*100).toFixed(2)+'%' : '--'}</td>
													<td>{item.price_max && item.price_max!=0 ? (item.price_max).toFixed(2):'--'}</td>
													<td>{item.price_min && item.price_min!=0 ? (item.price_min).toFixed(2):'--'}</td>
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