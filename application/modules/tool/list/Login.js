var UserCenterHandle = require('../../../handle/usercenter/UserCenter');

module.exports = React.createClass({
    componentDidMount: function() {
        var type = Url.getParam('type');
        var code = Url.getParam('code');
        UserCenterHandle.thirdLogin({code: code}, type, function(result) {
            if (result.code == 200) {
                var data = result.data;
                this.setState({success: true}, function() {
                    setTimeout(function() {
                        Interface.setLogin(data.user_name, data.user_passwd, true, true);
                    }, 2000);
                }.bind(this))
            } else {
                this.setState({error: result.code});
            }
        }.bind(this))
    },

    getInitialState: function() {
        return {success: false, error: false};
    },
    render: function() {
        if (this.state.error) return <div className="bind_user_box">
                                        <span>登录失败，原因： {Utils.getPromptInfo(this.state.error)}</span>
                                     </div>;
        if (this.state.success) return <div className="bind_user_success">
                                            <i></i>
                                            <label>登录成功</label>
                                        </div>;
        return <div className="bind_user_box">
                    <span>正在登录中，请稍候...</span>
                </div>;
    }
});