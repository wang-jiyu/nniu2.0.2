module.exports = {
	// 附件上传
	upload: function(url, data, callback) {
		var formData = new FormData();
		formData.append('original_filename', data.name);
		formData.append('upload_file', data.file);

		data.ajax = Forms.post({
						api: Config.SITE_URL.ATTACHMENT,
						uri: url,
						params: formData,
						processData: false,
						xhr: function() {
							var myXHR = $.ajaxSettings.xhr();
							if (typeof(data.getProgress) == 'function') {
								data.upload = myXHR.upload;
								myXHR.upload.addEventListener('progress', data.getProgress, false);
							}
							return myXHR; 
						}.bind(this),
						callback: function(result) {
							if (result.code == 42602) {
								Event.trigger('OpenAlert', {
									title: '上传类型有误',
									message: '抱歉，您上传的文件类型有误！（仅可以上传图片以及PDF格式文件）',
									button: Config.MESSAGE_BUTTON.OK
								});
							}
							if (data.upload) {
								data.upload.removeEventListener('progress', data.getProgress, false);
								delete data.getProagess;
							}
							typeof(callback) == "function" && callback(result);
						}.bind(this)
					});
		return data.ajax;
	},

	proxy: function(url, data, callback) {
		return this.upload(url, data, function(result) {
					typeof(callback) == 'function' && callback(result);
					typeof(data.uploadComplete) == 'function' && data.uploadComplete(result);
				});
	},
	uploadToMessage: function(data, callback) {
		var _url = '/api/message/upload?ref_id=' + data.ref_id + '&ref_type=' + data.ref_type;
		if (data.state) _url = '/api/message/upload?ref_id=' + data.ref_id + '&ref_type=' + data.ref_type + '&state=' + data.state;
		return this.proxy(_url, data, callback);
	},

    uploadToEntity: function(data, callback) {
        var _url = '/api/entity/upload?ref_id=' + data.ref_id + '&ref_type=' + data.ref_type;
        if (data.state) _url = '/api/entity/upload?ref_id=' + data.ref_id + '&ref_type=' + data.ref_type + '&state=' + data.state;
        return this.proxy(_url, data, callback);
    },

	uploadToAvatar: function(data, callback) {
		var _url = '/api/avatar/upload';
		return this.proxy(_url, data, callback);
	},
	uploadToReport: function(data, callback) {
		var _url = '/api/entity/upload?ref_type=' + data.ref_type + '&is_pay=' + data.is_pay + '&ref_id=' + data.ref_id;
		return this.proxy(_url, data, callback);
	},
	download: function(url, data, method) {
		var method = (method || 'get').toLocaleLowerCase();

		if (url.indexOf('access_token') < 0) url += '?access_token=' + Config.ACCESS_TOKEN;
		if (method == 'get' && !data) data = Url.toSerialize(url);

		var name = 'download' + Utils.createId();
		var objForm = $('<form target="' + name + '" method="' + method + '" action="' + url + '" style="display:none"><iframe name="' + name + '" ></iframe>' + getList(data) + '<input type="submit" /></form>').appendTo('body');
		objForm[0].submit();
		setTimeout(function() {
			objForm.remove();
		}, 5000);
		function createKey(field, content) {
			return '<textarea name="' + field + '">' + content + '</textarea>';
		}

		function getList(list) {
			var result = '';
			if (list) {
				for (var key in list) {
					result += createKey(key, list[key]);					
				}
			}
			return result;
		}
	},
	transfersToFiles: function(transfers) {
		if (!transfers || transfers.length == 0) return false;
		var result = {length: 0};
		var time = Utils.formatDate(new Date, 'YYYY-MM-DD HH:mm:SS');
		for (var i = 0; i < transfers.length; i++) {
			var item = transfers[i];
			if (item.kind == 'file') {
				var blob = item.getAsFile();
				var filename = blob.name || '粘帖上传- ' + time + ' ' + i + '.' + blob.type.split('/')[1];
				var file = new File([blob], filename, {type: blob.type});
				if (file.size == 0) continue;
				result[result.length] = file;
				result.length++;
			}
		}
		if (result.length == 0) return false;
		return result;
	},
	// 获得附件文件
	getFile: function(id, param) {
		var siginInfo = '';
		if (Config.ACCESS_TOKEN) siginInfo = 'access_token=' + Config.ACCESS_TOKEN;
		if (!param) return Config.SITE_URL.ATTACHMENT + '/api/attachments/' + id + '?' + siginInfo;
		return Config.SITE_URL.ATTACHMENT + '/api/attachments/' + id + '?' + $.param(param) + '&' + siginInfo;
	}
}