
var UserOrderHandle = require('../../../../handle/usercenter/UserOrder');
var UserCenterHandle = require('../../../../handle/usercenter/UserCenter');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');

module.exports = React.createClass({
    upVip: function(item) {
        var uri = '/tool.html?tool=order&id=' + item.ref_id + '&type=7';
        location.href = uri;
    },

    load: function() {
        this.setState({loading: true});
        UserCenterHandle.getVipInfo(function(result) {
            if (result.code == 200)
                return this.setState({vipInfo: result.data, loading: false, code: null});
            return this.setState({loading: false, code: null});
        }.bind(this));
    },

    componentDidMount: function() {
        this.load();
    },

    getList: function() {
      if (this.state.loading) return <div style={{position: 'relative', height: '100%'}}><Loading /></div>;
      if (this.state.code) return <div style={{position: 'relative', height: '100%'}}><Reload onReload={this.load} code={this.state.code} /></div>;

       return (<div>
                   <h3>请选择会员类型</h3>
                   <table className="grid_box">
                       <thead>
                       <tr>
                           <td width="200">模块/服务</td>
                           <td width="120">免费</td>
                           <td width="120">VIP1</td>
                           <td width="120">VIP2</td>
                           <td width="120">VIP3</td>
                       </tr>
                       </thead>
                       <tbody>
                       <tr>
                           <td>相似K线</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>￥10/次</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>3次/天</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>不限</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>不限</span>
                           </td>
                       </tr>
                       <tr>
                           <td>大数据诊股</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>不限</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>不限</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>不限</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>不限</span>
                           </td>
                       </tr>
                       <tr>
                           <td>量化策略（普通）</td>
                           <td>
                               <i className="icon_mark error"></i>
                               <span></span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>5个</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>5个</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>不限</span>
                           </td>
                       </tr>
                       <tr>
                           <td>量化策略（尊享）</td>
                           <td>
                               <i className="icon_mark error"></i>
                               <span></span>
                           </td>
                           <td>
                               <i className="icon_mark error"></i>
                               <span></span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>2个</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>不限</span>
                           </td>
                       </tr>
                       <tr>
                           <td>量化策略（第三方）</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                       </tr>
                       <tr>
                           <td>锦囊</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>9折</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>9折</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>8折</span>
                           </td>
                       </tr>
                       <tr>
                           <td>内参（首证）</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>8折</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>免费</span>
                           </td>
                       </tr>
                       <tr>
                           <td>内参（智能&第三方）</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>9折</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>8折</span>
                           </td>
                       </tr>
                       <tr>
                           <td>内参（量身定制）</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                       </tr>
                       <tr>
                           <td>课堂</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>另付费</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>9折</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>9折</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>8.5折</span>
                           </td>
                       </tr>
                       <tr>
                           <td>股票池</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span></span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span></span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span></span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span></span>
                           </td>
                       </tr>
                       <tr>
                           <td>图文/视频直播</td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span></span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span></span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span></span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span></span>
                           </td>
                       </tr>
                       <tr>
                           <td>专属服务</td>
                           <td>
                               <i className="icon_mark error"></i>
                               <span>客户经理</span>
                           </td>
                           <td>
                               <i className="icon_mark error"></i>
                               <span>客户经理</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>普通投顾</span>
                           </td>
                           <td>
                               <i className="icon_mark right"></i>
                               <span>金牌投顾</span>
                           </td>
                       </tr>
                       </tbody>
                   </table>
                   <div className="level_vip_submit">
                       {
                           this.state.vipInfo.map(function(item, i) {
                               return  <label key={i}>
                                   <input type="button" value="升级" disabled={Vip.chechAuth(item.level_weight)} onClick={this.upVip.bind(this, item)} />
                                   <h5>￥ {item.level_price}/年</h5>
                               </label>
                           }.bind(this))
                       }
                   </div>
               </div>);
    },

    getInitialState: function() {
        return {loading: true, vipInfo: [], code: null};
    },
    render: function() {

        return <div className="level_vip_box">
                    {this.getList()}
            </div>;
    }
});