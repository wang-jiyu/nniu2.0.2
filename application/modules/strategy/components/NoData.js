module.exports=React.createClass({
	getInitialState:function(){
		return {"text":"该策略当前暂无数据"}
	},
	render:function(){
		return(
			<div className="no_data_box">
			<div className="no_data_bj"></div>
			<div className="no_data">{this.state.text}</div>
			</div>
		)
	}
})
