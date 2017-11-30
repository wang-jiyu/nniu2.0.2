var Program = require('../../../../components/common/Program');
var LiveHandle = require('../../../../handle/live/Index');

module.exports = React.createClass({
    submit: function(e) {
        var data = e.target.data;
        var value = e.target.data.schedule_value;
        var program = [];

        if(value instanceof Array) {
            for (var i = 0; i < value.length ;i++) {
                if (value[i] == '') continue;
                program.push({hour: data.schedule_hour[i], minute: data.schedule_minute[i], text: value[i]})
            }
        } else {
            program.push({hour: data.schedule_hour, minute: data.schedule_minute, text: value})
        }

        var param = {
            topic: data.topic,
            group_limit: parseInt(data.group_limit),
            description: data.description,
            schedule: JSON.stringify(program)
        };
        LiveHandle.setRoom_old(Config.CACHE_DATA.ROOM._id, param, function(result) {
            if (result.code == 200) {
                this.close();
                Config.CACHE_DATA.ROOM.topic_title = param.topic;
                Config.CACHE_DATA.ROOM.description = param.description;
                Config.CACHE_DATA.ROOM.schedule = JSON.parse(param.schedule);
                Config.CACHE_DATA.ROOM.group_limit = parseInt(param.group_limit);
                this.props.onChange();
            }
        }.bind(this))
    },
    close: function() {
        Event.trigger('CloseDialog');
    },

    getInitialState: function() {
        return {limitGroup: Config.CACHE_DATA.GROUP_LIST};
    },
    render: function() {
        return <div className="set_live_box dialog_page">
                    <form onSubmit={this.submit}>
                        <table className="form_table" width="100%">
                            <tbody>
                            <tr>
                                <td className="field">今日主题</td>
                                <td>
                                    <input type="text" name="topic" data-required="required" defaultValue={Config.CACHE_DATA.ROOM.topic} />
                                    <em></em>
                                </td>
                            </tr>
                            <tr>
                                <td  className="field">节目单</td>
                                <td>
									<Program source={Config.CACHE_DATA.ROOM.schedule} name="schedule" />
								</td>
                            </tr>
                            <tr>
                                <td  className="field">描述</td>
                                <td><textarea name="description" defaultValue={Config.CACHE_DATA.ROOM.description}></textarea></td>
                            </tr>
                            <tr>
                                <td  className="field">访问限制</td>
                                <td>
                                    <select className="gray" name="group_limit" defaultValue={Config.CACHE_DATA.ROOM.group_limit}>
                                        {this.state.limitGroup.map(function(item) {
                                            if (item.assort == 1) return null;
                                            return <option value={item.weight} key={item._id}>{item.name}</option>
                                        })}
                                    </select>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table width="100%" className="operate_table">
                            <tbody>
                            <tr>
                                <td className="field"></td>
                                <td>
                                    <input type="submit" value="提交" ref="button" />
                                    <a href="javascript:;" onClick={this.close}>取消</a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
               </div>;
    }
});


