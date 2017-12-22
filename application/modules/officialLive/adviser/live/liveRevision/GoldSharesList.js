var LiveHandle = require('../../../../../handle/live/Index');

module.exports = React.createClass({

    btnEditClick: function () {
        var fun = this.props.onEdit;
        fun(this.props.info);
    },

    render: function () {
        var info = this.props.info;
        if (!info)
            return null;
        return (
            <div className="curr-goldshares-item">
                <div className="curr-goldshares-title">
                    <span className="curr-goldshares-code">{info.stock_name + "（" + info.stock_code + "）"}</span>
                    <span className="curr-goldshares-time"> {Utils.formatDate(info.create_time, 'YYYY-MM-DD hh:mm')}</span>
                    {!LiveHandle.isRoomOwner() ? null : <span className="curr-goldshares-edit" onClick={this.btnEditClick}>编辑</span>}
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