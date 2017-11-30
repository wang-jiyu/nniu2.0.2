var EvaluateTest =  require('./EvaluateTest');
var EvaluateResult = require('./EvaluateResult');

module.exports = React.createClass({
    changeStep: function (step) {
        this.setState({step: step});
    },
    load: function() {
		this.setState({loading: false, step: Config.CACHE_DATA.USER.risk_score == 0});
    },
	componentDidMount: function() {
		Interface.getProfile(this.load)
	},
	getInitialState: function() {
		return {loading: true, step: true};
	},

	render: function() {
    	if (this.state.loading) return null;
		return <div className="evaluate_content_box">
					{
						this.state.step ?
                            <EvaluateTest onChangeStep={this.changeStep} /> :
							<EvaluateResult onChangeStep={this.changeStep} />
					}
				</div>;
	}
});
