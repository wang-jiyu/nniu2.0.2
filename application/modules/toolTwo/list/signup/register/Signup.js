var RegisterHandle = require('../../../../../handle/signup/Register');
var SmsHandle = require('../../../../../handle/Sms');
var Rule = require('./rule');

module.exports = React.createClass({
    rule: function() {
        Event.trigger('OpenDialog', {module: <Rule />, title: '用户注册服务协议', width: 400, height: 480});
    },
    submit: function(e) {
        Forms.disableButton(this.refs.button);
        var data = e.target.data;
        data.type = 1;
        SmsHandle.getMobileCode(data, function(result) {
            if (result.code == 200) return this.props.next(data);
            var param = {error: typeof result.code == 'number' ? Utils.getPromptInfo(result.code) : null, captcha: Math.random()};
            this.setState(param, function() {
                this.refs.code.value = '';
                Forms.activeButton(this.refs.button);
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

    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state != nextState;
    },

    getInitialState: function() {
        return {captcha: Math.random(), error: null, source: this.props.source || {}};
    },

    render: function() {
        return (<form onSubmit={this.submit} ref="forms">
				<input type="text" name="name" placeholder="输入您的名字" data-required="true" defaultValue={this.state.source.name} data-name="用户名" maxLength="12"  minLength="2" />
				<input type="password" name="password" autoComplete="new-password" placeholder="请设置4-20位登录密码" maxLength="20" data-type="password" data-required="true" defaultValue={this.state.source.password} data-name="登录密码" />
				<div className="code_box">
					<input type="text" className="mobile" name="mobile" placeholder="输入手机号码" data-type="mobile" maxLength="11" data-required="true" defaultValue={this.state.source.mobile} data-name="手机号码"  />
					<div className="code">
						<input type="text" ref="code"  name="captcha_code" maxLength="4" placeholder="输入图片验证码" data-required="true" data-name="图片验证码" />
						<img src={Utils.getCaptcha(this.state.captcha)} onClick={this.changeCaptch} />
					</div>
				</div>
                {this.state.error != null ? <p className="prompt">{this.state.error}</p> : null}
				<div className="remark">点击下一步表示您已阅读并同意《<a href="javascript:;" onClick={this.rule}>用户注册服务协议</a>》</div>
				<input type="submit" value="下一步" ref="button" />
			</form>);
    }
});