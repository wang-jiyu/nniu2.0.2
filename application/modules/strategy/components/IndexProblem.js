module.exports = React.createClass({
    getInitialState: function() {
        return {
            data: {}
        }
    },
    render: function() {
        return (
            <div>
                <div className="problem-title">
                    <div href="javascript:void(0)">
                        <div className="tit">
                            <h2>常见问题</h2>
                            <a href="strategyproblem.html">更多{'>'}</a>
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
                    </div>
                </div>
            </div>
        )
    }
})