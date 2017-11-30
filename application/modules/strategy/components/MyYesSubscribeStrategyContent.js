/**
 * Created by Administrator on 2017/7/10.
 */
var NoSubscribeData = require('./MyNoSubscribeState');
var Loading = require('../../../components/common/Loading');
module.exports = React.createClass({
    render: function() {
        console.log(this.props.data);
        var temp;
        if (this.props.hasLoading) {
            temp = <div style={{'text-align':'center','margin-top':'60'}}><Loading /></div>
        } else {
            if (this.props.data.length > 0) {
                // console.log(this.props.data);
                temp = <div>
                     <h3 className="my_sub_h3">{this.props.title}</h3>
                    {
                        this.props.data.map(function(item,index){
                            return <div className="my_sub_box clearfix">
                                    <div className="my_sub_box_left">
                                        <div className="my_sub_tit"><a href={'/strategyNoInfo.html?_id='+item._id}>{item.title}</a></div>
                                        <ul className="clearfix">
                                            <li>
                                                <div className="my_sub_rise ratio" style={item.profit_year>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{item.profit_year && item.profit_year != 0 ? (item.profit_year*100).toFixed(2)+'%' : '--'}</div>
                                                <div className="my_sub_info">年化收益率</div>
                                            </li>
                                            <li>
                                                <div className="my_sub_desc ratio" style={item.profit_total>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{item.profit_total && item.profit_total != 0 ? (item.profit_total*100).toFixed(2)+'%' : '--'}</div>
                                                <div className="my_sub_info">总收益率</div>
                                            </li>
                                            {/*<li>
                                                    <div className="my_sub_rise ratio">0.18%</div>
                                                    <div className="my_sub_info">月收益率</div>
                                                </li>
                                                <li>
                                                    <div className="my_sub_rise ratio">18%</div>
                                                    <div className="my_sub_info">周收益率</div>
                                                </li>
                                                <li>
                                                    <div className="my_sub_rise ratio">-3%</div>
                                                    <div className="my_sub_info">昨日收益率</div>
                                                </li>
                                                <li>
                                                    <div className="my_sub_rise ratio">18%</div>
                                                    <div className="my_sub_info">最大回撤</div>
                                                </li>*/}
                                            <li>
                                                <div className="ratio" style={item.success>0?{'color':'#EE0F0F'}:{'color':'#129206'}}>{item.success && item.success !=0 ? (item.success*100).toFixed(2)+'%' : '--'}</div>
                                                <div className="my_sub_info">成功率</div>
                                            </li>
                                        </ul>
                                    </div>

                                    <a href={'strategyNoInfo.html?_id='+item._id} className="my_sub_more">

                                    </a>
                                </div>
                        })
                    }
                    </div>
            } else {
                temp = <NoSubscribeData />
            }
        }
        return (
            <div className="my_sub">
                {temp}
            </div>
        );
    }
});