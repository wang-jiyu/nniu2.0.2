var ReactDOM = require('react-dom');
var PostionUser = require('../../components/TopPostionUser');
var UnitCard = require('../../components/UnitCard');
// var Curve = require('../../components/Curve');
var NoSubscriptionState = require('../../components/NoSubscriptionState');
var DatailsTab = require('../../components/DatailsTab');
var Main = React.createClass({
	render: function() {
		return (<div>
				<PostionUser />
				<DatailsTab />
			</div>)
	}
})
ReactDOM.render(<Main />, document.getElementById('main_wrap'))