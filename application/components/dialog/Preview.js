module.exports = React.createClass({
    time: null,
    imgAnimate: null,
    imgScale: null,
    animate: function(data, out, enter) {
        data.css({transform: 'translate(' + out +  'px)', opacity: 0}).one(Config.EVENT.TRANSITION_END, function() {
            data.css({transform: 'translate(' + enter +  'px)'});
            setTimeout(function() {
                data.one(Config.EVENT.TRANSITION_END, function() {
                    this.clearScale();
                    this.setState({index: this.state.index, top: null});
                    var _img = data.find('img');
                    var time = setInterval(function() {
                        if (_img[0].complete) {
                            this.load(_img);
                            data.css({transform: 'translate(0)', opacity: 1}).one(Config.EVENT.TRANSITION_END, function() {
                                this.imgAnimate = null;
                                clearInterval(time)
                            }.bind(this));
                        }
                    }.bind(this), 100);
                }.bind(this));
            }.bind(this), 0);
        }.bind(this));
    },
    clear: function() {
		if (!this.time) return null;
        $(this.refs.carousel).removeClass('carousel');
        clearInterval(this.time);
        this.time = null;
    },
    clearScale: function() {
        var _data = $(this.refs.content);
        _data.attr('class', 'preview_content');
        this.imgScale = null;
    },
    open: function(data) {
        var _items = {open: true, source: data.source, index: data.index, top: null};

        $('body').on('click', this.clickClose);
        $(window).on('resize', this.resize).on('keydown', this.previewDown);
        this.setState(_items);
    },
    prev: function() {
        if (this.imgAnimate || this.state.source.length <= 1) return false;
        this.state.index --;
        if (this.state.index < 0) this.state.index = this.state.source.length - 1;
        this.imgAnimate = $(this.refs.imgBox);
        this.animate(this.imgAnimate, '200', '-200');
        this.clear();
    },
    next: function(clear) {
        if (this.imgAnimate || this.state.source.length <= 1) return false;
        this.state.index ++;
        if (this.state.index > this.state.source.length - 1) this.state.index = 0;
        this.imgAnimate = $(this.refs.imgBox);
        this.animate(this.imgAnimate, '-200', '200');
        if (clear) this.clear();
    },
    carousel: function() {
        if (!this.time) {
            $(this.refs.carousel).addClass('carousel');
            this.time = setInterval(function() {
                if ($(this.refs.imgBox).find('img')[0].complete) this.next();
            }.bind(this), 4000);
        } else {
            this.clear();
        }
    },
    wheel: function(e) {
        e.stopPropagation();
        if (this.imgScale) return false;
        if (e.deltaY < 0) return this.prev();
        return this.next(true);
    },
    scale: function() {
        if (!this.imgScale) {
            this.imgScale = $(this.refs.content);
            this.imgScale.attr('class', 'over');
            this.imgScale.scrollTop(0).scrollLeft(0);
        } else {
            this.clearScale();
        }
    },
    load: function(img) {
        var _window = $(window);
        var top = (_window.height() - img.height() - 50) / 2;
        if (top < 60) top = 60;
        this.setState({top: top});
    },
    close: function() {
        $('body').off('click', this.clickClose);
        $(window).off('resize', this.resize).off('keydown', this.previewDown);
        $(this.refs.imgBox).find('img').off('load');

        var preview = $(this.refs.preview);
        preview.addClass('preview_hide');
        preview.one(Config.EVENT.TRANSITION_END, function() {
            preview.removeClass('preview_hide');
            this.clearScale();
            this.clear();
            this.setState({open: false, top: null});
            this.imgAnimate = null;
        }.bind(this));
    },
    clickClose: function (e) {
        if (!$.contains(this.refs.box, e.target) && !$(e.target).hasClass('preview_img')) this.close();
    },
    previewDown: function(e) {
        e.stopPropagation();
        switch (e.keyCode) {
            case 37: return this.prev();
            case 39: return this.next(true);
            case 27: return this.close();
            default: return null;
        }
    },
    resize: function() {
        var _img = $(this.refs.imgBox).find('img');
        if (!this.imgAnimate && _img[0].complete) this.load(_img);
    },
	previewImage: function(e) {
		var target = $(e.currentTarget);
		var targetGroup = target.attr('data-group');
		var _source = [];
		var _index = 0;
		target.blur();
		if (targetGroup) {
			$('[data-group=' + targetGroup + ']').each(function(i, elemet) {
				_source.push({img: $(elemet).attr('data-preview'), title: $(elemet).attr('title')});
				if (elemet == e.currentTarget) _index = i;
			});
		} else {
			var targetPreview = target.attr('data-preview');
			var targetTitle = target.attr('title');
			_source.push({img: targetPreview, title: targetTitle})
		}
		Event.trigger('OpenPreview', {index: _index, source: _source});
	},
    componentDidMount: function() {
		$('body').on('click', '[data-preview]', this.previewImage);

        this.OpenPreview = Event.on('OpenPreview', function(data) {
            this.open(data);
            var _img = $(this.refs.imgBox).find('img');
            _img.on('load', function() {
                this.load(_img);
                _img.off('load');
            }.bind(this));
        }.bind(this));
    },
    componentWillUnmount: function() {
        $(window).off('resize', this.resize).off('keydown', this.previewDown);
		$('body').off('click', '[data-preview]', this.previewImage).off('click', this.clickClose);
        Event.off(this.OpenFloatLoader);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state != nextState;
    },
    getInitialState: function() {
        return {open: false, index: 0, source: []};
    },
    render: function() {
        var _index, _next, _prev, module, title, img;

        if (this.state.open) {
            _index = this.state.index;
            title = this.state.source[_index].title;
            img = this.state.source[_index].img;

            if (this.state.source.length > 1) {
                _next = _index + 1;
                if (_next > this.state.source.length - 1) _next = 0;
                _prev = _index - 1;
                if (_prev < 0) _prev = this.state.source.length - 1;

                module = <div className="preview_content" ref="content">
                    <div>
                        <span>{this.state.source[_prev].title}</span>
                        <img src={this.state.source[_prev].img} style={{maxWidth: '100%', maxHeight: '100%'}} />
                    </div>
                    <div style={this.state.top ? {top: this.state.top, visibility: 'visible'} : null} ref="imgBox">
                        <span>{title}</span>
                        <img src={img} className="preview_img" onWheel={this.wheel} onClick={this.scale} ref="img" />
                    </div>
                    <div>
                        <span>{this.state.source[_next].title}</span>
                        <img src={this.state.source[_next].img} style={{maxWidth: '100%', maxHeight: '100%'}} />
                    </div>
                </div>;
            } else {
                module = <div className="preview_content" ref="content">
                    <div style={this.state.top ? {top: this.state.top, visibility: 'visible'} : null} ref="imgBox">
                        <span>{title}</span>
                        <img src={img} className="preview_img" onClick={this.scale} />
                    </div>
                </div>
            }
        }

        return <div className={this.state.open ? 'preview_box preview_show' : 'preview_box'} ref="preview">
                <div className="preview_top_btn" style={this.state.source.length > 1 ? {display: 'block'} : null}>
                    <ul ref="box">
                        <li onClick={this.prev}><i></i></li>
                        <li onClick={this.carousel}><i ref="carousel"></i></li>
                        <li onClick={this.next}><i></i></li>
                        <li onClick={this.close}><i></i></li>
                    </ul>
                </div>
                {module}
        </div>
    }
});