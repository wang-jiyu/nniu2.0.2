module.exports = React.createClass({
	render: function() {
        var text = this.props.text || '';
        return <div className="submit_success" style={this.props.style}>
                    <i></i>
                    <h3>{text}</h3>
               </div>;
    }
});