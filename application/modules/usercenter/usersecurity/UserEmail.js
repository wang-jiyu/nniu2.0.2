var SubmitSuccess = require('../../../components/common/SubmitSuccess');
var UserCenterHandle = require('../../../handle/usercenter/UserCenter');
var BindEmail = require('./BindEmail');

module.exports = React.createClass({
    bindSuccess: function(result) {
        this.props.onChange(result);
        this.setState({success: true, verify: false});
    },
    submit: function(e) {
        Forms.disableButton(this.refs.submit);
        var params = {password: Utils.md5(e.target.data.password, 16), email: e.target.data.email};
        UserCenterHandle.bindEmail(params, function(result) {
            if (result.code == 200) {
                this.setState({verify: {email: params.email, token: result.data.token}})
            } else {
                this.setState({error: result.code}, function() {
                    Forms.activeButton(this.refs.submit);
                }.bind(this));
            }
        }.bind(this))
    },
    componentDidMount: function() {
        //Utils.setPosition(this.refs.title, -1);
        this.refs.password.focus();
    },

    getInitialState: function() {
        return {success: false, verify: false, error: null};
    },
    render: function() {
        if(this.state.success) return <SubmitSuccess text={'邮箱认证成功'} style={{marginTop: '50px'}} />;
        if(this.state.verify) return <BindEmail verify={this.state.verify} onChange={this.bindSuccess} />;
        return (
            <div className="user_email_box">
                <form onSubmit={this.submit}>
                    <input name="password" data-required="required" type="password" placeholder="请输入登录密码" ref="password" />
                    <input name="email" data-required="required" type="text" data-type="email" placeholder="请输入邮箱地址" />
                    {typeof(this.state.error) == 'number' &&  <p className="prompt">{Utils.getPromptInfo(this.state.error)}</p>}
                    <input type="submit" value="下一步" ref="submit" />
                </form>
            </div>);
    }
});