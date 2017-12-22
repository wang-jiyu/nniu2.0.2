var TimeCounts = require('./TimeCounts');
var SmsHandle = require('../../../handle/Sms');
var UserCenterHandle = require('../../../handle/usercenter/UserCenter');

module.exports = React.createClass({
    submit: function(e) {
        Forms.disableButton(this.refs.submit);
        var params = {code: e.target.data.code, token: this.props.verify.token};
        UserCenterHandle.updateEmail(params, function(result) {
            if (result.code == 200) {
                Interface.getProfile(function() {
                    this.props.onChange(Config.CACHE_DATA.USER);
                }.bind(this), true);
                /*Config.CACHE_DATA.USER.email = this.props.verify.email;
                this.props.onChange(Config.CACHE_DATA.USER);*/
            } else {
                this.setState({error: result.code}, function() {
                    this.refs.code.value = '';
                    Forms.activeButton(this.refs.submit);
                }.bind(this));
            }
        }.bind(this))
    },
    componentDidMount: function() {
        //Utils.setPosition(this.refs.title, -1);
        this.refs.code.focus();
    },

    getInitialState: function() {
        return {};
    },
    render: function() {
        return (
            <div className="bind_email_box">
                <div className="bind_email_title">
                    <p className="email">{this.props.verify.email}</p>
                    <p>请查收邮箱上收到的验证码</p>
                </div>
                <form onSubmit={this.submit}>
                    <input name="code" required="required" type="text" placeholder="请输入验证码" ref="code" />
                    {typeof(this.state.error) == 'number' &&  <p className="prompt">{Utils.getPromptInfo(this.state.error)}</p>}
                    <input type="submit" value="下一步" ref="submit" />
                </form>
            </div>);
    }
});