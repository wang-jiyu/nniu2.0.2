var Signup = require('./Signup');
var CheckMobile = require ('./CheckMobile');
var Success = require('./Success');

module.exports = React.createClass({

	next: function(data) {
        data = $.extend(this.state.source, data);
		this.setState({step: ++this.state.step, source: data});
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return this.state != nextState;
	},

	getInitialState: function() {
        var data = {mobile: '', password: null};
		return {step: 1, source: data};
	},

	render: function() {
		switch (this.state.step) {
			case 2: return <CheckMobile source={this.state.source} next={this.next} />;
			case 3: return <Success source={this.state.source} />;
			default: return <Signup source={this.state.source} next={this.next} />;
		}
	}
});