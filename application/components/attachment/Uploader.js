var AttachmentHandle = require('../../handle/Attachment');

module.exports = React.createClass({
	timeKey: '',
	uploader: function() {
		Forms.disableButton(this.refs.btnUploader);
		var temp = this.state.temp;
		var count = 0;
		Array.prototype.map.call(this.state.source, function(item, i) {
			var objCover = $(this.refs['cover' + i]);
			var data = {
				file: item,
				name: temp[i] ? temp[i] : item.name,
				ref_id: this.props.id,
				ref_type: this.props.refType,
				state: Utils.getMessageState(),
				getProgress: function(e) {
					var percent = e.loaded / e.total * 100;
					var _height = 100 - percent;
					objCover.css({height: _height + '%'});
				}
			};
			AttachmentHandle.uploadToMessage(data, function(result) {
				typeof(this.props.onUploaded) == 'function' && this.props.onUploaded(result.data);
				if (++count == this.state.source.length) this.close();
			}.bind(this));			
		}.bind(this));
		
	},
	removeFile: function(index) {
		delete this.state.source[index];
		delete this.state.temp[index];
		for (var i = index + 1; i < this.state.source.length; i++) {
			this.state.source[i - 1] = this.state.source[i];
			this.state.temp[i - 1] = this.state.temp[i];
		}
		if (--this.state.source.length == 0) return this.close();
		setTimeout(function() {
			var _height = $(this.refs.dialogPage).height();
			var setHeight = Math.min(_height + 100, 544);
			Event.trigger('ChangeDialog', {height: setHeight});	
		}.bind(this));
		this.timeKey = $.now();
		this.setState({source: this.state.source});
	},
	close: function() {
		Event.trigger('CloseDialog');
	},
	txtBind: function(i, e) {
		this.state.temp[i] = e.currentTarget.value;
		this.setState({temp: this.state.temp});
	},
	componentWillMount: function() {
		var base64;
			if (this.props.files.length == 1) {
				var file = this.props.files[0];
				var index = file.type.indexOf('image');
				if (index == 0 && file.type != 'image/vnd.adobe.photoshop') {
					var reader = new FileReader();
					reader.onload = function(e) {
						var img = new Image;
						img.src = e.currentTarget.result;
						//img = $(img).css({maxWidth: '180px', maxHeight: '180px'});
						//img.appendTo('body');
						img.onload = function() {
                            img.width = img.width > 180 ? 180:img.width;
                            img.height = img.height > 180 ? 180:img.height;
                            Event.trigger('ChangeDialog', {height: 260 + img.height});
						}
                        img.remove();
						this.setState({base64: e.currentTarget.result});
					}.bind(this)
					reader.readAsDataURL(file);
				}
			}
	},
	componentDidMount: function() {
		if (this.props.files.length >= 2) {
			var _height = $(this.refs.dialogPage).height();
			var setHeight = Math.min(_height + 100, 544);
			Event.trigger('ChangeDialog', {height: setHeight});
		}

	},
	
	getInitialState: function() {
		
		return {source: this.props.files, temp: {}, length: this.props.files.length};
	},
	render: function() {
		if (this.state.length == 0) return null;

		/*if (this.props.isExt) {
			var ext = ['jpg', 'png', 'gif', 'jpeg'];
			var fileExt = this.props.files[0].name.split('.')[1];

			ext = $.extend(ext, this.props.isExt.split(','));
			var extIndex = ArrayCollection.indexOf.call(ext, fileExt);

			if (extIndex < 0) return <div>请上传图片或者pdf文件</div>
		}*/


		if (this.state.length == 1) {
			var item = this.state.source[0];
			return <div className="dialog_page">
						<div className="uploader_preview">
						{
							this.state.base64 ?
							<div>
								<img src={this.state.base64}/>
								<div className="cover" ref="cover0"></div>
							</div>
							 :
							<div>
								<img src={Utils.getFileIcon(item.name)} width="80" height="80"/>
								<div className="cover" ref="cover0"></div>
							</div>
						}
							
						</div>
						<table width="100%" className="form_table" >
							<tbody>
								<tr>
									<td className="field">文件名称</td>
									<td><input type="text" className="short" value={this.state.temp[0] == undefined ? item.name : this.state.temp[0]} onChange={this.txtBind.bind(this, 0)}/></td>
								</tr>
							</tbody>
						</table>
						<table width="100%" className="operate_table">
							<tbody>
								<tr>
									<td className="field"></td>
									<td>
										<input type="button" value="上传" className="blue" onClick={this.uploader} ref="btnUploader" />
										<a href="javascript:;" onClick={this.close}>取消</a>
									</td>
								</tr>
							</tbody>
						</table>
				</div>;
		}

		var fileList = []
		for (var i = 0; i < this.state.source.length; i++) {
			var item = this.state.source[i];
			fileList.push(<tr key={this.timeKey + i} className="upload_trs">
							<td width="60">
								<img src={Utils.getFileIcon(item.name)} width='40' height='40'/>
								<div className="cover" ref={'cover' + i}></div>
							</td>
							<td width="380"><input type="text" name="name" value={this.state.temp[i] == undefined ? item.name : this.state.temp[i]} onChange={this.txtBind.bind(this, i)} /></td>
							<td><a href="javascript:;" onClick={this.removeFile.bind(this, i)} className="btn_delete">删除</a></td>
							
						</tr>);
		}

		return <div className="dialog_page" ref="dialogPage">
				<table width="100%"  className="form_table" >
					<tbody ref="upList">
						{fileList}
					</tbody>
				</table>
				<table width="100%" className="operate_table">
					<tbody>
						<tr>
							<td width="60"></td>
							<td>
								<input type="button" value="上传" className="blue" onClick={this.uploader} ref="btnUploader"/>
								<a href="javascript:;" onClick={this.close}>取消</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
	}
});