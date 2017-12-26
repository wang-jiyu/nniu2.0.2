var LiveHandle = require('../../../../handle/live/Index');
var UploadReport = require('./UploadReport');
var AttachmentHandle = require('../../../../handle/Attachment');
var CheckBox = require('../../../../components/form/CheckBox');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');
module.exports = React.createClass({
    request: null,
    notify: function() {
        if (this.request) return null;

        this.request = true;
        var params = {ref_id: this.props.source._id, ref_type: Config.CHANNEL_REF.REPORT};
        LiveHandle.addNotify(params, function(result) {
            if (result.code == 200) {
                this.props.source.is_notify = 1;
                result.data.type = Config.CHANNEL_TYPE.CHANNEL;
                var data = [result.data];
                Interface.pushMessage('Subscribe', data);
                this.forceUpdate();
            }
            this.request = null;
        }.bind(this));
    },
    unnotify: function() {
        if (this.request) return null;

        this.request = true;
        var params = {ref_id: this.props.source._id, ref_type: Config.CHANNEL_REF.REPORT};
        LiveHandle.removeNotify(params, function(result) {
            if (result.code == 200) {
                this.props.source.is_notify = 0;
                result.data.type = Config.CHANNEL_TYPE.CHANNEL;
                var data = [result.data];
                Interface.pushMessage('Unsubscribe', data);
                this.forceUpdate();
            }
            this.request = null;
        }.bind(this));
    },
    load: function() {
        var params = {limit: 20, latest_stamp: ''};
        if (this.state.lastData) params.latest_stamp = this.state.lastData._id;
        this.state.lastData = null;

        LiveHandle.reportsAttachment(params, this.props.source._id, function(result) {
            if (result.code == 200 && this.isMounted()) {
                var _data = result.data;
                if (_data.length >= 20) this.state.lastData = _data.pop();
                this.state.source.push.apply(this.state.source, _data);
                return this.setState({source: this.state.source, code: null, loading: false, lastData: this.state.lastData})
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this))
    },
    wheel: function() {
        if (Utils.isScrollBottom(this.refs.tipsBox) && this.state.lastData) this.load();
    },
    addAttachment: function(result) {
        this.state.source.push(result);
        this.setState({source: this.state.source});
    },
    online: function(url) {
        Interface.popWin('内参附件', url, {width: 850, maxHeight: 740, top: 30, bottom: 30, align: 'center', valign: 0.4});
    },
    download: function(url) {
        AttachmentHandle.download(url);
    },
    openModule: function() {
        Event.trigger('FreshJewelModule', {module: <UploadReport onChange={this.addAttachment} source={this.props.source} title="上传内参" />,
            title: <div className="run_box">
                        <div className="running">
                            <div className="left">
                                <i style={{marginTop: '4px'}}></i>
                                <div>
                                    <label style={{marginTop: '-20px'}}>运行中</label>
                                    <p style={{marginTop: '-29px'}}>最后更新时间：{this.props.source.update_time ? Utils.formatDate(this.props.source.update_time, 'YYYY-MM-DD hh:mm:ss') : Utils.formatDate(this.props.source.create_time, 'YYYY-MM-DD hh:mm:ss')}</p>
                                </div>
                            </div>
                        </div>
                    </div>,
            rightModule: <div className="detail_item">
                                <h5>内参详情</h5>
                                <div>
                                    <h6>内参{this.state.reportItem.title}</h6>
                                    <p>{this.state.reportItem.specialty}</p>
                                </div>
                                <div>
                                    <h6>适用人群</h6>
                                    <p>{this.state.reportItem.apply_to}</p>
                                </div>
                                <div>
                                    <h6>风险提示</h6>
                                    <p>{this.state.reportItem.risk_tip}</p>
                                </div>
                                <div>
                                    <h6>服务期限</h6>
                                    <p>{ this.state.reportItem.service_period}天</p>
                                </div>
                          </div>});
    },
    getList: function(){
    	if (this.state.loading) return <div className="reprot_run"><Loading  /></div>;
    	if (this.state.code) return <div className="reprot_run"><Reload onReload={this.load} code={this.state.code} /></div>;
    	return <div className="reprot_run">
                    <div className="run_box">
                        <div className="running">
                            <div className="left">
                                <i></i>
                                <div>
                                    <label>运行中</label>
                                    <p>最后更新时间：{this.props.source.update_time ? Utils.formatDate(this.props.source.update_time, 'YYYY-MM-DD hh:mm:ss') : Utils.formatDate(this.props.source.create_time, 'YYYY-MM-DD hh:mm:ss')}</p>
                                </div>
                            </div>
                            {this.props.source.advisor._id == Config.CACHE_DATA.USER._id ? null :
                                <div className="right">
                                    <CheckBox checked={this.props.source.is_notify} onChange={this.props.source.is_notify ? this.unnotify : this.notify}>开启提醒推送服务</CheckBox>
                                </div>}
                        </div>
                    </div>
                    <div className="run_content">
                        <ul>
                            {LiveHandle.isRoomOwner() ?
                                <li>
                                    <input type="button" value="上传内参" className="dark_blue"  onClick={this.openModule} />
                                </li> : null}
                            {this.state.source.map(function(item) {
                                return <li className="text_detail" key={item._id}>
                                            <i className="icon purpel"></i>
                                            <div className="detail">
                                                <label>{item.title}</label>
                                                <div className="time">
                                                    <i>{Utils.formatDate(item.create_time, 'YYYY-MM-DD')}</i>
                                                </div>
                                                <p>{item.description}</p>
                                                <div className="btn_box">
                                                    <input type="button" value="在线阅读" className="small" onClick={this.online.bind(this, AttachmentHandle.getFile(item.attach_id))} />
                                                    <input type="button" value="下载" className="small blue" onClick={this.download.bind(this, AttachmentHandle.getFile(item.attach_id, {download: 1, filename: item.title + '.pdf'}))}/>
                                                </div>
                                            </div>
                                        </li>
                            }.bind(this))}
                        </ul>
                    </div>
                </div>
    },
    componentDidMount: function() {
        this.state.reportItem = this.props.source;
        Event.trigger('FreshJewelModule', {rightModule: <div className="detail_item">
            <h5>内参详情</h5>
            <div>
                <h6>内参{this.state.reportItem.title}</h6>
                <p>{this.state.reportItem.specialty}</p>
            </div>
            <div>
                <h6>适用人群</h6>
                <p>{this.state.reportItem.apply_to}</p>
            </div>
            <div>
                <h6>风险提示</h6>
                <p>{this.state.reportItem.risk_tip}</p>
            </div>
            <div>
                <h6>服务期限</h6>
                <p>{this.state.reportItem.service_period}天</p>
            </div>
        </div>}, 'rightModule');
        this.load();
    },
    getInitialState: function() {
        return {loading: true, source: [], code: null};
    },
    render: function() {
        return <div>{this.getList()}</div>
    }
});


