var AttachmentHandle = require('../../../handle/Attachment');
var MembersHandle = require('../../../handle/member');

module.exports = React.createClass({
    uploadChange: function (e) {
        var files = $.extend({}, e.currentTarget.files, true);
        $(e.currentTarget).val('');
        if (files.length != 1) return false;

        Utils.getBase64(files[0], function (src) {
            this.state.source.avatar = src;

            this.setState({source: this.state.source, isMark: true, headRand: ''}, function () {
                var objMark = $(this.refs.mark);
                var data = {
                    file: files[0],
                    getProgress: function (e) {
                        var percent = e.loaded / e.total * 100;
                        if (percent < 90) objMark.css({top: percent + '%'})
                    }
                };

                AttachmentHandle.uploadToAvatar(data, function (result) {
                    if (result.code == 200) {
                        MembersHandle.setHeader(function (item) {
                            if (item.code == 200) {
                                Interface.getProfile(function () {
                                    if (typeof (window.updateAvatar) == 'function') window.updateAvatar(Config.CACHE_DATA.USER.avatar);
                                    this.setState({
                                        source: $.extend(true, {}, Config.CACHE_DATA.USER),
                                        headRand: '?' + Math.random()
                                    })
                                }.bind(this), true);
                            }
                        }.bind(this))
                    }
                    this.setState({isMark: false});
                }.bind(this));
            });
        }.bind(this))
    },
    freshUser: function () {
        this.setState({source: $.extend(true, {}, Config.CACHE_DATA.USER)});
    },
    select: function (module) {
        this.props.onSelectModule(module);
    },
    componentDidMount: function () {
        Event.on('UpdateUser', this.freshUser)
    },
    componentWillUnmount: function () {
        Event.off('UpdateUser', this.freshUser)
    },

    getInitialState: function () {
        return {source: $.extend(true, {}, Config.CACHE_DATA.USER), isMark: false, headRand: '', active: null};
    },
    render: function () {
        return <div className="info_account">
            <div className="info_header">
                <i onClick={function () {
                    $(this.refs.avatar).click();
                }.bind(this)} ref="header">
                    {this.state.isMark ? <div ref="mark" className="mark"></div> : null}
                    <img src={Utils.getAvatar(this.state.source.avatar) + this.state.headRand} alt="" width="98"
                         height="98"/>
                </i>
                <span>{this.state.source.name}</span>
                <input type="file" ref="avatar" className="hide" onChange={this.uploadChange}/>
            </div>
            <div className="info_icon">
                <i className={this.state.source.mobile ? 'selected' : null}
                   title={this.state.source.mobile ? '已绑定手机号码' : '尚未绑定手机号码'}>&#xe647;</i>
                <i className={this.state.source.is_auth == 1 ? 'selected' : null}
                   title={this.state.source.is_auth == 1 ? '已实名认证' : '尚未进行实名认证'}
                   style={{fontSize: '22px', lineHeight: '30px'}}>&#xe681;</i>
                <i className={this.state.source.risk_score != 0 ? 'selected' : null}
                   title={this.state.source.risk_score != 0 ? '已进行风险测评' : '尚未进行风险测评'}>&#xe833;</i>
            </div>
            <ul>
                <li>
                    <h5>粉丝</h5>
                    <span style={{color: '#fd3f3e'}}>{this.state.source.fans}</span>
                </li>
                <li className={this.props.pointer == 'follow' ? 'active' : null}
                    onClick={this.select.bind(this, 'follow')}>
                    <h5>关注</h5>
                    <span
                        style={{color: '#ff6600'}}>{this.state.source && this.state.source.follow_ids ? this.state.source.follow_ids.length : ""}</span>
                </li>
                <li>
                    <h5>牛币</h5>
                    <span style={{color: '#f6a623'}}>0</span>
                </li>
            </ul>
        </div>
    }
});