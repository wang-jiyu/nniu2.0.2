module.exports = React.createClass({
	render: function() {
		var strategyInfoData = this.props.data
		console.log(strategyInfoData);
		var label = strategyInfoData.label || [];
		return (
			<div className="unitCard levelCenter mtop10">
				<div className="card-left-circle">
					<div className="circle-num">{strategyInfoData.profit_year && strategyInfoData.profit_year !=0 ? (Math.floor(strategyInfoData.profit_year*10000)/100)+'%' : '--'}</div>
					<p className="circle-num-desc">年化收益率</p>
				</div>
				<div className="card-right-info">
					<div className="unit-card-name">
						<span>{strategyInfoData.name}</span>
						<span className="strategyInfoTime">创建于：{parseInt(strategyInfoData.createtime).toString().substr(0,4)+'-'+parseInt(strategyInfoData.createtime).toString().substr(4,2)+'-'+parseInt(strategyInfoData.createtime).toString().substr(6,2)}</span>
					</div>
					<div className="unit-card-desc">
						<div className="unit-card-desc-con">
							<span className="card-desc-con-label">策略说明：</span>
							<span className="card-desc-con-value">{strategyInfoData.remark}</span>
						</div>
						<div className="unit-card-desc-style">
							<span className="card-desc-con-label">策略风格：</span>
							{
								label.map(function(item,index){
									return <span className="card-desc-con-value">{item.title}</span>
								})
							}
						</div>
					</div>
					<div className="unit-card-num-array">
						<span><p className="unit-num" style={strategyInfoData.profit_total>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{strategyInfoData.profit_total && strategyInfoData.profit_total !=0 ? (strategyInfoData.profit_total*100).toFixed(2)+'%' : '--'}</p><p className="unit-num-name">总收益率</p></span>
						<span><p className="unit-num" style={strategyInfoData.profit_month>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{strategyInfoData.profit_month && strategyInfoData.profit_month !=0 ? (strategyInfoData.profit_month*100).toFixed(2)+'%' : '--'}</p><p className="unit-num-name">月收益率</p></span>
						<span><p className="unit-num" style={strategyInfoData.profit_week>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{strategyInfoData.profit_week && strategyInfoData.profit_week !=0 ? (strategyInfoData.profit_week*100).toFixed(2)+'%' : '--'}</p><p className="unit-num-name">周收益率</p></span>
						<span><p className="unit-num" style={strategyInfoData.profit_yesterday>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{strategyInfoData.profit_yesterday && strategyInfoData.profit_yesterday !=0 ? (strategyInfoData.profit_yesterday*100).toFixed(2)+'%' : '--'}</p><p className="unit-num-name">昨日收益率</p></span>
						<span><p className="unit-num" style={strategyInfoData.backset>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{strategyInfoData.backset && strategyInfoData.backset !=0 ? (strategyInfoData.backset*100).toFixed(2)+'%' : '--'}</p><p className="unit-num-name">最大回撤</p></span>
						<span><p className="unit-num" style={strategyInfoData.success>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{strategyInfoData.success && strategyInfoData.success !=0 ? (strategyInfoData.success*100).toFixed(2)+'%' : '--'}</p><p className="unit-num-name">成功率</p></span>
					</div>
				</div>
			</div>
		)
	}
})