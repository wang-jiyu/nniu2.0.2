var NoData = require('./NoData');
var TodayTc = require('./TodayTc');
var CurrentCc = require('./CurrentCc');
var Transaction = require('./Transaction');
var StrategyListData = require('../../../handle/strategy/Index');

var DatePicker = require('element-react').DatePicker;
require('element-theme-default');
var tabs = [{
    name: '今日调仓',
    param: 0,
    template: 'TodayTc'
}, {
    name: '当前持仓',
    param: 1,
    template: 'CurrentCc'
}, {
    name: '过往交易',
    param: 2,
    template: 'Transaction'
}]
module.exports = React.createClass({
    getInitialState: function() {
        return ({
            "tabValue": 'TodayTc',
            "currentIndex": 0,
            "dateValue": '',
            "historyData": []
        })
    },
    getHistoryData: function(paramObj) {
        StrategyListData.getStrategyHistoryData(paramObj, function(result) {
            result = JSON.parse(result);
            if (result.code == 200) {
                this.setState({
                    historyData: result.data
                });
            }
        }.bind(this));
    },
    handleClick: function(changeValue, index) {
        this.setState({
            tabValue: changeValue,
            currentIndex: index
        });
    },
    handleChange: function(date) {
        this.setState({
            dateValue: date
        });
        var year = date.getFullYear().toString();
        var month = Config.TOOL.checkTimeItem(date.getMonth() + 1);
        var _id = Url.getParam("_id")
        var info = {};
        info._id = _id;
        info.month = year + month;
        this.getHistoryData(info);

    },
    check_tab_index: function(index) {
        return index === this.state.currentIndex ? "checked" : "";
    },
    componentDidMount: function() {
        var _id = Url.getParam("_id")
        var info = {};
        info._id = _id;
        this.getHistoryData(info);
    },
    componentWillMount: function() {
        // var _id = Url.getParam("_id")
        // var info = {};
        // info._id = _id;
        // this.getHistoryData(info);
    },
    render: function() {
        var temp = (this.state.tabValue == 'TodayTc') ? <TodayTc /> : (this.state.tabValue == 'CurrentCc') ? <CurrentCc /> : (this.state.tabValue == 'Transaction') ? <Transaction data={this.state.historyData} /> : <NoData />
            // var hasTime = this.state.currentIndex== 2 ? <DatePicker value={this.state.dateValue} placeholder="选择年月"onChange={this.handleChange} selectionMode="month"/> : '';
        var hasHide = {
            'text-align': 'right',
            'margin-right': '30px'
        }
        hasHide.display = this.state.currentIndex == 2 ? 'block' : 'none';
        return (
            <div>
                <div className="detailsTab mtop20">
                    <ul className="clearfix">
                        {
                            tabs.map(function (item, index) {
                                return <li className={this.check_tab_index(index)} ref='li'
                                           onClick={this.handleClick.bind(this, item.template, index)}>
                                    {item.name}
                                </li>
                            }.bind(this))
                        }
                    </ul>
                     <div style={hasHide}>
                            <DatePicker
                            value={this.state.dateValue}
                            placeholder="选择年月"
                            onChange={this.handleChange}
                            selectionMode="month"
                        />
                        </div>

                </div>
                {temp}
            </div>
        )
    }

});
