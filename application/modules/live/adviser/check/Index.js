var LiveHandle = require('../../../../handle/live/Index');
module.exports = React.createClass({
    getInitialState: function () {
        return { checkList: [], limit:5, page0:1,page1:1,page2:1, totalPage:0, checkType:0, ok:false }
    },

    getCheckList: function(checkType) {
        var page;
        if(checkType == 0) {
            page = this.state.page0;
        }else if(checkType == 1) {
            page = this.state.page1;
        }else if(checkType == 2) {
            page = this.state.page2;
        }
        this.setState({checkType:checkType});
        var isVip = this.props.isVip;
        var ref_id;
        ref_id = isVip ? Config.CACHE_DATA.ROOM.vip_channel_id : Config.CACHE_DATA.ROOM.chat_channel_id;
        LiveHandle.getCheckMessageList(Config.CACHE_DATA.ROOM._id,ref_id,this.state.limit,page,checkType, function (result) {
            if (result.code == 200) {
                this.setState({
                    checkList:result.data.messages,
                    totalPage:Math.ceil(result.data.count/this.state.limit)
                })
            } else {
                Event.trigger('ServerTips', result.message);
            }
        }.bind(this));
    },
    handleMessage: function(msgId,handleType) {
        this.messageId=msgId;
        this.handType=handleType;
        $(this.refs.confirmBox).css('display','block');
    },
    //下一页
    setNext: function() {
        if(this.state.checkType == 0) {
            if(this.state.page0 == this.state.totalPage) {
                return false
            }else{
                this.setState({
                    page0:this.state.page0 + 1
                },function() {
                    this.getCheckList(this.state.checkType);
                })
            }
        }else if(this.state.checkType == 1) {
            if(this.state.page1 == this.state.totalPage) {
                return false
            }else{
                this.setState({
                    page1:this.state.page1 + 1
                },function() {
                    this.getCheckList(this.state.checkType);
                })
            }
        }else if(this.state.checkType == 2) {
            if(this.state.page2 == this.state.totalPage) {
                return false
            }else{
                this.setState({
                    page1:this.state.page2 + 1
                },function() {
                    this.getCheckList(this.state.checkType);
                })
            }
        }

    },
    //上一页
    setUp: function() {
        if(this.state.checkType == 0) {
            if(this.state.page0 > 1) {
                this.setState({
                    page0:this.state.page0 - 1
                },function() {
                    this.getCheckList(this.state.checkType);
                })
            }else{
                return false;
            }
        }else if(this.state.checkType == 1) {
            if(this.state.page1 > 1) {
                this.setState({
                    page1:this.state.page1 - 1
                },function() {
                    this.getCheckList(this.state.checkType);
                })
            }else{
                return false;
            }
        }else if(this.state.checkType == 2) {
            if(this.state.page2 > 1) {
                this.setState({
                    page2:this.state.page2 - 1
                },function() {
                    this.getCheckList(this.state.checkType);
                })
            }else{
                return false;
            }
        }
    },
    transferTime: function(time) {
        var date = new Date(time * 1000);
        return date.toLocaleString();
    },
    renderCheckList: function() {
        if(this.state.checkType !== 0){
            return this.state.checkList.map(item=>{
                    return <tr>
                        <td>{this.transferTime(item.create_time)}</td>
                        <td>{item.from.name}</td>
                        <td>{item.body.content}</td>
                        <td></td>
                    </tr>
            })
        }else{
            return this.state.checkList.map(item=>{
                    return <tr>
                        <td>{this.transferTime(item.create_time)}</td>
                        <td>{item.from.name}</td>
                        <td>{item.body.content}</td>
                        <td><span onClick={this.handleMessage.bind(this,item._id,1)}>通过</span>&nbsp;&nbsp;&nbsp;&nbsp;<span onClick={this.handleMessage.bind(this,item._id,2)}>屏蔽</span></td>
                    </tr>
            })
        }

    },
    getPage: function() {
        if(this.state.checkType == 0) {
            return this.state.page0;
        }else if(this.state.checkType == 1) {
            return this.state.page1;
        }else if(this.state.checkType == 2) {
            return this.state.page2;
        }
    },
    confirm: function() {
        var msgObj = {
            "room_id":Config.CACHE_DATA.ROOM._id,
            "message_id":this.messageId,
            "handle_type":this.handType
        }
        LiveHandle.handleCheckMessage(msgObj, function(result) {
            if(result.code == 200) {
                this.getCheckList(0);
            }else{
                Event.trigger('ServerTips', result.message);
            }
        }.bind(this));
        $(this.refs.confirmBox).css('display','none');
    },
    cancel: function() {
        this.setState({ok:false});
        $(this.refs.confirmBox).css('display','none');
    },
    componentWillMount: function() {
        this.getCheckList(0);
    },
    render: function() {
        return (
            <div className="check_box clearfix">
                <div className="check_box_header"><h3>直播室敏感词审核</h3></div>
                <div className="change_status">
                     <span className="">状态 ｜</span>
                     <span onClick={this.getCheckList.bind(this,0)}>待审核</span>
                     <span onClick={this.getCheckList.bind(this,1)}>已通过</span>
                     <span onClick={this.getCheckList.bind(this,2)}>已屏蔽</span>
                </div>
                <div className="check_table">
                    <table>
                        <thead>
                            <td>时间</td>
                            <td>用户昵称</td>
                            <td>内容</td>
                            <td>操作</td>
                        </thead>
                    {this.renderCheckList()}
                    </table>
                </div>
                <div className="change_page">
                    <span onClick={this.setUp}>上一页</span>
                    <span>{this.getPage()}页/{this.state.totalPage}页</span>
                    <span onClick={this.setNext}>下一页</span>
                </div>
                    <div className="confirmBox" ref="confirmBox">
                        <p>您是否执行该操作？</p>
                        <button onClick={this.confirm}>确定</button>
                        <button onClick={this.cancel}>取消</button>
                    </div>
            </div>
        );
    }
});
