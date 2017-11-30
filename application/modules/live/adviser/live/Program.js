module.exports = React.createClass({
	getProgramList: function() {
		var now = parseInt(Utils.formatDate(new Date, 'HHmm'));
		if (this.props.source) {
			return <ul>
						{this.props.source.map(function(item, i) {
							var className = '';
							var next = this.props.source[i + 1];
							var time = parseInt(item.hour + '' + item.minute);
							if (next) var nextTime = parseInt(this.props.source[i + 1].hour + '' + this.props.source[i + 1].minute);
							
							if (now > time && now < nextTime) className = 'selected';
							if (!next && now > time) className = 'selected';

							return <li key={i + '' + item.hour + item.minute} className={className}>
											<span className="play"></span>
											<label>{item.hour}:{item.minute}</label>
											<i>{item.text}</i>
									</li>
						}.bind(this))}
					</ul>
		}
		return <div style={{textAlign: 'center', lineHeight: '100px'}}>暂无节目单</div>
	},
	getInitialState: function() {
		return {minClass: null}
	},
	render: function() {
		return (<div className="programs_box">
					<h5>
						<label>时间</label>
						<i>节目单</i>
					</h5>
					{

						this.getProgramList()
					}
					
			</div>)
	}
})