var Loading = require('../../../components/common/Loading');
module.exports = React.createClass({
    getListData: function() {
        this.setState({
            data: this.props.source
        })
    },
    tabClick: function(index, sort, objFocus) {
        objFocus = objFocus || {};
        this.setState({
            currentIndex: index
        });
        // console.log(sort);
        this.props.listApi(sort, 6, objFocus, function(data) {
            // console.log(data);
            if (data) {
                this.setState({
                    data: data
                });
            }
        }.bind(this))
    },
    check_tab_index:function(index) {
        return index === this.state.currentIndex ? "active" : "";
    },
    getInitialState: function() {
        return {
            currentIndex: 0,
            data: []
        };
    },
    componentWillMount: function() {
        this.props.listApi(1, 6, {
            "field": 'profit_year',
            "name": '年化收益率'
        }, function(data) {
            if (data) {
                this.setState({
                    data: data
                });
            }
        }.bind(this))
    },
    render: function() {
        var tabName = this.props.tabName;
        var listSource = this.state.data;
        // console.log(listSource);
        return (
            <div className="rate">
            <div className="rate-banner">
             {
                  tabName.map(function(item, i){
                     return <a className={ this.check_tab_index(i) } href="javascript:;" onClick={this.tabClick.bind(this,i,item.id,{"field":item.param,"name":item.name})}>{item.name}</a>
                  }.bind(this)) 
              }
                
            </div>
            <div className="content-list">
              <ul className="content-ul">
                    {
                        !this.props.loading >0 ? listSource.map(function(item, i) {
                            var fontStyle={};
                            fontStyle.color = item[this.props.focusPostion.field] >= 0 ? '#EE0F0F' : '#129206';
                            return <li>
                                    <a href={'strategyNoInfo.html?_id='+item._id+'&access_token='+this.props.access_token}>
                                       <p className="desc">{item.name}</p>
                                       <p className="strategyListCreate">创建于：{(item.createtime).toString().substr(0,4)+'-'+(item.createtime).toString().substr(4,2)+'-'+(item.createtime).toString().substr(6,2)}</p>
                                        <p className="ratio" style={fontStyle}>{this.props.focusPostion.name=='股票数'?<div>{item[this.props.focusPostion.field] && item[this.props.focusPostion.field]!=0?item[this.props.focusPostion.field]:'0'}<span style={{'fontSize':'15'}}>只</span></div>:item[this.props.focusPostion.field] && item[this.props.focusPostion.field]!=0?(item[this.props.focusPostion.field]*100).toFixed(2)+'%':'--'}</p>
                                        <p className="day">{this.props.focusPostion.name}</p>
                                        <div className="line"></div>
                                        <div className="stock-description">
                                        {
                                            item.label.map(function(items,index){
                                                return <span>{items.title}</span>
                                            }.bind(this))
                                        }
                                        </div>
                                        <div className="num">
                                            <div className="num-votes">
                                                <p>{item.position && item.position!=0?item.position:'0'}</p>
                                                <p>股票数</p>
                                            </div>
                                            <div className="degree">
                                                <p>{item.success && item.success!= 0 ? (item.success*100).toFixed(2)+'%' : '--'}</p>
                                                <p>成功率</p>
                                            </div>
                                            <div className="yestaday-yield">
                                                <p className="yield-rate">{item.backset && item.backset !=0 ? (item.backset*100).toFixed(2)+'%' : '--'}</p>
                                                <p>最大回辙</p>
                                            </div>
                                        </div>
                                        </a>
                                    </li>
                        }.bind(this)):<div style={{"text-align":"center","margin-top":"170"}}><Loading /></div>
                    }
                </ul>
            </div>
            {/*<ul className="pagination">
                <li>1</li>
                <li>2</li>
                <li>3</li>
            </ul>*/}
        </div>
        )
    }
})