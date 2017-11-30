var UserCenterHandle = require('../../../handle/usercenter/UserCenter');
var SubmitSuccess = require('../../../components/common/SubmitSuccess');

module.exports = React.createClass({
    submit: function(e) {
        var params = Config.CACHE_DATA.USER.is_default_passwd == 1 ? {password: Utils.md5(e.target.data.password, 16)}: {old: Utils.md5(e.target.data.old, 16), password: Utils.md5(e.target.data.password, 16)};

        Forms.disableButton(this.refs.submit);
        UserCenterHandle.setPassword(params, function(result) {
            if (result.code == 200) {
                this.setState({success: true})
				typeof(this.props.onChange) == 'function' && this.props.onChange();
            } else {
                this.setState({error: result.code}, function() {
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
        this.refs.password.focus();
    },

    getInitialState: function() {
        return {success: false, error: null};
    },
    render: function() {
        if(this.state.success) return <SubmitSuccess text={'修改成功'} style={{marginTop: '50px'}} />;

        return (<div className="password_box">
					{this.props.tootip}
                    <form ref="forms" onSubmit={this.submit}>
                        {
                            Config.CACHE_DATA.USER.is_default_passwd == 1 ? <ul>
                                <li>
                                    <input type="password" name="password" maxLength="20" data-required="required" placeholder="新密码" ref="password" data-type="password" data-name="新密码" />
                                    <div className="tooltip">强烈建议密码同时包含字母、数字和标点符号</div>
                                </li>
                                <li>
                                    <input type="password" name="confirm" maxLength="20" data-compare="password" data-required="required" placeholder="确认新密码" data-type="password" data-name="新密码" />
                                </li>
                            </ul> :
                            <ul>
                                <li>
                                    <input type="password" name="old" maxLength="20" data-required="required" placeholder="现有密码" ref="password" data-type="password" data-name="现有密码" />
                                </li>
                                <li>
                                    <input type="password" name="password" maxLength="20" data-required="required" placeholder="新密码" data-type="password" data-name="新密码" />
                                    <div className="tooltip">强烈建议密码同时包含字母、数字和标点符号</div>
                                </li>
                                <li>
                                    <input type="password" name="confirm" maxLength="20" data-compare="password" data-required="required" placeholder="确认新密码" data-type="password" data-name="新密码" />
                                </li>
                            </ul>
                        }

                        {typeof(this.state.error) == 'number' &&  <p className="prompt">{Utils.getPromptInfo(this.state.error)}</p>}
                        <input type="submit" value="提交" ref="submit" />
                    </form>
                </div>);
    }
});
