module.exports = React.createClass({
	getInitialState: function() {
		return {};
	},
	render: function() {
		var props = $.extend(true, {}, this.props);
		var className = props.className;
		var children = props.children;
		delete props.className;		
		delete props.children;
		return <label className="checkbox">
					<input type="checkbox" {...props} />
					<span>{children}</span>
				 </label>;
	}
});