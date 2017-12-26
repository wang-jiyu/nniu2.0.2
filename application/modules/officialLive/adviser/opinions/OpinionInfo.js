var Comment = require('../../../../components/common/Comment');
var OpinionHandle = require('../../../../handle/live/Opinion');
var MessagesHandle = require('../../../../handle/messages/Index');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');
module.exports = React.createClass({
	praise: function(e) {
		var obj = $(e.target);
		if (obj.attr('disabled')) return false;
		obj.attr('disabled', true);
		if (this.state.data.is_praise == 0) {
			OpinionHandle.praiseOpinion(this.state.data._id, function(result) {
				if (result.code == 200) {
					this.state.data.is_praise = 1;
					this.state.data.praise += 1;
					this.setState({data: this.state.data});
				}
				obj.attr('disabled', false);
			}.bind(this));
		} else {
			OpinionHandle.cancelPraise(this.state.data._id, function(result) {
				if (result.code == 200) {
					this.state.data.is_praise = 0;
					this.state.data.praise -= 1;
					this.setState({data: this.state.data});
				}
				obj.attr('disabled', false);
			}.bind(this));
		}
	},
	comment: function(result, source) {
		this.state.data.comments = source.length;
		this.setState({data: this.state.data});
	},
	load: function() {
		this.setState({loading: true});
        OpinionHandle.getOpinion(this.props.id, function(result) {
            if (result.code == 200) return this.setState({data: result.data, loading: false, code: null});
            return this.setState({loading: false, code: result.code});
        }.bind(this));
    },
	componentDidMount: function() {
		this.load();
	},
	componentWillUnmount: function() {
        typeof(this.props.onChange) == 'function' && this.props.onChange(this.state.data);
    },
	getInitialState: function() {
		return {data: null, loading: true, code: null}
	},
	render: function() {
		if (this.state.loading) return <Loading />;
		if (this.state.code) return <Reload onReload={this.load} code={this.state.code} />;
		return  <div className="opinion_live_inform">
			        <div className="opinion_inform_general">
			        	<h2>{this.state.data.title}</h2>
			            <div>
			                <i><img src={this.state.data.advisor.avatar} width="30" height="30" /></i>
			                <a href="javascript:;">{this.state.data.advisor.name}</a>
			                <span>{Utils.formatDate(this.state.data.create_time)}</span>
			                <span>{this.state.data.reads}次阅读</span>
			            </div>
			            <ul className="lit_share">
			                <li onClick={this.praise} className={this.state.data.is_praise == 1 ? 'is_praise' : null}>{this.state.data.praise}</li>
			            </ul>
			        </div>
			        <div className="opinion_inform_content simditor">
			            <div className="simditor-body" dangerouslySetInnerHTML={{__html: this.state.data.content}}></div>
			            <p className="tips">风险提示：以上内容仅代表个人观点，不构成投资建议，股市有风险，投资需谨慎！</p>
			        </div>
			        <div className="opinion_inform_comment">
						<h2>评论</h2>
						<Comment maxLength="200" placeholder="最多输入200个字符,按(Ctrl+Enter)发送消息" source={this.state.data} onCommon={this.comment} />
			        </div>
			    </div>
	}
})