var RegisterHandle = require('../../../../../handle/signup/Register');
var SmsHandle = require('../../../../../handle/Sms');

module.exports = React.createClass({
	resend: function(e) {
		SmsHandle.resend(this.state.source.mobile, function(result) {
            Forms.activeButton(this.refs.button);
            if (result.code == 200)
                return this.setState({second: 60, error: '验证码发送成功，请查收!'}, function () {
                    this.timing();
                }.bind(this));
            this.setState({error: typeof result.code == 'number' ?
                Utils.getPromptInfo(result.code) : null}, function() {
                this.refs.code.value = '';
            }.bind(this));
		}.bind(this));
	},


	siginup: function(token) {
		var params = {token: token, name: this.state.source.name, password: Utils.md5(this.state.source.password, 16)};
		RegisterHandle.siginup(params, function(result) {
			if (result.code == 200) return this.props.next({mobile: this.state.source.mobile, password: params.password});
            this.setState({error: typeof result.code == 'number' ?
                Utils.getPromptInfo(result.code) : null}, function() {
                Forms.activeButton(this.refs.button);
                this.refs.code.value = '';
            }.bind(this));
		}.bind(this));
	},

	submit: function(e) {
        Forms.disableButton(this.refs.button);
		var params = {mobile: this.state.source.mobile, code: e.target.data.code};
		SmsHandle.checkSms(params, function(result) {
			if (result.code == 200) return this.siginup(result.data.token);
            this.setState({error: typeof result.code == 'number' ?
                Utils.getPromptInfo(result.code) : null
            }, function() {
                Forms.activeButton(this.refs.button);
                this.refs.code.value = '';
            }.bind(this));
		}.bind(this))
	},

	timing: function() {
		if (this.state.second == 0) return null;
		setTimeout(function() {
			if (this.state.second > 0 && this.isMounted()) this.setState({second: --this.state.second}, this.timing);
		}.bind(this), 1000);
	},

    verifyError: function(e, tipText) {
        this.setState({error: tipText});
    },

    componentDidMount: function() {
        this.timing();
        $(this.refs.forms).on('VerifyError',  this.verifyError);
    },

    componentWillUnmount: function() {
        $(this.refs.forms).off('VerifyError');
    },

    shouldComponentUpdate: function(nextProps, nextState) {
		return this.state != nextState;
	},

	getInitialState: function() {
		return {source: this.props.source, second: 60, error: null};
	},

	render: function() {
		return <form onSubmit={this.submit} ref="forms">
					<div className="number">{this.state.source.mobile.substr(0, 3) + '****' + this.state.source.mobile.substr(-4)}</div>
					{
						this.state.second > 0 ? 
						<div className="sms_remark resend">请查收手机上收到的短信验证码，{this.state.second}秒后方可重发短信</div> : 
						<div className="sms_remark resend">请查收手机上收到的短信验证码，<a href="javascript:;" onClick={this.resend}>重发短信</a></div>
					}
					<input type="text" ref="code"  name="code" placeholder="输入验证码" data-required="true" data-name="验证码" />
            		{this.state.error != null ?  <p className="prompt">{this.state.error}</p> : null}
					<input type="submit" value="下一步" ref="button" />				
				</form>;
	}
});