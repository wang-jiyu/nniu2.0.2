var ReactDOM = require('react-dom');
var AutoSignin = require('../../components/AutoSignin');
var AusleseTips = require('./AusleseTips');
var Reference = require('./Reference');
var More = require('./More');
var Assemble = require('./Assemble');
var Advert = require('../../components/common/Advert');
require('../../components/CommonEvent');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

var Main = React.createClass({

    openModule: function(type) {
        if (Url.getParam('type')) Event.trigger('SetUrl', location.pathname);
        this.setState({pointer: type});
    },

    success: function () {
        this.login(true);
    },

    login: function(flag) {
        if (flag) this.setState({loading: true});
        AutoSignin(function(result) {
            if (result.code == 200) {
                return Interface.getProfile(function() {
                    return this.setState({loading: false, code: null});
                }.bind(this));
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this));
    },

    focusChange: function() {
        if (Interface.isFocus()) return null;
        this.openModule('index');
        $(window).scrollTop(0);
    },

    refreshModule: function() {
        this.forceUpdate();
    },

    setUrl: function(url) {
        history.pushState(null, null, url);
        this.refreshModule();
    },

    componentDidMount: function() {
        Event.on('UrlChange' + Config.MODULE_NAME.JEWEL, function(url) {
            if (!url) return this.forceUpdate();
            Url.setUrl(url);
            return this.login(false);
        }.bind(this));

        this.login(true);
        Event.on('PaySuccess', this.success);
        Event.on('FocusChange', this.focusChange);
        Event.on('SetUrl', this.setUrl);
    },

    componentWillUnmount: function () {
        Event.off('PaySuccess', this.success);
        Event.off('FocusChange', this.focusChange);
        Event.off('SetUrl', this.setUrl);
    },

    getInitialState: function() {
        return {loading: true, code: null, pointer: 'index'}
    },

    render: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.login.bind(this, true)} code={this.state.code} />;
        if (Url.getParam('type') == 'tips' || this.state.pointer == 'moretips') return <More openModule={this.openModule} type={1}  />;
        if (Url.getParam('type') == 'reference' || this.state.pointer == 'morereferences') return <More openModule={this.openModule} type={2} />;
        return (
            <div className="treasure_chest_box">
                <div className="promotion_box">
                    <div className="promotion">
                        <Advert position={7} data={this.state.source} width="100%" height="430"  />
                        <Assemble />
                    </div>
                </div>
                <AusleseTips openModule={this.openModule} />
                <Reference openModule={this.openModule} />
            </div>
        )
    }
});

ReactDOM.render(<Main />, document.getElementsByClassName('main_wrap')[0]);