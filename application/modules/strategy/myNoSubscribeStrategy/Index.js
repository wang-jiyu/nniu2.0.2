var ReactDOM = require('react-dom');
var IndexHead = require('../components/IndexHead');
var FireRecommendation = require('../components/FireRecommendation');
var MyNoSubscribeState = require('../components/MyNoSubscribeState');

var Main = React.createClass({
    render: function () {
        return (
                <div className="quantization-main w">
                    <IndexHead />
                    <div className="con w">
                        <MyNoSubscribeState />
                        <FireRecommendation />
                    </div>
                </div>
        )
    }
})
ReactDOM.render(<Main />, document.getElementById('main_wrap'))