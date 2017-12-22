var PageBox = require('../../../components/common/PageBox');
var MenuList = require('../../../components/listview/MenuList');
var FollowHandle = require('../../../handle/usercenter/FollowHandle');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');

module.exports = React.createClass({
    page: function(result) {
        this.state.page = result.page;
        this.load();
    },

    listChange: function(result) {
        this.state.status = result._id;
        this.state.page = 1;
        this.load()
    },

    load: function() {
    	this.setState({loading: true});
        var param = {page: this.state.page};
        FollowHandle.getFollowList(param, function(result) {
            if (result.code == 200)
               return this.setState({loading: false, source: result.data.rows, pagination: result.data.pagination, code: null});
            return this.setState({code: result.code, loading: false});
        }.bind(this))
    },

    openAdvisor: function(id) {
        Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, '/live.html?adviser=' + id);
    },

    unfollow: function(id) {
        FollowHandle.unFollow(id, function(result) {
            if (result.code == 200) {
                var data = this.state.source.filter(function(item) {
                    return id != item.advisor._id;
                }.bind(this));

                Interface.getProfile(function() {
                    Event.trigger('FreshUserInfo');
                }, true);
                this.setState({source: data});
            }
        }.bind(this))
    },

    getList: function () {
        if (this.state.loading)
            return (<tr height="300">
                <td colSpan="6" style={{position: 'relative'}}><Loading /></td>
            </tr>);

        if (this.state.code)
            return (<tr height="300">
                <td colSpan="6" style={{position: 'relative'}}><Reload onReload={this.load} code={this.state.code} /></td>
            </tr>);

        if (this.state.source.length == 0) {
            return <tr height="300">
                <td colSpan="6" className="info_order_data">暂无关注</td>
            </tr>;
        }

        return this.state.source.map(function(item) {
            return (
                <tr key={item.advisor._id} height="40">
                    <td className="adviser_info_name">
                        <a href="javascript:;" onClick={this.openAdvisor.bind(this, item.advisor._id)}>{item.advisor.name}</a>
                    </td>
                    <td>{item.level_name}</td>
                    <td className="follow_intro">{item.advisor.intro}</td>
                    <td>{Utils.formatDate(item.create_time, 'YYYY-MM-DD')}</td>
                    <td style={{textAlign: 'center'}}>
                        <a href="javascript:;" onClick={this.unfollow.bind(this, item.advisor._id)}>取消</a>
                    </td>
                </tr>
            );
        }.bind(this));
    },

    componentDidMount: function() {
        this.load();
    },

    getInitialState: function() {
        return {loading: true, page: 1, source: [], code: null};
    },
    render: function() {
        return <div>
            <h3 className="info_title">我的关注</h3>
            <div className="info_content">
                <table className="grid_box" width="100%">
                    <thead>
                        <tr height="40">
                            <th style={{width: 80}}>投顾姓名</th>
                            <th style={{width: 80}}>投顾称号</th>
                            <th>个人简介</th>
                            <th style={{width: 80}}>关注时间</th>
                            <th style={{width: 80}}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getList()}
                    </tbody>
                </table>
                <div className="grid_page_box">
                    <PageBox onChange={this.page} pagination={this.state.pagination} nowPage={this.state.page} />
                </div>
            </div>
        </div>
    }
});