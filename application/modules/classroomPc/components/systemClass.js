var ReactDOM = require('react-dom');
module.exports = React.createClass({	
    render: function () {    	
        return (
            
			<div className="systematiCourse">
				<div className="classRoomHeader clearfix">
					<span className="classRoomTitle">系统课程</span>
					<span className="classRoomTime">每周一更新</span>
				</div>
				<div className="courseScroll">
					<ul className="courseList">
						<li className="liveTelecast"> 
							<div className="courseLeftImg">
								<img src="" alt=""/>
								<span className="liveTelecastActive"><em className="musicActive active"><i></i><i></i><i></i></em>直播中</span>
							</div>
							<span className="curseTitle">直面市场下挫，如何自救？</span>
							<span className="curseTime">直播时间：09:31（40分钟）</span>
							<span className="curseonline">在线人数：10,000人</span>
							<span className="ChatImmediately" >聊天</span>
						</li>
						<li className="videoPlaying">
							<div className="courseLeftImg">
								<img src="" alt=""/>
							</div>
							<span className="curseTitle">直面市场下挫，如何自救？</span>
							<span className="curseTime">直播时间：09:31（40分钟）</span>
							<span className="curseonline">在线人数：10,000人</span>
						</li>
						<li>
							<div className="courseLeftImg">
								<img src="" alt=""/>
							</div>
							<span className="curseTitle">直面市场下挫，如何自救？</span>
							<span className="curseTime">直播时间：09:31（40分钟）</span>
							<span className="curseonline">在线人数：10,000人</span>
						</li>						
					</ul>
				</div>
			</div>
        )
    }
})