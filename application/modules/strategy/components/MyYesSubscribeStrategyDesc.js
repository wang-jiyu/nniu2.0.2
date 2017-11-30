/**
 * 我的已订阅 => 策略动态部分
 */
module.exports = React.createClass({
    getInitialState: function () {
        return {
            dataList: [
                {
                    "date": "05/22",
                    "time": "11:27",
                    "strategy": "矩阵多因子策划",
                    "operate": "调入",
                    "bank": "浦发银行",
                    "money": 60005698939850394650934
                }, {
                    "date": "05/22",
                    "time": "11:27",
                    "strategy": "矩阵多因子策划",
                    "operate": "调出",
                    "bank": "浦发银sdfsdfsfdgerh行",
                    "money": 60000
                }, {
                    "date": "05/22",
                    "time": "11:27",
                    "strategy": "矩阵多因子策划",
                    "operate": "调入",
                    "bank": "浦发银行",
                    "money": 60000
                }, {
                    "date": "05/22",
                    "time": "11:27",
                    "strategy": "矩阵多因子策dfdfddfhdfhdfh划",
                    "operate": "调出",
                    "bank": "浦发银行",
                    "money": 60000
                }, {
                    "date": "05/22",
                    "time": "11:27",
                    "strategy": "矩阵多因子策划",
                    "operate": "调入",
                    "bank": "浦发银行",
                    "money": 60000
                }
            ]
        }
    },
    componentDidMount: function () {

    },
    handleClick: function (event) {
        console.log(event.target);
    },
    render: function () {
        // console.log(this.state.dataList.length);
        return (
            <div className="container">
                <div className="strategy-box">
                    <h3 className="title">策略动态</h3>
                    {
                        this.state.dataList.length? <ul className="strategy-list">
                            {
                                this.state.dataList.map(function(item, index) {
                                    return (<li key={index} className="list-item">
                                        <span classname="date">{item.date}</span>
                                        <span className="time">{item.time}</span>
                                        <span className="strategy">{item.strategy}</span>
                                        <span className={ item.operate === '调入' ? 'in' : 'out'}
                                              onClick={this.handleClick.bind(this)}>{item.operate}</span>
                                        <span className="bank">{item.bank}<br/>{item.money}</span>
                                    </li>)
                                })
                            }
                        </ul>: <div className="notDynamic_img"><p>近三天没有动态</p></div>
                    }
                </div>
            </div>
        )
    }
})
