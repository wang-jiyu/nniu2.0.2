var ClassRoomHandle = require('../../handle/classroom/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({

    openCourse: function(item, type, index) {
        this.props.openCourse && this.props.openCourse(item, type, index);
    },

    load: function(flag) {
       if (flag) this.setState({loading: true});
        ClassRoomHandle.getFreeCourseList({limit: 3}, function(result) {
            if (result.code == 200) {
                return this.setState({source: result.data.slice(0, 3), loading: false, code: null});
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
            <div className="classroom_index_public classroom_index_class classroom_wrapper">
                <div className="class_name">
                    <h3>公开课程</h3>
                    <a href="javascript:;" onClick={this.openCourse.bind(this, null, 'more')}>查看更多</a>
                </div>
                <div className="class_list">
                    <ul>
                        {
                            this.state.source.map(function(item, index) {
                                return (
                                    <li key={item._id} onClick={this.openCourse.bind(this, item, 'play', index)}>
                                        <a href="javascript:;">
                                            <div className="pic">
                                                {item.cover_url ? <img src={item.cover_url} title={item.title} alt={item.title} /> : null}
                                            </div>
                                            <p className="name">
                                                {item.title}
                                            </p>
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