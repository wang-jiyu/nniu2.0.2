var MobilePayRadio = require('../../../../../components/listview/MobilePayRadio');
var UserOrderHandle = require('../../../../../handle/usercenter/UserOrder');

module.exports = React.createClass({
    timer: function () {
        setTimeout(function () {
            this.setState({
                error: null
            })
        }.bind(this), 2000);
    },
    onChange: function (e) {
        this.setState({
            consumeNniuMoney: e.target.selectedOptions[0].getAttribute('data-money') / 100
        });
    },
    hasUseNniuMoney: function () {
        if (this.refs.hasUseNniuMoney.checked) {
            this.setState({
                consumeNniuMoney: this.props.source.discounts[0].discountDetails[0].discountMoney / 100
            });
        } else {
            this.setState({
                consumeNniuMoney: 0
            });
        }
    },
    submit: function (e) {
        if (!this.state.checked)
            return this.setState({
                error: '请阅读并确认产品服务协议及风险提示书'
            }, function () {
                clearTimeout(this.timer);
                this.timer();
            }.bind(this));

        if (Config.CACHE_DATA.USER.advisor_type == 2)
            return this.setState({
                error: '投顾不可以购买此产品'
            }, function () {
                clearTimeout(this.timer);
                this.timer();
            }.bind(this));

        if (this.refs.hasUseNniuMoney) {
            if (this.refs.hasUseNniuMoney.checked) {
                var info = [];
                var nniuMoney = {
                    discountType: 1,
                    discountNum: parseInt(this.refs.nniuMoneySelect.value)
                }
                info.push(nniuMoney);
            }
        }

        var param = $.extend(this.props.source, {
            paymethod: parseInt(e.target.data.pay),
            discountDetails: info ? info : null,
            deduction: this.refs.hasUseNniuMoney && this.refs.hasUseNniuMoney.checked ? this.state.consumeNniuMoney : 0

        });
        var step = 2;
        if (JSON.parse(Url.getParam('auth_before')) === 0) {
            step = 4;
        } else {
            if (Config.CACHE_DATA.USER.is_auth) step = 3;
            if (Config.CACHE_DATA.USER.is_auth && Config.CACHE_DATA.USER.risk_score > 0) step = 4;
        }
        this.props.onChange(step, param);
    },

    checked: function (e) {
        this.setState({
            checked: e.currentTarget.checked
        })
    },
    getPayWay: function (status) {
        switch (status) {
            case 0:
                return <li className="localpay clearfix">
                    <div className="left">线下银行转账</div>
                    <MobilePayRadio name="pay" value="0" defaultChecked={true}/>
                </li>;
            case 1:
                return <li className="weixinpay clearfix">
                    <div className="left">微信支付</div>
                    <MobilePayRadio name="pay" value="1" defaultChecked={true}/>
                </li>;
            default:
                return <li className="alipay clearfix">
                    <div className="left">支付宝</div>
                    <MobilePayRadio name="pay" value="2" defaultChecked={true}/>
                </li>;
        }
    },


    read: function (index) {
        Event.trigger('SetUrl', location.pathname + location.search + '&step=' + index);
    },

    refreshModule: function () {
        this.forceUpdate();
    },

    setUrl: function (url) {
        history.pushState(null, null, url);
        this.refreshModule();
    },
    componentWillMount: function () {

    },
    componentDidMount: function () {
        $(window).on('popstate', this.refreshModule);
        Event.on('SetUrl', this.setUrl);
    },

    getInitialState: function () {
        return {
            checked: true,
            way: this.props.paymethod,
            error: null,
            pointer: 0,
            consumeNniuMoney: 0
        };
    },
    render: function () {
        var userPay = Config.CACHE_DATA.USER.risk_score > 0 && Config.CACHE_DATA.USER.is_auth;
        if (!this.props.source) return null;
        var step = Url.getParam('step');
        var notCanPay = Url.getParam('notCanPay');
        return (
            <div>
                <form style={{display: !step ? 'block' : 'none'}} onSubmit={this.submit}>
                    <div className="mobile_pay_main">
                        <div className="mobile_order">
                            <p>请仔细核对订单信息</p>
                            <ul className="order_info_list">
                                <li className="clearfix">
                                    <div className="left">产品名称</div>
                                    <div className="right">{this.props.source.product_name}</div>
                                </li>
                                <li className="clearfix">
                                    <div className="left">服务周期</div>
                                    <div className="right">{this.props.source.cycle}个月</div>

                                </li>
                                <li className="clearfix">
                                    <div className="left">产品价格</div>
                                    <div
                                        className="order_price right"
                                        style={{color: '#FF5A1C'}}>{this.props.source.price ? Utils.formatCoin(this.props.source.price) : '免费'}
                                    </div>
                                </li>
                                <li className="clearfix">
                                    <div className="left">优惠金额</div>
                                    <div
                                        className="order_price right">{Utils.formatCoin(this.props.source.price - this.props.source.discount_price)}元
                                    </div>
                                </li>
                                <li className="clearfix">
                                    <div className="left"><span>牛币</span><br/><i style={{
                                        fontSize: '.34rem',
                                        color: '#999'
                                    }}>{this.props.source.discounts[0] && this.props.source.discounts[0].discountDetails ? '最多可用' + this.props.source.discounts[0].discountDetails[this.props.source.discounts[0].discountDetails.length - 1].discountNum + '个，抵' + this.props.source.discounts[0].discountDetails[this.props.source.discounts[0].discountDetails.length - 1].discountMoney / 100 + '元' : '牛币不足！'}</i>
                                    </div>
                                    <div className="right">
                                        {this.props.source.discounts[0] && this.props.source.discounts[0].discountDetails ?
                                            <input onChange={this.hasUseNniuMoney} ref='hasUseNniuMoney'
                                                   className="nniuMoneySwitch" type="checkbox"/> :
                                            <input onChange={this.hasUseNniuMoney} ref='hasUseNniuMoney'
                                                   className="nniuMoneySwitch" type="checkbox" disabled="disabled"/>}
                                    </div>
                                </li>
                                {
                                    this.state.consumeNniuMoney !== 0 ? <li className="clearfix">
                                        <div className="left">
                                            <span>使用</span>
                                            <span className="selectNniuMoney">
                                                <select ref='nniuMoneySelect' onChange={this.onChange}>
                                                {
                                                    this.props.source.discounts[0] && this.props.source.discounts[0].discountDetails ? this.props.source.discounts[0].discountDetails.map(function (item, i) {
                                                        return <option
                                                            data-money={item.discountMoney}>{item.discountNum}</option>
                                                    }) : null
                                                }
                                                </select>
                                            </span>
                                        </div>
                                        <div className="right" style={{color: '#FF5A1C'}}>
                                            抵{this.state.consumeNniuMoney}元
                                        </div>
                                    </li> : null
                                }
                            </ul>
                        </div>
                        <div className="mobile_order mobile_pay_type">
                            <p>请选择支付方式</p>
                            {
                                !this.props.paymethod && this.props.paymethod != 0 ?
                                    <ul className="order_info_list">
                                        <li className="alipay clearfix">
                                            <div className="left">支付宝</div>
                                            <MobilePayRadio name="pay" value="2" defaultChecked={true}/>
                                        </li>
                                        <li className="weixinpay clearfix">
                                            <div className="left">微信支付</div>
                                            <MobilePayRadio name="pay" value="1"/>
                                        </li>
                                        {!notCanPay ? <li className="localpay clearfix">
                                            <div className="left">线下银行转账</div>
                                            <MobilePayRadio name="pay" value="0"/>
                                        </li> : null}
                                    </ul> :
                                    <ul className="order_info_list">
                                        {this.getPayWay(this.props.paymethod)}
                                    </ul>
                            }

                            <div className="mobile_agreement clearfix">
                                <label className="mobile_checkbox agree_radio">
                                    <input type="checkbox" ref="checkbox" onChange={this.checked} name="agreement"
                                           defaultChecked/>
                                    <i></i>
                                </label>
                                <div className="agreement_text">我已阅读并确认
                                    <a onClick={this.read.bind(this, 1)}>《产品服务协议》</a>
                                    <a onClick={this.read.bind(this, 2)}>《风险提示书》</a>
                                </div>
                            </div>
                        </div>
                        <footer className="mobile_pay_footer">
                            <div className="pay_total_amount"><span
                                style={{color: '#3D3D3D'}}>支付金额:</span>￥{this.props.source.discount_price - this.state.consumeNniuMoney}
                            </div>
                            <input type="submit" className="submit" value="确认支付"/>
                        </footer>
                        <div className={this.state.error ? 'shadow show' : 'shadow'} ref="shadow">
                            {this.state.error}
                        </div>
                    </div>
                </form>
                <div className="agreement" style={{display: step == 2 ? 'block' : 'none'}}>
                    <div className="content risktips">
                        <dl>
                            <dt>风险提示</dt>
                            <dd>尊敬的客户：
                                <div>
                                    您好！为使您更好地了解 海纳智投 提供服务存在的风险，根据法律法规、监管规定、自律规则的有关规定，本公司提供本风险揭示书，请您认真仔细阅读，慎重决定是否接受本产品服务。
                                </div>
                                <div>海纳智投是由北京首证投资顾问有限公司（以下简称“首证投顾”或者称为“本公司”）设计研发。</div>
                                <div>
                                    首证投顾具有中国证券监督管理委员会批准的证券投资咨询业务资格（资格编号：ZX0013），您可通过网址www.sac.net.cn查询本公司是否具备证券投资咨询业务资格，本公司证券投资顾问是否具备证券投资咨询执业资格。
                                </div>
                                <div>请您在接受本公司证券投资顾问服务前，认真阅读以下内容：</div>
                            </dd>
                            <dd>
                                <div>
                                    一、证券投资顾问业务，是证券投资咨询业务的一种基本形式，指证券投资咨询公司接受投资者委托，按照约定，向投资者提供涉及证券及证券相关产品的投资建议服务，辅助投资者作出投资决策，并直接或者间接获取经济利益的经营活动。投资建议服务内容包括投资的品种选择、投资组合以及理财规划建议等。
                                </div>
                                <div>您应充分了解证券投资顾问业务含义，理解在接受证券投资顾问服务后，您应自主作出投资决策，并独立承担投资风险。</div>
                            </dd>
                            <dd>
                                <div>
                                    二、本公司承诺诚信提供专业服务，但不承诺或者保证投资收益，不承诺或者保证您的投资本金或者原始本金不受损失；本公司及其人员也不得与您约定分享投资收益或者分担投资损失。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    三、您在接受证券投资顾问服务前，应向本公司说明自身资产与收入状况、投资经验、投资需求和风险偏好等情况并接受评估，以便于本公司根据您的风险承受能力和服务需求，向您提供适当的证券投资顾问服务。您向本公司提供的前述信息应当真实、准确、完整。如您前述信息发生重要变化的，可能影响本公司对您分类的，应及时告知本公司。您不按照本公司要求提供相关信息或者提供信息不真实、不准确、不完整的，应当依法承担相应法律责任，且本公司将拒绝向其提供服务。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    四、问卷调查、投资知识测试或者模拟交易以及本公司开展的其他投资者适当性工作仅作为本公司评估您投资偏好及风险承受能力的参考或依据。您应当在了解产品或者服务情况，听取本公司适当性意见的基础上，根据自身能力审慎、独立决策，独立承担投资风险。本公司的适当性匹配意见不表明本公司对产品或者服务的风险和收益做出实质性判断或者保证，不代表本公司因此对您的投资风险承担任何责任。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    五、如本公司告知您不适合购买相关产品或者接受相关服务后，您主动要求购买风险等级高于您风险承受能力的产品或者接受相关服务的，本公司在确认您不属于风险承受能力最低类别的投资者后，本公司将向您提供特别风险警示，您在点击阅读并充分理解本公司提供的特别风险警示后仍坚持购买的，本公司可以向您销售相关产品或者提供相关服务。由此，您将独立承担购买前述高风险产品或者接受高风险服务所发生的一切风险。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    六、本公司作为投资建议依据的证券研究报告和投资分析意见等，可能存在不准确、不全面或者被误读的风险，且投资建议中的资料、意见、预测均反映该投资建议初次公开发布时的判断，可能会随时调整，您可以向证券投资顾问了解证券研究报告的发布人和发布时间以及投资分析意见的来源，以便在进行投资决策时作出理性判断。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    七、本公司作为投资建议依据的证券研究报告和投资分析意见等，可能存在不准确、不全面或者被误读的风险，且投资建议中的资料、意见、预测均反映该投资建议初次公开发布时的判断，可能会随时调整，您可以向证券投资顾问了解证券研究报告的发布人和发布时间以及投资分析意见的来源，以便在进行投资决策时作出理性判断。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    八、__海纳智投__虽采用大数据技术研发而成，功能强劲，但仅为辅助您投资决策的软件工具，不能取代您自己的投资分析及投资决策。__海纳智投_提供的投资建议仅供参考，请您根据自己的投资经验及风险承受能力，谨慎入市，谨慎选股。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    九、本公司所有视频、文字资讯均只代表发布机构或者个人本身的研究观点或者对市场信息的解读，所有视频及文字资讯均仅供您参考，您应自主做出投资决策并独立承担风险。对于您根据前述信息作出的投资决策所引发的任何损失，本公司不承担任何赔偿责任。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    十、海纳智投部分功能板块服务是由首证投顾以及其关联公司、关联网站之外的第三方单独提供或者由首证投顾与前述第三方分别提供服务的（具体情况详见相关产品说明）。对于涉及第三方提供服务的部分，可能需要您单独与相关第三方签署相关协议。首证投顾不对第三方提供的服务承担任何责任，请您谨慎选择购买、使用。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    十一、您在接受证券投资顾问服务前，必须了解本公司及其人员提供的证券投资顾问服务不能确保投资者获得盈利或者本金不受损失。本公司及其人员提供的投资建议具有针对性和时效性，不能在任何市场环境下长期有效。
                                </div>
                            </dd>
                            <dd>
                                <div>十二、本公司证券投资顾问存在因离职、离岗等原因导致更换投资顾问服务人员并影响服务连续性的风险。</div>
                            </dd>
                            <dd>
                                <div>
                                    十三、您在接受证券投资顾问服务前，必须了解证券投资咨询机构存在因停业、解散、撤销、破产，或者被中国证券监督管理委员会撤销相关业务许可、责令停业整顿等原因导致不能履行职责的风险。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    十四、您应向本公司提供有效的联系方式和服务获取方式，如有变动须及时向本公司进行说明，如因您自身原因或者不可抗力因素导致您未能及时获取本公司提供的服务的，由此产生的不利后果将由您自行承担。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    十五、您在接受证券投资顾问服务前，必须了解本公司证券投资顾问服务的收费标准和方式，按照公平、合理、自愿的原则，与本公司签订相关证券投资顾问服务协议，接受该协议所约定的收费标准和方式。证券投资顾问服务收费应向协议中所载明的本公司账户支付，不得向证券投资顾问人员或其他个人账户支付。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    十六、您在接受证券投资顾问服务前，必须了解本公司证券投资咨询机构及其人员可能存在道德风险，如您发现投资顾问存在违法违规行为或利益冲突情形，如泄露客户投资决策计划、传播虚假信息、进行关联交易等，您可以向本公司投诉或向有关部门举报。
                                </div>
                            </dd>
                            <dd>
                                <div>十七、您应妥善保管您从本公司获取的登录本公司网络平台产品或者移动端APP的账号及密码，您不得私自接受本公司人员的个人咨询服务，否则，由此引发的风险将由您自行承担。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    十八、您在接受证券投资顾问服务时，应保管好自己的证券账户、资金账户和相应的密码，不要委托本公司及其人员管理您的证券账户、资金账户，代理买卖证券，否则由此导致的风险将由您自行承担。
                                </div>
                            </dd>
                            <dd>
                                <div>十九、建议您不要使用透支资金、借贷资金进入资本市场，不要使用
                                    “必须的基本生活费用”进行证券投资，以避免因投资失败而导致生活品质下降。只有用闲钱进行证券投资，心态才会更平和，收益才会更稳定。
                                </div>
                            </dd>
                            <dd>
                                <div>二十、股市有风险，投资需谨慎。</div>
                            </dd>
                        </dl>
                        <dl className="important_tips">
                            <dt>重要提示：</dt>
                            <dd>
                                <div>
                                    本风险揭示书所列风险仅为列举性质，未能详尽列明您接受本公司服务所面临的全部风险和可能导致您投资损失的所有因素。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    您在接受本公司提供服务前，应认真阅读并理解相关网络平台或者移动端APP用户注册服务协议、公告、声明、规则、公约或者说明、相关服务协议及本风险揭示书、特别风险警示的全部内容。
                                </div>
                            </dd>
                            <dd>
                                <div>您在接受证券投资顾问服务的情况下应当自行承担投资风险，本公司不以任何方式向您作出不受损失或者取得最低收益的承诺。</div>
                            </dd>
                            <dd>
                                <div>您只有在充分知晓并理解上述风险的前提下，方可与本公司签署有关证券投资顾问服务协议。</div>
                            </dd>
                            <dd>
                                <div>特别提示：您勾选“□已认真阅读、全面理解并自愿签署”本风险揭示书，即表明您已经完全理解并自愿承担本公司提供的证券投资顾问服务存在的各种风险与损失。</div>
                            </dd>
                        </dl>
                    </div>
                    <div className="agree_button" onClick={function () {
                        history.back(-1);
                    }}>我已阅读并同意
                    </div>
                </div>
                <div className="agreement" style={{display: step == 1 ? 'block' : 'none'}}>
                    <div className="content product_tips">
                        <dl>
                            <dt><h1>产品服务协议</h1></dt>
                            <dd className="agreement_header">
                                <div><span>甲方：</span>{Config.CACHE_DATA.USER.mobile}</div>
                                <div><span>乙方：</span>北京首证投资顾问有限公司</div>
                                <div><span>地址：</span>北京市丰台区榴乡路88号石榴中心2号楼18层</div>
                                <div><span>业务许可编号：</span>ZX0013</div>
                                <div><span>邮政编码：</span>100070</div>
                                <div><span>联系电话：</span>400-156-6699</div>
                            </dd>
                            <dd>
                                <div>
                                    根据《中华人民共和国证券法》、《中华人民共和国合同法》、《证券、期货投资咨询管理暂行办法》、《证券投资顾问业务暂行规定》等法律法规、规章及监管机构和行政管理部门的规则、准则，甲乙双方本着平等自愿、诚实信用的原则，就甲方委托乙方提供证券投资顾问服务及其相关事宜达成如下协议，以兹共同遵守。
                                </div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>第一条 声明与承诺</dt>
                            <dd>
                                <div>1.1甲方声明与承诺</div>
                            </dd>
                            <dd>
                                <div>
                                    1.1.1甲方承诺其具有相应合法的证券投资资格，甲方承诺其已经认真阅读、全面理解并已点击签署乙方提供的《风险揭示书》，已知晓证券投资风险，已知晓乙方提供的证券投资顾问服务不保证或者承诺收益。甲方承诺认真阅读并全面理解本协议的所有条款。
                                </div>
                            </dd>
                            <dd>
                                <div>1.1.2 甲方保证其向乙方提供的所有证件、资料均合法、真实、有效、完整，并保证如相关资料发生变化，应及时以合理方式通知乙方。</div>
                            </dd>
                            <dd>
                                <div>
                                    1.1.3甲方承诺遵守证券市场有关的法律、法规、规章、规范性文件，以及中国证券业协会、证券交易所和证券登记结算机构等发布的自律规则及乙方发布的用户注册服务协议、公告、声明、相关业务规则、公约或者说明等。
                                </div>
                            </dd>
                            <dd>
                                <div>1.2乙方声明与承诺</div>
                            </dd>
                            <dd>
                                <div>1.2.1乙方承诺其是依法设立的证券投资咨询机构，具备提供证券投资顾问服务的必要条件和专业能力。</div>
                            </dd>
                            <dd>
                                <div>1.2.2乙方声明其所提供的证券投资顾问服务和产品仅供甲方参考，甲方应自主作出投资决策，并独立承担投资风险。</div>
                            </dd>
                            <dd>
                                <div>1.2.3乙方承诺遵守有关法律、法规、规章、规范性文件及中国证券业协会、证券交易所和证券登记结算机构等发布的自律规则。</div>
                            </dd>

                        </dl>
                        <dl>
                            <dt>
                                <div>第二条 服务内容及方式</div>
                            </dt>
                            <dd>
                                <div>
                                    2.1乙方向甲方提供证券投资顾问服务，服务内容和方式为：以海纳智投（包括PC端软件及移动端APP）为服务方式，为客户提供相关证券资讯及投顾服务（具体服务内容详见产品各版本的相关产品说明）。海纳智投部分功能板块服务是由乙方以及其关联公司、关联网站之外的第三方单独提供，或者由乙方与前述第三方分别提供服务的（具体情况详见相关产品说明）。对于涉及第三方提供服务的部分，需要甲方在签署本协议的同时，还应与提供该服务的相关第三方签署配套使用的相关协议。否则，甲方将不能使用该部分功能。首证投顾不对第三方提供的服务承担任何责任，请甲方谨慎选择使用。
                                </div>
                            </dd>
                            <dd>
                                <div>2.2 甲方根据本协议第四条约定向乙方一次性支付全额服务费用后，即可通过PC端软件或者移动端APP享受乙方提供的证券投资顾问服务。</div>
                            </dd>
                            <dd>
                                <div>2.3
                                    乙方可能不定期开展优惠活动，具体优惠内容详见乙方PC端网络平台或者移动APP届时发布的相关活动说明；如甲方符合参与相关优惠活动的条件且甲方按照相关流程确认参与优惠活动的，乙方将按照该活动说明为甲方提供相应的优惠服务。
                                </div>
                            </dd>

                        </dl>
                        <dl>
                            <dt>
                                <div>第三条 服务期限</div>
                            </dt>
                            <dd>
                                <div>
                                    3.1本产品服务期限详见乙方PC端网络平台或者移动端APP相关界面所发布的产品说明，服务期限自甲方向乙方全额支付服务费用的当日开始计算，截止日为结束月份的相应日期；如付款当日为当月最后一日的，则截止日为结束月份的最后一日。
                                </div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <div>第四条 服务费用与税收</div>
                            </dt>
                            <dd>
                                <div>4.1
                                    甲方享用乙方提供的服务，应向乙方支付服务费用。各项服务费用明细详见乙方届时发布的收费说明及收费标准。乙方保留单方面制定并调整PC端网络平台或者移动APP软件工具服务产品的服务费用标准的权利。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    4.2甲方在享用乙方提供的服务时，可能需要向第三方（如银行、第三方支付机构以及其他第三方服务主体等）支付一定的第三方服务费用，具体收费标准详见第三方网站相关页面，或者乙方届时发布提示及收费标准。甲方同意根据上述收费标准自行或者委托乙方或者乙方指定的第三方代为向该第三方支付服务费用。甲方与该第三方因费用支付等事项发生的争议或者纠纷，由甲方与该第三方自行处理。
                                </div>
                            </dd>
                            <dd>
                                <div>4.3 乙方收取服务费用的专用账户信息如下：
                                    账户名称：北京首证投资顾问有限公司
                                    开户行：工行北京首都体育馆支行
                                    银行账号：0200 0537 1920 0138 464
                                </div>
                            </dd>
                            <dd>
                                <div>4.4
                                    甲方应点击乙方提供的支付链接方式或者以其他合法安全方式向乙方专用账户付款，甲方应增强自我防范电信诈骗意识，不得随意登录不明链接方式或者不明网页付款，乙方唯一的网址为www.0606.com.cn，甲方务必谨记和识别。如甲方不慎付款错误或者被电信诈骗，甲方应立即报警并自行处理所有事宜，乙方不承担任何责任。
                                </div>
                            </dd>
                            <dd>
                                <div>4.5甲乙双方按照国家税收法律法规的规定各自缴纳应纳税款。</div>
                            </dd>

                        </dl>
                        <dl>
                            <dt>
                                <div>第五条 甲方权利与义务</div>
                            </dt>

                            <dd>
                                <div>5.1 甲方有权按照本协议约定享受乙方提供的证券投资顾问服务。</div>
                            </dd>
                            <dd>
                                <div>
                                    5.2甲方应事先了解乙方的证券投资顾问服务收费标准和方式以及服务期限，并根据本协议约定一次性足额向乙方支付服务费用。证券投资顾问服务费用应向乙方公司专用账户支付，不得向证券投资顾问人员或者其他任何个人账户支付。甲方应了解乙方的任何工作人员均无权以任何理由擅自变更公司收款账户和收款方式，甲方不得向乙方任何工作人员以任何形式支付服务费用。乙方唯一收款账户为本协议4.3条所列账户，除此之外无任何收款账户。
                                </div>
                            </dd>
                            <dd>
                                <div>5.3甲方应填写乙方提供的客户调查问卷，配合乙方开展其他投资者适当性工作，如投资知识测试或者模拟交易等，接受乙方的风险承受能力评估，并向乙方客观真实说明如下信息：
                                </div>
                            </dd>
                            <dd>
                                <div>5.3.1姓名、住址、职业、年龄、联系方式，法人或者其他组织的名称、注册地址、办公地址、性质、资质及经营范围等基本信息；</div>
                            </dd>
                            <dd>
                                <div>5.3.2收入来源和数额、资产、债务等财务状况；</div>
                            </dd>
                            <dd>
                                <div>5.3.3投资相关的学习、工作经历及投资经验；</div>
                            </dd>
                            <dd>
                                <div>5.3.4投资期限、品种、期望收益等投资目标；</div>
                            </dd>
                            <dd>
                                <div>5.3.5风险偏好及可承受的损失；</div>
                            </dd>
                            <dd>
                                <div>5.3.6诚信记录；</div>
                            </dd>
                            <dd>
                                <div>5.3.7实际控制甲方的自然人和交易的实际受益人；</div>
                            </dd>
                            <dd>
                                <div>5.3.8法律法规、自律规则规定的投资者准入要求相关信息；</div>
                            </dd>
                            <dd>
                                <div>5.3.9其他乙方为开展投资者适当性工作之必要信息。</div>
                            </dd>
                            <dd>
                                <div>
                                    乙方将根据投资者的风险承受能力和服务需求，向甲方提供适当的证券投资顾问服务。问卷调查、投资知识测试或者模拟交易以及乙方开展的其他投资者适当性工作仅作为乙方评估甲方投资偏好及风险承受能力的参考或依据。甲方应当在了解产品或者服务情况，听取乙方适当性意见的基础上，根据自身能力审慎、独立判断或者决策，自行决定证券投资，并自行承担投资损益。乙方的适当性匹配意见不表明其对产品或者服务的风险和收益做出实质性判断或者保证，不代表乙方因此对甲方的投资风险承担任何责任。
                                </div>
                            </dd>

                            <dd>
                                <div>
                                    5.4甲方应配合乙方依法开展投资者适当性工作并按照乙方要求提供相关证明材料。如甲方被评估为专业投资者的或者甲方申请由普通投资者转为专业投资者的，应当按照乙方要求提供资质证件、登记备案证明、收入状况证明、持有相关金融资产证明以及工作经历证明等。如甲方不能配合乙方开展相关投资者适当性工作，提供相关证明资料，接受乙方依法录音录像或者其他留痕措施，则乙方有权拒绝为甲方提供本协议项下之服务。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    5.5甲方向乙方提供5.3、5.4约定之信息应当真实、准确、完整。前述信息发生重要变化的，可能影响乙方对其分类的，甲方应及时告知乙方。甲方不按照乙方要求提供相关信息或者提供信息不真实、不准确、不完整的，应当依法承担相应法律责任，且乙方将拒绝向其提供服务。
                                </div>
                            </dd>
                            <dd>
                                <div>如甲方因自身原因或者不可抗力因素导致甲方未能及时获取乙方提供的证券投资顾问服务的，由甲方自行承担不利后果。</div>
                            </dd>
                            <dd>
                                <div>5.6乙方对甲方进行客户回访，甲方应积极配合甲方工作，客观、真实地回答乙方回访人员的提问。</div>
                            </dd>
                            <dd>
                                <div>5.7自甲方签订本协议之日起5个工作日内，甲方可以书面通知方式提出解除本协议。甲方在此期间如出现投资损失，与乙方无关，不得据此要求乙方承担任何赔偿、补偿责任。
                                </div>
                            </dd>
                            <dd>
                                <div>5.8甲方不得与乙方及其人员约定证券投资收益共享、损失分担的约定，也不得向乙方工作人员提供任何以甲方盈利为条件的经济奖励。</div>
                            </dd>
                            <dd>
                                <div>5.9甲方不得委托乙方证券投资顾问人员或者乙方其他人员管理自己的证券账户和资金账户、代理买卖证券等操作，否则由此导致的风险和损失将由甲方自行承担。</div>
                            </dd>
                            <dd>
                                <div>
                                    5.10如甲方发现或应当发现乙方人员存在违法违规行为或者利益冲突情形，如泄露客户投资决策计划、传播虚假信息、私下提供服务、私下收取服务费用等，甲方有义务向乙方投诉，投诉电话为010-53806052，乙方将严厉查处并纠正工作人员的违规个人行为。如甲方接受此类员工个人行为，所造成的后果由甲方自行承担，与乙方无关。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    5.11对于乙方提供的证券投资顾问服务，应仅限于甲方进行证券投资参考使用；甲方不得以任何目的以任何方式向任何第三方传播，包括但不限于将乙方产品发布的或者提供服务中所含有的数据、信息向任何第三人以转接（包括提供互联网之链接）、再发放、复制、出售、出租或者出借方式提供；甲方不得将前述数据、信息加以更改、增添、扩充、删减、毁损或者实施其它一切之变更；甲方不得将前述数据、信息另行取样并编制指数、其它衍生性产品；甲方不得将前述数据、信息用于任何非法目的，或者提供给第三方用于任何非法目的；甲方不得以任何形式侵犯乙方以及第三方的知识产权。
                                </div>
                            </dd>
                            <dd>
                                <div>5.12甲方不得将服务软件的账号密码借用给他人使用，如乙方发现前述情形（如账号登陆IP地址异常等），乙方将有权暂停甲方账号使用。</div>
                            </dd>
                            <dd>
                                <div>5.13甲方应保管好自己的登录账户及密码，任何使用甲方账户及密码进行的操作，均视为基于甲方真实意愿作出的本人行为。</div>
                            </dd>
                            <dd>
                                <div>
                                    5.14甲方应遵守证券市场有关的法律、法规、规章、规范性文件，以及中国证券业协会、证券交易所和证券登记结算机构等发布的自律规则及乙方发布的用户注册服务协议、公告、声明、相关业务规则、公约或者说明等。特别是甲方在使用乙方海纳智投部分功能板块时，与直播人员互动交流时，甲方应当遵守用户注册服务协议以及文明直播公约的相关要求。否则，乙方有权不经事先通知而立即停止提供相关服务，且不承担任何违约责任。
                                </div>
                            </dd>

                        </dl>
                        <dl>
                            <dt>
                                <div>第六条 乙方权利与义务</div>
                            </dt>
                            <dd>
                                <div>6.1 乙方应本着勤勉尽责、诚实守信的原则，为甲方提供专业、有偿服务。</div>
                            </dd>
                            <dd>
                                <div>6.2 乙方有权根据本协议约定收取服务费用。</div>
                            </dd>
                            <dd>
                                <div>6.3 乙方向甲方提供的服务内容仅供甲方参考，甲方应对乙方提供的服务内容做出独立的投资判断并独立承担投资风险，乙方不对甲方的投资损失承担任何责任。</div>
                            </dd>
                            <dd>
                                <div>6.4 乙方不得代理甲方直接从事证券投资，不得与甲方约定分享甲方证券投资的收益或者分担损失。</div>
                            </dd>
                            <dd>
                                <div>6.5 乙方保证其所提供的服务内容应符合国家相关法律法规要求，有相关根据并经合理论证，无虚假、不实和误导性的陈述。</div>
                            </dd>
                            <dd>
                                <div>6.6
                                    乙方依法保护因服务关系而知悉的有关甲方的财产状况信息及其他个人隐私，未经甲方许可，不得公开或者进行商业使用，但以更好的为甲方提供服务为目的而透露给乙方合作机构合理使用的除外。
                                </div>
                            </dd>
                            <dd>
                                <div>6.7
                                    在本协议有效期限内，甲方有权调整服务的具体形式和内容，有权更新本协议内容；乙方为保证服务的质量，可以对服务过程录音或者录像，但未经甲方许可，乙方不得公开或者进行商业使用，但以更好的为甲方提供服务为目的而透露给乙方合作机构合理使用的除外。
                                </div>
                            </dd>
                            <dd>
                                <div>6.8乙方及其人员不得利用证券投资顾问服务实施操纵市场、内幕交易以及其他任何证券欺诈行为；乙方及其人员不得为自己买卖股票及具有股票性质、功能的证券以及期货。
                                </div>
                            </dd>

                        </dl>
                        <dl>
                            <dt>
                                <div>第七条 特别约定</div>
                            </dt>
                            <dd>
                                <div>7.1
                                    甲乙双方确认，未经乙方书面授权，任何人员均无权代表乙方向甲方收取任何现金款项或者私自向甲方提供服务；在无乙方书面授权的情况下，如甲方向任何人员支付任何款项，或者甲方因依据该等人员提供的服务而遭受的一切损失，由甲方自行承担，乙方对此不承担任何责任。
                                </div>
                            </dd>
                            <dd>
                                <div>7.2
                                    乙方禁止乙方任何人员以乙方名义、个人名义或者以其他方式向甲方承诺或者保证投资收益；如甲方发现乙方任何人员就乙方提供相关服务承诺或者保证投资收益的，此承诺或者保证不代表乙方观点或者行为，甲方应当拨打乙方投诉电话（010-58306052）进行举报。甲方因相信前述承诺或者保证而签订本协议的，由此产生的任何后果，由甲方自行承担。
                                </div>
                            </dd>
                            <dd>
                                <div>7.3
                                    为保障甲方的合法权利，防止乙方人员不合规行为侵犯甲方权利，甲方应通过乙方官方网站公布的有效联系方式如座机号码、企业QQ、短信平台、电子邮箱等与乙方进行交流，以便于乙方通过服务留痕方式对乙方人员服务行为的合规性进行监督检查。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    7.4在本协议有效期限内，乙方将根据服务形式和内容进行更新升级，与此同时可能会更新本协议内容；如乙方更新本协议内容，乙方将以公告、声明、规则、公约或者说明形式在PC端网络平台或者移动端APP进行公示，同时乙方将以醒目方式提示甲方进行协议转签。甲方在此承诺并保证同意协议转签；乙方在此承诺并保证乙方将不会因协议转签而降低服务标准、服务质量以及服务品质。
                                </div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <div>第八条 乙方证券投资顾问服务职责及禁止行为</div>
                            </dt>
                            <dd>
                                <div>第八条 乙方证券投资顾问服务职责及禁止行为</div>
                            </dd>
                            <dd>
                                <div>8.1.1乙方应遵循诚实信用原则，勤勉、审慎地为甲方提供证券投资顾问服务。</div>
                            </dd>
                            <dd>
                                <div>8.1.2乙方依据乙方或者其他证券公司、证券投资咨询机构的证券研究报告作出投资建议的，应当按照甲方要求提供证券研究报告的发布人、发布日期。</div>
                            </dd>
                            <dd>
                                <div>8.1.3乙方应根据甲方填写的《风险能力评估表》了解甲方投资偏好及风险承受能力，并根据协议约定及时向甲方提供适当的投资策略、建议、预测、分析或者理财规划建议。
                                </div>
                            </dd>
                            <dd>
                                <div>8.2证券投资顾问服务的禁止行为</div>
                            </dd>
                            <dd>
                                <div>8.2.1乙方不得为乙方及其关联方的利益损害甲方利益；不得为自己或者与自己利益相关者的利益损害甲方利益；不得为其他特定客户利益损害甲方利益。</div>
                            </dd>
                            <dd>
                                <div>8.2.2乙方应当提示甲方潜在的投资风险，不得以任何方式向甲方承诺或者保证投资收益，不得与甲方约定投资收益或者分担投资损失。</div>
                            </dd>
                            <dd>
                                <div>8.2.3乙方不得代甲方作出投资决策，不得代理甲方办理证券账户及资金账户的开立、注销与转委托，不得代理甲方办理证券认购、交易或者资金存取、划转、查询等事宜。
                                </div>
                            </dd>
                            <dd>
                                <div>8.2.4乙方不得利用虚假、不实、误导性的信息、内幕信息以及市场传言为甲方提供证券投资顾问服务。</div>
                            </dd>
                            <dd>
                                <div>8.2.5如乙方向甲方提供投资建议时知悉甲方作出具体投资决策的，乙方不得向他人泄露。</div>
                            </dd>
                            <dd>
                                <div>8.2.6乙方不得通过广播、电视、网络、报刊等公众媒体，作出买入、卖出或者持有具体证券的投资建议。</div>
                            </dd>
                            <dd>
                                <div>8.2.7乙方及其人员不得以个人名义向甲方收取证券投资顾问服务费用。</div>
                            </dd>
                            <dd>
                                <div>8.2.8乙方不得实施损害甲方合法权益、扰乱证券市场秩序或者违背法律法规、规则及准则其他行为。</div>
                            </dd>
                            <dd>
                                <div>8.2.9乙方不得向不符合法律法规及政策规定的投资者准入要求的甲方提供服务。</div>
                            </dd>
                            <dd>
                                <div>8.2.10乙方不得向甲方就不确定事项提供确定性的判断，或者告知甲方有可能使其误认为具有确定性的意见。</div>
                            </dd>
                            <dd>
                                <div>8.2.11乙方不得向归类为普通投资者的甲方主动推介风险等级高于其风险承受能力的产品或者服务。</div>
                            </dd>
                            <dd>
                                <div>8.2.12乙方不得向归类为普通投资者的甲方主动推介不符合其投资目标的产品或者服务。</div>
                            </dd>
                            <dd>
                                <div>8.2.13乙方不得向风险承受能力最低类别的甲方销售或者提供风险等级高于其风险承受能力的产品或者服务。</div>
                            </dd>
                            <dd>
                                <div>8.2.14乙方不得实施其他违背适当性要求，损害甲方合法权益的行为。</div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <div>第九条 不可抗力</div>
                            </dt>
                            <dd>
                                <div>
                                    9.1因不可抗力原因而导致乙方无法正常向甲方提供服务的，乙方不承担责任；但乙方应尽快将发生不可抗力的事故情况以PC端网络平台或者移动端APP公告、声明或者其他合理方式通知甲方。
                                </div>
                            </dd>
                            <dd>
                                <div>
                                    9.2本条所称不可抗力是指因甲乙双方不能预见、不能避免、不能克服的客观情况而给协议一方或者协议双方造成损失的各种情形。包括但不限于因洪水、火灾、地震及其它自然灾害、战争、骚乱、突发性公共卫生事件、政府征用或者没收、监管部门监管政策变化、突发停电或其他突发事件、平台管理系统、PC端或者移动端运行系统出现重大故障、停止运作或瘫痪、银行系统非正常暂停或者停止交易等。
                                </div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <div>第十条 违约责任</div>
                            </dt>
                            <dd>
                                <div>10.1甲乙双方应本着诚实信用原则，自觉履行本协议。如因一方不履行本协议约定的任何义务，均构成该方的违约行为，因此给对方造成的损失，违约方应承担相应赔偿责任。
                                </div>
                            </dd>
                            <dd>
                                <div>10.2
                                    如甲方违反本协议相关约定，特别是违反本协议约定第1.1条、第五条、第七条约定的，乙方有权不经事先通知而立即限制或者停止甲方使用产品部分或者全部功能，有权立即解除与甲方签订的所有协议，且乙方前述行为不构成任何违约行为，乙方无须承担任何违约责任。届时，乙方将按照乙方已为甲方提供服务的期限与产品完整服务期限的比例扣除相应服务费用后，将甲方剩余的服务费用返还给甲方。
                                </div>
                            </dd>
                            <dd>
                                <div>10.3
                                    如甲方严重违反本协议相关约定，包括但不限于与乙方人员私下约定分享收益、分担损失，私下向乙方人员支付款项、提供奖励，要求乙方人员违反相关法律、规则等推荐个股，或者以投诉、举报、向媒体曝光、在网络社区或者论坛发布毁损乙方商誉的言论为要挟强迫乙方或者乙方人员违规承诺保本保收益的或者实施其他违法违规行为的，则乙方有权不经事先通知而立即停止甲方使用产品部分或者全部功能，有权立即解除与甲方签订的所有协议，且乙方前述行为不构成任何违约行为，乙方无须承担任何违约责任。届时，乙方将按照乙方已为甲方提供服务的期限与产品完整服务期限的比例扣除相应服务费用后，将甲方剩余的服务费用返还给甲方。此外，乙方有权将甲方列入“服务黑名单”，乙方将拒绝为例如“服务黑名单”的主体提供服务，且乙方有权将“服务黑名单”分享给同行业内其他机构以及乙方的其他合作机构。甲方由此遭受的损失将自行承担，与乙方无关。
                                </div>
                            </dd>
                            <dd>
                                <div>10.4
                                    如本协议因服务期限已届满或者因其他原因已经被解除、终止后，甲方又以种种理由要求或者以投诉、举报、向媒体曝光、在网络社区或者论坛发布毁损乙方商誉的言论为要挟强迫乙方退还相关服务费用的。乙方有权将甲方列入“服务黑名单”，乙方将拒绝为列入“服务黑名单”的主体提供服务，且乙方有权将“服务黑名单”分享给同行业内其他机构以及乙方的其他合作机构。甲方由此遭受的损失将自行承担，与乙方无关。
                                </div>
                            </dd>
                            <dd>
                                <div>10.5
                                    如甲方存在上述10.3、10.4约定的损害乙方商誉的行为，甲方将保留采取一切法律措施（包括但不限于报警、起诉等）追究甲方法律责任（包括但不限于刑事责任、民事赔偿责任等）的权利。
                                </div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <div>第十一条 法律适用与争议的解决</div>
                            </dt>
                            <dd>
                                <div>11.1本协议的订立、解释及争议的解决均适用中华人民共和国法律(为本协议之目的，不包括我国香港特别行政区、澳门特别行政区及我国台湾地区的法律法规)。</div>
                            </dd>
                            <dd>
                                <div>
                                    11.2因执行本协议所发生的或者与本协议有关的一切争议，甲乙双方应本着善意通过友好协商解决。协商不成的，应向北京市仲裁委员会提起仲裁。按照申请仲裁时该会现行有效的仲裁规则进行仲裁。仲裁裁决是终局的，对甲乙双方均有约束力。
                                </div>
                            </dd>
                            <dd>
                                <div>11.3
                                    在争议处理过程中，除正在审理的部分外，本协议其他部分将继续执行，任何一方不得因发生争议故意损害或者恶意诋毁另一方，不得威逼、利诱、恐吓对方，不得干扰、破坏对方的工作、经营、学习和生活，否则另一方有权追究其侵权责任。
                                </div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <div>第十二条 协议的生效与变更</div>
                            </dt>
                            <dd>
                                <div>
                                    12.1甲方按照PC端网络平台或者移动端APP规则、流程勾选“□已阅读理解并以真实意愿表示签署本协议”，且已向乙方一次性全额支付服务费用的，则本协议立即成立并生效。本协议自生效日起对甲乙双方具有同等的法律约束力。
                                </div>
                            </dd>
                            <dd>
                                <div>12.2本协议的修改或者补充，由乙方通过网络平台或者移动端APP以电子文本形式发布。一经发布，立即生效。</div>
                            </dd>
                            <dd>
                                <div>12.3本协议中的部分条款的无效或者无法履行，不影响本协议其他条款的效力。</div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <div>第十三条 协议的解除</div>
                            </dt>
                            <dd>
                                <div>13.1本协议生效后五个工作日内，甲方可通过书面通知形式无条件解除本协议，书面通知自到达乙方时生效，届时本协议将自动终止。乙方将退回甲方服务费用并终止提供服务。
                                </div>
                            </dd>
                            <dd>
                                <div>13.2
                                    除13.1约定情形外，未经乙方书面确认同意，甲方无权单方解除合同；如乙方同意解除合同，则乙方有权扣取甲方服务费用总额20%的违约金。在能够满足扣取20%违约金的前提下，乙方将扣除乙方已向甲方提供服务对应的服务费用（按照已提供服务期限占本协议约定服务期限比例等规则计算），将余款返还甲方，如余款已不足以扣取违约金的，则不再退还余款。
                                </div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <div>第十四条 通知和送达</div>
                            </dt>
                            <dd>
                                <div>14.1
                                    乙方以短信、电子邮件、PC端网络平台或者移动端APP公告、声明等方式进行通知和送达，联系方式以甲方在PC端网络平台或者移动端APP注册时填写内容为准。通知在下列日期视为送达甲方：
                                </div>
                            </dd>
                            <dd>
                                <div>14.1.1以短信方式通知的，乙方发送短信之日视为送达日；</div>
                            </dd>
                            <dd>
                                <div>14.1.2 以电子邮件方式通知的，乙方发送电子邮件之日视为送达日；</div>
                            </dd>
                            <dd>
                                <div>14.1.3以PC端网络平台或者移动端APP公告、声明方式通知的，乙方在PC端网络平台或者移动端APP发布公告、声明之日视为送达日。</div>
                            </dd>
                            <dd>
                                <div>14.2
                                    如甲方联系方式发生变更，甲方应尽快更新PC端网络平台或者移动端APP个人信息或者致电乙方客服进行修改。如因甲方未及时更新信息而造成的损失，由甲方自行承担责任。
                                </div>
                            </dd>
                        </dl>
                        <dl>
                            <dt>
                                <div>第十五条 附则</div>
                            </dt>
                            <dd>
                                <div>15.1 本协议以电子文本形式制成，不提供纸质协议。本协议保存在乙方PC端网络平台或者移动端APP指定位置，甲方认可该形式的协议效力及本协议内容。</div>
                            </dd>
                            <dd>
                                <div>15.2乙方将按照法律法规、规则及准则的要求保管本协议以及与提供约定服务有关的其他信息、资料。</div>
                            </dd>
                            <dd>
                                <div>15.3本协议签署地点为中国北京市丰台区。</div>
                            </dd>
                            <dd className="important_dd">
                                <div>甲方承诺：本人已阅读本协议所有条款，充分理解并知晓相应权利义务，愿意承担相关风险。[以下无正文]</div>
                            </dd>
                        </dl>
                    </div>

                    <div className="agree_button" onClick={function () {
                        history.back(-1);
                    }}>我已阅读并同意
                    </div>
                </div>
            </div>
        );
    }
});