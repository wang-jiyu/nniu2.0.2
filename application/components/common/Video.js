module.exports = React.createClass({
    videoInit: function () {
        setTimeout(function () {
            if (this.isMounted()) {
                this.refs.video.positionFullscreenButton(-100, -100, false);
            }
        }.bind(this));
    },
    videoFire: function (a, b, c) {
        if (isNaN(c.currentTime) && this.props.cancelClick) {
            this.setState({isEnd: true});
            this.props.onEnd && this.props.onEnd(true);
        } else {
            if (this.state.isEnd) {
                this.setState({isEnd: false});
                this.props.onEnd && this.props.onEnd(false);
            }
        }

        if (c.paused || !this.state.play || c.currentTime == undefined || c.duration == undefined || c.duration == 0) return null;
        this.setState({video: c, percent: c.currentTime / c.duration, isEnd: this.state.isEnd});
    },
    full: function () {
        document.documentElement.webkitRequestFullscreen();
        this.setState({isFullScreen: true});
    },

    exit: function () {
        document.webkitCancelFullScreen();
        $(this.refs.exit).removeClass('slideToggle');
        this.setState({isFullScreen: false});
    },
    stop: function () {
        this.pause();
        this.setState({hideVideo: true});
    },
    play: function () {
        this.state.play = true;
        this.refs.video.playMedia();
        this.props.onPause && this.props.onPause(false);
        this.setState({hideVideo: false});
        this.forceUpdate();
    },
    pause: function () {
        this.state.play = false;
        this.refs.video.pauseMedia();
        this.props.onPause && this.props.onPause(true);
        this.forceUpdate();
    },
    playSound: function () {
        this.refs.video.setMuted(this.state.sound);
        this.setState({sound: !this.state.sound})
    },

    mouseSpeedDown: function (e) {
        e.stopPropagation();
        window.addEventListener('mousemove', this.mouseSpeedMove);
        window.addEventListener('mouseup', this.mouseSpeedUp);
    },

    mouseDown: function (e) {
        window.addEventListener('mousemove', this.mouseMove);
        window.addEventListener('mouseup', this.mouseUp);
    },

    mouseSpeedMove: function (e) {
        this.pause();
        var left = e.pageX - $(this.refs.speedbar).offset().left;
        if (left < 0) left = 0;
        var percent = left / $(this.refs.speedbar).width()
        if (percent > 1) percent = 1;

        var currentTime = this.state.video.duration * percent;
        this.refs.video.setCurrentTime(currentTime);
        this.setState({percent: percent});
    },

    mouseMove: function (e) {
        var index = e.pageX - $(this.refs.sound).offset().left;
        if (index < 0) {
            index = 0;
        } else if (index > 100) {
            index = 94;
        } else {
            index = index / 100 * 94;
        }
        this.refs.video.setVolume(index / 94);
        this.setState({left: index, sound: index == 0 ? false : true}, function () {
            localStorage.setItem('volume', index);
        }.bind(this));
    },

    mouseSpeedUp: function (e) {
        var currentTime = this.state.video.duration * this.state.percent;
        if (currentTime == this.state.video.duration) currentTime -= 3;
        this.refs.video.setCurrentTime(currentTime);
        setTimeout(function () {
            this.play();
        }.bind(this), 100);
        window.removeEventListener('mousemove', this.mouseSpeedMove);
        window.removeEventListener('mouseup', this.mouseSpeedUp);
    },

    mouseUp: function (e) {
        window.removeEventListener('mousemove', this.mouseMove);
        window.removeEventListener('mouseup', this.mouseUp);
    },

    selectCurrentTime: function (e) {
        this.pause();
        var left = e.pageX - $(this.refs.speedbar).offset().left;

        if (left < 0) left = 0;
        var percent = left / $(this.refs.speedbar).width()
        if (percent > 1) percent = 1;
        var currentTime = this.state.video.duration * percent;

        this.refs.video.setCurrentTime(currentTime);

        this.setState({percent: percent}, function () {
            setTimeout(function () {
                this.play();
            }.bind(this), 100);
        }.bind(this));
    },

    selectSound: function (e) {
        var index = e.pageX - $(this.refs.sound).offset().left;
        if (index < 6) {
            index = 0;
        } else if (index > 94) {
            index = 94;
        } else {
            index = index - 6;
        }

        this.refs.video.setVolume(index / 94);
        this.setState({left: index, sound: index == 0 ? false : true}, function () {
            localStorage.setItem('volume', index);
        }.bind(this));
    },

    escDown: function (e) {
        if (e.keyCode == 27) {
            this.exit();
        }
    },

    showExit: function (e) {
        if (e.pageY < 150) return $(this.refs.exit).addClass('slideToggle');
        $(this.refs.exit).removeClass('slideToggle');
    },

    componentWillMount: function () {
        window[this.state.eventName] = {initPlugin: this.videoInit, fireEvent: this.videoFire};
        this.state.flashvars = $.param({
            jsinitfunction: this.state.eventName + '.initPlugin',
            jscallbackfunction: this.state.eventName + '.fireEvent',
            isvideo: 'true',
            autoplay: 'true',
            preload: 'none',
            startvolume: parseInt(localStorage.getItem('volumeIndex') / 94) || '0.8',
            timerrate: '250',
            flashstreamer: '',
            pseudostreamstart: 'start',
            file: this.props.rtmp || this.props.src
        });
    },

    fadeOut: function () {
        this.timer = setTimeout(function () {
            $(this.refs.operate).addClass('fadeOut');
        }.bind(this), 2000);
    },

    fadeIn: function () {
        clearTimeout(this.timer);
        $(this.refs.operate).removeClass('fadeOut');
        this.fadeOut();
    },

    componentDidMount: function () {
        var objVideo = $(this.refs.video);
        objVideo.css('height', objVideo.width() / 16 * 9);
        this.fullScreen = function () {
            if (document.webkitIsFullScreen) {
                objVideo.css({height: '100%'});
                this.refs.video.setVideoSize(window.screen.width, window.screen.height);
                this.setState({isFullScreen: true}, function () {
                    this.fadeOut();
                }.bind(this));

                window.addEventListener('keydown', this.escDown);
                window.addEventListener('mousemove', this.showExit);
                window.addEventListener('mousemove', this.fadeIn);
            } else {
                window.removeEventListener('keydown', this.escDown);
                window.removeEventListener('mousemove', this.showExit);
                window.removeEventListener('mousemove', this.fadeIn);
                $(this.refs.operate).removeClass('fadeOut');
                this.setState({isFullScreen: false}, function () {
                    objVideo.css('height', objVideo.width() / 16 * 9);
                    this.refs.video.setVideoSize(parseInt(objVideo.width()), parseInt(objVideo.height()));
                    clearTimeout(this.timer);
                }.bind(this));
            }
        }.bind(this);
        window.addEventListener('webkitfullscreenchange', this.fullScreen);
    },

    componentWillUnmount: function () {
        window.removeEventListener('webkitfullscreenchange', this.fullScreen);
        window.removeEventListener('keydown', this.escDown);
        window.removeEventListener('mousemove', this.showExit);
        window.removeEventListener('mousemove', this.fadeIn);
        this.exit();
        var name = this.state.eventName;
        setTimeout(function () {
            delete window[name];
        }, 400);
    },
    getInitialState: function () {
        return {
            flashvars: '',
            eventName: 'mediaBridge' + Utils.createId(),
            sound: true,
            play: true,
            left: parseInt(localStorage.getItem('volume')) || 80,
            speed: 0,
            isFullScreen: false,
            percent: 0,
            video: {},
            isEnd: false
        };
    },
    render: function () {
        console.log("刷新video");
        return (
            <div className={this.state.isFullScreen ? 'player_box full' : 'player_box'} ref="player">
                <div ref="exit" className="exit_box">请按ESC键即可<a onClick={this.exit}>退出全屏</a></div>
                <embed
                    style={this.state.hideVideo ? {opacity: 0} : {}}
                    wmode="opaque"
                    ref="video"
                    id={this.state.eventName}
                    play="true" loop="false" quality="high"
                    bgcolor="#000000" allowscriptaccess="always"
                    allowfullscreen="true" type="application/x-shockwave-flash"
                    pluginspage="//www.macromedia.com/go/getflashplayer"
                    src="/assets/flash/video.swf"
                    flashvars={this.state.flashvars}
                    scale="default"
                    is={true}
                />
                <div className="video_operate" ref="operate">
                    {this.props.src ? <div ref="speedbar" className="speedbar" onMouseDown={this.selectCurrentTime}>
                        <span className="speedbar_line" style={{left: this.state.percent * 100 + '%'}}></span>
                        <span className="speedbar_yetplay" style={{width: this.state.percent * 100 + '%'}}></span>
                        <span className="speedbar_radio_box">
						<span ref="speedRadio" className="speedbar_radio"
                              onMouseDown={this.mouseSpeedDown}
                              style={{left: this.state.percent * 100 + '%'}}
                        ></span>
						</span>
                    </div> : null}
                    <div className="playbar">
                        {this.props.src ? <i className={this.state.play ? 'video_play_icon' : 'video_pause_icon'}
                                             onClick={this.state.play ? this.pause : this.play}></i> : null}
                        <div className="video_menu">
                            <label className={this.state.sound ? 'sound_play' : 'sound_pause'}
                                   onClick={this.playSound}></label>
                            <div ref="sound" className="sound_box">
                                <span className="sound_line" onMouseDown={this.selectSound}></span>
                                <span ref="radio" className="sound_radio"
                                      onMouseDown={this.mouseDown}
                                      style={{left: this.state.left}}
                                ></span></div>
                            <b onClick={this.state.isFullScreen ? this.exit : this.full}></b>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});