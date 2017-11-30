var AttachmentHandle = require('../../../handle/Attachment');

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simditor-attachment', ["jquery","simditor"], function (a0,b1) {
      return (root['AttachmentButton'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("Simditor"));
  } else {
    root['SimditorAttachment'] = factory(jQuery,Simditor);
  }
}(this, function ($, Simditor) {

	var AttachmentButton,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  slice = [].slice;

	AttachmentButton = (function(superClass) {
		extend(AttachmentButton, superClass);

		AttachmentButton.prototype.name = 'attachment';

		AttachmentButton.prototype.icon = 'attachment-o';

		AttachmentButton.prototype.menu = false;

		AttachmentButton.prototype.render = function () {
			var the = this;
			var res = AttachmentButton.__super__.render.call(this), objInput, uploadProgress;
			
			createInput = (function(_this) {
			  return function() { 
				if (objInput) {
					objInput.remove();
				}

				return objInput = $('<input/>', {
				  type: 'file',
				  multiple: true,
				  name: 'upload_file',
				  style: 'display:none',
				  tabindex: -1,
				  accept: the.editor.opts.fileParam.isExt || '*'
				}).appendTo(_this.el);
			  };
			})(this);

			createInput();

			this.el.on("click", function (e) {
				objInput.click();
			});
			var DialogUploader;
			if (this.editor.opts.fileParam) {
				DialogUploader = this.editor.opts.fileParam.dialogUploader;
				delete this.editor.opts.fileParam.dialogUploader;
			}

			this.el.on("click", 'input[type=file]', function (e) {
				return e.stopPropagation();
			}).on("change", 'input[type=file]', function (e) {
				if (e.currentTarget.files.length == 0) return true;
				var files = $.extend(true, {}, e.currentTarget.files);
				$(e.currentTarget).val('');
				var IPopup = {module: <DialogUploader {...this.editor.opts.fileParam} files={files} key={$.now()} />,
						title: '文件上传',
						height: 340,
						width: 570};
				Event.trigger('OpenDialog', IPopup);
			}.bind(this));
			
			this.editor.body.on('paste', function (e) {
				e.preventDefault();
				var clipboardData = e.originalEvent.clipboardData;
				if (clipboardData.items.length == 0) return false;
				var files = AttachmentHandle.transfersToFiles(clipboardData.items);
				if (!files) {
					clipboardData.items[0].getAsString(function(str) {
						document.execCommand('insertHTML', null, str.replace(/\r\n|\<|\>/g, function(result) {
							switch (result) {
								case '<': return '&lt;';
								case '>': return '&gt;';
							}
							return '<br>'
						}));
					});
					return false;
				}
				var IPopup = {module: <DialogUploader files={files} {...this.editor.opts.fileParam} key={$.now()}/>,
						title: '文件上传',
						height: 340,
						width: 570};
				Event.trigger('OpenDialog', IPopup);
			}.bind(this));
			return res;

		}

		function AttachmentButton() {
			AttachmentButton.__super__.constructor.apply(this, arguments);
		}

		return AttachmentButton;
	})(Simditor.Button);
	
	Simditor.Toolbar.addButton(AttachmentButton);
	return AttachmentButton;
}));