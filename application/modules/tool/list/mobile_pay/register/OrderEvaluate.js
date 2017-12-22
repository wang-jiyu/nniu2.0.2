var UserCenterHandle = require('../../../../../handle/usercenter/UserCenter');
var Loading = require('../../../../../components/common/Loading');
var OrderResult = require('./OrderResult');

module.exports = React.createClass({

    submit: function (question_id) {
        var value = $(this.refs.askBox).find('input:checked').val();
        if (!value) return this.setState({tips: 'no_select'});

        this.state.answer[question_id] = value;
        this.setState({
            tips: 'yet_select',
            answer: this.state.answer,
        }, function () {
            var paramsArr = [];
            for (var key in this.state.answer) {
                paramsArr.push({question_id: key,option_id: this.state.answer[key]});
            }
            UserCenterHandle.setEvaluateQuestion(paramsArr, function (result) {
                if (result.code == 200) {
                    Interface.getProfile(function() {
                        Config.CACHE_DATA.USER.risk_score = result.data.score;
                        this.setState({result: true});
                    }.bind(this), true);
                }
            }.bind(this));
        }.bind(this));
    },
    resEvaluate: function(number) {
        if (typeof(number) == 'number') return this.props.onChange(number);
        this.setState({result: false});
    },

    select: function(answerId) {
        this.setState({pointer: answerId,tips: 'yet_select'});
    },

    componentDidMount: function() {
        UserCenterHandle.getEvaluateTest(function (result) {
            if (result.code == 200 && this.isMounted()) {
                this.setState({data : result.data, loading: false, index: 0, answer:{} });
            }
        }.bind(this));
    },

    next: function(question_id) {
        var value = $(this.refs.askBox).find('input:checked').val();
        if (!value) return this.setState({
            tips: 'no_select'
        });
        this.state.answer[question_id] = value;
        this.setState({
            index: ++this.state.index,
            tips: 'yet_select',
            answer: this.state.answer,
        });
    },

    prev: function () {
        this.setState({
            index: --this.state.index,
            tips: 'yet_select'
        })
    },

    getInitialState: function() {
        return {data: [], index: null, loading: true, result: false, answer: {}, tips: 'yet_select'};
    },

    render: function () {
        if (this.state.loading) return <Loading style={{marginTop: '50px'}} />;
        if (this.state.result) return <OrderResult product={this.props.product} onChange={this.resEvaluate} />;
        var item = this.state.data[this.state.index];
        return (
            <div className="evaluate">
                <h1>{this.state.index + 1}/{this.state.data.length}.{item.question}</h1>
                <div className="ask" ref="askBox">
                    {
                        item.option.map(function(object, index) {
                            return (
                                <label key={object.option_id}>
                                    <input type="radio"  name={item._id} value={object.option_id} onChange={this.select.bind(this, object.option_id)}  defaultChecked={this.state.answer[item._id] == object.option_id} />
                                    <div>
                                        {object.content}
                                    </div>
                                </label>
                            )
                        }.bind(this))
                    }

                </div>
                <div className={this.state.tips}>请选择答案</div>
                <div className="step clearfix">
                    <div className={this.state.index == 0 ? 'prev disabled' : 'prev'} onClick={this.state.index == 0 ? null : this.prev}>上一题</div>
                    <div className={this.state.index == 9 ? 'next disabled' : 'next active'} onClick={this.state.index == 9 ? null : this.next.bind(this, item._id)}>下一题</div>

                </div>
                {this.state.index == 9 ? <div className="agree_button" onClick={this.submit.bind(this, item._id)}>提交</div> : null}
            </div>
        );
    }
});