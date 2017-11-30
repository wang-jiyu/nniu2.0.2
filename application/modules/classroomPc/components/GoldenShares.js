module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			
		}
	},
	componentDidMount: function() {
		var goldPanelLen=$(".courseGoldWrapScroll").children(".courseGoldPanel").length;
		var wrapScrollWidth=goldPanelLen * 622 + 'px';
		$(".courseGoldWrapScroll").css({"width":wrapScrollWidth});
	},
    render: function () {    	
        return (
            <section className="courseGoldStock">
				<div className="classRoomHeader clearfix">
					<span className="classRoomTitle">课程金股</span>
					<span className="classRoomTime">2017-7-21 12:21</span>
				</div>
				<div className="courseGoldWrap clearfix">
					<div className="courseGoldWrapScroll">
						
						<div className="courseGoldPanel">
							<div className="curseGoldName">东方财富（300095）</div>
							<div className="curseGoldInterval clearfix">
								<span>参考介入区间<em>9.90-10.15</em></span>
								<span>目标位<em>11.15</em></span>
								<span>止损<em>9.55</em></span>
							</div>
							<div className="curseGoldDescribe">
								<p>这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，</p>
							</div>
						</div>	
						<div className="courseGoldPanel">
							<div className="curseGoldName">东方财富（300095）</div>
							<div className="curseGoldInterval clearfix">
								<span>参考介入区间<em>9.90-10.15</em></span>
								<span>目标位<em>11.15</em></span>
								<span>止损<em>9.55</em></span>
							</div>
							<div className="curseGoldDescribe">
								<p>这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，这里是原因，</p>
							</div>
						</div>	
					</div>
				</div>
			</section>
        )
    }
})