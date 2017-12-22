module.exports = React.createClass({
	render: function() {
		return <div className="progress_box">
					{this.props.source.map(function(item, index) {
						return  <div className={item.selected ? 'selected' : ''} style={{width: 1 / (this.props.source.length - 1) * 100 + '%'}} key={index}>
										<span>{item.text}</span>
								</div>
					}.bind(this))}
				</div>;
	}
});