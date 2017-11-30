require('../../components/CommonEvent');
var ReactDOM = require('react-dom');
var AutoSignin = require('../../components/AutoSignin');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');
var List = require('./List');
var Main = require('./Main');
var Intro = require('./Intro');
var More = require('./More');
var MoreGoodness = require('./MoreGoodness');

var ClassRoom = React.createClass({
	load: function(flag) {
		if (flag) this.setState({loading: true});
        AutoSignin(function(result) {
            if (result.code == 200) {
                return this.setState({loading: false, code: null }, function() {
                    Interface.getProfile(function(result) {});
                }.bind(this))
            }
            return this.setState({loading: false, code: result.code })
        }.bind(this));
    },

    getBackValue: function(type) {
        if (type == 'moregood' || (this.state.back && type == 'intro') || (this.state.back && type == 'list')) return true;
        return false;
    },

    openCourse: function(item, type, index) {
        if (Url.getParam('id')) Event.trigger('SetUrl', location.pathname);
	    index = typeof index == 'number' ? index : 0;
		var pointer = type;
		if (type == 'goodness' && item.is_pay) {pointer = 'list';}
        if (type == 'goodness' && !item.is_pay) {pointer = 'intro';}
        var params = item ? {item: item, pointer: pointer, index: index, flag: false, back: this.getBackValue(type)} : {pointer: pointer, flag: false, back: this.getBackValue(type)};
        this.setState(params);
    },

    updateView: function() {
        this.forceUpdate();
        var windowState = Interface.getWindowState();
        var windowIsVisible = windowState == 3 || windowState == 5;
        if (!Interface.isFocus() || !windowIsVisible) return null;
    },

    refreshModule: function() {
        this.forceUpdate();
    },

    setUrl: function(url) {
        history.pushState(null, null, url);
        this.refreshModule();
    },

    componentDidMount: function() {
        this.load(false);
        Event.on('SetUrl', this.setUrl);
        Event.on('FocusChange', this.updateView);
    },

    componentWillUnmount: function() {
        Event.off('FocusChange', this.updateView);
        Event.off('SetUrl', this.setUrl);
    },

	getInitialState: function() {
		return {pointer: 'main', item: {}, loading: true, code: null, index: 0, flag: true, back: false}
	},

	render: function() {
        if (!Interface.isFocus()) return null;
        var id = Url.getParam('id');
        var advisorId = Url.getParam('advisorId');
        var is_pay = Url.getParam('status');
        is_pay = (is_pay == 2 || is_pay == 4 || is_pay == 5) ? 1 : 0;
        if (id && advisorId && this.state.flag) {
            var item = {
                _id: id,
                is_pay: is_pay,
                advisor:{
                    _id: advisorId,
                    advisor_type : Url.getParam('advisorType')
                }
            };
            return <Intro openCourse={this.openCourse} item={item} />;
        }
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load.bind(this, true)} code={this.state.code} />;
        if (this.state.pointer == 'moregood') return <MoreGoodness openCourse={this.openCourse} />;
        if (this.state.pointer == 'play') return <More openCourse={this.openCourse} item={this.state.item} index={this.state.index} />;
        if (this.state.pointer == 'more') return <More openCourse={this.openCourse} />;
        if (this.state.pointer == 'backmore') return <List openCourse={this.openCourse} item={this.state.item} />;
		if (this.state.pointer == 'intro') {
			if(this.state.item.advisor && this.state.item.advisor._id == Config.CACHE_DATA.USER._id) {
				return <List openCourse={this.openCourse} item={this.state.item} backpath='moregood' />;
			}
			return <Intro openCourse={this.openCourse}  item={this.state.item} back={this.state.back} />;
		}
		if (this.state.pointer == 'list') return <List openCourse={this.openCourse} item={this.state.item} back={this.state.back} />;
        return <Main openCourse={this.openCourse} />;
	}
});

ReactDOM.render(<ClassRoom />, document.getElementsByClassName('main_wrap')[0]);