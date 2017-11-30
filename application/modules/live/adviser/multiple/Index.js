var Top = require('../components/Top');
var Bottom = require('../components/Bottom');
var VideoLive = require('../live/VideoLive');
var LiveHandle = require('../../../../handle/live/Index');

module.exports = React.createClass({
	addNotify: function() {
		var params = {ref_id: Config.CACHE_DATA.ROOM._id, ref_type: Config.CHANNEL_REF.ROOM};
		Forms.disableButton(this.refs.button);
		LiveHandle.addNotify(params, function(result) {
			Forms.activeButton(this.refs.button);
			if (result.code == 200) {
				Config.CACHE_DATA.ROOM.is_nofity = 1;
				result.data.type = Config.CHANNEL_TYPE.CHANNEL;
				var data = [result.data];
				Interface.pushMessage('Subscribe', data);
				this.forceUpdate();
			}
		}.bind(this));
	},
	removeNotify: function() {
		var params = {ref_id: Config.CACHE_DATA.ROOM._id, ref_type: Config.CHANNEL_REF.ROOM};
		Forms.disableButton(this.refs.button);
		LiveHandle.removeNotify(params, function(result) {
			Forms.activeButton(this.refs.button);
			if (result.code == 200) {
				Config.CACHE_DATA.ROOM.is_nofity = 0;
				result.data.type = Config.CHANNEL_TYPE.CHANNEL;
				var data = [result.data];
				Interface.pushMessage('Unsubscribe', data);
				this.forceUpdate();
			}
		}.bind(this));
	},
    render: function() {
        return <div className="live_box multiple_box">
					<div className="video_live">
						<Top />
						<div className="teacher_info">
							<div className="info_box">
								<img src={Config.CACHE_DATA.ROOM.thumbnail} />
								<div className="info">
									<div className="detail">
										<label className="name">{Config.CACHE_DATA.ROOM.title}</label>
										<label className="introduction">{Config.CACHE_DATA.ROOM.description}</label>
									</div>
									<div className="btn_box multiple_btn_box">
									 
									 {
										Config.CACHE_DATA.ROOM.is_nofity ?
										<input type="button" value="取消开播提醒" className="small dark_blue" onClick={this.removeNotify} ref="button"/> : 
										<input type="button" value="开播提醒" className="small" onClick={this.addNotify} ref="button"/>
									 }
									</div>
								</div>
							</div>
							<div className="multiple_teacher_info">
								<h4>主讲老师</h4>
								<ul className="multiple_teacher_list clearfix">
									{
										// Config.CACHE_DATA.ROOM.advisor.map(function (item, index) {
										// 	return <li key={index}><a title={item.name} href="javascript:;"><img src={item.avatar}/></a></li>
										// })
									}
								</ul>
							</div>
						</div>
						<VideoLive />
						<Bottom />
					</div>
				</div>;
    }
});