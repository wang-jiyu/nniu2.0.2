var ClassRoomHandle = require('../../handle/classroom/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');


module.exports = React.createClass({

    openCourse: function(item) {
        this.props.openCourse && this.props.openCourse(item, 'intro');
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
                return '已停售';
        }
    },

    load: function(flag) {
        if (flag) this.setState({loading: true});
        ClassRoomHandle.getGoodnessCourseList({limit: 6}, function(result) {
            if (result.code == 200) {
                return this.setState({source: result.data, loading: false, code: null});
            }
            this.setState({loading: false, code: result.code});
        }.bind(this));
    },

    componentDidMount: function() {
        this.load(false);
    },

    getInitialState: function() {
        return {source: [], code: null, loading: true}
    },

    render: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load.bind(this, true)} code={this.state.code} />;
        return (
            <div className="classroom_index_good classroom_index_class classroom_wrapper">
                <div className="class_name">
                    <h3>精品课程</h3>
                    <a href="javascript:;" onClick={this.props.openCourse.bind(this, null, 'moregood')}>查看更多</a>
                </div>
                <div className="class_list">
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

            </div>
        );
    }
});