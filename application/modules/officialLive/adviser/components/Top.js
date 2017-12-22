module.exports = React.createClass({
	
	goTo: function(type) {
        Interface.gotoLeftNavView(Config.MODULE_NAME.JEWEL, '/jewel.html?type=' + type);
    },
	
	render: function() {
		return <ul className="guide">
				<li>
					<a href="javascript:;" onClick={function() { 
					Event.trigger('UrlChange' + Config.MODULE_NAME.LIVE, '/live.html');}}>返回首页</a>
				</li>
				<li>
					<a href="javascript:;" onClick={this.goTo.bind(this, 'tips')}>锦囊列表</a>
				</li>
				<li>
					<a href="javascript:;" onClick={this.goTo.bind(this, 'reference')}>内参列表</a>
				</li>
				{Config.CACHE_DATA.USER.advisor_type == 2 ? null :
					<li>
					<a href="javascript:;" onClick={function() { Interface.gotoLeftNavView(Config.MODULE_NAME.USERCENTER, '/user_center.html?type=userAsset');}}>我的资产</a>
					</li>
				}

				<li>
					<a href="javascript:;" onClick={function() { Interface.gotoLeftNavView(Config.MODULE_NAME.USERCENTER, '/user_center.html?type=follow');}}>我的关注</a>
				</li>
			</ul>;
	}
});