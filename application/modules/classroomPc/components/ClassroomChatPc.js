module.exports = React.createClass({
	render: function() {
		return (
			<div className="chatRoomSection">
				<div className="roomList">
					<div className="privateStringHeader clearfix">
						<span className="privateStringTitle">2017年02月18日 | 直播主题：节后介入卖出的票大幅复利没有最好只有更好</span>
						<a href="javascript:void(0)" className="roomListClosed" onclick="closePop(this)">×</a>
						<span className="Participants">参与人数：50,126 人</span>
					</div>
					<div className="privateStringContent">
						<ul className="privateStringUl">
							<li className="rightSideChat">
								<span className="chatterFace"></span>
								<div className="chatterTop">
									<span className="chatterName">张方海</span>
									<span className="chatterIdentity">老师</span>
									<span className="sendtime">18:16</span>
								</div>
								<div className="chatterMessage clearfix">
									<p>从广西壮族自治区卫计委获悉，2017年广西将实现城市公立医院综合改革全覆盖，全面取消药品加成，实施药品零差率销售政策，破除以药补医机制。同时，广西卫生部门将继续严格控制医疗费用不合理增长，2017年广西公立医院医疗费用平均增长幅度控制在10%以下</p>
								</div>
							</li>
							<li className="leftSideChat">
								<span className="chatterFace"></span>
								<div className="chatterTop">
									<span className="chatterName">机智小狐狸</span>
									<span className="chatterIdentity">助理</span>
									<span className="sendtime">18:16</span>
								</div>
								<div className="chatterMessage clearfix">
									<p>去年湖北省高新技术产业实现增加值5574．54亿元，较上年增长13.9％，其中高新技术制造业实现增加值4761．62亿元，增长13％，高于同期工业增速5个百分点</p>
								</div>
							</li>
							<li className="leftSideChat">
								<span className="chatterFace"></span>
								<div className="chatterTop">
									<span className="chatterName">机智小狐狸</span>
									<span className="chatterIdentity">助理</span>
									<span className="sendtime">18:16</span>
								</div>
								<div className="chatterMessage clearfix">
									<p>去年湖北省高新技术产业</p>
								</div>
							</li>
							<li className="rightSideChat">
								<span className="chatterFace"></span>
								<div className="chatterTop">
									<span className="chatterName">张方海</span>
									<span className="chatterIdentity">老师</span>
									<span className="sendtime">18:16</span>
								</div>
								<div className="chatterMessage clearfix">
									<span className="chatterMessageImg"><img src="./assets/images/classroomPc/chatu.jpg" alt=""/></span>
								</div>
							</li>
						</ul>
					</div>
				</div>
	
				
				<div className="SendChatBox">
					<div className="SendChatContentTop">
						<span><img src="./assets/images/classroomPc/face.png" alt=""/></span><span><img src="./assets/images/classroomPc/A.png" alt=""/></span><span><img src="./assets/images/classroomPc/file.png" alt=""/></span><span><img src="./assets/images/classroomPc/pic.png" alt=""/></span>
					</div>
					<div className="SendChatContent">
						<textarea name="" id="SendChatContentTextarea" placeholder="我也说两句。。。" className="SendChatContentTextarea" maxlength="500" onkeyup="checkLen(this)"></textarea>
						<a href="javascript:void(0)" onclick="" className="sendBtn">发送</a>
						<span className="remainingWords">可输入<em id="count">500</em>个字</span>
					</div>
				</div>
			</div>

		)
	}
})