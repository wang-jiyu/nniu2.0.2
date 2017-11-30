require('../../../components/CommonEvent');
var AutoSignin = require('../../../components/AutoSignin');
var ReactDOM = require('react-dom');
var IndexHead = require('../components/IndexHead');
var MyYesSubscribeStrategyContent = require('../components/MyYesSubscribeStrategyContent.js');
var MyYesSubscribeStrategyDesc = require('../components/MyYesSubscribeStrategyDesc.js');
var StrategyListData = require('../../../handle/strategy/Index');
var NoSubscribeData = require('../components/MyNoSubscribeState');
// var FireRecommendation = require('../components/FireRecommendation');
var IndexAD = require('../components/IndexAD');
var Main = React.createClass({
	getStrategtylist: function(sort, size, obj, fun) {
		var sort = sort || 1
			// console.log(sort)
		var data = {
			sort: sort
		}
		if (size) {
			data.size = size;
		}
		StrategyListData.getStrategylist(data, function(result) {
			result = JSON.parse(result);
			if (result.code == 200) {
				if (fun) {
					fun(result.data);
				}
			}
		}.bind(this));
	},
	getSubscribeData: function(access_token) {
		this.setState({
			loading: true
		});
		var data = {
			access_token: access_token
		}
		StrategyListData.getAlreadySubscibeList(data, function(result) {
			// result = JSON.parse(result);
			if (result.code == 200) {
				this.setState({
					data: result.data,
					loading: false
				});
			}
		}.bind(this));
	},
	componentWillMount: function() {
		AutoSignin(function(result) {
			if (result.code == 200) {
				return Interface.getProfile(function() {
					console.log(Config);
					var access_token = Config.ACCESS_TOKEN;
					this.getSubscribeData(access_token);
				}.bind(this))
			}
		}.bind(this));
	},
	componentDidMount: function() {

	},
	getInitialState: function() {
		return {
			data: [],
			loading: true
		}
	},
	render: function() {
		var temp = this.state.data.length ? <MyYesSubscribeStrategyDesc /> : <div><IndexAD listApi={this.getStrategtylist} /></div>;
		return (
			<div className="quantization-main w">
                <IndexHead postion="我的" />

                <MyYesSubscribeStrategyContent hasLoading={this.state.loading} data={this.state.data} title="我的订阅" />
		<div><IndexAD listApi={this.getStrategtylist} /></div>
            </div>
		)
	}
})
ReactDOM.render(<Main />, document.getElementById('main_wrap'))
