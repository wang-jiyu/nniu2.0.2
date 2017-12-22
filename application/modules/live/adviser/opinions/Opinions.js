var LiveHandle = require('../../../../handle/live/Index');
var OpinionHandle = require('../../../../handle/live/Opinion');
var MessagesHandle = require('../../../../handle/messages/Index');
var OpinionInfo = require('./OpinionInfo');
var CreateOpinion = require('./CreateOpinion');
var EditorOpinion = require('./EditorOpinion');
var PageBox = require('../../../../components/common/PageBox');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');
module.exports = React.createClass({
    close: function() {
        Event.trigger('FreshModule', 'close');
    },
    page: function(result) {
        this.load(result);
    },
    openModule: function(type, result) {
        switch (type) {
            case 'createOpinion':
                Event.trigger('FreshModule', {module: <CreateOpinion onClose={this.close} />, title: <div className="opinions_live_header"><h3>{LiveHandle.getAppellation()}的观点</h3><span><span>{this.state.total}</span>篇</span></div>});
                break;
            case 'opinionInfo':
                var data = ArrayCollection.getItem.call(this.state.source, result._id, '_id');
                if (data) data.reads++;
                Event.trigger('FreshModule', {module: <OpinionInfo id={result._id} onChange={this.opinionChange} />, title: <div className="opinions_live_header"><h3>{LiveHandle.getAppellation()}的观点</h3><span><span>{this.state.total}</span>篇</span></div>});
                break;
            case 'editor':
                Event.trigger('FreshModule', {module: <EditorOpinion data={result} onClose={this.close} onChange={this.editorOpinion} />, title: <div className="opinions_live_header"><h3>{LiveHandle.getAppellation()}的观点</h3><span><span>{this.state.total}</span>篇</span></div>});
                break;
        }
    },
    title: function() {
        return  <div>
			<h3>{LiveHandle.getAppellation()}的观点</h3>
			<span><span>{this.state.total}</span> 篇</span>
		</div>;
    },
    editorOpinion: function(data) {
        $.extend(ArrayCollection.getItem.call(this.state.source, data._id, '_id'), data);
        this.setState({source: this.state.source});
    },
    // 增加观点
    addOpinion: function(result) {
        this.state.source.unshift(result);
        this.state.total++;
        this.setState({source: this.state.source, total: this.state.total});
    },
    // 删除观点
    deleteOpinion: function(data) {
        Event.trigger('OpenAlert', {
            title: '删除观点',
            message: '确认要删除当前观点吗？',
            button: Config.MESSAGE_BUTTON.DELETE,
            event: function() {
                OpinionHandle.deteleOpinion(data._id, function(result) {
                    if (result.code == 200) {
                        ArrayCollection.removeItem.call(this.state.source, data._id, '_id');
                        this.state.total--;
                        this.setState({source: this.state.source, total: this.state.total});
                    }
                }.bind(this))
            }.bind(this)
        });
    },
    // 点赞
    praise: function(item, e) {
        var obj = $(e.target);
        if (obj.attr('disabled')) return false;
        obj.attr('disabled', true);
        if (item.is_praise == 0) {
            OpinionHandle.praiseOpinion(item._id, function(result) {
                if (result.code == 200) {
                    var data = ArrayCollection.getItem.call(this.state.source, item._id, '_id');
                    data.is_praise = 1;
                    data.praise += 1;
                    this.setState({source: this.state.source});
                }
                obj.attr('disabled', false);
            }.bind(this));
        } else {
            OpinionHandle.cancelPraise(item._id, function(result) {
                if (result.code == 200) {
                    var data = ArrayCollection.getItem.call(this.state.source, item._id, '_id');
                    data.is_praise = 0;
                    data.praise -= 1;
                    this.setState({source: this.state.source});
                }
                obj.attr('disabled', false);
            }.bind(this));
        }
    },
    opinionChange: function(data) {
        if (this.isMounted()) {
            var _data = ArrayCollection.getItem.call(this.state.source, data._id, '_id');
            $.extend(_data, data);
            this.setState({source: this.state.source});
        }
    },
    load: function(param) {
        this.setState({loading: true});
        var id = Config.CACHE_DATA.ROOM.advisor._id;
        var params = $.extend({limit: 5, page: 1}, param);
        OpinionHandle.getOpinionList(id, params, function(result) {
            if (result.code == 200 && this.isMounted()) {
                return this.setState({code: null, source: result.data.rows, loading: false, pagination: result.data.pagination, nowPage: params.page, total: result.data.total_opinions});
            }
            return this.setState({code: result.code, loading: false});
        }.bind(this));
    },

    getList: function() {
        if (this.state.loading) return <div style={{position: 'relative', minHeight: '300px'}}><Loading /></div>;
        if (this.state.code) return <div style={{position: 'relative', minHeight: '300px'}}><Reload onReload={this.load.bind(this, {})} code={this.state.code} /></div>;
        if (this.state.source.length == 0)
            return (<div className="live_no_data">
				<i>&#xe87d;</i>
				<p>暂无观点</p>
			</div>);

        return <ul className="opinions_live_list">
            {this.state.source.map(function(item) {
                return <li key={item._id}>
					<a href="javascript:;" onClick={this.openModule.bind(this, 'opinionInfo', item)} className="title">{item.title}</a>
					<p dangerouslySetInnerHTML={{__html: MessagesHandle.formatToClient(item.intro)}}></p>
					<div className="bottom">
						<div>
							<time>{Utils.showDate(item.create_time, 'HH:mm')}</time>
							<span>{item.reads}次阅读</span>
						</div>
						<ul className="lit_share">
							<li onClick={this.praise.bind(this, item)} className={item.is_praise == 1 ? 'is_praise' : null}>{item.praise}</li>
							<li className="comment" onClick={this.openModule.bind(this, 'opinionInfo', item)}>{item.comments}</li>
						</ul>
					</div>
                    {LiveHandle.isRoomOwner() ?
						<ul className="opinions_operate">
							<li><a href="javascript:;" onClick={this.openModule.bind(this, 'editor', item)}>编辑</a></li>
							<li><a href="javascript:;" onClick={this.deleteOpinion.bind(this, item)}>删除</a></li>
						</ul>
                        : null}
				</li>
            }.bind(this))}
		</ul>;
    },

    componentDidMount: function() {
        Event.on('AddOpinion', this.addOpinion);
        Event.on('EditorOpinion', this.editorOpinion);
        this.load({});
    },
    componentWillUnmount: function() {
        Event.off('AddOpinion', this.addOpinion);
        Event.off('EditorOpinion', this.editorOpinion);
    },
    getInitialState: function() {
        return {source: [], loading: true, code: null}
    },
    render: function() {
        return <div className="opinions_live_box">
			<div className="opinions_live_header">
				<h3>{LiveHandle.getAppellation()}的观点</h3>
				<span><span>{this.state.total}</span> 篇</span>
			</div>
			<div className="opinions_live_content">
                {LiveHandle.isRoomOwner() ?
					<input type="button" className="dark_blue" value="创建新观点" onClick={this.openModule.bind(this, 'createOpinion')} />
                    : null}
                {this.getList()}
				<div className="grid_page_box">
					<PageBox onChange={this.page} pagination={this.state.pagination} nowPage={this.state.nowPage} />
				</div>
			</div>
		</div>;
    }
});
