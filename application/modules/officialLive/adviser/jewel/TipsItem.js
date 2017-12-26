var LiveHandle = require('../../../../handle/live/Index');
var MessagesHandle = require('../../../../handle/messages/Index');
var CheckBox = require('../../../../components/form/CheckBox');
var Editor = require('../../../../components/editor/Message');
var ChatList = require('../../../../components/common/ChatList');
var DialogUploader = require('../../../../components/attachment/Uploader');

module.exports = React.createClass({
	request: null,
	notify: function() {
		if (this.request) return null;
		this.request = true;
		var params = {ref_id: this.props.source._id, ref_type: Config.CHANNEL_REF.TACTICS};
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
		var params = {ref_id: this.props.source._id, ref_type: Config.CHANNEL_REF.TACTICS};
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
	createMessage: function(data) {
		this.refs.chatList.appendMessage({_id: Utils.createId(), body: {attachment: data, content: '', inline: null }, create_time: data.created_time, from: Config.CACHE_DATA.USER, type: 3,});
	},
	sendAttachment: function(data)  {
		this.createMessage(data);
	},
	submit: function(html) {
		console.log(html);
		if (html.length < 8) {
            $('.simditor-body').addClass('error_tips');
			return;
		}
		var targetRef = this.refs.chatList;
		var md5Key = Utils.getMessageState();
		var param = {
			content: MessagesHandle.formatToServer(html),
			state: md5Key
		};

		targetRef.scrollBottom();
		LiveHandle.sendTacticMessage(this.props.source._id, param, function(result) {
			if (result.code == 200) {
				result.data.sending = true;
				targetRef.state.sendMessage[md5Key] = result.data;
				targetRef.appendMessage(result.data);
			}
		}.bind(this));
	},
	getList: function(latestStamp, callback) {
		LiveHandle.getTacticContent(this.props.source._id, {latest_stamp: latestStamp}, callback);
	},
	appendMessage: function(data) {
		this.refs.chatList.appendMessage(data);
	},
	componentDidMount: function() {
		Event.on('LiveMessage' + this.props.source.channel_id + Config.CHANNEL_TYPE.CHANNEL, this.appendMessage);
		Event.trigger('FreshJewelModule', {rightModule: <div className="detail_item">
			<h5>锦囊包详情</h5>
			<div>
				<h6>锦囊：{this.props.source.title}</h6>
				<p>{this.props.source.description}</p>
			</div>
			<div>
				<h6>锦囊特点</h6>
				<p>{this.props.source.specialty}</p>
			</div>
			<div>
				<h6>适用人群</h6>
				<p>{this.props.source.apply_to}</p>
			</div>
			<div>
				<h6>风险提示</h6>
				<p>{this.props.source.risk_tip}</p>
			</div>
			<div>
				<h6>服务期限</h6>
				<p>{this.props.source.service_period}天</p>
			</div>
		</div>}, 'rightModule');
	},
	componentWillUnmount: function() {
		Event.off('LiveMessage' + this.props.source.channel_id + Config.CHANNEL_TYPE.CHANNEL, this.appendMessage);
	},
	render: function() {
        return <div className="tips_content_run">
                    <div className="run_box">
                        <div className="running">
                            <div className="left">
                                <i></i>
                                <div>
                                    <label>运行x中</label>
                                    <p>最后更新时间：{this.props.source.update_time ? Utils.formatDate(this.props.source.update_time, 'YYYY-MM-DD hh:mm:ss') : Utils.formatDate(this.props.source.create_time, 'YYYY-MM-DD hh:mm:ss')}</p>
                                </div>
                            </div>
							{this.props.source.advisor._id == Config.CACHE_DATA.USER._id ? null :
								<div className="right">
								<CheckBox checked={this.props.source.is_notify} onChange={this.props.source.is_notify ? this.unnotify : this.notify}>开启提醒推送服务</CheckBox>
								</div>}
                        </div>
                    </div>
                    <div className={LiveHandle.isRoomOwner() ? 'tips_content_list' : 'tips_content_list chart_list_full'}>
						<ChatList onGetData={this.getList} ref="chatList">
							{LiveHandle.isRoomOwner() ?
								<div className="editor">
									<Editor placeholder="请输入4~500个字符，按(Enter)发送消息" onSubmit={this.submit} toolbar={['attachment']} fileParam={{id: this.props.source.channel_id, dialogUploader: DialogUploader, onUploaded: this.sendAttachment, refType: 1}}   />
								</div> :
								null
							}
						</ChatList>
                    </div>
                </div>;
    }
});


