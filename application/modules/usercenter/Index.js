var ReactDOM = require('react-dom');
var AutoSignin = require('../../components/AutoSignin');
var UserInfo = require('./userinfo/Index');
var UserAsset = require('./UserAsset');
var UserCost = require('./UserCost');
var UserOrder = require('./UserOrder');
var UserSecurity = require('./usersecurity/Index');
var HeaderInfo = require('./components/HeaderInfo');
var Follow = require('./userinfo/Follow');
var CommonEvent = require('../../components/CommonEvent');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

var Main = React.createClass({
	load: function() {
		var pointer = Url.getParam('type');
		if (!pointer) pointer = 'userInfo';

        this.setState({loading: false, pointer: pointer});
	},
	setModule: function(result) {
		if (!result) return Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, '/live.html?adviser=' + Config.CACHE_DATA.USER._id);
		this.setState({pointer: result});
	},
	getModule: function() {
		switch (this.state.pointer) {
			case 'userInfo': return <UserInfo />;
			case 'userAsset': return <UserAsset />;
			case 'userCost': return <UserCost />;
			case 'userOrder': return <UserOrder />;
			case 'userSecurity': return <UserSecurity />;
			case 'follow': return <Follow />;
		}
	},
	componentWillMount: function() {
		this.state.columnList = [
			{text: '基本资料', name: 'userInfo'},
			{text: '投顾服务', name: null},
			{text: '我的资产', name: 'userAsset'},
			{text: '我的订单', name: 'userOrder'},
			{text: '消费明细', name: 'userCost'},
			{text: '安全设置', name: 'userSecurity'}
		];
	},
	login: function() {
        this.setState({loading: true, code: null});
        AutoSignin(function(result) {
            if (result.code != 200) return this.setState({loading: false, code: result.code});

            Interface.getProfile(this.load);
            Event.on('UrlChange' + Config.MODULE_NAME.USERCENTER, function(url) {
                if (!url) return this.forceUpdate();
                Url.setUrl(url);
                return this.load();
            }.bind(this));
        }.bind(this));
    },
	componentDidMount: function() {
		this.login();
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state != nextState;
	},
	componentWillReceiveProps: function(nextProps) {

	},
	getInitialState: function() {
		return {columnList: null, loading: true, follow: null};
	},
	render: function() {
		if (this.state.loading) return <Loading  />;
        if (this.state.code) return <Reload onReload={this.login} code={this.state.code} />;

		return <div className="user_info_box">
					<div className="left">
						<HeaderInfo pointer={this.state.pointer} onSelectModule={this.setModule} />
						<ul className="menu">
							{this.state.columnList.map(function(item, index) {
								if(Config.CACHE_DATA.USER.advisor_type != 2 && index == 1) return null;
								if(Config.CACHE_DATA.USER.advisor_type == 2 && (index == 2 || index == 3 || index == 4)) return null;
								return <li className={item.name == this.state.pointer ? 'selected' : ''} key={index}>
											<span onClick={this.setModule.bind(this, item.name)}><a href="javascript:;">{item.text}</a></span>
										</li>
							}.bind(this))}
						</ul>
					</div>
					<div className="right">
						{this.getModule()}
					</div>
					<CommonEvent />
				</div>;
	}
});

ReactDOM.render(<Main />, document.getElementsByClassName('main_wrap')[0]);