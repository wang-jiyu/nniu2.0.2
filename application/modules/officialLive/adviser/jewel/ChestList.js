var LiveHandle = require('../../../../handle/live/Index');
var GoldStock = require('./GoldStock');
var Tactics = require('./Tactics');
var AddChest = require('./AddChest');
var SetChest = require('./SetChest');
var Report = require('./Report');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');
module.exports = React.createClass({
    status: function (type) {
        switch (type) {
            case 1:
                return {text: '预售中', color: '#FF423D'};
            case 2:
                return {text: '运行中', color: '#FF6600'};
            case 3:
                return {text: '已停售', color: '#F59D00'};
            case 4:
                return {text: '已结束', color: '#888888'};
            default:
                return null;
        }
    },
    category: function (id) {
        var item = ArrayCollection.getItem.call(Config.CACHE_DATA.JEWEL_CATEGORY, id, '_id');
        if (!item) return {name: '实战组合', color: '#f2bf81'};
        return {name: item.category_name, color: item.color};
    },
    openModule: function (type, source) {
        var title = <div className="chest_header">{LiveHandle.getAppellation()}的百宝箱</div>;

        switch (type) {
            case 'addTip':
                Event.trigger('FreshJewelModule', {
                    module: <AddChest onChange={this.createChest} title="创建锦囊包" type="tip"/>, title: title
                });
                break;
            case 'editTip':
                Event.trigger('FreshJewelModule', {
                    module: <SetChest onChange={this.changeChest} source={source} title="修改锦囊包" type="tip"/>,
                    title: title
                });
                break;
            case 'addReport':
                Event.trigger('FreshJewelModule', {
                    module: <AddChest onChange={this.createChest} title="创建内参" type="report"/>, title: title
                });
                break;
            case 'editReport':
                Event.trigger('FreshJewelModule', {
                    module: <SetChest onChange={this.changeChest} source={source} title="修改内参" type="report"/>,
                    title: title
                });
                break;
        }
    },

    reportItem: function (id) {
        Event.trigger('FreshJewelModule', {
            module: <Report id={id} getItem={this.props.getItem}/>,
            title: <div className="chest_header">{LiveHandle.getAppellation()}的百宝箱</div>
        });
    },

    tipItem: function (id) {
        Event.trigger('FreshJewelModule', {
            module: <Tactics id={id} getItem={this.props.getItem}/>,
            title: <div className="chest_header">{LiveHandle.getAppellation()}的百宝箱</div>
        });
    },

    stockItem: function (id) {
        Event.trigger('FreshJewelModule', {
            module: <GoldStock id={id} getItem={this.props.getItem}/>,
            title: <div className="chest_header">{LiveHandle.getAppellation()}的百宝箱</div>
        });
    },

    createChest: function (result) {
        this.state.source.unshift(result);
        this.setState({source: this.state.source, total: ++this.state.total});
    },
    changeChest: function (result) {
        var index = ArrayCollection.indexOf.call(this.state.source, result._id, '_id');
        this.state.source[index] = result;
        this.setState({source: this.state.source});
    },
    deleteTip: function (item) {
        Event.trigger('OpenAlert', {
            title: '删除锦囊',
            message: '确认要删除当前锦囊吗？',
            button: Config.MESSAGE_BUTTON.DELETE,
            event: function () {
                LiveHandle.deleteTactic(item._id, function (result) {
                    if (result.code == 200) {
                        ArrayCollection.removeItem.call(this.state.source, item._id, '_id');
                        this.setState({source: this.state.source, total: --this.state.total});
                    }
                }.bind(this))
            }.bind(this)
        })
    },
    deleteReport: function (item) {
        Event.trigger('OpenAlert', {
            title: '删除内参',
            message: '确认要删除当前内参吗？',
            button: Config.MESSAGE_BUTTON.DELETE,
            event: function () {
                LiveHandle.deleteReport(item._id, function (result) {
                    if (result.code == 200) {
                        ArrayCollection.removeItem.call(this.state.source, item._id, '_id');
                        this.setState({source: this.state.source, total: --this.state.total});
                    }
                }.bind(this));
            }.bind(this)
        });
    },
    wheel: function () {
        if (Utils.isScrollBottom(this.refs.chestBox) && this.state.scroll) {
            this.setState({loadMore: true}, this.load(false));
        }
    },

    load: function (flag) {
        if (flag) this.setState({loading: true});
        var params = {limit: 6, page: this.state.page};
        //获取百宝箱列表1
        LiveHandle.boxlist(params, Config.CACHE_DATA.ROOM.advisor._id, function (result) {
            if (result.code == 200 && this.isMounted()) {
                //pc直播接口改变
                this.editorGolderStock(result.data.golden_stock);
                var _person = result.data.box_reference.rows.concat(result.data.golden_stock);
                var scroll = _person.length == 0 ? false : true;
                this.state.source.push.apply(this.state.source, _person);
                return this.setState({
                    code: null,
                    source: this.state.source,
                    loading: false,
                    page: ++this.state.page,
                    loadMore: false,
                    total: result.data.total,
                    scroll: scroll
                })
            }
            return this.setState({code: result.code, loading: false});
        }.bind(this))
    },
    componentDidMount: function () {
        this.load(true);
    },

    /**修改金股接口 */
    editorGolderStock: function (arr) {
        if (!arr)
            return;
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            item._id = item.id;
            item.title = item.product_name;
            item.state_v2 = item.run_status;
            item.type = 50;
        }
    },

    getInitialState: function () {
        return {code: null, loading: true, source: [], page: 1, scroll: true};
    },

    getItemName: function (type) {
        switch (type) {
            case 1:
                return "锦囊";
            case 4:
                return "内参";
            case 50:
                return "金股";
            default:
                return "x类型";
        }
    },

    getItemCss: function (type) {
        switch (type) {
            case 1:
                return "icon_text";
            case 4:
                return "icon_text blue";
            case 50:
                return "icon_text";
            default:
                return "icon_text";
        }
    },

    getItemClick: function (item) {
        switch (item.type) {
            case 1:
                return this.tipItem.bind(this, item._id);
            case 4:
                return this.reportItem.bind(this, item._id);
            case 50:
                return this.stockItem.bind(this, item._id);
            default:
                return this.reportItem.bind(this, item._id);
        }
    },

    render: function () {
        if (this.state.loading) return <Loading/>;
        if (this.state.code) return <Reload onReload={this.load} code={this.state.code}/>;
        // <li><a href="javascript:;" onClick={item.type == 1 ? this.deleteTip.bind(this, item) : this.deleteReport.bind(this, item)}>删除</a></li>

        var list = this.state.source.map(function (item, index) {
            var category = this.category(item.category_id);
            var status = this.status(item.state_v2);
            return <li key={index}>
                <div className={this.getItemCss(item.type)}>
                    <i></i>
                    <label>{this.getItemName(item.type)}</label>
                </div>
                <div className="detail yellow running">
                    <h4 onClick={this.getItemClick(item)}>
                        <label>{item.title}</label>
                        <b style={{background: category.color}}>{category.name}</b>
                    </h4>
                    <p>{item.specialty}</p>
                    <div>
                        <label>服务周期：</label>
                        <label style={{marginRight: '15px'}}>{item.service_period}天</label>
                        {status ? <i style={{color: status.color}}>{status.text}</i> : null}
                    </div>
                </div>
                {LiveHandle.isRoomOwner() && item.type == 999950 ?
                    <ul className="tips_operate">
                        <li><a href="javascript:;"
                               onClick={item.type == 1 ? this.openModule.bind(this, 'editTip', item) : this.openModule.bind(this, 'editReport', item)}>编辑</a>
                        </li>
                    </ul>
                    : null}
                <span
                    className="price">{item.is_pay && Config.CACHE_DATA.USER.advisor_type != 2 ? '已订购' : item.price ? '￥' + Utils.formatCoin(item.price) : '免费'}</span>
            </li>
        }.bind(this));
        if (this.state.source.length == 0) list = <li className="live_no_data">
            <i>&#xe87c;</i>
            <p>暂无百宝箱</p>
        </li>


        return <div className="treasure_chest">
            <div className="chest_header">
                <h5>{LiveHandle.getAppellation()}的百宝箱</h5>
                <span><span>{this.state.total}</span> 篇</span>
            </div>
            <ul className="treasure_chest_list" onScroll={this.wheel} ref="chestBox">
                {/*{LiveHandle.isRoomOwner() ? <li className="btn_box">*/}
                {/*<input type="button" className="dark_blue" value="创建新锦囊包" onClick={this.openModule.bind(this, 'addTip')} />*/}
                {/*<input type="button" className="dark_blue" value="创建新内参" onClick={this.openModule.bind(this, 'addReport')} />*/}
                {/*</li> : null}*/}
                {list}
                {this.state.loadMore && <li className="load_more">
                    <p>加载更多...</p>
                </li>}
            </ul>
        </div>;
    }
});


