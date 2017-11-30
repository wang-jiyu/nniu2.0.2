var SmsHandle = require('../../../handle/Sms');
var BindMobile = require('./BindMobile');
var SubmitSuccess = require('../../../components/common/SubmitSuccess');
var UserCenterHandle = require('../../../handle/usercenter/UserCenter');

module.exports = React.createClass({
    refreshCaptcha: function() {
        this.setState({captcha: Utils.getCaptcha()});
    },
    bindSuccess: function(result) {
        this.props.onChange(result);
        this.setState({success: true, verify: false});
    },
    submit: function(e) {
        Forms.disableButton(this.refs.submit);
        var params = {captcha_code: e.target.data.picture_code, mobile: e.target.data.mobile, password: Utils.md5(e.target.data.password, 16), type: 1};
        SmsHandle.getMobileToken(params, function(result) {
            if (result.code == 200) {
                this.setState({verify: {mobile: params.mobile, token: result.data.token}});
            } else {
                this.setState({error: result.code, captcha: Utils.getCaptcha()}, function() {
                    this.refs.code.value = '';
                    Forms.activeButton(this.refs.submit);
                }.bind(this));
            }
        }.bind(this))
    },
    formChange: function(e) {
        Forms.restrict(e.target, function(data) {
            this.setState(data);
        }.bind(this));
    },
    componentDidMount: function() {
        //Utils.setPosition(this.refs.title, -1);
        this.refs.password.focus();
    },

    getInitialState: function() {
        return {success: false, captcha: Utils.getCaptcha(), verify: false};
    },
    render: function() {
        if (this.state.success) return <SubmitSuccess text={'手机认证成功'} style={{marginTop: '50px'}} />;
        return (<div className={this.props.bindClass ? 'user_mobile_box ' + this.props.bindClass : 'user_mobile_box'}>
					{this.props.tootip}
					{
						this.state.verify ?
						<BindMobile verify={this.state.verify} onChange={this.bindSuccess} /> :
						 <form onSubmit={this.submit} ref="forms">
							<input name="password" data-required="required" type="password" placeholder="请输入登录密码" ref="password" />
							<div className="code_box">
								<input className="white" name="mobile" data-required="required" data-type="mobile" type="text" placeholder="请输入手机号" />
								<div className="code">
									<input name="picture_code" data-required="required" type="text" maxLength="4" placeholder="请输入图片验证码" ref="code" />
									<img src={this.state.captcha} onClick={this.refreshCaptcha} alt="" />
								</div>
							</div>
							{typeof(this.state.error) == 'number' &&  <p className="prompt">{Utils.getPromptInfo(this.state.error)}</p>}
							<input type="submit" value="下一步" />
						</form>
					}
                </div>);
    }
});