var ClassRoomHandle = require('../../handle/classroom/Index');
var Video = require('../../components/common/Video');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({

    load: function(flag) {
        if (flag) this.setState({loading: true});
        ClassRoomHandle.getGoodnessCharterList({id: this.props.item._id, type: 1}, function(result) {
            if (result.code == 200) {
                if (result.data.length > 0 && this.props.backItem) this.props.backItem(result.data[0]);
                return this.setState({source: result.data, loading: false, code: null});
            }
            this.setState({loading: false, code: result.code});
        }.bind(this));
    },

    getClass: function(item){
        if (item.video_url) {
            if (this.props.play._id == item._id) return 'play';
            return null;
        }
        switch (item.live_status) {
            case 0:
                return 'no-start';
            case 1:
                return 'live';
            case 2:
                return 'ended';
            default:
                return null;
        }
    },

    getText: function(item) {
        if (item.video_url)  return '更新时间';
        return '直播时间';
    },

    getTime: function(item) {
        var hh = parseInt(item.live_time / 3600);
        var mm = parseInt((item.live_time - 3600 * hh) / 60);
        hh = hh < 10 ? '0' + hh : hh;
        mm = mm < 10 ? '0' + mm : mm;
        if (item.video_url)  return Utils.formatDate(item.update_time, 'YYYY-MM-DD/hh:mm');
        if (item.live_duration || item.live_duration == 0) {
            return hh + ':' + mm +'（' + item.live_duration  + '分钟）';
        } else {
            return hh + ':' + mm;
        }
    },

    getNumber: function (item) {
        if (item.video_url) return '播放次数：' + item.play_count + '人';
        return '在线人数：' + item.online_count + '人';
    },

    loadProps: function(props) {
        this.state.play = props.play || {};
    },

    componentWillMount: function() {
        this.loadProps(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        this.loadProps(nextProps);
    },

    componentDidMount: function() {
        this.load(false);
    },

    getInitialState: function() {
        return {source:[], loading: true, code: null};
    },

    render: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load.bind(this, true)} code={this.state.code} />;
        return (
            <ul>
                {
                    this.state.source.map(function(item, idex) {
                        return (
                            <li key={'system' + item._id} className={this.getClass(item)} onClick={this.props.onSelect.bind(null, item)}>
                                <a href="javascript:;" className="pic">
                                    <img src={item.cover_url ? item.cover_url + '?x-oss-process=image/resize,m_mfit,h_150,w_150' : "../assets/images/class.png"} alt="" width="150" height="90" />
                                    <div className="pic_layer"></div>
                                </a>
                                <div className="info">
                                    <a href="javascript:;">{item.title}</a>
                                    <p>{this.getText(item)}：{this.getTime(item)}</p>
                                    <p>{this.getNumber(item)}</p>
                                </div>
                            </li>
                        )
                    }.bind(this))
                }
            </ul>
        );
    }
});