var RadioBox = require('../../../../components/form/RadioBox');
var CommonEvent = require('../../../../components/CommonEvent');
var UserCenterHandle = require('../../../../handle/usercenter/UserCenter');

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
            Forms.activeButton(this.refs.button);
            if (result.code == 200) {
                Interface.getProfile(function() {
                    this.props.onChangeStep(false);
                }.bind(this), true);

            }
        }.bind(this));
    },

    componentDidMount: function() {
        UserCenterHandle.getEvaluateTest(function (result) {
            this.setState({data : result.data});
        }.bind(this));
    },

    getInitialState: function() {
        return {data: [], index: null};
    },

    render: function () {
        return (
            <div className="evaluate_content">
                <div className="evaluate_banner">
                    <img src={Url.getAssets('/images/evaluate_banner.png')} alt="banner" />
                    <span>您的风险承受能力评级为：</span>
                    <h2>一分钟测评，为了您的投资更安全</h2>
                </div>
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
                        <input type="submit" value="提交" ref="button" />
                    </div>
                    {
                        this.state.index != null ?
                            <div className='show_tips'>您好！第{this.state.index}题没有回答，请回答后提交.</div> : ''
                    }
                </form>
                <CommonEvent />
            </div>
        );
    }
});