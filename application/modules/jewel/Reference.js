var JewelHandle = require('../../handle/jewel/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({

    goTo: function (item) {
        var url = '/live.html?adviser=' + item.advisor._id + '&report=' + item._id;
        Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, url);
    },

    toPay: function(item) {
        var uri = '/tool.html?tool=order&id=' + item._id + '&type=4';
        Interface.popWin('订单', uri, {width: 746, maxHeight: 790, top: 30, bottom: 30, align: 'center', valign: 0.4});
    },

    load: function (flag) {
        if (flag) this.setState({loading: true});
        var params = {type: 2,limit: 2, page: 1};
        JewelHandle.getList(params, function (result) {
            if (result.code == 200) {
                return this.setState({loading: false, code: null, source: result.data.rows.slice(0, 3)});
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this));
    },

    getList: function () {
        if (this.state.loading) return <div className="error_tips"><Loading /></div>;
        if (this.state.code) return <div className="error_tips"><Reload onReload={this.load.bind(this, true)} code={this.state.code}/></div>;
        return (
            <ul className="report_list">
                {
                    this.state.source.map(function(item, index) {
                        var text = realClass = value = '';
                        var flag;
                        switch (item.state_v2) {
                            case 1:
                                value = item.is_pay == 0 || Config.CACHE_DATA.USER.advisor_type == 2  ? '立即订购' : '立即续订';
                                flag = Config.CACHE_DATA.USER.advisor_type == 2 ? false : true;
                                break;
                            case 2:
                                value = item.is_pay == 0 || Config.CACHE_DATA.USER.advisor_type == 2  ? '立即订购' : '立即续订';
                                flag = Config.CACHE_DATA.USER.advisor_type == 2 ? false : true;
                                break;
                            case 3:
                                value = '立即订购';
                                flag = false;
                                break;
                            case 4:
                                value = '立即订购';
                                flag = false;
                                break;
                            default:
                                realClass = null;
                                flag = false;
                        }
                        return (
                            <li>
                                <h4 onClick={this.goTo.bind(this, item)}>{item.title}</h4>
                                <div className="detail">
                                    <img src={item.cover_url ? item.cover_url : "/assets/images/reference_normal.png" } />
                                    <div>
                                        <p>{item.specialty}</p>
                                        <input type="button" value={value} onClick={flag ? this.toPay.bind(this, item) : null} className={flag ? 'small' : 'small has'}/>
                                    </div>
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
            <div className="report_box">
                <div className="report">
                    <h1>内参</h1>
                    <p className="title">国内国际政经形式、产业要闻深入解读。投资大势了然于胸<a href="javascript:;" onClick={this.props.openModule.bind(null, 'morereferences')}>更多</a></p>
                    {this.getList()}
                </div>
            </div>
        )
    }
});

