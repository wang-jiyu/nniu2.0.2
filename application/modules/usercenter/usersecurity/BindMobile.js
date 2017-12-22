var TimeCounts = require('./TimeCounts');
var SmsHandle = require('../../../handle/Sms');
var UserCenterHandle = require('../../../handle/usercenter/UserCenter');

module.exports = React.createClass({
    resendCodeClick: function(callback) {
        SmsHandle.resend({mobile: this.props.mobile}, function(result) {
            callback(result);
        })
    },
    submit: function(e) {
        Forms.disableButton(this.refs.submit);
        var params = {code: e.target.data.code, mobile: this.props.verify.mobile, token: this.props.verify.token};
        UserCenterHandle.setMobile(params, function(result) {
            if (result.code == 200) {
                return Interface.getProfile(function() {
                    this.props.onChange(Config.CACHE_DATA.USER);
                }.bind(this), true);
            } 
			this.setState({error: result.code}, function() {
				this.refs.code.value = '';
				Forms.activeButton(this.refs.submit);
			}.bind(this));
        }.bind(this))
    },
    componentDidMount: function() {
        this.refs.code.focus();
    },
    getInitialState: function() {
        return {error: null};
    },
    render: function() {
        return (
            <div className="bind_mobile_box">
                <TimeCounts phone={this.props.verify.mobile} onClick={this.resendCodeClick} />
                <form onSubmit={this.submit}>
                    <input name="code" data-required="required" type="text" placeholder="请输入验证码" ref="code" />
                    {typeof(this.state.error) == 'number' &&  <p className="prompt">{Utils.getPromptInfo(this.state.error)}</p>}
                    <input type="submit" value="下一步" ref="submit" />
                </form>
            </div>);
    }
});