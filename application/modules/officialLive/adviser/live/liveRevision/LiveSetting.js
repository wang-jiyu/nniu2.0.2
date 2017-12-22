var LiveHandle = require('../../../../../handle/live/Index');

module.exports = React.createClass({
    //确定保存
    onSaveBtnClick: function () {
        var param = {
            Title: this.refs.liveTitle.value,
            Course_type: this.refs.courseType.selectedIndex + 1,
        };
        if (this.refs.liveText.checked) {
            param.type = 0;
        } else if (this.refs.liveVideo.checked) {
            param.type = 1;
        }

        //修改
        if (!isNaN(param.type)) {
            LiveHandle.setRoom(Config.CACHE_DATA.ROOM._id, param, function (result) {
                if (result.code == 200) {
                    Config.CACHE_DATA.ROOM.status = 1;
                    Config.CACHE_DATA.ROOM.lessons_type = param.Course_type;
                    this.close();
                    Event.trigger('editRoom', param.Title);
                    this.props.onChange();
                }
            }.bind(this));
        } else {
            //关闭
            LiveHandle.closeRoom(Config.CACHE_DATA.ROOM._id, param, function (result) {
                if (result.code == 200) {
                    Config.CACHE_DATA.ROOM.status = 0;
                    Config.CACHE_DATA.ROOM.lessons_type = param.Course_type;
                    this.close();
                    Event.trigger('editRoom', param.Title);
                    this.props.onChange();
                }
            }.bind(this));

        }
    },

    onCancelBtnClick: function () {
        this.close();
    },

    close: function () {
        Event.trigger('CloseDialog');
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({liveType: Config.CACHE_DATA.ROOM.type});
    },
    componentWillMount: function () {
        this.setState({liveType: Config.CACHE_DATA.ROOM.type});
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
        Config.CACHE_DATA.ROOM.type = type;
        this.setState({liveType: type})
    },

    render: function () {
        var type = this.state.liveType;
        return (
            <div>
                <div className="liveChat-img-enlarge"></div>
                <div className="liveChat-setting-bombbox">
                    <div className="liveChat-setting-tr1">
                        <span className="liveChat-setting-tr1span">直播主题：</span>
                        <input className="liveChat-settin-tr1input" maxlength="20" type="text" placeholder="请输入直播主题..."
                               ref="liveTitle" defaultValue={Config.CACHE_DATA.ROOM.topic}/>
                    </div>
                    <div className="liveChat-setting-tr2">
                        <span className="liveChat-setting-tr1span">课程类型：</span>
                        <select className="liveChat-setting-tr2select" ref="courseType">
                            <option value="1" selected={Config.CACHE_DATA.ROOM.lessons_type == 1 ? true : ""}>实战课
                            </option>
                            <option value="2" selected={Config.CACHE_DATA.ROOM.lessons_type == 2 ? true : ""}>系统课
                            </option>
                        </select>
                    </div>
                    <div className="liveChat-setting-tr3">
                        <span className="liveChat-setting-tr1span">直播类型：</span>
                        <label><input name="liveType" type="checkbox" value="" ref="liveVideo"
                                      onChange={this.onCourseChange}
                                      checked={type == 1}/>视频直播 </label>
                        <label><input name="liveTypeText" type="checkbox" value="" ref="liveText"
                                      onChange={this.onCourseChange}
                                      checked={type == 0}/>图文直播 </label>
                    </div>
                    <div className="liveChat-setting-button">
                        <button className="liveChat-setting-save adopt" onClick={this.onSaveBtnClick}>确定</button>
                        <button className="liveChat-setting-cancel" onClick={this.onCancelBtnClick}>取消</button>
                    </div>
                    <div className="liveChat-setting-ts">注：勾选直播类型，点击确定开启直播</div>
                </div>
            </div>

        )
    }
});