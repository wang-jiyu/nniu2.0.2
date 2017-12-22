var SmsHandle = require('../../../../handle/Sms');
module.exports = React.createClass({
    submit: function(e) {
        Forms.disableButton(this.refs.button);
        var data = e.target.data;
        SmsHandle.checkSms({mobile: this.props.data.mobile, code: data.code}, function(result) {
            if (result.code == 200)
                return this.props.onNext({token: result.data.token})
            this.setState({error: typeof result.code == 'number' ?
                Utils.getPromptInfo(result.code) : null
            }, function() {
                Forms.activeButton(this.refs.button);
                this.refs.code.value = '';
            }.bind(this));
        }.bind(this));
    },

    timing: function() {
        if (this.state.second == 0) return null;
        setTimeout(function() {
            if (this.state.second > 0 && this.isMounted()) this.setState({second: --this.state.second}, this.timing);
        }.bind(this), 1000);
    },

    sendAgain: function () {
        SmsHandle.resend(this.props.data.mobile, function(result) {
            if (result.code == 200)
                return this.setState({second: 60, error: '验证码发送成功，请查收!'}, function () {
                    this.timing();
                });
            this.setState({error: typeof result.code == 'number' ? Utils.getPromptInfo(result.code) : null}, function() {
                this.refs.code.value = '';
                Forms.activeButton(this.refs.button);
            }.bind(this));
        }.bind(this))
    },

    verifyError: function(e, tipText) {
        this.setState({error: tipText});
    },

    componentDidMount: function() {
        this.timing();
        $(this.refs.forms).on('VerifyError',  this.verifyError);
    },

    componentWillUnmount: function() {
        clearTimeout(this.timing);
        $(this.refs.forms).off('VerifyError');
    },

    getInitialState: function() {
        return {error: null, second: 60};
    },

    render: function() {
        return (
            <div className="reset_box">
                <h1>{this.props.data.mobile.substr(0, 3) + '****' + this.props.data.mobile.substr(-4)}</h1>
                {
                    this.state.second > 0 ?
                        <div className="sms_remark resend">请查收手机上收到的短信验证码，{this.state.second}秒后方可重发短信</div> :
                        <div className="sms_remark resend">请查收手机上收到的短信验证码，<a href="javascript:;" onClick={this.sendAgain}>重发短信</a></div>
                }
                <form onSubmit={this.submit} ref="forms">
                    <input type="text" maxLength="6"  ref="code" className="mobile" name="code" placeholder="请输入验证码"  data-required="true" data-name="验证码" />
                    {this.state.error != null ?  <p className="prompt">{this.state.error}</p> : null}
                    <input type="submit" value="下一步" ref="button" />
                </form>
            </div>
        )
    }
});