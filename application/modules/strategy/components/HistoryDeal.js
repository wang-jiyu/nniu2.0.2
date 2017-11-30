var NoData = require('./NoData');
var StrategyListData = require('../../../handle/strategy/Index');
module.exports = React.createClass({
	getHistoryData: function(paramObj) {
		StrategyListData.getStrategyTwoHistoryData(paramObj, function(result) {
			result = JSON.parse(result);
			if (result.code == 200) {
				this.setState({
					data: result.data
				});
			}
		}.bind(this));
	},
	componentDidMount: function() {
		// var _id = Url.getParam("_id")
		// var info = {};
		// info._id = _id;
		// info.size = 5;
		// this.getHistoryData(info);
	},
	componentWillMount: function() {
		var _id = Url.getParam("_id")
		var info = {};
		info._id = _id;
		info.size = 5;
		this.getHistoryData(info);
	},
	getInitialState: function() {
		return ({
			data: []
		})
	},
	render: function() {
		var temp;
		if (this.state.data.length > 0) {
			temp = <div className="history-deal-table">
					<div className="table-list-title">
						<ul>
							<li>序号</li>
							<li>代码</li>
							<li>名称</li>
							<li>调出时间</li>
							<li>调出价</li>
							<li>调入时间</li>
							<li>调入价</li>
							<li>止盈价</li>
							<li>止损价</li>
							<li>状态</li>
							<li>收益率</li>
						</ul>
					</div>
					<div className="table-list">
						{
							this.state.data.map(function(item,index){
								return <ul>
											<li>{++index}</li>
											<li>{item.code}</li>
											<li>{item.name}</li>
											<li>{(item.position_out).toString().substr(0,4)+'-'+(item.position_out).toString().substr(4,2)+'-'+(item.position_out).toString().substr(6,2)}</li>
											<li style={{"text-align":"right","padding-right":"50"}}>{(item.price_out).toFixed(2)}</li>
											<li>{(item.position_in).toString().substr(0,4)+'-'+(item.position_in).toString().substr(4,2)+'-'+(item.position_in).toString().substr(6,2)}</li>
											<li style={{"text-align":"right","padding-right":"50"}}>{(item.price_in).toFixed(2)}</li>
											<li>{item.price_max!=0?(item.price_max).toFixed(2):'--'}</li>
											<li>{item.price_min!=0?(item.price_min).toFixed(2):'--'}</li>
											<li style={item.state==0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{item.state==0?'已止盈':'已止损'}</li>
											<li style={item.profit>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{(item.profit*100).toFixed(2)+'%'}</li>
										</ul>
							})
						}
						</div>
				</div>
		} else {
			temp = <NoData />
		}
		return (
			<div className="history-deal levelCenter mtop20">
				<div className="history-deal-title">
					过往交易
				</div>
				{temp}
			</div>
		)
	}
})