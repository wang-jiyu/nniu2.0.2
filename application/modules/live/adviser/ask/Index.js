var QuestionList = require('./QuestionList');
var Advertisement = require('./Advertisement');
module.exports = React.createClass({
    render: function() {
        return (
            <div className="ask_box clearfix">
                <QuestionList />
                <Advertisement />
            </div>
        );
    }
});
