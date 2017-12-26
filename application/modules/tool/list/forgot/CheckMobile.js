var SmsHandle = require('../../../../handle/Sms');
module.exports = React.createClass({
    submit: function(e) {
        Forms.disableButton(this.refs.button);
        var data = e.target.data;
        data.type = 3;
        SmsHandle.getMobileCode(data, function(result) {
            if (result.code == 200)  return this.props.onNext({captcha_code: data.captcha_code, mobile: data.mobile});
            var param = {error: typeof result.code == 'number' ? Utils.getPromptInfo(result.code) : null, captcha: Math.random()};
            this.setState(param, function() {
                Forms.activeButton(this.refs.button);
                this.refs.code.value = '';
            }.bind(this));
        }.bind(this));
    },

    changeCaptch: function() {
        this.setState({captcha: Math.random()}, function() {
            this.refs.code.value = '';
            this.refs.code.focus();
        }.bind(this));
    },

    verifyError: function(e, tipText) {
        this.setState({error: tipText});
    },

    componentDidMount: function() {
        $(this.refs.forms).on('VerifyError',  this.verifyError);
    },

    componentWillUnmount: function() {
        $(this.refs.forms).off('VerifyError');
    },

    getInitialState: function() {
        return {captcha: Math.random(), error: null};
    },

    render: function() {
        return (
            <div className="reset_box">
                <h1 className="check_mobile_title">通过手机号找回密码</h1>
                <form onSubmit={this.submit} ref="forms">
                    <input type="text" className="mobile" name="mobile" placeholder="请输入手机号码"
                           data-type="mobile" maxLength="11" data-required="true" data-name="手机号码"/>
                   <div className="code_box">
                        <div className="code">
                            <input type="text" maxLength="4"  name="captcha_code" ref="code" placeholder="输入图片验证码"
                                   data-required="true"  data-name="图片验证码"/>
                            <img src={Utils.getCaptcha(this.state.captcha)} onClick={this.changeCaptch} />
                        </div>
                       {this.state.error != null ? <p className="prompt">{this.state.error}</p> : null}
                       <input type="submit" value="下一步" ref="button" />
                    </div>
                </form>
            </div>
        )
    }
});