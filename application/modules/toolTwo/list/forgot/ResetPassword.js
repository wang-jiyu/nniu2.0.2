var FotgotHandle = require('../../../../handle/signup/Forgot');
module.exports = React.createClass({

    submit: function(e) {
        Forms.disableButton(this.refs.button);
        var data = e.target.data;
        var params = {password: Utils.md5(data.password, 16), token: this.props.data.token};
        FotgotHandle.resetPassword(params, function(result) {
            if (result.code == 200) return this.props.onNext({password: params.password});
            this.setState({error: typeof result.code == 'number' ?
                Utils.getPromptInfo(result.code) : null
            }, function() {
                Forms.activeButton(this.refs.button);
                this.refs.password.value = '';
            }.bind(this));
        }.bind(this));
    },

    changeShow: function() {
        this.setState({flag: !this.state.flag});
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
        return {error: null, flag: true};
    },

    render: function() {
        return (
            <div className="reset_box">
                <h1>重置登录密码</h1>
                <form className="reset_password" onSubmit={this.submit} ref="forms">
                    <label className="reset_password_label">
                        <input ref="password" type={this.state.flag ? 'password' : 'text'} name="password" autoComplete="new-password" placeholder="请设置4-20位长度的新密码" maxLength="20" data-type="password" data-required="true" data-name="新密码" />
                        <i className="show_password_icon" onClick={this.changeShow}></i>
                    </label>
                    <p className="password_tips">强烈建议密码同时包含字母、数字和标点符号</p>
                    {this.state.error != null ?  <p className="prompt">{this.state.error}</p> : null}
                    <input type="submit" value="下一步" ref="button" />
                </form>
            </div>
        )
    }
});