var UserCenterHandle = require('../../../../../handle/usercenter/UserCenter');
var UserOrderHandle = require('../../../../../handle/usercenter/UserOrder');

module.exports = React.createClass({

    isAllowAge: function(age) {
        var age = age.trim();
        age = age.substring(6,10) + '-' + age.substring(10, 12) + '-' + age.substring(12,14);
        age = new Date(age).getTime();
        var min = new Date();
        min.setYear(min.getFullYear() - 70);
        var max = new Date();
        max.setYear(max.getFullYear() - 18);
        max = max.getTime();
        if (age > min && age < max) return true;
        return false;
    },

    submit: function(e) {
        if (!$(this.refs.checkbox).find('input:checked').val())
            return this.setState({error: '请阅读并确认《身份信息核验授权书》'});

        if (!$(this.refs.name).val())
            return this.setState({error: '请输入您的姓名'});

        if (!$(this.refs.cardno).val())
            return this.setState({error: '请输入您的身份证号码'});

        if(!Utils.checkRegexp(this.refs.cardno.value, 'idcard')) {
            return this.setState({error: '身份证格式错误'});
        }

        if(!this.isAllowAge(this.refs.cardno.value)) {
            return this.setState({error: '您的年龄不符合认证要求'});
        }

        this.setState({error: null});

        var params = {name: $(this.refs.name).val(), cardno: $(this.refs.cardno).val()};

        UserCenterHandle.authId(params, function(result) {
            if (result.code == 200) {
                var step = 3;
                if (Config.CACHE_DATA.USER.risk_score > 0) step = 4;
                this.props.onChange(step);
            }
            return this.setState({error: Utils.getPromptInfo(result.code)});
        }.bind(this));
    },
    componentDidMount: function() {
        //Utils.setPosition(this.refs.title, -1);
        this.refs.name.focus();
    },

    change: function(index) {
        Event.trigger('SetUrl', location.pathname + location.search + '&step=' + index);
    },

    refreshModule: function() {
        this.forceUpdate();
    },

    setUrl: function(url) {
        history.pushState(null, null, url);
        this.refreshModule();
    },

    componentDidMount: function() {
        $(window).on('popstate', this.refreshModule);
        Event.on('SetUrl', this.setUrl);
    },

    getInitialState: function() {
        return {error: null};
    },

    render: function() {
        var userPay = Config.CACHE_DATA.USER.risk_score > 0;
        var step = Url.getParam('step');
        return (
            <div className="authentication">
                <div style={{display: !step ? 'block' : 'none'}}>
                    <div className="content">
                        <p>应监管部门要求和对您合法权益的保障，请在购买产品前进行实名认证和风险测评。</p>
                        <p>如有问题请致电客服热线：<a href="tel:400-156-6699">400-156-6699</a></p>
                    </div>
                    <div className="authentication_input">
                        <input type="text" ref="name" name="name" placeholder="请输入您的姓名" />
                        <input type="text" ref="cardno" name="cardno" placeholder="请输入您的身份证号码"  />
                    </div>
                    <div className="mobile_agreement clearfix">
                        <label ref="checkbox" className="mobile_checkbox agree_radio">
                            <input  type="checkbox" name="agreement" value="true" />
                            <i></i>
                        </label>
                        <div className="agreement_text">我已阅读并确认
                            <a onClick={this.change.bind(this, 1)}>《身份信息核验授权书》</a>
                        </div>
                    </div>
                    <div className="tips">
                        <div className={this.state.error ? 'error' : 'noerror'}>{this.state.error}</div>
                        <div className="agree_button" onClick={this.submit}>我已阅读并同意</div>
                    </div>
                </div>
                <div style={{display: step ? 'block' : 'none'}}>
                    <div className="content risktips">
                        <dl>
                            <dt>身份信息核验授权书</dt>
                            <dd>
                                北京首证投资顾问有限公司：
                                <div>
                                    为保障金融投资环境健康，本人保证提供的身份信息为本人真实信息，承诺不盗用他人身份信息进行登记核验，并承诺遵守相关部门颁发的投资管理条例，不参与任何扰乱金融市场秩序的活动。
                                    本人同意并不撤销授权北京首证投资顾问有限公司及其提供身份验证的第三方服务公司对本人的身份信息进行核验并留存相关身份信息。
                                    本人在此声明充分理解上述授权含义，知晓并自愿承担由此带来的可能发现的任何影响。
                                    本授权一经确认立即生效。
                                </div>
                            </dd>
                        </dl>
                    </div>
                    <div className="agree_button" onClick={function() {history.back(-1);}}>我已阅读并同意</div>
                </div>
            </div>
        )
    }
});