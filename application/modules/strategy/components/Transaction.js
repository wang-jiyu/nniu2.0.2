{ /*过往交易*/ }
var NoData = require('./NoData');
module.exports = React.createClass({
    getInitialState: function() {
        return ({
            data: []
        })
    },
    mydate: function() {;
        ! function() {
            console.log(Laydate)
            laydate({
                elem: '#mydate'
            })
        }();
    },
    mydateTwo: function() {;
        ! function() {
            console.log(Laydate)
            laydate({
                elem: '#mydate_two'
            })
        }();
    },
    componentDidMount: function() {
        // var _id = Url.getParam("_id")
        // var info = {};
        // info._id = _id;
        // this.getHistoryData(info);
    },
    componentWillMount: function() {
        // var _id = Url.getParam("_id")
        // var info = {};
        // info._id = _id;
        // this.getHistoryData(info);
    },
    render: function() {
        // console.log(this.props.data);
        var temp;
        if (this.props.data.length > 0) {
            temp = <div className="transaction_main">

                <div className="transaction_box">
                    <table className="transaction_table">
                        <tbody>
                        <tr>
                            <th>序号</th>
							<th>代码</th>
							<th>名称</th>
							<th>调仓</th>
							<th>时间</th>
							<th>价格</th>
							{/*<th>止盈价</th>
							<th>止损价</th>*/}
                        </tr>
                        {
                            this.props.data.map(function (item, index) {
                            	var colorStyle={};
									colorStyle.color = item.state == 0 ? '#FF0000' : '#129206';
                                return <tr>
                                    <td>{++index}</td>
									<td>{item.code}</td>
									<td>{item.name}</td>
									<td className="red" style={colorStyle}>{item.state==0?"调入":"调出"}</td>
									<td>{(item.date).toString().substr(0,4)+'-'+(item.date).toString().substr(4,2)+'-'+(item.date).toString().substr(6,2)}</td>
									<td style={{"text-align":"right","padding-right":"50"}}>{(item.price).toFixed(2)}</td>
									{/* <td>{item.price_max}</td>*/}
									{/* <td>{item.price_min}</td>*/}
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        } else {
            temp = <NoData />
        }
        return (
            <div>
                {temp}
            </div>

        )
    }
})