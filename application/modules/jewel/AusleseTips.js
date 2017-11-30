var JewelHandle = require('../../handle/jewel/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({

    click: function(item) {
        if (item.link_type != 2) return Interface.popWin(item.title, item.link_url, {width: 1260, maxHeight: 642, top: 30, bottom: 30, align: 'center', valign: 0.4});

        var data = Utils.clickUrl(item);
        Interface.gotoLeftNavView(data.type, data.url);
    },

    goTo: function (item) {
        var url = '/live.html?adviser=' + item.advisor._id + '&tactics=' + item._id;
        Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, url);
    },

    toPay: function(item) {
        var uri = '/tool.html?tool=order&id=' + item._id + '&type=1';
        Interface.popWin('订单', uri, {width: 746, maxHeight: 790, top: 30, bottom: 30, align: 'center', valign: 0.4});
    },

    load: function (flag) {
        if (flag) this.setState({loading: true});
        var params = {type: 1, is_recommend: 1, limit: 6, page: 1};
        JewelHandle.getList(params, function (result) {
            if (result.code == 200) {
                return this.setState({loading: false, code: null, source: result.data.rows});
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this));
    },

    getList: function () {
        if (this.state.loading) return <div className="error_tips"><Loading /></div>;
        if (this.state.code) return <div className="error_tips"><Reload onReload={this.load.bind(this, true)} code={this.state.code}/></div>;
        return (
            <ul>
                {
                    this.state.source.map(function(item, index) {
                        var text = realClass = value = '';
                        var flag;
                        switch (item.state_v2) {
                            case 1:
                                text = '预售中';
                                realClass = 'green';
                                value = item.is_pay == 0 || Config.CACHE_DATA.USER.advisor_type == 2  ? '订购' : '续订';;
                                flag = Config.CACHE_DATA.USER.advisor_type == 2 ? false : true;
                                break;
                            case 2:
                                text = '运行中';
                                realClass = 'pink';
                                value = item.is_pay == 0 || Config.CACHE_DATA.USER.advisor_type == 2  ? '订购' : '续订';
                                flag = Config.CACHE_DATA.USER.advisor_type == 2 ? false : true;
                                break;
                            case 3:
                                text = '已停售';
                                realClass = 'gray';
                                value = '订购';
                                flag = false;
                                break;
                            case 4:
                                text = '已结束';
                                realClass = 'gray';
                                value = '订购';
                                flag = false;
                                break;
                            default:
                                text = null;
                                realClass = null;
                                flag = false;
                        }

                        return (
                            <li className="tip_item">
                                <img src={item.advisor.avatar} />
                                <div className="detail">
                                    <h5>
                                        <label onClick={this.goTo.bind(this, item)}>{item.title}</label>
                                        {text ? <input type="button" value={text} className={realClass} /> : null}
                                    </h5>
                                    <div>
                                        <i>{item.advisor.name}</i>
                                        <label>{item.advisor.level_name}</label>
                                        <b>证券资格证：{item.advisor.qcer}</b>
                                    </div>
                                    <p className="description">{item.specialty}</p>
                                    <p>运作周期：{item.service_period + '天'}</p>
                                    {text ? <input type="button" value={value} style={{marginLeft: 0}} onClick={flag ? this.toPay.bind(this, item) : null} className={flag ?  "small" : "small has" }/> : null}
                                </div>
                            </li>
                        );
                    }.bind(this))
                }
            </ul>
        );
    },

    componentDidMount: function () {
        this.load(false);
    },

    getInitialState: function () {
        return {source: [], loading: true, code: null}
    },

    render: function () {

        return (
            <div className="tips_box">
                <div className="tips">
                    <div className="chosen_tips_box">
                        <h4>
                            <label>精选锦囊</label>
                            <a href="javascript:;" onClick={this.props.openModule.bind(null, 'moretips')}>更多</a>
                        </h4>
                        {this.getList()}
                    </div>
                </div>

            </div>
        )
    }
});

