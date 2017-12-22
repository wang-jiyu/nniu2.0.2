var MessageEditor = require('../editor/Message');
var OpinionHandle = require('../../handle/live/Opinion');
var MessageHandle = require('../../handle/messages/Index');

module.exports = React.createClass({
	// 发送消息
	sendMessage: function(message) {
		var _message = MessageHandle.formatToServer(message);
		if ($.trim(_message) == '') return null;
		this.toMessage({content: _message});
	},
	toMessage: function(param) {
		Forms.disableButton(this.refs.button);
		OpinionHandle.commentCreate(param, this.props.source._id, function(result) {
			if (result.code == 200) {
				this.state.source.push(result.data);
				typeof(this.props.onCommon) == 'function' && this.props.onCommon(result.data, this.state.source);
				this.setState({source: this.state.source});
			}
			Forms.activeButton(this.refs.button);
		}.bind(this));
	},
	load: function() {
		var params = {limit: 20, latest_stamp: ''};
		if (this.state.lastData) params.latest_stamp = this.state.lastData._id;
		this.state.lastData = null;

		OpinionHandle.commentList(params, this.props.source._id, function(result) {
			if (result.code == 200) {
				var _data = result.data;
				if (_data.length >= 20) this.state.lastData = _data.pop();
				this.state.source.push.apply(this.state.source, _data);

				this.setState({source: this.state.source, loading: false})
			}
		}.bind(this))
	},
	componentDidMount: function() {
		this.load()
	},

	getInitialState: function() {
		return {source: [], loading: true}
	},
	render: function() {
		if (this.state.loading) return false;
		ArrayCollection.sort.call(this.state.source, 'create_time');
		return (<div className="comment_box">
						{this.state.source.length == 0 && <div className="not_comment">暂无评论</div>}
						{this.state.lastData ? <div className="more" onClick={this.load}><span>读取更多评论</span></div> : null}
			            <ul className="comment_list">
							{this.state.source.map(function(item) {
								return <li  className={item.member_id ? 'other' : ''} key={item._id}>
											<div className="avatar">
												<img src={item.from.avatar} />
											</div>
											<div className="item_main">
												<div className="info">
													<label>{item.from.name}</label>
													<i className="time">{Utils.showDate(item.create_time, true)}</i>
												</div>
												<div className="message">
													<p dangerouslySetInnerHTML={{__html: MessageHandle.formatToClient(item.comment)}}></p>
												</div>
											</div>
										</li>
							})}
			            </ul>
			            <div className="comment_submit clearfix">
			                <div className="avatar">
			                    <img src={Config.CACHE_DATA.USER.avatar} />
			                </div>
			                <div className="editor">
								<div>
									<MessageEditor
											onSubmit={this.sendMessage}
											ctrlKey={true}
											maxLength={this.props.maxLength}
											placeholder={this.props.placeholder ? this.props.placeholder : '按(Ctrl+Enter)发送消息'}

											link={true}
											ref="editor" />
								</div>
			                </div>
			            </div>
			        </div>)
	}
})
