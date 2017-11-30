var BuyTips = require('./BuyTips');
var LiveHandle = require('../../../../handle/live/Index');
var GoldSharesList = require('../live/liveRevision/GoldSharesList');
var CreateGoldShares = require('../live/liveRevision/CreateGoldShares');

//金股
module.exports = React.createClass({
    load: function () {
        var advisorID = Config.CACHE_DATA.ROOM.advisor._id;
        //获取单条锦囊包
        LiveHandle.getGoldStockList(this.props.id, advisorID, function (result) {
            if (result.code == 200) {
                this.state.source = result.data;
            } else {
                this.state.error = result.code;
            }
            this.setState({ loading: false });
        }.bind(this));
    },

    close: function () {
        Event.trigger('FreshJewelModule', 'close');
    },

    componentWillUnmount: function () {
        Event.off('PaySuccess', this.load);
    },
    componentDidMount: function () {
        Event.on('PaySuccess', this.load);
        this.load();
    },
    getInitialState: function () {
        return { source: null, loading: true, error: null, isBtnNewClick: false, editInfo: null }
    },

    getList: function (infos) {
        var arr = [];
        for (var i = 0; i < infos.length; i++) {
            var item = infos[i];
            arr.push(<GoldSharesList info={item} key={item._id} onEdit={this.onEditStock.bind(this)} />);
        }
        return arr;
    },

    //新建
    btnNewClick: function () {
        this.setState({ isBtnNewClick: true });
    },

    //编辑
    onEditStock: function (info) {
        this.setState({ isBtnNewClick: true, editInfo: info });
    },

    render: function () {
        var infos = this.state.source;
        var isBtnNewClick = this.state.isBtnNewClick;
        return (
            <div className="curr-goldshares-list">
                <div className={isBtnNewClick ? "hide" : "curr-goldshares-createbtnbox"}>
                    {!LiveHandle.isRoomOwner() ? null : <div className="curr-goldshares-create-btn" onClick={this.btnNewClick}>新建</div>}
                </div>
                <div className={isBtnNewClick ? "hide" : "curr-goldshares-item-box"}>
                    {
                        infos && this.getList(infos)
                    }
                </div>
                <CreateGoldShares hide={!isBtnNewClick} id={this.props.id} info={this.state.editInfo} ref="stockEditor" />
            </div>
        )
    }
});


