(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simditor-emoji', ['jquery', 'simditor'], function (a0,b1) {
      return (root['EmojiButton'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('jquery'), require('Simditor'
	));
  } else {
    root['SimditorEmoji'] = factory(jQuery,Simditor);
  }
}(this, function ($, Simditor) {

var EmojiButton,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

EmojiButton = (function(superClass) {
    extend(EmojiButton, superClass);

  EmojiButton.i18n = {
    'zh-CN': {
      emoji: '表情'
    },
    'en-US': {
      emoji: 'emoji'
    }
  };

  var _images = [];
  for (var i = 0; i < 60; i++) {
	  _images.push(i);
  }
  EmojiButton.images = _images;

  EmojiButton.prototype.name = 'emoji';

  EmojiButton.prototype.icon = 'smile-o';

  EmojiButton.prototype.menu = true;

  function EmojiButton() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    EmojiButton.__super__.constructor.apply(this, args);
    $.merge(this.editor.formatter._allowedAttributes['img'], ['data-emoji', 'alt']);
  }

  EmojiButton.prototype.renderMenu = function() {
    var $list, dir, html, i, len, name, opts, ref, tpl;
    tpl = '<ul class="emoji-list">\n</ul>';
    opts = $.extend({
      imagePath: '/emojis/',
      images: EmojiButton.images
    }, this.editor.opts.emoji || {});
    html = "";
    dir = opts.imagePath.replace(/\/$/, '') + '/';
    ref = opts.images;
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
	  var alt = Config.EMOJI[name] ? '[' + Config.EMOJI[name] + ']' : Config.EMOJI[name];
      html += "<li data-name='" + name + "'><img src='" + Url.getAssets(dir + name) + ".png' width='24' height='24' alt='" + alt + "' /></li>";
    }
    $list = $(tpl);
    $list.html(html).appendTo(this.menuWrapper);
    return $list.on('mousedown', 'li', (function(_this) {
      return function(e) {
        var $img;
        _this.wrapper.removeClass('menu-on');
        if (!_this.editor.inputManager.focused) {
          return;
        }
        $img = $(e.currentTarget).find('img').clone().attr({
          'data-emoji': true
        });
        _this.editor.selection.insertNode($img);
        _this.editor.trigger('valuechanged');
        _this.editor.trigger('selectionchanged');
        return false;
      };
    })(this));
  };

  EmojiButton.prototype.status = function() {};

  return EmojiButton;

})(Simditor.Button);

Simditor.Toolbar.addButton(EmojiButton);

return EmojiButton;

}));
