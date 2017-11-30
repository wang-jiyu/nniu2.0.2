module.exports = React.createClass({

	render: function() {
		console.log(this.props.combatData);
		return (

			<div className="practiceCourses">
				<div className="classRoomHeader clearfix">
					<span className="classRoomTitle">实战课程</span>
					<span className="classRoomTime">盘中直播课</span>
				</div>
				<div className="courseScroll">
					<ul className="courseList">
					{
						this.props.combatData.map(function(elem, index) {
							return <li className="liveTelecast videoPlaying"> 
							<div className="courseLeftImg">
								<img src={elem.device_cover_url} alt={elem.title}/>
								{elem.live_status==2?<span className="liveTelecastActive"><em className="musicActive active"><i></i><i></i><i></i></em>直播中</span>:null}
							</div>
							<span className="curseTitle">{elem.title}</span>
							{!elem.video_url?<span className="curseTime">直播时间：{Config.TOOL.formatter(elem.live_time*1000,'YYYY MM DD H M')}（{elem.live_duration/60}分钟）</span>:null}
							<span className="curseonline">在线人数：{elem.online_count}人</span>
							{!elem.video_url?<span className="ChatImmediately" onclick="popover()">聊天</span>:null}
						</li>
						})
					}
					</ul>
				</div>
			</div>
		)
	}
})