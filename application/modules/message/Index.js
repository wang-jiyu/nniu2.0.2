var ReactDOM = require('react-dom');
var AutoSignin = require('../../components/AutoSignin');
var CommonEvent = require('../../components/CommonEvent');
var SessionList = require('./SessionList');
var Expert = require('./mode/Expert');
var Consult = require('./mode/Consult');
var Remind = require('./mode/Remind');
var Complain = require('./mode/Complain');
var Discuss = require('./mode/Discuss');
var System = require('./mode/System');
var Socket = require('../../components/Socket');
var ChatList = require('../../components/common/ChatList');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

var LiveHandle = require('../../handle/live/Index');


var Main = React.createClass({
	load: function() {
		this.subscribe();
		LiveHandle.getNotifyList(function(result) {
			if (result.code == 200 && result.data.length > 0) {
				Event.trigger('Subscribe', result.data);
			}
			this.setState({
				loading: false
			});
		}.bind(this));
	},
	subscribe: function() {
		Event.trigger('Subscribe', [{
			type: 2,
			channel: Config.CACHE_DATA.USER._id
		}]);
	},
	resubscribe: function() {
		LiveHandle.getNotifyList(function(result) {
			if (result.code == 200 && result.data.length > 0) {
				var data = $.map(result.data, function(item) {
					var channelName = Utils.getChannelId(item.channel, item.type);
					if (!Socket.channelList[channelName]) return item;
				});
				if (data.length > 0) Event.trigger('Subscribe', data);
			}
		}.bind(this));
	},
	select: function(item) {
		if (typeof(item) == 'string') {
			this.state.sessions[item] = true;
			return this.setState({
				pointer: item
			});
		}

		var pointer = item._id;
		this.state.sessions[pointer] = item;
		this.setState({
			pointer: pointer
		});
	},
	getModule: function(moduleName) {
		switch (moduleName) {
			case 'complain':
				return <Complain />;
			case 'expert':
				return <Expert />;
			case 'remind':
				return <Remind />;
			case 'consult':
				return <Consult />;
			case 'system':
				return <System />;
		}
		return <Discuss source={this.state.sessions[this.state.pointer]} pointer={this.state.pointer} />;
	},
	login: function() {
		this.setState({
			loading: true,
			code: null
		});
		AutoSignin(function(result) {
			if (result.code != 200) return this.setState({
				loading: false,
				code: result.code
			});
			Interface.getProfile(this.load);
			Event.on('UrlChange' + Config.MODULE_NAME.MESSAGE, function(url) {
				if (!url) return this.forceUpdate();
				Url.setUrl(url);
				return this.load();
			}.bind(this));
		}.bind(this));
	},
	componentDidMount: function() {
		this.login();
		Event.on('PaySuccess', this.resubscribe);
		Event.on('NewMessage', function(data) {
			this.refs.sessionList && this.refs.sessionList.receiveData(data);
			Event.trigger('ChatMessage' + data.ref_id + data.ref_type, data.messages[0], data.md5);
		}.bind(this));
	},
	getInitialState: function() {
		return {
			loading: true,
			code: null,
			pointer: null,
			sessions: {}
		};
	},
	render: function() {
		if (this.state.loading) return <Loading />;
		if (this.state.code) return <Reload onReload={this.login} code={this.state.code} />;
		var sessionList = Object.keys(this.state.sessions);
		console.log(this.state.sessions);
		console.log(this.state.pointer);
		return <div className="message_box">
					<SessionList pointer={this.state.pointer} onSelect={this.select} ref="sessionList" />
					<div className="message_view">
						{sessionList.map(function(key) {
							return <div className={this.state.pointer == key ? 'message_right_item visibility' : 'message_right_item'} key={key}>
										{this.getModule(key)}
									</div>
						}.bind(this))}
						
					</div>
					<CommonEvent />
				</div>;
	}
});

ReactDOM.render(<Main />, document.getElementsByClassName('main_wrap')[0]);