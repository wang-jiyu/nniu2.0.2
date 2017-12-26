var Edit = require('./Edit');
var UserMobile = require('../usersecurity/UserMobile');
var UserEmail = require('../usersecurity/UserEmail');

module.exports = React.createClass({
    userChange: function(result) {
        this.setState({source: result});
    },
    getRiskType: function () {
        if (Config.CACHE_DATA.USER.risk_score <= 10) return '厌恶风险型';
        if (Config.CACHE_DATA.USER.risk_score <= 20) return '保守型';
        if (Config.CACHE_DATA.USER.risk_score <= 30) return '稳健型';
        return '激进型';
    },

    infoChange: function(status) {
        if (status == true) return this.setState({edit: false, source: Config.CACHE_DATA.USER});
        this.setState({edit: true})
    },
    openDialog: function(type) {
        switch (type) {
            case 'mobile':
                Event.trigger('OpenDialog', {module: <UserMobile onChange={this.userChange} />, title: '手机认证', width: 450, height: 440});
                break;
            case 'email':
                Event.trigger('OpenDialog', {module: <UserEmail onChange={this.userChange} />, title: '邮箱认证', width: 450, height: 440});
                break;
        }
    },
    evaluateChange: function () {
		Interface.popWin('风险测评', '/tool.html?tool=evaluaterisk', {width: 756, maxHeight: 790, top: 30, bottom: 30, align: 'center', valign: 0.3});
    },
    upVip: function() {
        Interface.popWin('升级会员', '/tool.html?tool=vip', {width: 750, maxHeight: 790, top: 30, bottom: 30, align: 'center', valign: 0.4});
    },
    freshUser: function() {
        this.setState({source: Config.CACHE_DATA.USER});
    },
    componentDidMount: function() {
        Event.on('UpdateUser', this.freshUser)
    },
    componentWillUnmount: function() {
        Event.off('UpdateUser', this.freshUser)
    },

    getInitialState: function() {
        return {source: Config.CACHE_DATA.USER, edit: false};
    },
    render: function() {
        if (this.state.edit) return <Edit onClose={this.infoChange} />;
        var sex = {0: '保密', 1: '男', 2: '女'};

        return <div>
                    <h3 className="info_title">基本资料</h3>
                    <div className="info_content">
                        <table className="form_item">
                            <tbody>
                            <tr>
                                <td className="field">牛牛号：</td>
                                <td className="evaluate_result_text" style={{ width: Config.CACHE_DATA.USER.risk_score != 0 ? 400 : 'auto'}}>
                                    <span style={{float: 'left'}}>{this.state.source.uid}</span>
                                    {Config.CACHE_DATA.USER.risk_score != 0 ? <div onClick={this.evaluateChange}>{this.getRiskType()}</div> :''}
                                    </td>
                            </tr>
                            <tr>
                                <td className="field">昵称：</td>
                                <td><span>{this.state.source.name}</span></td>
                            </tr>
                            <tr>
                                <td className="field">会员组：</td>
                                <td>
                                    <span>{Vip.getIdItem(this.state.source.group, 'name')}</span>
                                    {Vip.getIdItem(this.state.source.group, 'weight') == 4 ? null : <a href="javascript:;" onClick={this.upVip}>升级会员</a>}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table className="form_item">
                            <tbody>
                            <tr>
                                <td className="field">性别：</td>
                                <td><span>{sex[this.state.source.gender]}</span></td>
                            </tr>
                            <tr>
                                <td className="field">生日：</td>
                                <td><span>{Utils.formatDate(this.state.source.birthday, 'YYYY-MM-DD')}</span></td>
                            </tr>
                            <tr>
                                <td className="field">股龄：</td>
                                <td><span>{this.state.source.guling == 11 ? '10年以上' : this.state.source.guling + '年'}</span></td>
                            </tr>
                            <tr>
                                <td className="field">绑定手机：</td>
                                <td>
                                    {this.state.source.mobile.length > 0 ? <span>{this.state.source.mobile}</span> : <a href="javascript:;" onClick={this.openDialog.bind(this, 'mobile')}>立即绑定</a>}
                                </td>
                            </tr>
                            <tr>
                                <td className="field">绑定邮箱：</td>
                                <td>
                                    {this.state.source.email.length > 0 ? <span>{this.state.source.email}</span> : <a href="javascript:;" onClick={this.openDialog.bind(this, 'email')}>立即绑定</a>}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table className="form_item">
                            <tbody>
                            <tr>
                                <td className="field">所在地：</td>
                                <td>
                                    <span className="province">{this.state.source.location.province}</span>
                                    <span className="province">{this.state.source.location.city}</span>
                                    <span className="province">{this.state.source.location.district}</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="field">邮政编码：</td>
                                <td><span>{this.state.source.postal_code}</span></td>
                            </tr>
                            <tr>
                                <td className="field">地址：</td>
                                <td><span>{this.state.source.address}</span></td>
                            </tr>
                            </tbody>
                        </table>
                        {this.state.source.advisor_type == 2 ?
                            <table className="form_item" width="100%">
                                <tbody>
                                <tr>
                                    <td className="field">等级：</td>
                                    <td><span>{Vip.getIdItem(this.state.source.level, 'name')}</span></td>
                                </tr>
                                <tr>
                                    <td className="field">证券资格证：</td>
                                    <td><span>{this.state.source.qcer}</span></td>
                                </tr>
                                <tr>
                                    <td className="field">简介：</td>
                                    <td width="520"><span>{this.state.source.intro}</span></td>
                                </tr>
                                </tbody>
                            </table> : null}
                        <div className="submit_box">
                            <input type="button" value="修改资料" onClick={this.infoChange} />
                            <a href="javascript:;" onClick={this.evaluateChange}>{Config.CACHE_DATA.USER.risk_score != 0 ? '重新测评' : '风险测评'}</a>
                        </div>
                    </div>
                </div>
    }
});