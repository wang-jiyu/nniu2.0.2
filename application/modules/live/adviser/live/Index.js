var VideoLive = require('./VideoLive');
var TextLive = require('./TextLive');
var HistoryLive = require('./HistoryLive');

var LiveHandle = require('../../../../handle/live/Index');

module.exports = React.createClass({
	upVip: function() {
		Interface.popWin('升级会员', '/tool.html?tool=vip', {
			width: 750,
			maxHeight: 790,
			top: 30,
			bottom: 30,
			align: 'center',
			valign: 0.4
		});
	},
	getVideo: function() {
		return <VideoLive onChange={this.gotoHistory} history={this.state.history} />;
	},
	getText: function() {
		return <TextLive onChange={this.gotoHistory} history={this.state.history} isVip={this.props.isVip}/>;
	},
	gotoHistory: function() {
		this.setState({
			history: null,
			isList: true
		});
	},
	gotoMessage: function(history) {
		this.setState({
			history: history,
			isList: false
		});
	},
	getModule: function() {
		if (this.state.isList) return <HistoryLive onChange={this.gotoMessage} />;
		if (this.state.room.type == 11) return this.getVideo();
		return this.getText();
	},
	componentDidMount: function() {
		if (this.state.room._id) LiveHandle.joinRoom(this.state.room._id);
	},
	getInitialState: function() {
		return {
			room: Config.CACHE_DATA.ROOM,
			history: null,
			isList: false
		};
	},
	render: function() {
		if (!Config.CACHE_DATA.ROOM._id) return <div className="graphic_box not_open">
									             			<i></i>
									                 		<p>暂未开通直播，敬请期待</p>
									             		</div>;

		if (!Vip.chechAuth(Config.CACHE_DATA.ROOM.group_limit) && !LiveHandle.isRoomOwner() && Config.CACHE_DATA.ROOM.status != 0 && !this.state.isList) {
			return <div className={this.state.room.type == 1 ? 'live_info_box graphic_vip' : 'graphic_box graphic_vip'}>
						<i></i>
						<p>会员等级不足，请升级到{Vip.getWeightItem(Config.CACHE_DATA.ROOM.group_limit, 'name')}后观看</p>
						<input type="button" value="升级会员" onClick={this.upVip} />
					</div>;
		}
		return this.getModule();
	}
});