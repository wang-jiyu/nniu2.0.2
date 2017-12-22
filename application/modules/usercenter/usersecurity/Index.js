var BindMobile = require('./BindMobile');
var IconMark = require('../../../components/common/IconMark');
var UserPassword = require('./UserPassword');
var UserMobile = require('./UserMobile');
var UserEmail = require('./UserEmail');
var UserId = require('./UserId');

var UserCenterHandle = require('../../../handle/usercenter/UserCenter');

module.exports = React.createClass({
    userChange: function(result) {
        this.setState({source: result});
    },
    bindSns: function(type) {
        UserCenterHandle.bindSns({type: 'binduser', sns: type}, function(result) {
            if (result.code == 200) {
                switch (type) {
                    case 'sina':
                        Interface.popWin('绑定帐号', result.data.redirect_uri, {width: 398, maxHeight: 320, top: 30, bottom: 30, align: 'center', valign: 0.4});
                        break;
                    case 'wechat':
                        Interface.popWin('绑定帐号', result.data.redirect_uri, {width: 750, maxHeight: 564, top: 30, bottom: 30, align: 'center', valign: 0.4});
                        break;
                    case 'qq':
                        Interface.popWin('绑定帐号', result.data.redirect_uri, {width: 508, maxHeight: 504, top: 30, bottom: 30, align: 'center', valign: 0.4});
                        break;
                }

            }
        })
    },
    unbindSns: function(type) {
        var _type = 'QQ';
        if (type == 'sina') _type = '新浪微博';
        if (type == 'wechat') _type = '微信';

        Event.trigger('OpenAlert', {
            title: '账号解绑',
            message: '确定将当前' + _type + '账号解除绑定吗？',
            button: Config.MESSAGE_BUTTON.OKCANCEL,
            event: function() {
                UserCenterHandle.unbindUser(type, function(result) {
                    if (result.code == 200) {
                        this.security();
                    }
                }.bind(this))
            }.bind(this)
        })
    },
    openDialog: function(type) {
        switch (type) {
            case 'password':
                Event.trigger('OpenDialog', {module: <UserPassword />, title: '修改密码', width: 450, height: 425});
                break;
            case 'mobile':
                Event.trigger('OpenDialog', {module: <UserMobile onChange={this.userChange} />, title: '手机认证', width: 450, height: 440});
                break;
            case 'email':
                Event.trigger('OpenDialog', {module: <UserEmail onChange={this.userChange} />, title: '邮箱认证', width: 450, height: 440});
                break;
            case 'id':
                Event.trigger('OpenDialog', {module: <UserId onChange={this.userChange} />, title: '实名认证', width: 450, height:480});
        }
    },
    security: function() {
        Interface.getProfile(function() {
            this.setState({source: Config.CACHE_DATA.USER});
        }.bind(this), true);
    },
    componentDidMount: function() {
        Event.on('ChangeState', this.security);
    },
    componentWillUnmount: function() {
        Event.off('ChangeState', this.security);
    },

    getInitialState: function() {
        return {source: Config.CACHE_DATA.USER};
    },
    render: function() {
        var mobile = this.state.source.mobile;
        return (
            <div>
                <h3 className="info_title">安全设置</h3>
                <div className="security_setting">
                    <ul>
                        <li>
                            <label>
                                <IconMark status={true} />
                                <span>登录密码</span>
                            </label>
                            <span>为了您的账户安全，请定期修改登录密码</span>
                            <a href="javascript:;" onClick={this.openDialog.bind(this, 'password')}>立即设置</a>
                        </li>
                        <li>
                            <label>
                                <IconMark status={this.state.source.mobile.length > 0} />
                                <span>手机认证</span>
                            </label>
                            <span>{this.state.source.mobile.length > 0 ? '您已绑定 ' + mobile.slice(0,3) + '***' + mobile.slice(-4) + ' 手机，若丢失或停用请及时修改' : '您尚未绑定任何手机号码'}</span>
                            <a href="javascript:;" onClick={this.openDialog.bind(this, 'mobile')}>{this.state.source.mobile.length == 0 ? '立即认证' : '重新认证'}</a>
                        </li>
                        <li>
                            <label>
                                <IconMark status={this.state.source.email.length > 0} />
                                <span>邮箱认证</span>
                            </label>
                            <span>邮箱可以用来重置密码或其他安全验证</span>
                            <a href="javascript:;" onClick={this.openDialog.bind(this, 'email')}>{this.state.source.email.length == 0 ? '立即认证' : '重新认证'}</a>
                        </li>
                        <li>
                            <label>
                                <IconMark status={this.state.source.is_auth} />
                                <span>实名认证</span>
                            </label>
                            <span>保障账户安全，确认投资身份</span>
                            <a href="javascript:;" onClick={this.state.source.is_auth != 1 ? this.openDialog.bind(this, 'id') : null} disabled={this.state.source.is_auth == 1}>{this.state.source.is_auth != 1 ? '立即认证' : '已认证'}</a>
                        </li>
                        <li>
                            <label>
                                <IconMark status={this.state.source.bind_qq} />
                                <span>绑定QQ</span>
                            </label>
                            <span>绑定后可用QQ登录</span>
                            {!this.state.source.bind_qq ?
                                <a href="javascript:;" onClick={this.bindSns.bind(this, 'qq')}>立即绑定</a> :
                                <a href="javascript:;" onClick={this.unbindSns.bind(this, 'qq')}>解除绑定</a>}
                        </li>
                        <li>
                            <label>
                                <IconMark status={this.state.source.bind_wechat} />
                                <span>绑定微信</span>
                            </label>
                            <span>绑定后可用微信登录</span>
                            {!this.state.source.bind_wechat ?
                                <a href="javascript:;" onClick={this.bindSns.bind(this, 'wechat')}>立即绑定</a> :
                                <a href="javascript:;" onClick={this.unbindSns.bind(this, 'wechat')}>解除绑定</a>}
                        </li>
                        <li>
                            <label>
                                <IconMark status={this.state.source.bind_sina} />
                                <span>绑定新浪微博</span>
                            </label>
                            <span>绑定后可用新浪微博登录</span>
                            {!this.state.source.bind_sina ?
                                <a href="javascript:;" onClick={this.bindSns.bind(this, 'sina')}>立即绑定</a> :
                                <a href="javascript:;" onClick={this.unbindSns.bind(this, 'sina')}>解除绑定</a>}
                        </li>
                    </ul>
                </div>
            </div>);
    }
});