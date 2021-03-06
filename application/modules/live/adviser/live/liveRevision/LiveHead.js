var Video = require('../../../../../components/common/Video');

module.exports = React.createClass({

    onEditRoom: function (title) {
        var room = this.props.info;
        room.topic = title;
        this.forceUpdate();
    },

    componentDidUpdate: function () {
        if (Config.CACHE_DATA.ROOM.type != 1)
            return;
        if (Config.CACHE_DATA.ROOM.status == 0) {
            this.refs.liveVideo.stop();
        } else {
            this.refs.liveVideo.play();
        }

        console.log(this.refs.liveVideo);
    },

    componentDidMount: function () {
        Event.on('editRoom', this.onEditRoom);
    },

    videoUrl: function () {
        var isVip = this.props.isVip;
        if (!isVip) {
            // return Config.CACHE_DATA.ROOM.vip_status == 0 ? "11" : Config.CACHE_DATA.ROOM.rtmp_url || Config.CACHE_DATA.ROOM.hls_url || Config.CACHE_DATA.ROOM.flv_url;
            if(Config.CACHE_DATA.ROOM.status == 0){
                return "";
            }else{
                if (Config.CACHE_DATA.ROOM.rtmp_url && Config.CACHE_DATA.ROOM.rtmp_url != "") {
                    return Config.CACHE_DATA.ROOM.rtmp_url;
                }
                if (Config.CACHE_DATA.ROOM.vip_hls_url && Config.CACHE_DATA.ROOM.hls_url != "") {
                    return Config.CACHE_DATA.ROOM.hls_url;
                }
                if (Config.CACHE_DATA.ROOM.flv_url && Config.CACHE_DATA.ROOM.flv_url != "") {
                    return Config.CACHE_DATA.ROOM.flv_url;
                }
            }
        } else {
            // return Config.CACHE_DATA.ROOM.status == 0 ? "" : Config.CACHE_DATA.ROOM.vip_rtmp_url || Config.CACHE_DATA.ROOM.vip_hls_url || Config.CACHE_DATA.ROOM.vip_flv_url;
            if(Config.CACHE_DATA.ROOM.vip_status == 0){
                return "";
            }else{
                if (Config.CACHE_DATA.ROOM.vip_live_rtmp_url && Config.CACHE_DATA.ROOM.vip_live_rtmp_url != "") {
                    return Config.CACHE_DATA.ROOM.vip_live_rtmp_url;
                }
                if (Config.CACHE_DATA.ROOM.vip_live_hls_url && Config.CACHE_DATA.ROOM.vip_live_hls_url != "") {
                    return Config.CACHE_DATA.ROOM.vip_live_hls_url;
                }
                if (Config.CACHE_DATA.ROOM.vip_live_flv_url && Config.CACHE_DATA.ROOM.vip_live_flv_url != "") {
                    return Config.CACHE_DATA.ROOM.vip_live_flv_url;
                }
            }
        }
    },

    videoStatus:function () {
        return this.props.isVip ? Config.CACHE_DATA.ROOM.vip_status : Config.CACHE_DATA.ROOM.status;
    },

    videoTopic:function () {
        return this.props.isVip ? Config.CACHE_DATA.ROOM.vip_topic : Config.CACHE_DATA.ROOM.topic;
    },

    render: function () {
        console.log("视频：", "地址", this.videoUrl());
        var room = this.props.info;
        return <div className="curr-top clearfix" >
            <div className="curr-videobox" >
                <div className="curr-classroom-name" >
                    <span className="curr-classroom-live" >{this.videoStatus() == 0 ? "" : "● 直播中"}</span >
                    <span
                        className="curr-classroom-name-text" >{this.videoStatus() == 0 ? "" : this.videoTopic()}</span >
                </div >
                {/* <video id="my-video1" className="video-js" autoplay controls preload="auto" width="869" height="500" poster="" data-setup="{}">
                    <source src='http://www.w3school.com.cn/i/movie.mp4' type='rtmp/flv' />
                </video> */}
                <div className="video" style={{height: 493}} >
                    <Video ref="liveVideo"
                           rtmp={this.videoUrl()} />
                </div >
            </div >
            <div className="curr-teacher-introduction" >
                <div className="curr-teacher-details clearfix" >
                    <div className="curr-teacher-img" >
                        <img src={room.advisor.avatar} alt="" />
                    </div >
                    <div className="curr-teacter-namebox" >
                        <div className="curr-teacher-name" > {room.advisor.name} </div >
                        {/*<div className="curr-teacher-tag">{room.advisor.level_name}</div>*/}
                    </div >
                </div >
                <div className="curr-certificates" >证券资格证：{room.advisor.qcer}</div >
                <div className="curr-teacher-info" >
                    {room.advisor.intro}
                </div >
                {/*<div className="curr-teacher-sign">在线人数：{room.visitor_count}人</div>*/}
            </div >
        </div >
    }
})
;