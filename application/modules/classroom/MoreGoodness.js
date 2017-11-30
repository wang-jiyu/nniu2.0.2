var ClassRoomHandle = require('../../handle/classroom/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({
    update: function(flag) {
      this.state.source = [];
      this.state.page = 1;
      this.init(flag);
    },

    openCourse: function(item) {
        if(item.advisor && item.advisor._id == Config.CACHE_DATA.USER._id) {
            return this.props.openCourse && this.props.openCourse(item, 'backmore', null);
        }
        this.props.openCourse && this.props.openCourse(item, 'intro', null);
    },

    getState: function(state) {
        switch (state) {
            case 1:
                return '待运行';
            case 2:
                return '运行中';
            case 3:
                return '已结束';
            case 4:
                return '停售';
        }
    },

    getList: function () {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.update.bind(this, true)} code={this.state.code} />;
        return <div className="class_list">
            <ul>
                {
                    this.state.source.map(function(item, index) {
                        return (
                            <li key={item._id} onClick={this.openCourse.bind(this, item)}>
                                <a href="javascript:;" >
                                    <div className="pic">
                                        {item.cover_url ? <img src={item.cover_url} title={item.title} alt={item.title} /> : null}
                                    </div>
                                    <div className="about">
                                        <p className="name clearfix">
                                            主讲老师：{item.advisor.name}
                                            <div className="right">{this.getState(item.state)}</div>
                                        </p>
                                        <p>
                                            职业编号：{item.advisor.qcer}</p>
                                        <p className="opt">
                                            <span className="buy">{item.buy_count}人购买</span>
                                            <span className="cost">￥{item.price}元／<em>期</em></span>
                                        </p>
                                    </div>
                                </a>
                            </li>
                        );
                    }.bind(this))
                }

            </ul>
        </div>
    },

    load: function(flag, callback) {
        if (flag) this.setState({loading: true});
        var params = {limit: 9, page: this.state.page};
        ClassRoomHandle.getGoodnessCourseList(params, function(result) {
            if (result.code == 200) {
                if (result.data.length < params.limit) this.state.scroll = false;
                result.data = this.state.source.concat(result.data);
                return this.setState({source: result.data, loading: false, code: null, page: ++this.state.page}, function() {
                    if (typeof callback == 'function') callback();
                }.bind(this));
            }
            this.setState({loading: false, code: result.code}, function() {
                this.state.scroll = true;
                if (typeof callback == 'function') callback();
            }.bind(this));
        }.bind(this));
    },

    scroll: function() {
        if (!this.state.scroll) return;
        if (Utils.isScrollBottom($(this.refs.list)[0], 10)) {
            this.state.scroll = false;
            this.load(false);
        }
    },

    init: function(flag) {
        this.state.scroll = true;
        this.load(flag, function() {
            $(this.refs.list).on('scroll', this.scroll);
        }.bind(this));
    },

    componentDidMount: function() {
        this.init(false);
    },

    getInitialState: function() {
        return {source: [], code: null, loading: true, page: 1}
    },

    render: function() {

        return (
            <div className="classroom_index_box more_goodness">
                <div className="classroom_back classroom_wrapper">
                    <h3>精品课堂</h3>
                    <a className="classroom_update" onClick={this.update.bind(this, true)} href="javascript:;">刷新</a>
                    <a href="javascript:;" onClick={this.props.openCourse.bind(null, null, 'main')}>返回</a>
                </div>
                <div className="classroom_index_good classroom_index_class classroom_wrapper"  ref="list">
                    {this.getList()}
                </div>

            </div>
        );
    }
});