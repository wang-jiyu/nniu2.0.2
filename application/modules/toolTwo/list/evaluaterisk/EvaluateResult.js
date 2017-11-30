var CommonEvent = require('../../../../components/CommonEvent');
var UserCenterHandle = require('../../../../handle/usercenter/UserCenter');
module.exports = React.createClass({
    closeWindow: function() {
        Interface.closeWin();
    },

    getRiskType: function () {
        if (Config.CACHE_DATA.USER.risk_score <= 10) return '厌恶风险型';
        if ( Config.CACHE_DATA.USER.risk_score <= 20) return '保守型';
        if ( Config.CACHE_DATA.USER.risk_score <= 30) return '稳健型';
        return '激进型';
    },

    getRiskTip: function () {
        if (Config.CACHE_DATA.USER.risk_score <= 10)
            return '您属于无风险承受能力投资者，我们强烈建议您慎重开通投资易服务，如您坚持开通由此带来的风险需要您自身承担；投资有风险，入市需谨慎。';

        if (Config.CACHE_DATA.USER.risk_score <= 20)
            return '您的风险承担能力水平比较低，您对市场可能的风险持谨慎的态度，注重本金的安全性，对期望收益率不高；投资有风险，入市需谨慎。';

        if (Config.CACHE_DATA.USER.risk_score <= 30)
            return '您有一定的风险承受能力，对投资收益比较敏感，期望通过长期且持续的投资获得高于平均水平的回报，愿意承担可预见的投资风险去获取更多的收益；投资有风险，入市需谨慎。';

        return '积极进取的投资理念。提醒您不要因追求一时的高收益而投入全部资金，同时做好仓位管理和风险控制；投资有风险，入市需谨慎。';
    },

    render: function () {
        return (
            <div className="evaluate_content">
                <div className="evaluate_banner">
                    <img src="../assets/images/evaluate_banner.png" alt="banner" />
                    <span>您的风险承受能力评级为：</span>
                    <h1>{this.getRiskType()}</h1>
                </div>
                <div className="evaluate_result">
                    {this.getRiskTip()}
                </div>
                <div className="evaluate_result_info">
                    <i className="evaluate_type_icon" style={{left: 70*( Config.CACHE_DATA.USER.risk_score >= 10 ? Math.floor((Config.CACHE_DATA.USER.risk_score - 10) / 4) : 0) + 140}}></i>
                    <ul className="clearfix result_list">
                        <li>
                            <div>1</div>
                        </li>
                        <li>
                            <div>2</div>
                        </li>
                        <li>
                            <div>3</div>
                        </li>
                        <li>
                            <div>4</div>
                        </li>
                        <li>
                            <div>5</div>
                        </li>
                        <li>
                            <div>6</div>
                        </li>
                        <li>
                            <div>7</div>
                        </li>
                        <li>

                            <div>8</div>
                        </li>
                        <li>
                            <div>9</div>
                        </li>
                        <li>
                            <div>10</div>
                        </li>
                    </ul>
                    <div className="evaluate_type clearfix">
                        <p>厌恶风险型</p>
                        <p>保守型</p>
                        <p>稳健性</p>
                        <p>激进型</p>
                    </div>
                    <div className="submit_box">
                        <input type="button" value="再测一次" onClick={this.props.onChangeStep.bind(null, true)} />
                        <a href="javascript:;" onClick={this.closeWindow}>关闭</a>
                    </div>
                    <p className="evaluate_agreement">
                        本风险承受力评估问卷结果是根据您填问卷当时所提供的资料而推论得知且其结果将作为您未来在投资时的参考所用，此问卷内容及其结果不构成与您进行交易之要约或要约之引诱，亦非投资买卖建议。本公司将不对此份问卷之准确性及资讯是否完整负责。您在此问卷上所填的资料本公司将予以保密。本公司明确规定所有获准使用您资料的公司职员，均须遵守本公司的保密责任。投资有风险，入市需谨慎。
                    </p>
                </div>
                <CommonEvent />
            </div>
        );
    }
});