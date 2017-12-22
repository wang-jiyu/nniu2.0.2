var ClassRoomHandle = require('../../handle/classroom/Index');
var Video = require('../../components/common/Video');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({

    select: function(item) {
        this.setState({item: item});
    },

    load: function(flag) {
        if (flag) this.setState({loading: true});
        ClassRoomHandle.getFreeCourseList({}, function(result) {
            if (result.code == 200) {
                var params = this.props.item ?  {source: result.data, item: this.props.item,  loading: false, code: null} : {source: result.data, item: result.data.length > 0 ? result.data[0] : null,  loading: false, code: null};
                return this.setState(params, function() {
                    if (this.props.index && this.props.index > 0) {
                        $list = $(this.refs.list);
                        $list.scrollLeft(($list.find('li').outerWidth() + 29) * this.props.index);
                    }
                });
            }
            this.setState({loading: false, code: result.code});
        }.bind(this));
    },

    update: function () {
        this.load(true);
    },

    loadProps: function(props) {
        if (props.item) {
            this.state.item = props.item;
        }
    },

    componentDidMount: function () {
        this.load(false);
    },

    getInitialState: function() {
        return {source: [], item: null, code: null, loading: true}
    },
    render: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load.bind(this, true)} code={this.state.code} />;
        return (
            <div className="classroom_play_box">
                <div className="classroom_back classroom_wrapper">
                    <a className="classroom_update" onClick={this.update} href="javascript:;">刷新</a> <a href="javascript:;" onClick={this.props.openCourse.bind(null, null, 'main')}>返回</a>
                </div>
                <div className="classroom_play_focus classroom_wrapper">
                    <div className="classroom_video">
                        <Video key={this.state.item._id} src={this.state.item ? this.state.item.video_url : ''} />
                    </div>
                    <div className="classroom_info">
                        <h3>课程简介</h3>
                        <p>{this.state.item ? this.state.item.description : ''}</p>
                    </div>
                </div>
                <div className="classroom_play_list classroom_wrapper">
                    <ul ref="list">
                        {
                            this.state.source.map(function(item, index) {
                                return (
                                    <li key={item._id} className={this.state.item && this.state.item._id == item._id ? 'play' : null } onClick={this.select.bind(this, item)}>
                                        <a href="javascript:;" className="pic">
                                            <img src={item.cover_url ? item.cover_url + '?x-oss-process=image/resize,m_mfit,h_150,w_150' : "../assets/images/class.png"} alt="" width="150" height="90" />
                                            <div className="pic_layer"></div>
                                        </a>
                                        <div className="info">
                                            <a href="javascript:;">{item.title}</a>
                                            <p>
                                                <span>{item.advisor.name}</span>
                                                <span>{Utils.formatDate(item.update_time, 'YYYY-MM-DD')}</span>
                                            </p>
                                        </div>
                                    </li>
                                );
                            }.bind(this))
                        }

                    </ul>
                </div>

                <div className="classroom_tip classroom_wrapper">
                    <div className="classroom_tip_warn">
                        <p>股市有风险</p>
                        <p>入市需谨慎</p>
                    </div>
                    <div className="classroom_tip_state">
                        <p>投顾老师所发表言论均代表其个人对市场所持观点，网友应充分考虑市场的高风险性，据此操作风险自担。海纳智投提供此互动平台不代表认可其观点。</p>
                        <p>海纳智投所有投顾不提供代客理财或QQ咨询等非法业务。有私下进行收费咨询或推销其他产品服务，属于非法个人行为，与海纳智投无关，请各位网友务必不要上当受骗！如发现上述违规行为可向投顾客服举报。</p>
                    </div>
                </div>
            </div>
        );
    }
});