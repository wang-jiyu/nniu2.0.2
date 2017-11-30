var ClassRoomHandle = require('../../handle/classroom/Index');
var Video = require('../../components/common/Video');
var SystemCourse = require('./SystemCourse');
var GoldenShares = require('./GoldenShares');
var ClassroomChatPc = require('./ClassroomChatPc');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({

    openCourse: function() {
        if (this.props.item.advisor && (this.props.item.advisor._id == Config.CACHE_DATA.USER._id))
            return this.props.openCourse(null, this.props.backpath ? this.props.backpath : 'main');
        this.props.openCourse(this.props.item, 'intro');
    },

    select: function(item) {
        this.setState({
            play: item,
            isEnd: false
        }, function() {
            ClassRoomHandle.watchPlay(item._id, function() {}.bind(this));
            var stockObj = {
                lesson_guid: item._id,
                course_guid: item.course_id
            };
            ClassRoomHandle.getClassRecommendStock(stockObj, function(result) {
                if (result.code === 200) {
                    return this.setState({
                        recommendStock: result.data
                    });
                }
            }.bind(this));
        }.bind(this));
    },

    start: function() {
        if (!this.state.play._id) return;
        if (this.state.isEnd)
            return ClassRoomHandle.startPlay(this.state.play._id, function(result) {
                if (result.code == 200) return this.setState({
                    isEnd: false
                });
            }.bind(this));
        return ClassRoomHandle.endPlay(this.state.play._id, function(result) {
            if (result.code == 200) return this.setState({
                isEnd: true
            });
        }.bind(this));
    },

    end: function(flag) {
        this.setState({
            isEnd: flag
        });
    },

    pause: function(flag) {
        this.setState({
            pause: flag
        });
    },

    getClass: function(item) {
        if (item.video_url) {
            if (this.state.play._id == item._id) return 'play';
            return null;
        }
        switch (item.live_status) {
            case 0:
                return 'no-start';
            case 1:
                return 'live';
            case 2:
                return 'ended';
            default:
                return null;
        }
    },

    getText: function(item) {
        if (item.video_url) return '更新时间';
        return '直播时间';
    },

    getTime: function(item) {
        var hh = parseInt(item.live_time / 3600);
        var mm = parseInt(item.live_time % 3600 / 60);
        hh = hh < 10 ? '0' + hh : hh;
        mm = mm < 10 ? '0' + mm : mm;
        if (item.video_url) return Utils.formatDate(item.update_time, 'YYYY-MM-DD/hh:mm');
        if (item.live_duration || item.live_duration == 0) {
            return hh + ':' + mm + '（' + item.live_duration + '分钟）';
        } else {
            return hh + ':' + mm;
        }
    },

    getNumber: function(item) {
        if (item.video_url) return '播放次数：' + item.play_count + '人';
        return '在线人数：' + item.online_count + '人';
    },

    isAdvisor: function() {
        return this.props.item.advisor._id == Config.CACHE_DATA.USER._id;
    },

    update: function() {
        this.load(true);
    },

    backItem: function(item) {
        if (!this.state.play._id) this.setState({
            play: item
        });
    },

    load: function(flag) {
        if (flag) this.setState({
            loading: true
        });
        ClassRoomHandle.getGoodnessCharterList({
            id: this.props.item._id,
            type: 2
        }, function(result) {
            if (result.code == 200) {
                if (result.data.length > 0) {
                    var stockObj = {
                        lesson_guid: result.data[0]._id,
                        course_guid: result.data[0].course_id
                    };
                    ClassRoomHandle.getClassRecommendStock(stockObj, function(result) {
                        if (result.code === 200) {
                            return this.setState({
                                recommendStock: result.data
                            });
                        }
                    }.bind(this));
                    return this.setState({
                        actionSource: result.data,
                        play: result.data[0],
                        loading: false,
                        code: null,
                        chatData: result.data[0]
                    }, function() {
                        $(window).scrollTop(0);
                    }.bind(this));
                }
                return this.setState({
                    actionSource: result.data,
                    loading: false,
                    code: null
                }, function() {
                    $(window).scrollTop(0);
                }.bind(this));
            }
            return this.setState({
                loading: false,
                code: result.code
            });
        }.bind(this));
    },

    getShow: function(rtmp) {
        if (!this.isAdvisor() || this.state.play.video_url || !rtmp) return null;
        if (this.state.isEnd) return <a href="javascript:;" onClick={this.start} className="start-play">开启直播</a>;
        return <a href="javascript:;" onClick={this.start} className="start-play">关闭直播</a>;
    },

    getShowVideo: function(rtmp) {
        if (this.state.play.video_url)
			console.log(this.state)
            return <Video ref="video" key={this.state.play._id}
                          src={this.state.play.video_url}
                          cancelClick={true}
                          onPause={this.pause}
                          onEnd={this.end}
                    />;
        if (this.state.isEnd || this.state.play.live_status == 2) return <div className="end"> <div></div></div>;
        if (this.state.play.live_status == 0) return <div className="unstart"> <div></div></div>;
        if (rtmp) {
            return <Video ref="video" key={this.state.play._id}
                              rtmp={rtmp}
                              onPause={this.pause}
                              onEnd={this.end}
                />;
        }
    },
    getChatData: function(objParam) {
        if (objParam.data) {
            this.setState({
                chatData: objParam.data
            });
        }

        if (objParam.switch) {
            if (objParam.switch == 'on') {
                this.setState({
                    chatStatus: true,
                });
            } else if (objParam.switch == 'off') {
                this.setState({
                    chatStatus: false,
                });
            }
        }

    },
    componentDidMount: function() {
        this.load(false);
    },

    getInitialState: function() {
        return {
            actionSource: [],
            play: {},
            pause: false,
            isEnd: false,
            loading: true,
            code: null,
            start: false,
            recommendStock: [],
            chatStatus: false,
            chatData: {}

        }
    },

    render: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load.bind(this, true)} code={this.state.code} />;
        var rtmp = this.state.play.live_rtmp_url || this.state.play.live_flv_url || this.state.play.live_hls_url;
        return (
            <div className="classroom_list_box">
                <div className="classroom_back classroom_wrapper">
                    {this.getShow(rtmp)}
                    <a className="classroom_update" onClick={this.update} href="javascript:;">刷新</a> <a href="javascript:;" onClick={this.openCourse}>返回</a>
                </div>
                <div className="classroom_info_video classroom_wrapper">
                    {this.state.pause ? <div className="pause" onClick={this.refs.video.play}></div> : null}

                    {this.getShowVideo(rtmp)}
                </div>
                <div>
                    {this.state.recommendStock.length>0?<GoldenShares recommendStock={this.state.recommendStock}/>:null}
                </div>

                {!this.state.chatStatus?<div className="classroom_list classroom_wrapper">
                    <div className="classroom_training">
                        <h3>实战课程 <span>盘中直播课</span></h3>
                        <div className="list_inner">
                            <ul>
                                {
                                    this.state.actionSource.map(function(item, idex) {
                                        return (
                                            <li key={'action' + item._id} className={this.getClass(item)} onClick={this.select.bind(this, item)}>
                                                <a href="javascript:;" className="pic">
                                                    <img src={item.cover_url ? item.cover_url + '?x-oss-process=image/resize,m_mfit,h_150,w_150' : "../assets/images/class.png"} alt="" width="150" height="90" />
                                                    <div className="pic_layer"></div>
                                                </a>
                                                <div className="info">
                                                    <a href="javascript:;">{item.title}</a>
                                                    <p>{this.getText(item)}：{this.getTime(item)}</p>
                                                    <p>{this.getNumber(item)}</p>
                                                    {this.getClass(item)==='live'?<div className="chatButton" onClick={this.getChatData.bind(this,{data:item,switch:'on'})}>聊天</div>:null}
                                                </div>
                                            </li>
                                        )
                                    }.bind(this))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="classroom_system">
                        <h3>系统课程 <span>每周一更新</span></h3>
                        <div className="list_inner">
                            <SystemCourse item={this.props.item} onSelect={this.select} play={this.state.play} backItem={this.backItem}  />
                        </div>
                    </div>
                </div>: <ClassroomChatPc close={this.getChatData} data={this.state.chatData}/>}
            </div>
        );
    }
});