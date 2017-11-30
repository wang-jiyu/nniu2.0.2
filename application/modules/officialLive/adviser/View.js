var OpinionHandle = require('../../../handle/live/Opinion');

module.exports = React.createClass({
	gotoMore: function(id) {
		var array = ['opinions'];
		if (typeof(id) == 'string') {
			array.push('article');
			array.push(id);
		}
		Event.trigger('GotoModule', array);
	},
	componentDidMount: function() {
		var id = Config.CACHE_DATA.ROOM.advisor._id;
		var params = {limit: 3, page: 1};
		OpinionHandle.getOpinionList(id, params, function(result) {
			if (result.code == 200) {
				this.setState({source: result.data.rows.splice(0, 3), loading: false});
			}
		}.bind(this));
	},
	getInitialState: function() {
		return {loading: true, source: []}
	},
	render: function() {
		if (this.state.loading || this.state.source.length == 0) return null;
		return <div className="view">
					<h4>
						<label>观点</label>
						<a href="javascript:" onClick={this.gotoMore}>更多 &gt;&gt;</a>
					</h4>
					 <ul>
					{this.state.source.map(function(item, i) {
						return <li key={item._id}>
									<a href="javascript:" onClick={this.gotoMore.bind(this, item._id)}>{item.title}</a>
									<label>{Utils.formatDate(item.create_time, 'MM-DD')}</label>
								</li>
					}.bind(this))}
					</ul>
				</div>;							
}});