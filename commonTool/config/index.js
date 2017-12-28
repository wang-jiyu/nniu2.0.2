module.exports = {
	ID: 0, // Utils.crateId()
	CACHE_DATA: {
		DEVICE_IDENTITY: Math.random(),
		BANNED_LIST: {}, //直播禁言列表
		GROUP_LIST: [], //会员组
		ROOM: {}, //房间信息
		USER: {} //用户信息
	},
	REFRESH_TOKEN: Url.getParam('refresh_token'),
	FOCUSIN: false,

	SITE_URL: {
        API: 'https://mapi2.0606.com.cn',
        CMS: 'https://cms2.0606.com.cn',
        ADVISOR: 'https://advisor2.0606.com.cn',
        ATTACHMENT: 'https://box2.0606.com.cn',
		DEV_STRATEGY: 'https://116.62.182.134:8085'
	},
	PUSHER: {
		SAFETY_KEY: '9104cfcb1e8e4d7b',
		HOST: 'wss://pusher2.0606.com.cn',
		PORT: 443,
	},
	CHANNEL: {
		CHANNEL: {
			PREV: 'private-channel-',
			TYPE: 1
		},
		SESSION: {
			PREV: 'private-member-',
			TYPE: 2
		},
	},

	MODULE_KEY: {

	},
	CHANNEL_TYPE: {
		CHANNEL: 1,
		SESSION: 2
	},
	CHANNEL_REF: {
		TACTICS: 1,
		LIVE: 2,
		TEXT: 3,
		REPORT: 4,
		VIP: 5,
		ROOM: 9
	},
	MODULE_NAME: {
		USERCENTER: 100,
		NEWS: 200,
		JEWEL: 300,
		LIVE: 301,
		CLASSROOM: 302,
		MESSAGE: 500,
		STRATEGY: 400
	},
	LIMIT: {
		NONE: 0,
		FULL: -1,
		LIST: 1,
		ADD: 2,
		EDIT: 4,
		DELETE: 8
	},
	REGISTER_WAYS: {
		DEFAULT: 0,
		MAIL: 1,
		LINK: 2
	},
	PUSH_MESSAGE: {
		PROMPT: 0,
		SUCCESS: 1
	},
	MESSAGE_BUTTON: {
		NONE: 0,
		OK: 1,
		OKCANCEL: 2,
		DELETE: 3
	},
	NETWORK_STATE: {
		ABORT: 0,
		ERROR: 1,
		COMPLETE: 2
	},
	EVENT: {
		TRANSITION_END: (function() {
			var transEndEventNames = {
				WebkitTransition: 'webkitTransitionEnd',
				MozTransition: 'transitionend',
				OTransition: 'oTransitionEnd otransitionend',
				transition: 'transitionend'
			};

			var body = document.body || document.documentElement,
				style = body.style;

			for (var name in transEndEventNames) {
				if (typeof style[name] === 'string') return transEndEventNames[name];
			}
		})()
	},
	FILE_EXT: {
		'3GP': '3gp.png',
		'7Z': '7z.png',
		'404': '404.png',
		'AI': 'ai.png',
		'ASF': 'asf.png',
		'ASP': 'asp.png',
		'AVI': 'avi.png',
		'BMP': 'bmp.png',
		'C': 'c.png',
		'CHM': 'chm.png',
		'CSS': 'css.png',
		'DMG': 'dmg.png',
		'DOC': 'doc.png',
		'DOCX': 'docx.png',
		'DWG': 'dwg.png',
		'EPS': 'eps.png',
		'EXE': 'exe.png',
		'FLV': 'flv.png',
		'GIF': 'gif.png',
		'GZ': 'gz.png',
		'HTM': 'htm.png',
		'HTML': 'html.png',
		'ICO': 'ico.png',
		'ISO': 'iso.png',
		'JAR': 'java.png',
		'JPEG': 'jpeg.png',
		'JPG': 'jpg.png',
		'JS': 'js.png',
		'LOG': 'log.png',
		'MKV': 'mkv.png',
		'MOV': 'mov.png',
		'MP3': 'mp3.png',
		'MP4': 'mp4.png',
		'MPEG': 'mpeg.png',
		'PDF': 'pdf.png',
		'PHP': 'php.png',
		'PNG': 'png.png',
		'PPT': 'ppt.png',
		'PPTX': 'pptx.png',
		'PSD': 'psd.png',
		'RAR': 'rar.png',
		'RM': 'rm.png',
		'RMVB': 'rmvb.png',
		'RP': 'rp.png',
		'SWF': 'swf.png',
		'TIF': 'tif.png',
		'TXT': 'txt.png',
		'WAV': 'wav.png',
		'WMV': 'wmv.png',
		'XLS': 'xls.png',
		'XLSX': 'xlsx.png',
		'XML': 'xml.png',
		'ZIP': 'zip.png',
		'DEFAULT': 'default.png'
	},
	EMOJI: ['微笑', '大笑', '憨笑', '奸笑', '调皮',
		'心花怒放', '大哭', '愤怒', '休息一下', '抠鼻',
		'发呆', '表扬', '不好意思', '亲亲', '抓狂',
		'不会吧', '捂脸', '不明白', '凶', '再见',
		'害羞', '惊讶', '探索', '晕', '没什么了不起',
		'可怜', '鼓掌', '衰', '难过', '哼',
		'委屈', '批评', '骂人', '酷', '迟到',
		'卖萌', '挨打', '吐', '出差', '下班',
		'奋斗', '受伤', '坏笑', '鄙视', '拥抱',
		'加班', '爱心', '心碎', '礼物', '咖啡',
		'太棒了', 'OK', '握手', '过来一下', 'NO',
		'YES', '晚安', '太阳', '生日蛋糕', '鲜花'
	],
	RULE_LIST: require('./rule'),
	LOCALES: require('./locales'),
	TOOL: require('./tool'),
	PATH: ''
};

$.extend(module.exports, window.Config);
