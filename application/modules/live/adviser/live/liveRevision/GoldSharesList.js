var LiveHandle = require('../../../../../handle/live/Index');

module.exports = React.createClass({

    btnEditClick: function () {
        var fun = this.props.onEdit;
        fun(this.props.info);
    },
    onStatusChange: function(id) {
        if($(this.refs.status).text() == "结束") {
            value = 1
        }else{
            value = 2
        }
        this.props.showConfirmBox(true,value,id);
    },
    render: function () {
        var info = this.props.info;
        var addBgColor = {
            backgroundColor:(info.position_status == 2) ? "#FF5A1C":"#cfcfcf"
        }
        if (!info)
            return null;
        return (
            <div className="curr-goldshares-item">
                <div className="curr-goldshares-title">
                    <span className="curr-goldshares-code">{info.stock_name + "（" + info.stock_code + "）"}</span>
                    <span className="curr-goldshares-time"> {Utils.formatDate(info.create_time, 'YYYY-MM-DD hh:mm')}</span>
                    {!LiveHandle.isRoomOwner() ? null : <div style={{display:'inline'}}><span style={addBgColor} className="curr-goldshares-status2">{info.position_status == 2?"持仓中":"已结束"}</span><span className="curr-goldshares-status" onClick={this.onStatusChange.bind(this,info._id)} ref="status">{info.position_status == 2?"结束":"恢复"}</span><span className="curr-goldshares-edit" onClick={this.btnEditClick}>编辑</span></div>}
                </div>
                <div className="curr-goldshares-index">
                    <ul className="curr-goldshares-ul clearfix">
                        <li>
                            <div className="curr-goldshares-li-value">{info.min_price + "~" + info.max_price}</div>
                            <div className="curr-goldshares-li-value">介入区间</div>
                        </li>
                        <li>
                            <div className="curr-goldshares-li-value">{info.target_price}</div>
                            <div className="curr-goldshares-li-value">目标位</div>
                        </li>
                        <li>
                            <div className="curr-goldshares-li-value">{info.stop_price}</div>
                            <div className="curr-goldshares-li-value">止损位</div>
                        </li>
                    </ul>
                </div>
                <div className="curr-goldshares-info">
                    {info.reason}
                </div>
            </div>
        )
    }
});