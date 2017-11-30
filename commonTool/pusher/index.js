var io = require('socket.io-client');

/**
 * 订阅频道对象
 * Channel
 */
function Channel(pusher, auth) {
	if (!(this instanceof Channel)) return new Channel(pusher, auth);
	this.eventList = {};
	this.subscribed = 0; // 0 订阅前  1 已订阅  2 取消前
	this.pusher = pusher;
	this.auth = auth;
	this.subscribe();
}

Channel.prototype = Event.__proto__;

/// 订阅频道
Channel.prototype.subscribe = function () {
	var pusher = this.pusher;
	var commandData = ['pusher:subscribe', {auth: this.auth.auth, channel: this.auth.channel, callback: this.auth.callback || ''}];

	pusher.sendCommandQueue(commandData);
	return this;
};

// 取消订阅频道
Channel.prototype.unsubscribe = function () {
	var pusher = this.pusher;
	var commandData = ['pusher:unsubscribe', {auth: this.auth.auth, channel: this.auth.channel, callback: ''}];
	this.subscribed = 2;
	pusher.sendCommandQueue(commandData);
	return this;
};

var PusherClass  = {
	/// 连接socket
	initial: function () {
		if (typeof (io) == 'undefined' || this.config.host == null) return false;

		this.socket = io.connect(this.config.host + ':' + this.config.port, {reconnectionDelay: 5000, transports: ['websocket', 'polling']});
		this.addEventlister();
	},
	addEventlister: function () {
		var that = this;

		that.socket.on('connect', function (obj) {
			//console.log('connect', Utils.formatDate(), obj);
		});

		that.socket.on('connect_error', function (obj) {
			//console.log('connect_error', Utils.formatDate(), obj);
		});	

		that.socket.on('connect_timeout', function () {
			//console.log('connect_timeout', Utils.formatDate());
		});	

		that.socket.on('error', function (obj) {
			//console.log('error', Utils.formatDate(), obj);
		});	

		that.socket.on('disconnect', function (obj) {
			//console.log('disconnect', Utils.formatDate(), obj);
			clearInterval(that.heartbeat);
		});

		that.socket.on('reconnect', function (obj) {
			//console.log('reconnect', Utils.formatDate(), obj);
		});
		
		that.socket.on('reconnect_attempt', function (obj) {
			//console.log('reconnect_attempt', Utils.formatDate(), obj);
		});

		that.socket.on('reconnecting', function (obj) {
			//console.log('reconnecting', Utils.formatDate(), obj);
			Event.trigger('ChangeSocketState', {state: Config.NETWORK_STATE.ERROR, data: obj});
		});

		that.socket.on('reconnect_error', function (obj) {
			//console.log('reconnect_error', Utils.formatDate(), obj);
		});

		that.socket.on('reconnect_failed', function (obj) {
			//console.log('reconnect_failed', Utils.formatDate(), obj);
		});

		/// 双方握手成功
		that.socket.on('pusher:connection_established', function () {
			that.connectionIndex++;
			that.callQueue();

			Event.trigger('ChangeSocketState', {state: Config.NETWORK_STATE.COMPLETE});
			clearInterval(that.heartbeat);
			that.heartbeat = setInterval(function() {
				if (that.heartIndex < 0) that.heartIndex = 0;
				Event.trigger('Heartbeat', that.heartIndex);
				that.heartIndex--
				that.sendCommand('heartbeat');
			}, 5000);
		});
		
		/// 心跳回执
		that.socket.on('pusher:heartbeat_was_respond', function () {
			that.heartIndex += 2;
			if (that.heartIndex > 5) {
				that.heartIndex = 5;
			}
		});

		/// 订阅频道成功
		that.socket.on('pusher:subscription_succeeded', function (object) {
			that.channelList[object.channel].subscribed = 1;
		});

		/// 取消订阅频道成功
		that.socket.on('pusher:unsubscription_succeeded', function (object) {
			if (typeof (object) == 'string') {
				object = JSON.parse(object);
			}

			delete that.channelList[object.channel];
		});

		/// 频道接收消息事件
		that.socket.on('pusher:event', function (object) {
			if (typeof (object) == 'string') {
				object = JSON.parse(object);
			}

			try {
				object.data = JSON.parse(object.data);
			} catch (e) {}

			if (that.channelList[object.channel]) {
				that.channelList[object.channel].trigger(object.event, object);
			}
		});

		/// 错误事件
		that.socket.on('pusher:error', function (object) {
			
		});
	},
	callQueue: function() {
		for (var i = 0; i < this.queue.length; i++) {
			typeof(this.queue[i]) == 'function' && this.queue[i]();
		}
		this.queue.length = 0;
	},
	push: function(callback) {
		if (this.socket && this.socket.connected) {
			typeof(callback) == 'function' && callback();
			return true;
		}
		this.queue.push(callback);		
	},
	/// 发送command
	sendCommand: function(obj) {
		if (obj.type) {
			var eventType = obj.type;
			delete obj.type;
			this.socket.emit(eventType, obj);
			return true
		}

		this.socket.emit(obj);
		return true
	},
	sendCommandQueue: function(obj) {
		var that = this;
		that.push(function() {
			that.sendCommand(obj);
		});
	},
	subscribe: function(item, force) {
		if (!this.channelList[item.channel] || force) {
			this.channelList[item.channel] = new Channel(this, item);
		}
		return this.channelList[item.channel];
	},
	/// 取消订阅
	unsubscribe: function(channel) {
		if (this.channelList[channel]) { 
			this.channelList[channel].unsubscribe();
			return true;
		}
		return false;
	},
	resubscribe: function(callback) {
		var channelList = this.channelList;
		this.channelList = {};
		typeof(callback) == 'function' && callback(channelList);
	}
}

function Pusher(config) {
	if (!(this instanceof Pusher)) {
		return new Pusher(config);
	}

	this.config = $.extend({host: 'pusher.facework.im', port: 3380}, config);

	this.queue = [];
	this.channelList = {};
	this.heartIndex = 5;
	this.connectionIndex = 0;
	this.heartbeat = null;
	this.initial();
}

Pusher.prototype = PusherClass;

module.exports = Pusher;