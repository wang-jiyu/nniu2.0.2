var MessageHandle = require('../../handle/messages/Index');

module.exports = React.createClass({
	getSessionList: function() {
		var searchKey = this.state.search.toLocaleLowerCase();

		function searchItem(item) {
			if (searchKey.length == 0) return true
			if (item.name.indexOf(searchKey) != -1) return true;
			var pinyinArray = item.name_pinyin.toLocaleLowerCase().split(',')
			if (pinyinArray[0].indexOf(searchKey) != -1 || (pinyinArray[1] && pinyinArray[1].indexOf(searchKey) != -1)) return true;
			return false;
		}

		return $.map(this.state.sessionList, function(item) {
			if (!searchItem(item)) return null;
			return <li key={item._id} onClick={this.select.bind(null, item)} className={this.getClassname(item._id)}>
						<i className="message_tab_header"><img src={item.avatar} width="40" height="40" /></i>
						<div className="message_tab_content">
							<span>
								<label>{item.name}</label>
								{item.unread ?
										<i className="unread"></i> :
										<time>{Utils.showDate(item.last_doing_time, true)}</time>
								}
							</span>
							<p>{item.last_message}</p>
						</div>
					</li>
		}.bind(this));
	},
	getClassname: function(_class) {
		if (_class == this.props.pointer) return 'selected';
		return null;
	},
	search: function(e) {
		this.setState({search: e.currentTarget.value});
	},
	clearUnreadMessage: function(item) {
		if (typeof(item) != 'object' || item.unread == 0)  return null;
		item.unread = 0;
		MessageHandle.clearMessageUnread(item._id, item.type);
		this.setMessageBadge();
		this.forceUpdate();
	},
	select: function(item) {
		switch (item) {
			case 'consult':
			case 'remind':
			case 'system':
				this.receiveSundry(item, true);
			break;
			default: 
				this.clearUnreadMessage(item);
		}
		typeof(this.props.onSelect) == 'function' && this.props.onSelect(item);
	},
	getUnread: function() {
		var result = 0;
		var list = $.map(this.state.sessionList, function(item) {
						if (item.unread > 0) return true;
					});
		result += list.length;
		if (this.state.notify > 0) result++;
		if (this.state.cms > 0) result++;
		if (this.state.system > 0) result++;
		return result;
	},
	getNotifyUnread: function(next) {
		MessageHandle.getNotifyUnread(function(result) {
			if (result.code == 200) {
				$.extend(this.state, result.data);
				next();
			}
		}.bind(this));
	},
	getCmsUnread: function(next) {
		MessageHandle.getCmsUnread(function(result) {
			if (result.code == 200) {
				this.state.cms = result.data.number;
				next();
			}
		}.bind(this));
	},
	getInventory: function(next) {
		MessageHandle.getInventory(function(result) {
			if (result.code == 200) {
				this.setState({sessionList: result.data}, function() {
					next();
				}.bind(this));
			}
		}.bind(this));
	},
	setMessageBadge: function() {
		Interface.setMessageBadge(this.getUnread());
	},
	getInMenu: function(data) {
		for (var i = 0; i < this.state.sessionList.length; i++) {
			var item = this.state.sessionList[i];
			if (data.ref_id == item._id && data.ref_type == item.type) {
				return item
			}
		}
		return null;
	},
	receiveData: function(data) {
		var item = this.getInMenu(data);
		if (!item) return null;

		if (data.messages[0].body.content) {
			item.last_message = data.messages[0].body.content;
			item.last_doing_time = data.messages[0].create_time;
		}

		var isSelect = this.props.pointer == item._id;
		var windowState = Interface.getWindowState();
		var windowIsVisible = windowState == 3 || windowState == 5;
		var windowIsFocus = Interface.isFocus();

		if (isSelect && windowIsFocus && windowIsVisible) { //当前窗口
			this.forceUpdate();
			return MessageHandle.clearMessageUnread(item._id, item.type);
		}

		if (!windowIsVisible || !windowIsFocus) Interface.popNotify(item.avatar, item.name, item.last_message, item, item._id);

		item.unread++;
		this.setMessageBadge();
		this.forceUpdate();
	},
	focusChange: function() {
		if (Interface.isFocus()) {
			switch (this.props.pointer) {
				case 'consult':
				case 'remind':
				case 'expert':
					return this.select(this.props.pointer);
			}

			for (var i = 0; i < this.state.sessionList.length; i++) {
				var item = this.state.sessionList[i];
				if (this.props.pointer == item._id) {
					this.select(item);
				}
			}
		}
	},
	clearSundryUnread: function(type, callback) {
		MessageHandle.clearSundryUnread(type, callback)
	},
	receiveSundry: function(type, isClick) {
		var isForceUpdate = false;
		var windowState = Interface.getWindowState();
		var windowIsVisible = windowState == 3 || windowState == 5;
		var windowIsFocus = Interface.isFocus();
		switch (type) {
			case 'remind':
				if ((this.props.pointer == 'remind' && windowIsFocus && windowIsVisible) || isClick == true) {
					this.state.notify = 0;
					this.clearSundryUnread(0);
					isForceUpdate = true;
				} else {
					var item = isClick;
					if (typeof(item.body.inline) == 'string') {
						try {
							item.body.inline = JSON.parse(item.body.inline);
						} catch(e) {
						
						}
					}
					isForceUpdate = true;
					this.state.notify++;
				}

				if (!windowIsFocus || !windowIsVisible) {
					Interface.popNotify(location.origin + '/assets/images/remind.png', '提醒', isClick.body.inline.content, type, 'remind');
				}
				this.setMessageBadge();
			break;
			case 'consult':
				if ((this.props.pointer == 'consult' && windowIsFocus && windowIsVisible) || isClick == true) {
					this.state.cms = 0;
					this.clearSundryUnread(1);
					isForceUpdate = true;
				} else {
					isForceUpdate = true;
					this.state.cms++;
				}

				if (!windowIsFocus || !windowIsVisible) {
					var inline = isClick.body.inline;
					if (typeof(isClick.body.inline) == 'string') {
						inline = JSON.parse(isClick.body.inline);
					}

					Interface.popNotify(location.origin + '/assets/images/news.png', '资讯推送', inline.intro, type, 'consult');
				}
				this.setMessageBadge();
			break;
			
			case 'system':
				if ((this.props.pointer == 'system' && windowIsFocus && windowIsVisible) || isClick == true) {
					this.state.system = 0;
					this.clearSundryUnread(2);
					isForceUpdate = true;
				} else {
					isForceUpdate = true;
					this.state.system++;
				}

				if (!windowIsFocus || !windowIsVisible) {
					var inline = isClick.body.inline;
					if (typeof(isClick.body.inline) == 'string') {
						inline = JSON.parse(isClick.body.inline);
					}
					Interface.popNotify(location.origin + '/assets/images/system.png', '系统消息', inline.content, type, 'system');
				}
				this.setMessageBadge();
			break;
		}

		if (isForceUpdate) {
			this.forceUpdate();
		}
	},
	openMessage: function(type) {
		Interface.bringWindowToTop();
		Interface.gotoLeftNavView(Config.MODULE_NAME.MESSAGE);
		setTimeout(function() {
			switch(type) {
				case 'remind':
				case 'system':
				case 'consult':
					this.select(type);
				break;
				default:
					var data = {ref_id: type._id, ref_type: type.type};
					this.select(this.getInMenu(data));
			}
		}.bind(this), 200);
	},
	componentDidMount: function() {
		Utils.playQueue([this.getNotifyUnread, this.getInventory], function() {
			this.setMessageBadge();
		}.bind(this));

		Event.on('OpenMessage', this.openMessage);
		Event.on('FocusChange', this.focusChange);
		Event.on('NewConsult', this.receiveSundry.bind(this, 'consult'));
		Event.on('NewNotify', this.receiveSundry.bind(this, 'remind'));
		Event.on('NewSystem', this.receiveSundry.bind(this, 'system'));
	},
	getInitialState: function() {
		return {sessionList: [], search: '', notify: 0, cms: 0, system: 0};
	},
	render: function() {
		return <div className="message_list">
						<div className="search_box">
							<input type="text" placeholder="搜索" value={this.state.search} onChange={this.search} />
						</div>
						<ul className="message_tab_list">
							<li onClick={this.select.bind(null, 'expert')} className={this.getClassname('expert')}>
								<i className="message_tab_header expert"></i>
								<div className="message_tab_content">
									<span>
										<label>牛人榜</label>
									</span>
									<p>持牌投顾排行榜</p>
								</div>
							</li>

							<li onClick={this.select.bind(null, 'consult')} className={this.getClassname('consult')}>
								<i className="message_tab_header consult"></i>
								<div className="message_tab_content">
									<span>
										<label>资讯推送</label>
										{this.state.cms ?
												<time className="unread"></time> : null}
									</span>
									<p>日常资讯推送</p>
								</div>
							</li>
							
							<li onClick={this.select.bind(null, 'remind')} className={this.getClassname('remind')}>
								<i className="message_tab_header remind"></i>
								<div className="message_tab_content">
									<span>
										<label>提醒</label>
										{this.state.notify ?
												<time className="unread"></time> : null}
									</span>
									<p>日常工作提醒</p>
								</div>
							</li>
							
							<li onClick={this.select.bind(null, 'system')} className={this.getClassname('system')}>
								<i className="message_tab_header system"></i>
								<div className="message_tab_content">
									<span>
										<label>系统消息</label>
										{this.state.system ?
												<time className="unread"></time> : null}
									</span>
									<p>系统消息内容</p>
								</div>
							</li>
							{this.getSessionList()}

							<li onClick={this.select.bind(null, 'complain')} className={this.getClassname('complain')}>
								<i className="message_tab_header complain"></i>
								<div className="message_tab_content">
									<span>
										<label>投诉建议</label>
									</span>
									<p></p>
								</div>
							</li>
						</ul>
					</div>
				}
});