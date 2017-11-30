var LiveHandle = require('../../../../../handle/live/Index');

module.exports = React.createClass({

    btnCancelClick: function () {
        this.close();
    },

    close: function() {
        Event.trigger('FreshJewelModule', 'close');
    },

    btnConfirmClick: function () {
        var obj = {
            "stock_name": this.refs.stockName.value,
            "stock_code": this.refs.stockCode.value,
            "stop_price": parseFloat(this.refs.stopPrice.value),
            "target_price": parseFloat(this.refs.targetPrice.value),
            "min_price": parseFloat(this.refs.minPrice.value),
            "max_price": parseFloat(this.refs.maxPrice.value),
            "reason": this.refs.reason.value
        }

        //修改
        if (this.isEdit) {
            LiveHandle.goldStockEdit(this.props.info._id, obj, function (result) {
                if (result.code == 200) {
                    this.close();
                } else {
                    this.state.error = result.code;
                }
                this.setState({ loading: false });
            }.bind(this));
        } else {//添加
            LiveHandle.goldStockCreate(this.props.id, obj, function (result) {
                if (result.code == 200) {
                    this.close();
                } else {
                    this.state.error = result.code;
                }
                this.setState({ loading: false });
            }.bind(this));
        }

    },

    onPriceChange: function (propName) {
        var value = this.refs[propName].value;
        // if (value.toString().split(".")[1]) {
        //     if (value.toString().split(".")[1].length > 1) {
        //         value = (value - 0).toFixed(2);
        //     }
        // }
        var s ={};
        s[propName] =value;
        this.setState(s);
    },


    getInitialState: function () {
        return { stockName: "", stockCode: "", minPrice: "", maxPrice: "", targetPrice: "", stopPrice: "", reason: "" }
    },


    componentWillReceiveProps: function (nextProps) {
        if (nextProps.info) {
            this.isEdit = true;
            // this.setState({ maxPrice: nextProps.info.max_price });
            this.setState({ stockName: nextProps.info.stock_name, stockCode: nextProps.info.stock_code, minPrice: nextProps.info.min_price, maxPrice: nextProps.info.max_price, targetPrice: nextProps.info.target_price, stopPrice: nextProps.info.stop_price, reason: nextProps.info.reason });
        }
    },

    componentDidMount: function () {
    },

    editStock: function (info) {

    },

    render: function () {
        var hide = this.props.hide;
        return (
            <div className={hide ? "hide" : "curr-goldshares-create"}>
                <div className="curr-goldshares-create-tit">课程金股</div>
                <div className="curr-goldshares-create-tr1">
                    <span className="curr-goldshares-create-name">股票名称 :</span>
                    <input className="curr-goldshares-create-input" type="text" placeholder="请输入名称" ref="stockName" onChange={this.onPriceChange.bind(this, "stockName")} value={this.state.stockName}/>
                    <span className="curr-goldshares-create-code">股票代码： </span>
                    <input className="curr-goldshares-create-input" type="text" placeholder="300059" ref="stockCode" onChange={this.onPriceChange.bind(this, "stockCode")} value={this.state.stockCode}/>
                </div>
                <div className="curr-goldshares-create-tr2">
                    <span className="curr-goldshares-create-name">介入区间 :</span>
                    <input className="curr-goldshares-create-input" type="text" placeholder="0" ref="minPrice" onChange={this.onPriceChange.bind(this, "minPrice")} value={this.state.minPrice} />
                    <span className="curr-goldshares-create-yuan">元</span>
                    <span className="curr-goldshares-create-line"></span>
                    <input className="curr-goldshares-create-input" type="text" placeholder="0" ref="maxPrice" onChange={this.onPriceChange.bind(this, "maxPrice")} value={this.state.maxPrice} />　元
            </div>
                <div className="curr-goldshares-create-tr3">
                    <span className="curr-goldshares-create-name">目标位 :　</span>
                    <input className="curr-goldshares-create-input" type="text" placeholder="0" ref="targetPrice" onChange={this.onPriceChange.bind(this, "targetPrice")} value={this.state.targetPrice} />
                    <span className="curr-goldshares-create-yuan">元</span>
                    <span className="curr-goldshares-create-name">止损位：　</span>
                    <input className="curr-goldshares-create-input" type="text" placeholder="0" ref="stopPrice" onChange={this.onPriceChange.bind(this, "stopPrice")} value={this.state.stopPrice} />　元
            </div>
                <div className="curr-goldshares-create-tr4">
                    <span className="curr-goldshares-create-name">推荐理由 :</span>
                    <textarea name="" id="" cols="30" rows="10" placeholder="请描述..." ref="reason" onChange={this.onPriceChange.bind(this, "reason")} value={this.state.reason}></textarea>
                </div>
                <div className="curr-goldshares-create-tr5">
                    <button className="curr-goldshares-create-save adopt" onClick={this.btnConfirmClick}>保存</button>
                    <button className="curr-goldshares-create-cancel" onClick={this.btnCancelClick}>取消</button>
                </div>
            </div>
        )
    }
});