var LiveHandle = require('../../../../handle/live/Index');
var Loading = require('../../../../components/common/Loading');
var DataPick = require(('amazeui-react'));
var DateTimeInput = DataPick.DateTimeInput;

module.exports = React.createClass({
    submit: function(e) {
        if (!this.refs.begin.state.start || !this.refs.begin.state.end)
            return $('.time').find('input').addClass('error');
        Forms.disableButton(this.refs.submit);
        var param = e.target.data;
        param.begin_time = this.refs.begin.state.start / 1000;
        param.end_time = this.refs.begin.state.end / 1000;
        param.price = parseFloat(param.price);
        param.risk_level = parseInt(param.risk_level);

        switch(this.props.type) {
            case 'tip':
                LiveHandle.setTactic(param, this.props.source._id, function(result) {
                    if (result.code == 200) {
                        result.data.type = 1;
                        this.props.onChange(result.data);
                        Event.trigger('FreshJewelModule', 'close');
                    }
                    Forms.activeButton(this.refs.submit);
                }.bind(this));
                break;
            case 'report':
                LiveHandle.setReport(this.props.source._id, param , function(result) {
                    if (result.code == 200) {
                        result.data.type = 4;
                        this.props.onChange(result.data);
                        Event.trigger('FreshJewelModule', 'close');
                    }
                    Forms.activeButton(this.refs.submit);
                }.bind(this));
                break;
        }
    },
   
    price: function(e) {
        if (parseInt(e.currentTarget.value) > 100000) return this.setState({price: 99999.99});
        if (parseInt(e.currentTarget.value) < 0) return this.setState({price: 0});
        if (!isNaN(e.currentTarget.value)) this.setState({price: e.currentTarget.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')});
    },
    close: function() {
        Event.trigger('FreshJewelModule', 'close');
    },
    load: function() {
        switch(this.props.type) {
            case 'tip':
                LiveHandle.getTacticItem(this.props.source._id , function(result) {
                    if (result.code == 200 && this.isMounted()) {
                        this.setState({source: result.data, loading: false, price: result.data.price, begin: result.data.begin_time, end: result.data.end_time})
                    }
                }.bind(this));
                break;
            case 'report':
                LiveHandle.getReportsItem(this.props.source._id , function(result) {
                    if (result.code == 200 && this.isMounted()) {
                        this.setState({source: result.data, loading: false, price: result.data.price, begin: result.data.begin_time, end: result.data.end_time})
                    }
                }.bind(this));
                break;
        }

    },
    componentDidMount: function() {
        this.state.category = Config.CACHE_DATA.JEWEL_CATEGORY;
        this.load();
    },

    getInitialState: function() {
        return {loading: true};
    },
    render: function() {
        if (this.state.loading) return <Loading style={{marginTop: '100px'}} />;
        return <div className="dialog_content create_report dialog_chest">
            <h3>{this.props.title}</h3>
            <form onSubmit={this.submit}>
                <table width="100%" className="form_table">
                    <tbody>
                    <tr>
                        <td className="field">标题</td>
                        <td>
                            <input name="title" type="text" data-required="required" defaultValue={this.state.source.title} maxLength="60" />
                            <em></em>
                        </td>
                    </tr>
                    <tr>
                        <td className="field">分类</td>
                        <td>
                            <select className="gray" name="category_id" defaultValue={this.state.source.category_id}>
                                {this.state.category.map(function(item) {
                                    return <option value={item._id} key={item._id}>{item.category_name}</option>
                                })}
                            </select>
                        </td>
                    </tr>
                    <tr className="time">
                        <td className="field">服务期限</td>
                        <td>
                            <DateTimeInput name="begin_time" ref="begin" format="YYYY-MM-DD" data-required="required" placeholder="请选择时间范围"  className="time_input input_calendars" readOnly={true} showTimePicker={false} multiple={true}  start={this.state.begin * 1000} end={this.state.end * 1000} />
                        </td>
                    </tr>
                    <tr>
                        <td className="field">描述</td>
                        <td>
                            <textarea name="description" maxLength={200} placeholder="最多输入200个字符" defaultValue={this.state.source.description}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td className="field">特点</td>
                        <td>
                            <textarea name="specialty" maxLength={200} placeholder="最多输入200个字符" defaultValue={this.state.source.specialty}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td className="field">适用人群</td>
                        <td>
                            <input type="text" name="apply_to" defaultValue={this.state.source.apply_to} />
                        </td>
                    </tr>
                    <tr>
                        <td className="field">风险提示</td>
                        <td>
                            <input type="text" name="risk_tip" defaultValue={this.state.source.risk_tip} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="order_info">
                    <h5>订单信息</h5>
                    <table width="100%" className="form_table">
                        <tbody>
                        <tr>
                            <td className="field">风险等级</td>
                            <td>
                                <select className="gray" name="risk_level"  defaultValue={this.state.source.risk_level}>
                                    <option value="1">厌恶风险型</option>
                                    <option value="2">保守型</option>
                                    <option value="3">稳健型</option>
                                    <option value="4">激进型</option>
                                </select>
                            </td>
                        </tr>
                        <tr className="price">
                            <td className="field">订购价格</td>
                            <td>
                                <input type="text" name="price" onChange={this.price} value={this.state.price} />
                                <label>如果价格为零，则按免费计算</label>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <table width="100%" className="operate_table">
                    <tbody>
                    <tr>
                        <td className="field"></td>
                        <td>
                            <input type="submit" value="提交" ref="submit" />
                            <a href="javascript:;" onClick={this.close}>取消</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>;
    }
});


