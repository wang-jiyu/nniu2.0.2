var UserOrderHandle = require('../../../../handle/usercenter/UserOrder');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');
module.exports = React.createClass({
    submit: function() {
		var uri = '/tool.html?tool=order&id=' + this.state.source._id + '&type=' + this.props.type;
		Interface.popWin('订单', uri, {width: 746, maxHeight: 790, top: 30, bottom: 30, align: 'center', valign: 0.4});
    },
    category: function(id) {
        var item = ArrayCollection.getItem.call(Config.CACHE_DATA.JEWEL_CATEGORY, id, '_id');
        if (!item) return {name: '实战组合', color: '#f2bf81'};
        return {name: item.category_name, color: item.color};
    },

    getState: function(type) {
        switch(type) {
            case 1: return {text: '预售中', color: '#FF423D'};
            case 2: return {text: '运行中', color: '#FF6600'};
            case 3: return {text: '已停售', color: '#F59D00'};
            case 4: return {text: '已结束', color: '#888888'};
            default: return null;
        }
    },

    getInputText: function(type) {
        if (Config.CACHE_DATA.USER.advisor_type == 2) return null;
        switch(type) {
            case 1: return {text: '立即订购', disabled: false};
            case 2: return {text: '立即订购', disabled: false};
            case 3: return {text: '已停售', disabled: true};
            case 4: return {text: '已结束', disabled: true};
            default: return null;
        }
    },


    getStop: function() {
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        now = now.valueOf();
        if (this.state.source.state_v2 == 1) {
            var start = new Date(this.props.source.begin_time * 1000);
            start.setHours(23, 59, 59, 0);
            start = start.valueOf();
            start  = Math.floor((start - now) / 3600 / 24 / 1000);
            if (start < 0) return null;
            return  <span style={{marginLeft: '10px'}}>距离开始还有<span style={{color: 'red'}}>{start}</span>天（{Utils.formatDate(this.props.source.begin_time, 'YYYY-MM-DD')}）</span>;
        }

        if (this.state.source.state_v2 == 2) {
            var stop = new Date(this.props.source.stopsell_time * 1000);
            stop.setHours(23, 59, 59, 0);
            stop = stop.valueOf();
            stop  = Math.floor((stop - now) / 3600 / 24 / 1000);
            if (stop < 0) return null;
            return  <span style={{marginLeft: '10px'}}>距离停售还有<span style={{color: 'red'}}>{stop}</span>天（{Utils.formatDate(this.props.source.stopsell_time, 'YYYY-MM-DD')}）</span>;
        }

        return  null;

    },

    getArea: function(cycle) {
        if (this.state.source.state_v2 == 1)
            return <td>{Utils.formatDate(this.state.source.begin_time, 'YYYY-MM-DD')} 至 {Utils.getNeighborDate(cycle - 1, this.state.source.begin_time)}  共<span style={{color: 'red'}}>{this.state.source.service_period}</span>天</td>;
        if (this.state.source.state_v2 == 2)
            return <td>{Utils.getNeighborDate(1, new Date())} 至 {Utils.getNeighborDate(cycle, new Date())}  共<span style={{color: 'red'}}>{this.state.source.service_period}</span>天</td>;
        return <td>共<span style={{color: 'red'}}>{this.state.source.service_period}</span>天</td>;
    },

    getList: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load} code={this.state.code} />;
        var level = '激进型';
        switch(this.state.source.risk_level) {
            case 1:
                level = '厌恶风险型';
                break;
            case 2:
                level = '保守型';
                break;
            case 3:
                level = '稳健型';
                break;
            case 4:
                level = '激进型';
                break;
        }
        var category = this.category(this.state.source.category_id);
        var cycle = this.state.source.service_period && parseInt(this.state.source.service_period);

        var title = this.getInputText(this.state.source.state_v2) && '抱歉，该产品' + this.getInputText(this.state.source.state_v2).text + '，无法进行购买';
        if (Config.CACHE_DATA.USER.advisor_type == 2) title = '抱歉，投顾不能购买产品';
        return (<div className="tips_detail_intro">
                        <div className="intro">
                            <div className={this.props.type == 1 ? 'icon_text' : 'icon_text blue'}>
                                <i></i>
                                <label>{this.props.type == 1 ? '锦囊' : '内参'}</label>
                            </div>
                            <div className="text">
                                <div>
                                    <h4><label>{this.state.source.title} {this.getState(this.state.source.state_v2) ? <span style={{color: this.getState(this.state.source.state_v2).color}}>{this.getState(this.state.source.state_v2).text}</span> : null }</label></h4>
                                    <span className="state_button" style={{background: category.color}}>{category.name}</span>
                                    <p>{this.state.source.description}</p>
                                </div>
                                <div>
                                    <h4>{this.props.type == 1 ? '锦囊特点' : '内参特点'}</h4>
                                    <p>{this.state.source.specialty}</p>
                                </div>
                                <div>
                                    <h4>服务周期</h4>
                                    <p>服务期限：{this.props.source.service_period}天    {this.getStop()}</p>
                                </div>
                                <div>
                                    <h4>适用人群</h4>
                                    <p>{this.state.source.apply_to}</p>
                                </div>
                                <div>
                                    <h4>风险提示</h4>
                                    <p>{this.state.source.risk_tip}</p>
                                </div>
                            </div>
                        </div>
                        <div className="detail">
                            <div className="sell_box">
                                <div className="sell_content">
                                    <i className="sell_icon"></i>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="filed">风险等级：</td>
                                            <td>{level}</td>
                                        </tr>
                                        <tr>
                                            <td className="filed">优惠信息：</td>
                                            <td>
                                                <div className="sale_info">
                                                    <div className="sale_info_left">
                                                        <i></i>
                                                        <span>{this.state.product.counpon}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        {this.state.product.price == this.state.product.discount_price ? null :
                                            <tr>
                                                <td className="filed">价格：</td>
                                                <td>
                                                    <span style={{textDecoration: 'line-through'}}>{'￥' + Utils.formatCoin(this.state.product.price)}</span>
                                                    <span>(为您节省： {'￥' + Utils.formatCoin(this.state.product.price - this.state.product.discount_price)})</span>
                                                </td>
                                            </tr>}
                                        <tr>
                                            <td className="filed">服务期限：</td>
                                            {this.getArea(cycle)}
                                        </tr>
                                        {
                                            this.state.source.is_pay == 1 ?
                                                1 : null
                                        }
                                        <tr>
                                            <td className="filed">订购价格：</td>
                                            <td>￥<span style={{color: '#ec407a', fontSize: '20px'}}>{this.state.product.discount_price ? Utils.formatCoin(this.state.product.discount_price) : '0.00'}</span></td>
                                        </tr>
                                        <tr>
                                            <td className="filed"></td>
                                            <td>
                                                {this.getInputText(this.state.source.state_v2) ? <input type="button" value={this.getInputText(this.state.source.state_v2).text} onClick={this.submit} disabled={this.getInputText(this.state.source.state_v2).disabled} /> : null}
                                                {Config.CACHE_DATA.USER.advisor_type == 2 || this.getInputText(this.state.source.state_v2) && this.getInputText(this.state.source.state_v2).disabled ? <p className="remind"><span>*</span> {title}</p> : null}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>);    
    },
    load: function() {
        this.setState({loading: true, code: null});
        var param = {ref_id: this.props.source._id, ref_type: this.props.type};
        UserOrderHandle.getProduct(param, function(result) {
            if (result.code == 200) {
                return this.setState({loading: false, code: null, product: result.data});
            }
            return this.setState({loading: false, code: result.code});    
        }.bind(this));
    },
    componentDidMount: function() {
        this.load();
    },
    getInitialState: function() {
        return {loading: true, source: this.props.source, product: {}};
    },
    render: function() {
        return <div className="tips_detail_box dialog_chest">
                    {this.getList()}
                </div>
    }
});


