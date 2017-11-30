var IndexProblem = require('./IndexProblem');
module.exports = React.createClass({
    componentWillMount: function() {
        this.props.listApi(4, 1, {}, function(data) {
            this.setState({
                data: data[0]
            });
        }.bind(this));
    },
    getInitialState: function() {
        return {
            data: {}
        }
    },
    render: function() {
        return (
            <div className="problem">
            {/*<div className="problem-title">
                <a href="strategyproblem.html">
                    <div className="tit">
                        <h2>常见问题</h2>
                    </div>
                    <div className="strategy-process">
                        <div className="subscribe">
                            <img src="assets/images/strategy/index/subscribe.png" alt="订阅策略"/>
                            <span>订阅策略</span>
                        </div>
                        <div className="arrow">
                            <img src="assets/images/strategy/index/payment-arrow.png" alt=""/>
                        </div>
                        <div className="online-payment">
                            <img src="assets/images/strategy/index/payment.png" alt="在线支付"/>
                            <span>在线支付</span>
                        </div>
                        <div className="arrow">
                            <img src="assets/images/strategy/index/payment-arrow.png" alt=""/>
                        </div>
                        <div className="info">
                            <img src="assets/images/strategy/index/information.png" alt="调仓信息"/>
                            <span>接受调仓信息</span>
                        </div>
                    </div>
                </a>
            </div>*/}
            <a href={'strategyNoInfo.html?_id='+this.state.data._id} className="problem-recommend">
                <div className="adTitle">{this.state.data.name}</div>
                <div className="adRate">{this.state.data.profit_yesterday && this.state.data.profit_yesterday !=0 ? ((this.state.data.profit_yesterday*100).toFixed(2))+'%' : '--'}</div>
                <div className="yesterdayRate">昨日收益率</div>
            </a>
        </div>
        )
    }
})