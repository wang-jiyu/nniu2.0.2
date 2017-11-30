var ReactDOM = require('react-dom');
var PracticalLessons = require('./PracticalLessons');
var SystemClass = require('./systemClass');
module.exports = React.createClass({
	render: function() {
		return (
			<section className="allCourses clearfix">
				<PracticalLessons combatData={this.props.combatData}/>
				<SystemClass />
			</section>
		)
	}
})