var ReactDOM = require('react-dom');

var AutoSignin = require('../../components/AutoSignin');
var CommonEvent = require('../../components/CommonEvent');
var News = require('./news/Index');
var Journal = require('./journal/Index');
var Calendar = require('./calendar/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

var Main = React.createClass({
	gotoNews: function(item) {
		Event.trigger('UrlChange' + Config.MODULE_NAME.NEWS, '/news.html?type=' + item._id);
	},
	getModule: function() {
		switch (this.state.pointer) {
			case '64a080de0cbad36ab607f5d6': return <Calendar key={this.state.key}  />;
			case '4abaa8740a819b2e7737f57b': return <Journal key={this.state.key} />;
			default: return <News key={this.state.key} />;
		}
	},
	load: function() {
		var type = Url.getParam('type');
		var pointer = this.state.nav[0]._id;
		if (type) pointer = type;
		this.setState({loading: false, pointer: pointer});
	},
	login: function() {
        this.setState({loading: true, code: null});
        AutoSignin(function(result) {
            if (result.code != 200) return this.setState({loading: false, code: result.code});
            Interface.getProfile(this.load);
            Event.on('UrlChange' + Config.MODULE_NAME.NEWS, function(url) {
                if (!url) return this.forceUpdate();
                this.state.key++;
                Url.setUrl(url);
                return this.load();
            }.bind(this));
        }.bind(this));
    },
    componentDidMount: function() {
		this.login();
	},
    getInitialState: function() {
		var nav = [{name: '财经头条', _id: '43a58de05457647be46cf5ee'}, {name: '财经日历', _id: '64a080de0cbad36ab607f5d6'}, {name: '首证期刊', _id: '4abaa8740a819b2e7737f57b'}];
        return {loading: true, code: null, nav: nav, key: 0};
    },
    render: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.login} code={this.state.code} />;
		return <div className="full_wrap">
					<ul className="news_nav_box">
						{this.state.nav.map(function(item) {
							return <li className={this.state.pointer == item._id ? 'selected' : ''} key={item._id} onClick={this.gotoNews.bind(this, item)}>{item.name}</li>
						}.bind(this))}
					</ul>
					{this.getModule()}
					<CommonEvent />
				</div>;
	 }
});

ReactDOM.render(<Main />, document.getElementsByClassName('main_wrap')[0]);