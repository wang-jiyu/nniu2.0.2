var LiveModule = require('./live/Index');
var Jewel = require('./jewel/List');
var Ask = require('./ask/Index');
var Check = require('./check/Index');
var Opinions = require('./opinions/Index');
var View = require('./View');
var MultipleLive = require('./multiple/Index');
var Top = require('./components/Top');
var Bottom = require('./components/Bottom');
var AskQuestion = require('./ask/AskQuestion');
var SetLive = require('./live/SetLive');
var LiveHandle = require('../../../handle/live/Index');
var UserCenterHandle = require('../../../handle/usercenter/UserCenter');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
var LiveHead = require('./live/liveRevision/LiveHead');
var LiveChat = require('./live/liveRevision/LiveChat');
var LiveSetting = require('./live/liveRevision/LiveSetting');
var Spin =require('../../../components/common/Spin');
module.exports = React.createClass({
    askQuestion: function () {
        Event.trigger('OpenDialog', {
            module: <AskQuestion/>,
            title: '向' + this.state.room.advisor.name + '提问',
            width: 450,
            height: 420
        });
    },

    //获取tab页
    getModule: function () {
        switch (this.state.pointer) {
            case 'live':
                return <LiveModule key="normal" param={this.state.param}/>;
            // return <LiveChat param={this.state.param}/>
            case 'Viplive':
                return <LiveModule key="vip" param={this.state.param} isVip={true}/>
            case 'jewel':
                return <Jewel param={this.state.param}/>;
            case 'ask':
                return <Ask param={this.state.param}/>;
            case 'opinions':
                return <Opinions param={this.state.param}/>;
            case 'check':
                return <Check param={this.state.param}/>;
            case 'Vipcheck':
                return <Check key="checkVip" param={this.state.param} isVip={true}/>;
        }
    },
    switchMenu: function (pointer) {
        this.setState({
            pointer: pointer
        });
        Config.CACHE_DATA.TAB_TYPE =pointer;
        localStorage.tabName=pointer;
        if(pointer.indexOf("live")!=-1){
            location.reload();
        }
    },
    route: function () {
        if (Url.getParam('tactics')) {
            return Event.trigger('GotoModule', ['jewel', 'tactics', Url.getParam('tactics')]);
        }

        if (Url.getParam('report')) {
            return Event.trigger('GotoModule', ['jewel', 'report', Url.getParam('report')]);
        }
    },
    updateView: function () {
        this.forceUpdate();
    },
    liveState: function (status) {
        Config.CACHE_DATA.ROOM.status = parseInt(status);
        this.forceUpdate();
    },

    //获取房间信息成功
    getRoomComplete: function (result) {
        if (result.code == 200) {
            Config.CACHE_DATA.ROOM = result.data;
            Config.CACHE_DATA.ROOM2 = result.data;
            try {
                if (Config.CACHE_DATA.ROOM.schedule == "") {
                    Config.CACHE_DATA.ROOM.schedule = "{[]}"
                }
                Config.CACHE_DATA.ROOM.schedule = JSON.parse(Config.CACHE_DATA.ROOM.schedule);
            } catch (e) {
                Config.CACHE_DATA.ROOM.schedule = null;
            }

            if (Config.CACHE_DATA.ROOM.chat_channel_id) {
                this.subscribe = [
                    {
                        channel: Config.CACHE_DATA.ROOM.chat_channel_id,
                        type: Config.CHANNEL_TYPE.CHANNEL
                    },
                    {
                        channel: Config.CACHE_DATA.ROOM.vip_channel_id,
                        type: Config.CHANNEL_TYPE.CHANNEL
                    }];
                Interface.pushMessage('Subscribe', this.subscribe);
                console.log("触发事件", "Subscribe");
                Event.on('LiveStateChange' + Config.CACHE_DATA.ROOM.chat_channel_id, this.liveState);
            }


            Event.on('UpdateUser', this.updateView);
            if (Config.CACHE_DATA.ROOM.type != 2 && $.isArray(Config.CACHE_DATA.ROOM.advisor)) Config.CACHE_DATA.ROOM.advisor = Config.CACHE_DATA.ROOM.advisor[0];
            this.getBannedList();

            var arr = this.state.menu;
            if (!LiveHandle.isRoomOwner()) {
                if (Config.CACHE_DATA.ROOM.purchase_status && Config.CACHE_DATA.ROOM.purchase_status.isBuy) {
                    arr.splice(0, 1);
                    arr.pop();
                    arr.pop();
                } else {
                    arr.splice(1, 1);
                    arr.pop();
                    arr.pop();
                }
            }

            return this.setState({
                code: null,
                loading: false,
                room: Config.CACHE_DATA.ROOM,
                menu: arr,
                isFollow: Config.CACHE_DATA.USER.follow_ids.indexOf(Config.CACHE_DATA.ROOM.advisor._id) != -1
            }, this.route);
        }

        return this.setState({
            code: result.code,
            loading: false,
            menu: arr
        });
    },
    getBannedList: function () {
        Config.CACHE_DATA.BANNED_LIST = {};
        // if (!LiveHandle.isRoomOwner() || !Config.CACHE_DATA.ROOM._id) return null;
        LiveHandle.getBannedList(Config.CACHE_DATA.ROOM._id, function (result) {
            if (result.code == 200)
                result.data.map(function (item, index) {
                    Config.CACHE_DATA.BANNED_LIST[item] = true;
                });
        });
    },
    //获取房间信息
    getRoomInfo: function () {
        var roomId = Url.getParam('room');
        if (roomId) return LiveHandle.getRoom(roomId, this.getRoomComplete);
        LiveHandle.getAdviserRoom(Url.getParam('adviser'), this.getRoomComplete);
    },
    getPointer: function () {
        var tactics = Url.getParam('tactics');
        var report = Url.getParam('report');
        if (tactics || report) return 'jewel';
        // return 'live';
        return localStorage.tabName;
    },
    updataUser: function () {
        Interface.getProfile(function (result) {
            this.setState({
                isFollow: Config.CACHE_DATA.USER.follow_ids.indexOf(Config.CACHE_DATA.ROOM.advisor._id) != -1
            });
        }.bind(this), true);
    },

    addNotify: function () {
        var params = {
            ref_id: Config.CACHE_DATA.ROOM._id,
            ref_type: Config.CHANNEL_REF.ROOM
        };
        Forms.disableButton(this.refs.button);
        LiveHandle.addNotify(params, function (result) {
            Forms.activeButton(this.refs.button);
            if (result.code == 200) {
                Config.CACHE_DATA.ROOM.is_nofity = 1;
                result.data.type = Config.CHANNEL_TYPE.CHANNEL;
                var data = [result.data];
                Interface.pushMessage('Subscribe', data);
                this.forceUpdate();
            }
        }.bind(this));
    },
    removeNotify: function () {
        var params = {
            ref_id: Config.CACHE_DATA.ROOM._id,
            ref_type: Config.CHANNEL_REF.ROOM
        };
        Forms.disableButton(this.refs.button);
        LiveHandle.removeNotify(params, function (result) {
            Forms.activeButton(this.refs.button);
            if (result.code == 200) {
                Config.CACHE_DATA.ROOM.is_nofity = 0;
                result.data.type = Config.CHANNEL_TYPE.CHANNEL;
                var data = [result.data];
                Interface.pushMessage('Unsubscribe', data);
                this.forceUpdate();
            }
        }.bind(this));
    },

    unfollow: function () {
        LiveHandle.unfollow(this.state.room.advisor._id, function (result) {
            if (result.code == 200) return this.updataUser();
        }.bind(this));
    },
    follow: function () {
        LiveHandle.follow(this.state.room.advisor._id, function (result) {
            if (result.code == 200) return this.updataUser();
        }.bind(this));
    },

    tabNames: function () {
        var arr = [{
            text: '直播',
            pointer: 'live',
            event: this.switchMenu
        }, {
            text: 'VIP直播',
            pointer: 'Viplive',
            event: this.switchMenu
        }, {
            text: '观点',
            pointer: 'opinions',
            event: this.switchMenu
        }, {
            text: '百宝箱',
            pointer: 'jewel',
            event: this.switchMenu
        }, {
            text: '问答',
            pointer: 'ask',
            event: this.switchMenu
        }, {
            text: '审核',
            pointer: 'check',
            event: this.switchMenu
        },{
            text: 'VIP审核',
            pointer: 'Vipcheck',
            event: this.switchMenu
        }];
        return arr;
    },

    componentWillMount: function () {
        this.state.menu = this.tabNames();

        this.state.pointer = this.getPointer();
    },

    gotoModule: function (data) {
        this.setState({
            param: data,
            pointer: data[0] || 'live'
        });
    },
    newMessage: function (data) {
        Event.trigger('LiveMessage' + data.ref_id + data.ref_type, data.messages[0], data.md5);
    },
    componentDidMount: function () {
        Event.on('NewMessage', this.newMessage);
        Event.on('GotoModule', this.gotoModule);
        Event.on('ServerTips', this.showTips);
        this.getRoomInfo();
    },
    componentWillUnmount: function () {
        Event.off('NewMessage', this.newMessage);
        Event.off('GotoModule', this.gotoModule);
        Event.off('ServerTips', this.showTips);
        Config.CACHE_DATA.BANNED_LIST = {};

        if (this.subscribe) {
            Interface.pushMessage('Unsubscribe', this.subscribe);
            Event.off('LiveStateChange' + Config.CACHE_DATA.ROOM.chat_channel_id, this.liveState);
        }

        if (!this.state.loading) {
            Event.off('UpdateUser', this.updateView);
        }
    },
    getInitialState: function () {
        console.log("tabName",localStorage.tabName);
        return {
            pointer: localStorage.tabName,
            loading: true,
            room: null,
            isFollow: false,
            param: null,
            code: null
        };
    },

    setLiveData: function () {

    },
    setMenu: function () {
        Event.trigger('OpenDialog', {
            module: <SetLive onChange={this.setLiveData}/>,
            title: '直播室设置',
            width: 662,
            height: 568
        });
    },

    showTips: function (tips) {
        this.refs.tips.showTips(tips);
    },

    update: function () {
        location.reload();
    },

    render: function () {
        if (this.state.loading) return <Loading/>;
        if (this.state.code) return <Reload onReload={this.getRoomInfo} code={this.state.code}/>;
        if (this.state.room.type == 2 || this.state.room.live_type == 11) return <MultipleLive/>;

        return <div className="live_box">
            <Top/>
            <div className="main">
                <div className="curr-sidebar">
                    <div className="curr-go-index" onClick={function() {
            Event.trigger('UrlChange' + Config.MODULE_NAME.LIVE, '/live.html');}}><p>返回首页</p></div>
                    <div className="curr-refresh" onClick={this.update}>刷新</div>
                    {(this.state.room.live_type == 1) ? (
                        <div className="curr-refresh" onClick={this.setMenu}>节目单</div>) : ""}
                </div>
            </div>
            <LiveHead info={this.state.room} isVip={this.state.pointer == "Viplive"} />
            <div className="teacher_nav">
                <ul className="teacher_nav_list">
                    {this.state.menu.map(function (item, i) {
                        return <li className={this.state.pointer == item.pointer ? 'selected' : null}
                                   onClick={item.event.bind(this, item.pointer)} key={i}>
                            <a href="javascript:;">{item.text}</a>
                        </li>;
                    }.bind(this))}
                </ul>
            </div>
            {/*直播聊天*/}
            {/* <LiveChat /> */}
            {/* 直播设置*/}
            {/*<LiveSetting />*/}

            <div className="video_live">
                {this.getModule()}
                <Bottom/>
            </div>
            <Spin ref="tips" style={{width:400,marginLeft:-200}}/>
        </div>;
    }
});