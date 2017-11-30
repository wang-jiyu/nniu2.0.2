var UserOrderHandle = require('../../../../../handle/usercenter/UserOrder');

module.exports = React.createClass({
    timer: function () {
        setTimeout(function () {
            this.setState({
                error: null
            })
        }.bind(this), 2000);
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
    submit: function () {
        var product = this.props.product;
        if (!product.discount_price) {
            var param = {
                product_id: product._id,
                paymethod: product.paymethod,
                num:product.cycle,
                timeType:product.timeType,
                discountDetails:product.discountDetails,
                isExclusive:parseInt(Url.getParam('is_exclusive')),
                serviceType:parseInt(Url.getParam('serviceType'))
            };
            UserOrderHandle.createMobileOrder(param, function(result) {
                if (result.code == 42903) {
                    this.props.onChange(5);
                } else {
                    this.setState({
                        error: Utils.getPromptInfo(result.code)
                    }, function () {
                        clearTimeout(this.timer);
                        this.timer();
                    }.bind(this));
                }
            }.bind(this))
        } else {
            this.props.onChange(4);
        }
    },
    resetEvaluate: function() {
        this.props.onChange();
    },

   

    getInitialState: function() {
        return {tips: {class: 'shadow', text:''}};
    },

    render: function () {
        return (
            <div className="result">
                <div className="header">
                    <h1>初步判断您属于{this.getRiskType()}客户</h1>
                    <span>{this.getRiskTip()}</span>
                </div>
                <div className="details">
                    <h1>具体说明：</h1>
                    <span>本风险承受力评估问卷结果是根据您填问卷当时所提供的资料而推论得知且其结果将作为您未来在投资时的参考所用，此问卷内容及其结果不构成与您进行交易之要约或要约之引诱，亦非投资买卖建议。本公司将不对此份问卷之准确性及资讯是否完整负责。您在此问卷上所填的资料本公司将予以保密。本公司明确规定所有获准使用您资料的公司职员，均须遵守本公司的保密责任。投资有风险，入市需谨慎。</span>
                </div>
                <div className={this.state.error ? 'shadow show' : 'shadow'} ref="shadow">
                    {this.state.error}
                </div>
                <div className="agree_button" onClick={this.submit}>我已阅读并同意</div>
            </div>
        );
    }
});