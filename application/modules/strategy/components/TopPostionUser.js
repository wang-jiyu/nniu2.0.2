module.exports = React.createClass({
	getInitialState: function() {
		return {
			source: Config.CACHE_DATA.USER,
			postion: this.props.postion
		};
	},
	render: function() {
		return (
			<div>
				<div className="top-postion-user">
					<div className="top-postion">
						<span>我的位置：</span>
						<span><a href="/strategyIndex.html?postion=index">量化策略</a>{' > '}</span>
						<span>{this.state.postion}</span>
					</div> 
					< div className = "top-user" >
						<span>{Config.CACHE_DATA.USER.name||this.props.userName||'游客'}</span>
						<span>
		<i>APP下载</i>
						< div className = "twoCode" >
							<img src="assets/images/strategy/index/code2.png" alt="下载"/>
						< /div>< /span>
						
		 			</div>
		 	 	</div> < div style = {
				{
					"clear": "both"
				}
			} > < /div> < /div >
		)
	}
})