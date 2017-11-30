var AreaPicker = require('../../../components/common/AreaPicker');
var RadioBox = require('../../../components/form/RadioBox');
var UserCenterHandle = require('../../../handle/usercenter/UserCenter');
var UserMobile = require('../usersecurity/UserMobile');
var UserEmail = require('../usersecurity/UserEmail');

var DataPick = require(('amazeui-react'));
var DateTimeInput = DataPick.DateTimeInput;

module.exports = React.createClass({
    userChange: function(result) {
        this.setState({source: result});
    },
    submit: function(e) {
            Forms.disableButton(this.refs.submit);
            var data = {location: {city: e.target.data.city, district: e.target.data.district, province: e.target.data.province}, birthday: this.state.source.birthday};
            var params = $.extend(e.target.data, data);
            params.guling = parseInt(params.guling);
            params.gender = parseInt(params.gender);
            delete params.city;
            delete params.district;
            delete params.province;

            UserCenterHandle.setUser(params, function(result) {
                if (result.code == 200) return this.update();

                Forms.activeButton(this.refs.submit);
            }.bind(this))

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
    upVip: function() {
        Interface.popWin('升级会员', '/tool.html?tool=vip', {width: 750, maxHeight: 790, top: 30, bottom: 30, align: 'center', valign: 0.4});
    },
	update: function() {
		Interface.getProfile(function(result) {
			this.props.onClose(true);
		}.bind(this), true);
	},
    selectTime: function(result) {
        this.state.source.birthday = parseInt(new Date(result).getTime() / 1000);
    },
    formChange: function(e) {
        Forms.restrict(e.target, function(data) {
            this.setState(data);
        }.bind(this));
    },
    close: function() {
        this.props.onClose(true);
    },
    getInitialState: function() {
        var data = $.extend(true, {}, Config.CACHE_DATA.USER);
        return {
            source: data,
            province: data.location.province || '',
            city: data.location.city || '',
            district: data.location.district || ''
        }
    },
    render: function() {
        return <div>
                    <h3 className="info_title">修改基本资料</h3>
                    <div className="info_content info_edit">
                        <form onSubmit={this.submit} ref="forms">
                            <table className="form_item">
                                <tbody>
                                <tr>
                                    <td className="field">牛牛号：</td>
                                    <td>{this.state.source.uid}</td>
                                </tr>
                                <tr>
                                    <td className="field">昵称：</td>
                                    <td><input type="text" className="gray" name="name" defaultValue={this.state.source.name} data-required="required" maxLength="12"  minLength="2" /></td>
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
                                <tr title={Config.CACHE_DATA.USER.is_auth == 1 ? '已实名认证，无法再次进行选择' : ''}>
                                    <td className="field">性别：</td>
                                    <td>
                                        {
											!this.state.source.gender ? 
											<RadioBox name="gender" defaultChecked={!this.state.source.gender} value="0"  disabled={Config.CACHE_DATA.USER.is_auth}>保密</RadioBox> :
											null
										}
                                        <RadioBox name="gender" defaultChecked={this.state.source.gender == 1} value="1"  disabled={Config.CACHE_DATA.USER.is_auth}>男</RadioBox>
                                        <RadioBox name="gender" defaultChecked={this.state.source.gender == 2} value="2"  disabled={Config.CACHE_DATA.USER.is_auth}>女</RadioBox>
                                    </td>
                                </tr>
                                <tr title={Config.CACHE_DATA.USER.is_auth == 1 ? '已实名认证，无法再次进行选择' : ''}>
                                    <td className="field">生日：</td>
                                    <td><DateTimeInput ref="timeInput" format="YYYY-MM-DD" placeholder="出生日期" dateTime={Utils.formatDate(this.state.source.birthday, 'YYYY-MM-DD')} onSelect={this.selectTime} className="time_input input_calendars" readOnly={true} showTimePicker={false} disabled={Config.CACHE_DATA.USER.is_auth == 1} /></td>
                                </tr>
                                <tr>
                                    <td className="field">股龄：</td>
                                    <td>
                                        <select name="guling" defaultValue={this.state.source.guling} className="gray" >
                                            <option value="0">0年</option>
                                            <option value="1">1年</option>
                                            <option value="2">2年</option>
                                            <option value="3">3年</option>
                                            <option value="4">4年</option>
                                            <option value="5">5年</option>
                                            <option value="6">6年</option>
                                            <option value="7">7年</option>
                                            <option value="8">8年</option>
                                            <option value="9">9年</option>
                                            <option value="11">10年以上</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="field">绑定手机：</td>
                                    <td>
                                        {this.state.source.mobile.length > 0 ? <span>{this.state.source.mobile}</span> : null}
                                        <a href="javascript:;" onClick={this.openDialog.bind(this, 'mobile')}>{this.state.source.mobile.length > 0 ? '重新绑定' : '立即绑定'}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="field">绑定邮箱：</td>
                                    <td>
                                        {this.state.source.email.length > 0 ? <span>{this.state.source.email}</span> : null}
                                        <a href="javascript:;" onClick={this.openDialog.bind(this, 'email')}>{this.state.source.email.length > 0 ? '重新绑定' : '立即绑定'}</a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <table className="form_item">
                                <tbody>
                                <tr>
                                    <td className="field">所在地：</td>
                                    <td>
                                        <label ref="location">
                                            <AreaPicker className="gray" onChange={this.formChange} value={{
                                                            province: this.state.province,
                                                            city: this.state.city,
                                                            district: this.state.district
                                                        }} />
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="field">邮政编码：</td>
                                    <td><input type="text" name="postal_code" className="gray" defaultValue={this.state.source.postal_code} /></td>
                                </tr>
                                <tr>
                                    <td className="field">地址：</td>
                                    <td><input type="text" name="address" className="gray" defaultValue={this.state.source.address} /></td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="submit_box">
                                <input type="submit" value="保存" ref="submit" />
                                <a href="javascript:;" onClick={this.close}>取消</a>
                            </div>
                        </form>
                    </div>
                </div>
    }
});