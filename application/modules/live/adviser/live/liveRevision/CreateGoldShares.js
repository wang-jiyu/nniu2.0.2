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
            "reason": this.refs.reason.value,
            "capital_quantity": parseFloat(this.refs.capitalQuantity.value)
        }
        var access_token = Config.ACCESS_TOKEN;
        //修改
        if (this.isEdit) {
            delete obj.reason;
            console.log(this.reasonStatus);
            if(this.props.info.stock_name == obj.stock_name && this.props.info.stock_code == obj.stock_code && this.props.info.min_price == obj.min_price && this.props.info.max_price == obj.max_price && this.props.info.target_price == obj.target_price && this.props.info.stop_price == obj.stop_price && this.props.info.capital_quantity == obj.capital_quantity) {
                this.close();
            }else{
                LiveHandle.goldStockEdit(this.props.info._id, obj, function (result) {
                    if (result.code == 200) {
                        this.close();
                    } else {
                        Event.trigger('ServerTips', result.message);
                    }
                    this.setState({ loading: false });
                }.bind(this));
            }
        } else {//添加
            LiveHandle.goldStockCreate(this.props.id, obj, function (result) {
                if (result.code == 200) {
                    this.close();
                } else {
                    Event.trigger('ServerTips', result.message);
                }
                this.setState({ loading: false });
            }.bind(this));
        }

    },

    onPriceChange: function (propName) {
        var value = this.refs[propName].value;
        if(propName == "capitalQuantity") {
            if (value.toString().split(".")[1]) {
                if (value.toString().split(".")[1].length > 1) {
                    value = parseFloat((value - 0).toFixed(2));
                    console.log(typeof(value));
                }
            }
        }
        var s ={};
        s[propName] =value;
        this.setState(s);
    },
    //删除理由
    deleteReason: function(reasonId) {
        var goldenStockId;
        if(this.isEdit) {
            goldenStockId = this.props.info._id;
        }else{
            goldenStockId = this.props.id;
        }
        if(this.state.reasonItems.length == 1) {
            $(this.refs.notDelete).css('display','block');
            setTimeout(function() {
                $(this.refs.notDelete).css('display','none');
            }.bind(this),3000);
        }else{
            this.reasonStatus = "delete";
            LiveHandle.deleteOneReason(reasonId, function(result) {
                if(result.code == 200) {
                    this.sendReasonInter(goldenStockId);
                }else{
                    Event.trigger('ServerTips', result.message);
                }
            }.bind(this));
        }
    },
    //编辑理由
    editReason: function(reasonId,followReason) {
        $(this.refs.addReasonMask).css('display','block');
        $(this.refs.addreason).val(followReason);
        this.reasonStatus = "edit";
        this.reasonId = reasonId;
    },

    getReasonList: function() {
        return this.state.reasonItems.map(item=>{
            return <li><p onClick={this.editReason.bind(this,item._id,item.follow_reason)}>{item.follow_reason}</p><button onClick={this.deleteReason.bind(this,item._id)}>删除</button></li>
        })
    },
    sendReasonInter: function(id) {
        LiveHandle.getStockReasonList(id, function(result) {
            if(result.code == 200) {
                this.setState({
                    reasonItems:result.data
                })
            }else{
                Event.trigger('ServerTips',result.message);
            }
        }.bind(this));
    },
    onReasonAdd: function() {
        $(this.refs.addReasonMask).css('display','block');
        $(this.refs.addreason).val('');
        this.reasonStatus = "add";
        this.reasonId = "";
    },
    onCloseAdd: function() {
        this.reasonStatus = "";
        $(this.refs.addReasonMask).css('display','none');
    },
    saveReason: function() {
        if(this.reasonStatus == "add") {
            var reasonObj = {
                "golden_stock_id":this.props.info._id,
                "reason":this.refs.addreason.value
            }
            if(reasonObj.reason == "") {
                Event.trigger('ServerTips',"推荐理由不能为空");
            }else{
                this.reasonStatus = "edit";
                LiveHandle.saveOneReason(reasonObj, function(result) {
                    if(result.code == 200) {
                        this.sendReasonInter(this.props.info._id);
                        this.onCloseAdd();
                    }else{
                        Event.trigger('ServerTips',result.message);
                    }
                }.bind(this));
            }
        }else{
            var editObj = {
                "golden_stock_id":this.props.info._id,
                "reason_guid":this.reasonId,
                "reason":this.refs.addreason.value
            }
            LiveHandle.editReason(editObj, function(result) {
                if(result.code == 200) {
                    this.sendReasonInter(this.props.info._id);
                    this.onCloseAdd();
                }else{
                    Event.trigger('ServerTips',result.message);
                }
            }.bind(this));
        }

    },
    getInitialState: function () {
        return { stockName: "", stockCode: "", minPrice: "", maxPrice: "", targetPrice: "", stopPrice: "", reason: "", capitalQuantity: "", reasonItems:[]}
    },


    componentWillReceiveProps: function (nextProps) {
        if (nextProps.info) {
            this.isEdit = true;
            console.log(nextProps.info.capital_quantity);
            this.sendReasonInter(nextProps.info._id);
            // this.setState({ maxPrice: nextProps.info.max_price });
            this.setState({ stockName: nextProps.info.stock_name, stockCode: nextProps.info.stock_code, minPrice: nextProps.info.min_price, maxPrice: nextProps.info.max_price, targetPrice: nextProps.info.target_price, stopPrice: nextProps.info.stop_price, reason: nextProps.info.reason, capitalQuantity: nextProps.info.capital_quantity});
        }
    },


    componentDidMount: function () {

    },

    editStock: function (info) {

    },

    render: function () {
        var hide = this.props.hide;
        var reasonAreaStyle = {
            float:'left',
            display:(this.isEdit) ? "none":"block",
        }
        var appendReasonStyle = {
            margin:(this.isEdit) ? "0 10px 10px 36px":"14px 10px 10px 102px"
        }
        if(hide) {
            return null;
        }else{
            return (
            <div className={hide ? "hide" : "curr-goldshares-create"}>
                <div className="addReasonMask" ref="addReasonMask">
                <div className="addReasonBox">
                <textarea className="inputArea" ref="addreason" cols="30" rows="10" placeholder="请输入理由..."></textarea>
                <button className="curr-goldshares-create-save" onClick={this.onCloseAdd}>取消</button>
                <button className="curr-goldshares-create-cancel adopt" onClick={this.saveReason}>保存</button>
                </div>
                </div>
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
                <div className="curr-goldshares-create-tr2">
                    <span className="curr-goldshares-create-name">仓位：</span>
                    <input className="curr-goldshares-create-input2" type="number" placeholder="0" ref="capitalQuantity" onChange={this.onPriceChange.bind(this, "capitalQuantity")} value={this.state.capitalQuantity}/>
                    <span className="curr-goldshares-create-yuan">%</span>
                    <span className="curr-goldshares-create-hint">提示：只能输入数字，包含小数点后两位</span>
                </div>
                <div className="curr-goldshares-create-tr4">
                    <span className="curr-goldshares-create-name" style={{"float":"left"}}>推荐理由 :</span>
                    <button className="curr-goldshares-create-add" onClick={this.onReasonAdd} style={{"display":this.isEdit? "inline-block":"none"}}>添加</button>
                    <textarea name="" id="" cols="30" rows="10" placeholder="请描述..." ref="reason" onChange={this.onPriceChange.bind(this, "reason")} value={this.state.reason} style={reasonAreaStyle}></textarea>
                <div className="appendReason" style={appendReasonStyle}>
                    <ul>
                        {this.getReasonList()}
                    </ul>
                    <div className="notDelete" ref="notDelete">必须保留一条理由</div>
                </div>
                </div>
                <div className="curr-goldshares-create-tr5">
                    <button className="curr-goldshares-create-save adopt" onClick={this.btnConfirmClick}>保存</button>
                    <button className="curr-goldshares-create-cancel" onClick={this.btnCancelClick}>取消</button>
                </div>
             </div>
        )
        }
    }
});