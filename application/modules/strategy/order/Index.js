var ReactDOM = require('react-dom');
var OrderSuccess = require('./OrderSuccess');
var Subscription = require('./Subscription');
var Main = React.createClass({
	clickOrder: function() {
		this.setState({
			hasBuy: true
		});
	},
	getInitialState: function() {
		return {
			loading: true,
			orderState: 'no', // no 未定购  success 成功  error 失败
			data: null,
			hasBuy: false
		}
	},
	render: function() {
		return !this.state.hasBuy ? <Subscription onClick={this.clickOrder} /> : <OrderSuccess />
	}
})
ReactDOM.render(<Main />, document.getElementById('main_wrap'));