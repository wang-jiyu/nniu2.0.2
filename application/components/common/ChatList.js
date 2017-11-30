var MessagesHandle = require('../../handle/messages/Index');
var AttachmentHandle = require('../../handle/Attachment');
var LiveHandle = require('../../handle/live/Index');

module.exports = React.createClass({
	online: function (result) {
		var url = AttachmentHandle.getFile(result._id);
		Interface.popWin('预览文件', url, { width: 850, maxHeight: 740, top: 30, bottom: 30, align: 'center', valign: 0.4 });
	},
	download: function (result) {
		var url = AttachmentHandle.getFile(result._id, { download: 1, filename: result.title });
		AttachmentHandle.download(url);
	},
	getSource: function (source) {
		if (!this.state.startId) return source;
		var index = ArrayCollection.indexOf.call(source, this.state.startId, '_id');
		return source.slice(index, this.state.maxShow + index);
	},

	//附件信息
	getAttachmentCase: function (item) {
		// var isOwner = item.from._id == Config.CACHE_DATA.USER._id;
		var isOwner = LiveHandle.isRoomOwner(item.from._id);

		switch (item.body.attachment.assort) {
			case 1: return <dd key={item._id} className={isOwner ? 'teacher' : null} data-id={item._id}>
				<img src={item.from.avatar} className="avatar" />
				<div className="info">
					<div className="info_head">
						<a href="javascript:;" className="name">{item.from.name}</a>
						<time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
						<span className="identity">助理</span>
					</div>
					<div className="message execute">
						<img src={AttachmentHandle.getFile(item.body.attachment._id)} height={item.body.attachment.height} data-preview={AttachmentHandle.getFile(item.body.attachment._id)} data-group={Config.CACHE_DATA.ROOM.channel_id} />
					</div>
				</div>
			</dd>
			case 0: return <dd key={item._id} className={isOwner ? 'owner' : null} data-id={item._id}>
				<img src={item.from.avatar} className="avatar" />
				<div className="info">
					<div className="info_head">
						<a href="javascript:;" className="name">{item.from.name}</a>
						<time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
					</div>
					<div className="message">
						<div className="share_file share_file_pdf">
							<div className="file_ext">
								<img src={Utils.getFileIcon(item.body.attachment.ext)} />
							</div>
							<div className="file_info">
								<h4 title={item.body.attachment.title}>{item.body.attachment.title}</h4>
								<span>{Utils.formatBytes(item.body.attachment.size)}</span>
							</div>
							{item.body.attachment.ext == 'pdf' ?
								<div className="file_operat">
									<i className="online" title="在线阅读" onClick={this.online.bind(this, item.body.attachment)}></i>
									<i className="download" title="下载" onClick={this.download.bind(this, item.body.attachment)}></i>
								</div> : null}
						</div>
					</div>
				</div>
			</dd>
		}
	},

	//聊天信息
	getMessageType: function (item) {
		if (item.body.attachment) return this.getAttachmentCase(item);

		if (typeof (this.props.onExpand) == 'function') {
			var module = this.props.onExpand(item, this);
			if (React.isValidElement(module)) return module;
		}

		
		var isOwner = item.from._id == Config.CACHE_DATA.USER._id;
		var isRight =item.body.content =="z";

		return <dd key={item._id} className={isRight ? 'teacher' : null} data-id={item._id}>
			<img src={item.from.avatar} className="avatar" />
			<div className="info">
				<div className="info_head">
					<a href="javascript:;" className="name">{item.from.name}</a>
					<time>{Utils.formatDate(item.create_time, 'HH:mm')}</time>
					<span className="identity">助理</span>
				</div>
				<div className="message">
					<p dangerouslySetInnerHTML={{ __html: MessagesHandle.formatToClient(item.body.content) }}></p>
				</div>
			</div>
		</dd>;
	},
	isLoad: function (isLoad) {
		if (this.props.isReverse) return Utils.isScrollBottom(this.refs.messageBox, 10);
		return Utils.isScrollTop(this.refs.messageBox);
	},
	scrollPosition: function (fixElement, isNext) {
		var messageBox = $(this.refs.messageBox);
		var position = fixElement.position();
		if (position) {
			var top = messageBox.scrollTop() + position.top;
			if (isNext) {
				top -= messageBox.height();
			}
			messageBox.scrollTop(top);
		}
	},
	checkIsLoad: function () {
		if (!this.state.startId) return true;
		var index = ArrayCollection.indexOf.call(this.state.source, this.state.startId, '_id');
		if (this.props.isReverse) return this.state.source.length - index <= this.state.scrollLimt
		return index < this.state.scrollLimt;
	},
	scrollLoad: function () {
		if (this.state.loading) return null;
		var messageBox = $(this.refs.messageBox);
		var lastDataId;

		if (this.state.lastMessageId && this.isLoad() && this.checkIsLoad()) {
			if (this.props.isReverse) {
				lastDataId = messageBox.find('[data-id]:last').attr('data-id');
				this.state.unread = false;
			} else {
				lastDataId = messageBox.find('[data-id]:first').attr('data-id');
			}

			return this.getMessageList(function (result) {
				if (result.code == 200) {
					if (this.props.isReverse) {
						this.scrollPosition(messageBox.find('[data-id=' + lastDataId + ']').next(), true);
					} else {
						this.scrollPosition(messageBox.find('[data-id=' + lastDataId + ']').prev());
					}
				}
			}.bind(this));
		}

		if (!this.state.startId) return null;

		if (Utils.isScrollTop(this.refs.messageBox)) {
			//向上取数据
			var index = ArrayCollection.indexOf.call(this.state.source, this.state.startId, '_id');
			index = Math.max(index - this.state.scrollLimt, 0);
			var startId = this.state.source[index]._id;
			if (startId == this.state.startId) return null;

			lastDataId = messageBox.find('[data-id]:first').attr('data-id');
			return this.setState({ startId: startId }, function () {
				this.scrollPosition(messageBox.find('[data-id=' + lastDataId + ']').prev());
			}.bind(this));

		}

		if (Utils.isScrollBottom(this.refs.messageBox, 10)) {
			//向下取数据
			var index = ArrayCollection.indexOf.call(this.state.source, this.state.startId, '_id');
			index = Math.min(index + this.state.scrollLimt, this.state.source.length - this.state.scrollLimt);
			index = Math.max(index, 0);

			var startId = this.state.source[index]._id;
			if (startId == this.state.startId) return this.setState({ unread: false });

			lastDataId = messageBox.find('[data-id]:last').attr('data-id');
			return this.setState({ startId: startId }, function () {
				this.scrollPosition(messageBox.find('[data-id=' + lastDataId + ']').next(), true);
			}.bind(this));
		}
	},
	scrollBottom: function () {
		if (this.isMounted()) {
			var stopEvent = function (e) { e.stopPropagation(); }
			window.addEventListener('scroll', stopEvent, true);
			Utils.scrollBottom(this.refs.messageBox);
			setTimeout(function () {
				window.removeEventListener('scroll', stopEvent, true);
			});
		}
	},
	getMessageList: function (callback) {
		if (!this.state.loading) this.setState({ loading: true });
		if (typeof (this.props.onGetData) == 'function') {
			return this.props.onGetData(this.state.lastMessageId, this.getMessageComplete.bind(this, callback));
		}
	},
	getMessageComplete: function (callback, result) {
		if (result.code == 200 && this.isMounted()) {
			var messages = $.isArray(result.data) ? result.data : result.data.messages;

			if (messages.length > 20) {
				this.state.lastMessageId = messages.pop()._id;
			} else {
				this.state.lastMessageId = null;
			}

			if (this.props.isReverse) {
				var _id
				if (messages.length > 0) _id = messages[0]._id;
				Array.prototype.push.apply(this.state.source, messages);
				var index = Math.max(ArrayCollection.indexOf.call(this.state.source, _id, '_id') - this.state.scrollLimt, 0);;
				if (this.state.source[index]) {
					this.state.startId = this.state.source[index]._id;
				}
			} else {
				if (messages.length > 0) this.state.startId = messages[messages.length - 1]._id;
				messages.reverse();
				Array.prototype.unshift.apply(this.state.source, messages);
			}

			return this.setState({ source: this.state.source, loading: false }, function () {
				typeof (callback) == 'function' && callback(result);
			});
		}

		typeof (callback) == 'function' && callback(result);
	},
	appendMessage: function (data, md5) {
		if (!this.isMounted()) return null;
		if (md5 && this.state.sendMessage[md5]) {
			delete this.state.sendMessage[md5].sending;
			delete this.state.sendMessage[md5];
			return this.forceUpdate();
		}

		this.state.source.push(data);
		this.state.source.sort(function (p, n) {
			if (p.create_time > n.create_time) return 1;
			if (p.create_time < n.create_time) return - 1;
			return 0;
		});

		var isScrollBottom = Utils.isScrollBottom(this.refs.messageBox);

		if (isScrollBottom) this.state.startId = this.state.source[Math.max(this.state.source.length - this.state.maxShow, 0)]._id;

		this.setState({ source: this.state.source, unread: !isScrollBottom }, function () {
			if (isScrollBottom) {
				this.scrollBottom();
			}
		}.bind(this));
	},
	scrollEnd: function () {
		this.setState({ startId: this.state.source[Math.max(this.state.source.length - this.state.maxShow, 0)]._id, unread: false }, this.scrollBottom)
	},
	getUnread: function () {
		if (this.state.unread) return <div className="unread" onClick={this.scrollEnd}>有未读新消息</div>;
	},
	getUnreadText: function() {
		if(this.state.unread) {
			var val = this.state.source[this.state.source.length - 1].body.content;
			return <div className="msg_box" onClick={this.scrollEnd}>
                		<div className="l">{val}</div>
            			<div className="r">×</div>
            		</div>;
		}
	},
	componentDidMount: function () {
		this.getMessageList(function () {
			if (!this.props.isReverse) this.scrollBottom();
		}.bind(this));
	},
	getInitialState: function () {
		return { source: [], loading: true, lastMessageId: null, sendMessage: {}, maxShow: 40, startId: null, scrollLimt: 20, unread: false };
	},
	render: function () {
		var notData;
		if (this.state.source.length == 0 && !this.state.loading && React.isValidElement(this.props.notData)) notData = this.props.notData;

		var source = this.getSource(this.state.source);
		var nowYMD = '';
		return <div className="chart_list_box" >
			<div className="chart_list_scroll" style={this.props.style}>
				<dl ref="messageBox" onScroll={this.scrollLoad}>
					{
						notData ?
							notData :
							source.map(function (item, index) {
								var ymd = Utils.formatDate(item.create_time, 'YYYY/MM/DD');
								if (ymd != nowYMD) {
									nowYMD = ymd;
									return [<dt key={ymd}>{ymd}</dt>, this.getMessageType(item)];
								}
								return this.getMessageType(item)
							}.bind(this))}

				</dl>
				{this.getUnread()}
				{this.getUnreadText()}
			</div>
			{this.props.children}
		</div>
	}
})