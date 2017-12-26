var JewelHandle = require('../../handle/jewel/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({

    goTo: function (item) {
        var url = this.props.type == 1 ?
            '/live.html?adviser=' + item.advisor._id + '&tactics=' + item._id
            : '/live.html?adviser=' + item.advisor._id + '&report=' + item._id;
        Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, url);
    },

    load: function (flag, callback) {
        this.state.scroll = false;
        if (flag) this.state.loading = true;
        var params = this.state.pointer == 0 ? {type: this.props.type, limit: 9, page: this.state.page} : {type: this.props.type, limit: 10, page: this.state.page, run_status: this.state.pointer};
        JewelHandle.getList(params, function (result) {
            if (result.code == 200) {
                if (result.data.length == 0) {
                    this.state.scroll = false;
                    return this.setState({loading: false, code: null});
                }
                data = this.state.source.concat(result.data.rows);
                return this.setState({loading: false, code: null, source: data, page: this.state.page + 1}, function() {
                    this.state.scroll = true;
                    if (typeof callback == 'function') callback();
                }.bind(this));
            }
            return this.setState({loading: false, code: result.code}, function() {
                this.state.scroll = true;
                if (typeof callback == 'function') callback();
            }.bind(this));
        }.bind(this));
    },

    getState: function(state) {
        switch (state) {
            case 1:
                return {
                	text:'预售中',
                	color: '#FF423D'
                };
            case 2:
                return {
                	text: '运行中',
                	color: '#FF6600'
                };
            case 3:
                return {
                	text: '已停售',
                	color: '#F59D00'
                };
            case 4:
                return {
                	text: '已结束',
                	color: '#888888'
                };
            default:
                return null;
        }
    },

    getList: function () {
        if (this.state.loading) return <div className="error_tips"><Loading /></div>;
        if (this.state.code) return <div className="error_tips"><Reload onReload={this.load.bind(this, true)} code={this.state.code}/></div>;
        return (
            <ul>
                {
                    this.state.source.map(function(item, index){
                        return (
                            <li>
                                <div className="item-header">
                                    <img src={item.advisor.avatar} />
                                    <span>{item.advisor.name}</span>
                                    <div className="state" style={{color: this.getState(item.state_v2).color}}>{this.getState(item.state_v2).text}</div>
                                </div>
                                <h3>{item.title}</h3>
                                <div className="item-content">{item.specialty}</div>
                                <div className="item-footer">
                                    <div className="price">
                                        <span>订阅价</span>
                                        <p>{item.price + "元/" + Math.ceil((item.end_time - item.begin_time) / 3600 /24) + "天"}</p>
                                    </div>
                                    <div className="details-button" onClick={this.goTo.bind(this, item)}>查看详情</div>
                                </div>
                            </li>
                        );
                    }.bind(this))
                }

            </ul>
        );
    },

    changePointer: function(index) {
        $(this.refs.list).off('scroll', this.scroll);
        this.state.scroll = true;
        this.setState({pointer: index, page: 1, source: []}, function() {
            $(this.refs.list).on('scroll', this.scroll);
            this.load(true);
        }.bind(this));
    },

    scroll: function() {
        if (!this.state.scroll) return;
        if (Utils.isScrollBottom($(this.refs.list)[0], 10)) {
            this.state.scroll = false;
            this.load(true);
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

    
    componentWillMount: function() {
        $(this.refs.list).off('scroll', this.scroll);
    },    

    getInitialState: function () {
        return {source: [], loading: true, code: null, page: 1, pointer: 0}
    },

    render: function () {
        var array = this.props.type == 1 ?
            ['全部锦囊', '预售中', '运行中', '已停售' , '已结束'] :
            ['全部内参', '预售中', '运行中', '已停售', '已结束'];
        return (
            <div className="jewelmore-left">
                <ul className="jewelmore-nav">
                    {
                        array.map(function(item, index) {
                            return <li className={this.state.pointer == index ? 'active' : null} onClick={this.changePointer.bind(this, index)}>{item}</li>;
                        }.bind(this))
                    }
                </ul>
                <div className="tips_list" ref="list">{this.getList()}</div>
            </div>
        )
    }
});

