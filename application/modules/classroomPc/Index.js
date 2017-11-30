var ReactDOM = require('react-dom');
var GoldenShares = require('./components/GoldenShares');
var PcCourses = require('./components/PcCourses');
var ClassroomChatPc = require('./components/ClassroomChatPc');
var LivePlayPc = require('./components/LivePlayPc');
var ClassHandle = require('../../handle/newClass');
var AutoSignin = require('../../components/AutoSignin');
var ClassroomPc = React.createClass({
	getSystemList: function(objParam) {
		var obj = objParam || {}
		ClassHandle.getSystemDataList(obj, function(result) {
			console.log(result);
			if (result.code === 200) {
				console.log(result.data.system_lessons);
				this.setState({
					systemData: result.data.system_lessons
				});
				if (this.state.combatData.length <= 0) {
					var videoArray = [];
					if (result.data.system_lessons[0].video_url) {
						videoArray.push(result.data.system_lessons[0].video_url);
						this.setState({
							liveStatus: result.data.system_lessons[0].live_status
						});
						this.setState({
							liveStatus: 1
						});
					} else {
						videoArray.push(result.data.system_lessons[0].flv_url);
						videoArray.push(result.data.system_lessons[0].hls_url);
						videoArray.push(result.data.system_lessons[0].rtmp_url);
						this.setState({
							liveStatus: 1
						});
					}
					this.setState({
						video: videoArray
					});
				}
			}
		}.bind(this));
	},
	getRecommendStock: function(objParam) {
		console.log(objParam.transcribeVideo)
		var obj = {
			lesson_guid: objParam.lesson_guid,
			course_guid: objParam.course_guid
		};
		ClassHandle.getClassRecommendStock(obj, function(result) {
			if (result.code === 200) {
				this.setState({
					recommendStock: result.data
				});
			}
		}.bind(this));
		var videoArray = [];
		if (objParam.transcribeVideo) {
			videoArray.push(objParam.transcribeVideo);
		} else {
			videoArray.push(objParam.liveVideo);
		}
		this.setState({
			video: videoArray,
			channels_id: objParam.channels_id,
			lesson_guid: objParam.lesson_guid
		});
	},
	getCombatList: function(objParam, fun) {
		var obj = objParam || {};
		ClassHandle.getCombatMinutia(obj, function(result) {
			if (result.code === 200) {
				console.log(result);
				if (result.data.practical_lessons.length > 0) {
					this.setState({
						combatData: result.data.practical_lessons
					});
					fun({
						lesson_guid: result.data.practical_lessons[0]._id,
						course_guid: result.data.practical_lessons[0].course_id,
						channels_id: result.data.practical_lessons[0].channels_id
					});
					var videoArray = [];
					if (result.data.practical_lessons[0].video_url) {
						videoArray.push(result.data.practical_lessons[0].video_url);
						this.setState({
							liveStatus: result.data.practical_lessons[0].live_status
						});
					} else {
						videoArray.push(result.data.practical_lessons[0].flv_url);
						videoArray.push(result.data.practical_lessons[0].hls_url);
						videoArray.push(result.data.practical_lessons[0].rtmp_url);
						this.setState({
							liveStatus: 1
						});
					}
					this.setState({
						video: videoArray
					});
				}
			}
		}.bind(this));
	},
	componentWillMount: function() {
		AutoSignin(function(result) {
			if (result.code == 200) {
				return Interface.getProfile(function() {
					var info = {};
					info.class_id = Url.getParam('id');
					this.getCombatList(info, function(obj) {
						// this.getRecommendStock(obj);
					}.bind(this));
					/*this.getSystemList({
						course_guid: info.class_id
					});*/
				}.bind(this));

			}
		}.bind(this));

	},
	componentDidMount: function() {

	},
	componentDidUpdate: function() {},
	getInitialState: function() {
		return ({
			chatStatus: false,
			combatData: []
		})
	},
	render: function() {
		return (
			<div>
				<LivePlayPc />
				<GoldenShares />
				{this.state.chatStatus?<ClassroomChatPc />:<PcCourses combatData={this.state.combatData}/>}
			</div>
		)
	}

});
ReactDOM.render(<ClassroomPc />, document.getElementsByClassName('main_wrap')[0]);