module.exports = React.createClass({
    getInitialState: function () {
        return {
            dataPrlblem: [
                {
                    "title": "什么是量化策略？",
                    "conter": "量化投资是指利用一定的数学方法去模型化投资理念、根据策略实现投资收益的过程。"
                }, {
                    "title": "量化策略对投资有什么好处？",
                    "conter": "根据现代资产组合理论(MPT)，通过计算机自动计算，对沪深A股市场的个股进行监控，大幅度降低最大回撤和收益波动，帮助投资者锁定长期投资目标，克服短期市场情绪的影响。"
                }, {
                    "title": "什么是策略订阅？",
                    "conter": "用户订阅了一个策略后，可以查看策略计算结果，包括历史持仓，当前持仓，以及通过海纳智投的PC、APP产品接收调仓指令。根据这些信息，订阅者可以了解该策略在各个调仓日如何买卖股票，获得投资策略的机会。"
                }
            ]
        }
    },
	render: function() {
		return (
            <div className="problem—box">
                <div className="conter">
                    <div className="conter_top">
                    <h3>常见问题</h3>
                    </div>
             <ul>
                 { this.state.dataPrlblem.map(function(elem, index) {
                     return <li>
                    <h4>{elem.title}</h4>
                    <p>{elem.conter}</p>
                </li>
                 }) }
            </ul>
        <div className="conter_botttom">
            <h4>订阅流程</h4>
            <div className="conter_img">
                <img src="assets/images/strategy/dingyue.png" />
                <img src="assets/images/strategy/jiantou.png" />
                <img src="assets/images/strategy/pay.png" />
                <img src="assets/images/strategy/jiantou.png" />
                <img src="assets/images/strategy/jieshou.png"  className="conterimg"/>
            </div>
            <div className="conter_font">
                <p>订阅策略</p>
                <p>在线支付</p>
                <p>接受调仓信息</p>
            </div>
            <div className="conter_phone">
                <div className="phone_left">
                <h5>联系我们</h5>
                <p>400-156-6699</p>
            </div>
            <div className="phone_right">
                <img src="assets/images/strategy/cjwt.png" />
            </div>
                </div>
           </div>
                </div>
            </div>
		)
	}
})