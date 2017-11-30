var RadioBox = require('../../../../../components/form/RadioBox');
var UserCenterHandle = require('../../../../../handle/usercenter/UserCenter');
var UserOrderHandle = require('../../../../../handle/usercenter/UserOrder');
var Loading = require('../../../../../components/common/Loading');
var OrderResult = require('./OrderResult');

module.exports = React.createClass({
    checkEmpty: function (data) {
        var index = null;
        var list = this.state.data;
        for (var i = 0; i< list.length; i++) {
            if (!data[list[i]['_id']]) {
                index = i + 1;
                break;
            }
        }
        this.setState({index: index});
        return index;
    },

    submit: function (e) {
        var data = e.target.data;
        if (this.checkEmpty(data) != null) return;
        var paramsArr = [];
        for (var key in data) {
            paramsArr.push({question_id: key,option_id: data[key]});
        }
        Forms.disableButton(this.refs.button);
        UserCenterHandle.setEvaluateQuestion(paramsArr, function (result) {
            if (result.code == 200) {
                Interface.getProfile(function() {
                    Config.CACHE_DATA.USER.risk_score = result.data.score;
                    this.setState({result: true});
                }.bind(this), true);
            }
            Forms.activeButton(this.refs.button);
        }.bind(this));
    },
    resEvaluate: function(number) {
        if (typeof(number) == 'number') return this.props.onChange(number);
        this.setState({result: false});
    },

    componentDidMount: function() {
        UserCenterHandle.getEvaluateTest(function (result) {
            if (result.code == 200 && this.isMounted()) {
                this.setState({data : result.data, loading: false});
            }
        }.bind(this));
    },

    getInitialState: function() {
        return {data: [], index: null, loading: true, result: false};
    },

    render: function () {
        if (this.state.loading) return <Loading style={{marginTop: '50px'}} />;
        if (this.state.result) return <OrderResult product={this.props.product} onChange={this.resEvaluate} />;
        return (
            <div className="evaluate_content">
                <div className="evaluate_info">
                    <h3>尊敬的客户，您好！</h3>
                    <div>为尽可能准确的了解您的投资习惯及风险承受能力，以便为您提供个性化的服务，帮助您进行资产合理配置，规避市场风险，烦请您花费一点时间进行测试，谢谢！ 请先认真阅读然后填写本表,以下问题可协助您评估自身的投资风险承受能力、理财方式及投资目标。如您提供不准确及不完整资料，则可能对您投资风险承受能力与偏好的评估带来影响，本人承担相应责任。</div>
                </div>
                <form onSubmit={this.submit} ref="forms">
                    {
                        this.state.data.map(function (item, index){
                            return (
                                <dl className="form_item" key={index}>
                                    <dt>{index + 1}. {item.question}</dt>
                                    <dd>{item.option.map(function( obj, i){
                                        return <RadioBox key={i} name={item._id} value={obj.option_id}>{obj.content}</RadioBox>;
                                    })}</dd>
                                </dl>
                            );
                        }.bind(this))
                    }
                    <div className="submit_box">
                        <input type="submit" value="下一步" ref="button" />
                    </div>
                    {
                        this.state.index != null ?
                            <div className='show_tips'>您好！第{this.state.index}题没有回答，请回答后提交.</div> : ''
                    }
                </form>
            </div>
        );
    }
});