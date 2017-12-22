var Pusher = require('pusher');

var SocketHandle = require('../handle/Socket');

console.log("初始化socket")
var Socket = new Pusher({host: Config.PUSHER.HOST, port: Config.PUSHER.PORT});

function subscribe(channels) {
	Socket.push(function() {
		SocketHandle.subscribe({socket_id: Socket.socket.id, channels: channels}, function(result, orignal) {
			if (result.code == 200) {
				for (var i = 0; i < result.data.length; i++) {
					var item = result.data[i];
					item.orignal = orignal.channels[i];
					Socket.subscribe(item);
				}
			}
		});
	})
}

function unsubscribe(data) {
	if (data instanceof Array) {
		for (var i = 0; i < data.length; i++) {
			unsubscribe(data[i]);
		}
		return;
	}

	var channel;
	switch (data.type) {
		case Config.CHANNEL_TYPE.CHANNEL:
			channel = Socket.channelList['private-channel-' + data.channel];
		break;
		case Config.CHANNEL_TYPE.SESSION:
			channel = Socket.channelList['private-member-' + data.channel];
		break;
	}

	channel && channel.unsubscribe();
}

Event.on('Subscribe', subscribe);
Event.on('Unsubscribe', unsubscribe);

Socket.socket.on('pusher:connection_established', function(e) {
	if (Socket.connectionIndex > 1) { 
		//# 断线重连
		Socket.resubscribe(function(list) {
			var channelList = $.map(list, function(item) {
				if (item.subscribed == 2) return null;
				return item.auth.orignal;
			});
			channelList.length > 0 && subscribe(channelList);
		});
		return false;
	}
});

// 监听频道
function listerChannel(_channel) {
	_channel.on('pull-message', function(data) {
		var MessageHandle = require('../handle/messages/Index');
		MessageHandle.getMessage(data.data, function(result) {
			if (result.code == 200) {
				if (data.state) result.data.md5 = data.state;
				Interface.pushMessage('NewMessage', result.data);
			}
		})
	});

	_channel.on('pull-notify', function(data) {
		var MessageHandle = require('../handle/messages/Index');
		MessageHandle.getNotify(data.data, function(result) {
			if (result.code == 200) {
				Interface.pushMessage('NewNotify', result.data);
			}
		})
	});
	
	_channel.on('pull-system', function(data) {
        var MessageHandle = require('../handle/messages/Index');
        MessageHandle.getSingleSystem(data.data, function(result) {
            if (result.code == 200) {
                Interface.pushMessage('NewSystem', result.data);
            }
        })
	});

	_channel.on('pull-news', function(data) {
		var MessageHandle = require('../handle/messages/Index');
		MessageHandle.getNotify(data.data, function(result) {
			if (result.code == 200) {
				Interface.pushMessage('NewConsult', result.data);
			}
		})
	});

	_channel.on('start-weblive', function(data) {
		Interface.pushMessage('LiveStateChange' + data.data, '1');
	});

	_channel.on('end-weblive', function(data) {
		Interface.pushMessage('LiveStateChange' + data.data, '0');
	});

	_channel.on('join-group', function(data) {
		var _data = data.channel.split('private-channel-')[1];
		Interface.pushMessage('JoinWebLive' + _data, data.data);
	});
}

Socket.socket.on('pusher:subscription_succeeded', function (object) {
	var _channel = Socket.channelList[object.channel];
	listerChannel(_channel);
});

module.exports = Socket;