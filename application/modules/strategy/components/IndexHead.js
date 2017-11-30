if (Url.getParam("postion") == 'my') {
	var wo = 'active';
	var liang = ' ';
} else if (Url.getParam("postion") == 'index') {
	var liang = 'active';
	var wo = ' ';
};
var tabs = [{
	name: '量化策略',
	className: 'liang ' + liang,
	url: '/strategyIndex.html?postion=index'
}, {
	name: '我的',
	className: 'wo ' + wo,
	url: '/myYesSubscribeStrategy.html?postion=my'
}]
module.exports = React.createClass({
	getInitialState: function() {
		return {
			source: Config.CACHE_DATA.USER
		};
	},
	render: function() {
		return (
			<div className="index-head">
				<div className="header">
			        <div className="header-left">
			        {
			        	tabs.map(function(item,index){
			        		return <a href={item.url} className={item.className}>{item.name}</a>
			        	})
			        }
			        </div>
			        <div className="header-right">
			            <a className="geren">{Config.CACHE_DATA.USER.name}</a>
			            <a className="app-download">
			                <img src="assets/images/strategy/index/iphone.png" alt="手机"/>
			                <span>APP下载</span>
			                <div className="two-dimension-code">
			                    <img src="assets/images/strategy/index/code.png" alt="下载"/>
			                    <div className="download-desc">
			                        <p>扫一扫下载APP</p>
			                        <p>随时随地看策略</p>
			                    </div>
			                    <div className="sanjiao"></div>
			                </div>
			            </a>
			        </div>
			    </div>
			     <div className="banner-img">
        				<img src="assets/images/strategy/index/banner.png" alt="产品" />
    			</div>
			</div>
		)
	}
})