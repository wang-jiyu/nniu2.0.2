var StrategyListData = require('../../../handle/strategy/Index');
module.exports = React.createClass({
    getStrategtylist: function() {

        var data = {
            sort: 4,
            page: 1,
            size: 1
        }
        StrategyListData.getStrategylist(data, function(result) {
            result = JSON.parse(result);
            if (result.code == 200) {
                this.setState({
                    datalist: result.data
                });
            }
        }.bind(this));
    },
    componentWillMount: function() {
        this.getStrategtylist();
    },
    getInitialState: function() {
        return {
            datalist: []
        };
    },
    render() {
        console.log(this.state.datalist);
        return (
            <div className="fire-recommendation">
                <div className="recommendation-title">
                    火力推荐
                </div>
                <div className="recommendation-content">
                    <ul>
                        {
                            this.state.datalist.map(function(item,index){
                                return <li>
                                            <div className="yesterday-yield">
                                                <p className="val">{(item.profit_yesterday).toFixed(2)}%</p>
                                                <p className="desc">昨日收益率</p>
                                            </div>
                                            <div className="line"></div>
                                            <div className="recommended-stock">
                                                <div className="tit-name">{item.name}</div>
                                                <div className="characteristic">
                                                {
                                                    item.label.map(function(items,indexs){
                                                        return <span>{items.title}</span>
                                                    })
                                                 }
                                                </div>
                                            </div>
                                            {/*<!--*/}
                                            {/*<a className="subscribe">*/}
                                                {/*订阅*/}
                                            {/*</a>-->*/}
                                        </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
});