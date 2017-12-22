var AddComplain = require('./AddComplain');
var InfoComplain = require('./InfoComplain');
var PageBox = require('../../../components/common/PageBox');
var Loading = require('../../../components/common/Loading');
var LaunchBox = require('../components/LaunchBox');
var MessagesHandle = require('../../../handle/messages/Index');
var Reload = require('../../../components/common/Reload');

module.exports = React.createClass({
    category: function(id) {
        return ArrayCollection.getItem.call(this.state.category, id, '_id');
    },
    status: function(status) {
        switch (status) {
            case 1: return '处理中';
            case 2: return '已受理';
        }
        return '已解决';
    },
    selectComplain: function(item) {
        Event.trigger('OpenNotify', {
            module: <InfoComplain key={item._id} id={item._id} status={item.status} category={this.state.category} onChange={this.solvedComplain}  />,
            width: 340,
            gap: true
        });
    },
    solvedComplain: function(reuslt) {
        var item = ArrayCollection.getItem.call(this.state.source, reuslt, '_id');
        item.status = 0;
        this.state.solved += 1;
        this.setState({source: this.state.source, solved: this.state.solved, pagination: this.state.pagination})
    },
    complainChange: function(result) {
        this.state.source.unshift(result);
        this.state.pagination.total += 1;
        this.setState({source: this.state.source});
    },
    addComplain: function() {
        Event.trigger('OpenDialog', {
            module: <AddComplain onChange={this.complainChange} category={this.state.category} />,
            title: '投诉与建议',
            width: 700,
            height: 480});
    },
    deleteComplain: function(item) {
        Event.trigger('OpenAlert', {
            title: '删除问题',
            message: '删除后将无法恢复，您确定要删除问题吗？',
            button: Config.MESSAGE_BUTTON.OKCANCEL,
            event: function() {
                MessagesHandle.deleteComplain(item._id, function(result) {
                    if (result.code == 200) {
                        ArrayCollection.removeItem.call(this.state.source, item._id, '_id');
                        this.state.pagination.total -= 1;
                        if (item.status == 0) this.state.solved -= 1;
                        this.setState({source: this.state.source, pagination: this.state.pagination});
                    }
                }.bind(this))
            }.bind(this)
        });
    },
    page: function(result) {
        this.load(result);
    },
    load: function(result) {
    	this.setState({loading: true});
        var param = $.extend({page: 1}, result);
        MessagesHandle.complainList(param, function(result) {
               if (result.code == 200) {
                   result.data.rows.sort(function(p, n) {
                       if (p.create_time < n.create_time) return 1;
                       if (p.create_time > n.create_time) return -1;
                       return 0;
                   });

                   return this.setState({loading: false, source: result.data.rows, page: param.page, pagination: {total: result.data.total_number, page_size: 5}, solved: result.data.solved_number, code: null})
               }
               return this.setState({code: result.code, loading: false});
        }.bind(this))
    },
    componentDidMount: function() {
        MessagesHandle.complainCategory(function(result) {
            if (result.code == 200) {
                this.state.category = result.data;
                this.load();
            }
        }.bind(this))
    },
    componentWillUnmount: function() {

    },

    getInitialState: function() {
        return {source: [], loading: true, code: null}
    },

    render: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load} code={this.state.code} />;
        return <div className="complain_box">
                    <div className="complain_header">
                        <div className="header_left">
                            <span>我的投诉与建议</span>
                            <input type="button" value="新增建议与投诉" onClick={this.addComplain} className="blue" />
                        </div>
                        <div className="header_right">
                            <span>问题： <a href="javascript:;">{this.state.pagination.total}</a>  个，</span>
                            <span>已解决： <a href="javascript:;">{this.state.solved}</a>  个</span>
                        </div>
                    </div>
                    <table className="grid_box" width="100%">
                        <thead>
                            <tr height="40">
                                <th style={{width: 280}}>编号</th>
                                <th>问题标题</th>
                                <th style={{width: 140}}>提交时间</th>
                                <th style={{width: 80}}>问题分类</th>
                                <th style={{width: 80}}>问题状态</th>
                                <th style={{width: 100}}>操作</th>
                            </tr>
                        </thead>
                        {this.state.code ? <tbody>
                                <tr>
                                    <td colSpan="6" style={{position: 'relative', height: '400px'}}>
                                        <Reload onReload={this.load} code={this.state.code} />
                                    </td>
                                </tr>
                         </tbody>
                            :
                        <tbody>

                            {this.state.source.map(function(item) {
                                var category = this.category(item.category_id);
                                var status = this.status(item.status);

                                return <tr height="40" key={item._id}>
                                            <td>{item._id}</td>
                                            <td>{item.title}</td>
                                            <td>{Utils.formatDate(item.create_time, 'YYYY-MM-DD hh:mm')}</td>
                                            <td>{category.category_name}</td>
                                            <td style={item.status == 0 ? {color: '#417505'} : null}>{status}</td>
                                            <td>
                                                <a href="javascript:;" onClick={this.selectComplain.bind(this, item)}>查看</a>
                                                <span>|</span>
                                                <a href="javascript:;" onClick={this.deleteComplain.bind(this, item)}>删除</a>
                                            </td>
                                        </tr>
                            }.bind(this))}
                        </tbody>}
                    </table>
                    {(this.state.source.length == 0 && !this.state.loading) && <div className="info_data">暂无问题</div>}
                    <div className="grid_page_box">
                        <PageBox onChange={this.page} pagination={this.state.pagination} nowPage={this.state.page} />
                    </div>
                    <LaunchBox type="notify" className="launch_notify" />
               </div>
    }
});