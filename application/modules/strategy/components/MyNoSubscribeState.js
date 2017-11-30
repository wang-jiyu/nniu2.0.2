module.exports = React.createClass({
    render: function() {
        return (
            <div className="my_sub">
                <h3 className="my_sub_h3">我的订阅</h3>
                <div className="notSub">
                    <div className="notSub_tit">您还没有订阅任何策略！</div>
                    <p className="notSub_p">
                        购买后您可以享受如下服务：<br />
                        1、随时查看当前持仓明细<br />
                        2、及时获取交易动态<br />
                        <a href={Config.PATH+'strategyIndex.html?postion=index'}>我要去订阅{">>"} </a>
                    </p>
                </div>
            </div>
        )
    }
});