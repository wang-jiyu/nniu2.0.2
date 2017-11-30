var MessagesHandle = require('../../../handle/messages/Index');

module.exports = React.createClass({
    submit: function(e) {
        var param = e.target.data;
        Forms.disableButton(this.refs.button);
        MessagesHandle.addComplain(param, function(result) {
            if (result.code == 200) {
                this.props.onChange(result.data);
                Event.trigger('CloseDialog');
            } else {
                Forms.activeButton(this.refs.button);
            }
        }.bind(this))
    },

    getInitialState: function() {
        return {category: this.props.category || []}
    },

    render: function() {
        return <div className="add_complain">
                    <form onSubmit={this.submit}>
                        <table className="form_table">
                            <tbody>
                            <tr>
                                <td className="field">类型</td>
                                <td>
                                    <select className="gray" name="category_id">
                                        {this.state.category.map(function(item) {
                                            return <option value={item._id} key={item._id}>{item.category_name}</option>
                                        })}
                                    </select>
                                    <em></em>
                                </td>
                            </tr>
                            <tr>
                                <td className="field">标题</td>
                                <td>
                                    <input type="text" data-required="required" name="title" maxLength="60" />
                                    <em></em>
                                </td>
                            </tr>
                            <tr>
                                <td className="field">描述</td>
                                <td>
                                    <textarea data-required="required" maxLength="200" name="description" placeholder="请输入1~200个字符"></textarea>
                                    <em></em>
                                </td>
                            </tr>
                            <tr>
                                <td className="field">手机号码</td>
                                {
                                    Config.CACHE_DATA.USER.mobile ?
                                        <td><input type="text" defaultValue={Config.CACHE_DATA.USER.mobile} disabled={true} readOnly={true} name="mobile" /> </td>
                                        :
                                        <td><input type="text"  data-required="required" data-type="mobile" name="mobile" />  <em></em></td>
                                }
                            </tr>
                            <tr>
                                <td className="field">邮箱</td>
                                <td>
                                    <input type="text" name="email" data-type="email" />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table className="operate_table">
                            <tbody>
                            <tr>
                                <td className="field"></td>
                                <td><input type="submit" value="提交" ref="button" /></td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
    }
});