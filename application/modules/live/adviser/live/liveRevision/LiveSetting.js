var LiveHandle = require('../../../../../handle/live/Index');

module.exports = React.createClass({
    //确定保存
    onSaveBtnClick: function () {
        if (this.refs.liveTitle.value.length == "") {
            Event.trigger('ServerTips', "直播主题不能为空");
            return;
        }
        var param = {
            Title: this.refs.liveTitle.value,
            Course_type: parseInt(this.refs.courseType.value)
        };
        if (this.refs.liveText.checked) {
            param.type = 0;
        } else if (this.refs.liveVideo.checked) {
            param.type = 1;
        }
        var isVip = this.props.isVip;
        param.room_type = isVip ? 1 : 0;

        //修改
        if(this.isSend(param,isVip)) {
            if (!isNaN(param.type)) {
                LiveHandle.setRoom(Config.CACHE_DATA.ROOM._id, param, function (result) {
                    if (result.code == 200) {
                        this.onSettingOk(1);
                        this.close();
                        Event.trigger('editRoom', param.Title);
                        this.props.onChange();
                    } else {
                        Event.trigger('ServerTips', result.message);
                    }
                }.bind(this));
            } else {
                //关闭
                LiveHandle.closeRoom(Config.CACHE_DATA.ROOM._id, param, function (result) {
                    if (result.code == 200) {
                        this.onSettingOk(0);
                        this.close();
                        Event.trigger('editRoom', param.Title);
                        this.props.onChange();
                    } else {
                        Event.trigger('ServerTips', result.message);
                    }
                }.bind(this));

            }
        }else{
            this.close();
        }
    },
	isSend: function(param,isVip) {
        if(isVip) {
            if(Config.CACHE_DATA.ROOM.vip_status == 1) {
                if(param.type == undefined) {
                    return true;
                }else if(param.Title == Config.CACHE_DATA.ROOM.vip_topic && param.Course_type == Config.CACHE_DATA.ROOM.vip_lessons_type && param.type == Config.CACHE_DATA.ROOM.vip_type) {
                    return false;
                }else{
                    return true;
                }
            }else{
                if(param.type != undefined) {
                    return true;
                }else{
                    return false;
                }
            }
        }else{
            if(Config.CACHE_DATA.ROOM.status == 1) {
                if(param.type == undefined) {
                    return true;
                }else if(param.Title == Config.CACHE_DATA.ROOM.topic && param.Course_type == Config.CACHE_DATA.ROOM.lessons_type && param.type == Config.CACHE_DATA.ROOM.type) {
                    return false;
                }else{
                    return true;
                }
            }else{
                if(param.type != undefined) {
                    return true;
                }else{
                    return false;
                }
            }
        }
    },
    onSettingOk: function (value) {
        this.setLiveType(this.state.liveType);
        var isVip = this.props.isVip;
        if (isVip) {
            Config.CACHE_DATA.TAB_TYPE =1;
            Config.CACHE_DATA.ROOM.vip_topic = this.refs.liveTitle.value;
            Config.CACHE_DATA.ROOM.vip_status = value;
            Config.CACHE_DATA.ROOM.vip_lessons_type = this.refs.courseType.value;
        } else {
            Config.CACHE_DATA.TAB_TYPE =0;
            Config.CACHE_DATA.ROOM.topic = this.refs.liveTitle.value;
            Config.CACHE_DATA.ROOM.status = value;
            Config.CACHE_DATA.ROOM.lessons_type = this.refs.courseType.value;
        }
    },

    onCancelBtnClick: function () {
        this.close();
    },

    close: function () {
        Event.trigger('CloseDialog');
    },

    liveType: function () {
        return this.props.isVip ? Config.CACHE_DATA.ROOM.vip_type : Config.CACHE_DATA.ROOM.type;
    },
    setLiveType: function (type) {
        if (this.props.isVip) {
            Config.CACHE_DATA.ROOM.vip_type = type;
        } else {
            Config.CACHE_DATA.ROOM.type = type;
        }
    },

    lessonType: function () {
        return this.props.isVip ? Config.CACHE_DATA.ROOM.vip_lessons_type : Config.CACHE_DATA.ROOM.lessons_type;
    },

    topic: function () {
        return this.props.isVip ? Config.CACHE_DATA.ROOM.vip_topic : Config.CACHE_DATA.ROOM.topic;

    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({liveType: this.liveType()});
    },
    componentWillMount: function () {
        this.setState({liveType: this.liveType()});
    },
    onCourseChange: function (evt) {
        var type = this.state.liveType;
        if (this.refs.liveVideo == evt.currentTarget) {
            type = type == 1 ? -1 : 1;
        } else if (this.refs.liveText == evt.currentTarget) {
            type = type == 0 ? -1 : 0;
        } else {
            type = -1;
        }
        /*this.setLiveType(type);*/
        this.setState({liveType: type})
    },

    render: function () {
        var type = this.state.liveType;
        return (
            <div >
                <div className="liveChat-img-enlarge" ></div >
                <div className="liveChat-setting-bombbox" >
                    <div className="liveChat-setting-tr1" >
                        <span className="liveChat-setting-tr1span" >直播主题：</span >
                        <input className="liveChat-settin-tr1input" maxlength="20" type="text" placeholder="请输入直播主题..."
                               ref="liveTitle" defaultValue={this.topic()} />
                    </div >
                    <div className="liveChat-setting-tr2" >
                        <span className="liveChat-setting-tr1span" >课程类型：</span >
                        <select className="liveChat-setting-tr2select" ref="courseType" >
                            <option value="3" selected={this.lessonType() == 3 ? true : ""} >公开课
                            </option >
                            <option value="1" selected={this.lessonType() == 1 ? true : ""} >实战课
                            </option >
                            <option value="2" selected={this.lessonType() == 2 ? true : ""} >系统课
                            </option >
                        </select >
                    </div >
                    <div className="liveChat-setting-tr3" >
                        <span className="liveChat-setting-tr1span" >直播类型：</span >
                        <label ><input name="liveType" type="checkbox" value="" ref="liveVideo"
                                       onChange={this.onCourseChange}
                                       checked={type == 1} />视频直播 </label >
                        <label ><input name="liveTypeText" type="checkbox" value="" ref="liveText"
                                       onChange={this.onCourseChange}
                                       checked={type == 0} />图文直播 </label >
                    </div >
                    <div className="liveChat-setting-button" >
                        <button className="liveChat-setting-save adopt" onClick={this.onSaveBtnClick} >确定</button >
                        <button className="liveChat-setting-cancel" onClick={this.onCancelBtnClick} >取消</button >
                    </div >
                    <div className="liveChat-setting-ts" >注：勾选直播类型，点击确定开启直播</div >
                </div >
            </div >

        )
    }
});