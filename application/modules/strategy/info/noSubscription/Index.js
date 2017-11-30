require('../../../../components/CommonEvent');
var AutoSignin = require('../../../../components/AutoSignin');
var ReactDOM = require('react-dom');
var PostionUser = require('../../components/TopPostionUser');
var UnitCard = require('../../components/UnitCard');
var Curve = require('../../components/Curve');
var NoSubscriptionState = require('../../components/NoSubscriptionState');
var HistoryDeal = require('../../components/HistoryDeal');
var DatailsTab = require('../../components/DatailsTab');
var StrategyListData = require('../../../../handle/strategy/Index');
var Loading = require('../../../../components/common/Loading');
var Main = React.createClass({
	getStrategtylist: function(_id) {
		var data = {
			_id: _id
		}
		StrategyListData.getStrategyInfo(data, function(result) {
			result = JSON.parse(result);
			if (result.code == 200) {
				// this.state.data = result.data
				this.setState({
					data: result.data
				});
			}
		}.bind(this));
	},
	getStrategtyCurve: function(type) {
		var _id = Url.getParam("_id");
		var type = type || 0;
		var data = {
			_id: _id,
			type: type
		}
		StrategyListData.getStrategyCurve(data, function(result) {
			result = JSON.parse(result);
			if (result.code == 200) {
				// this.state.data = result.data
				this.setState({
					curveData: result.data
				});
				// console.log(this.state.curveData);
			}
		}.bind(this));
	},
	openModule: function() {
		this.setState({
			saleStatus: true
		});
	},
	getInitialState: function() {
		return {
			loading: true,
			saleStatus: false,
			data: [],
			curveData: [],
			ref_id: '',
			loading: true,
			price: null,
			time: null
		}
	},
	componentWillMount: function() {
		var _id = Url.getParam("_id");
		AutoSignin(function(result) {
			if (result.code == 200) {
				return Interface.getProfile(function() {
					var access_token = Config.ACCESS_TOKEN;
					var info = {
						_id: _id,
						access_token: access_token
					}
					StrategyListData.getStrategyHasPay(info, function(result) {
						console.log(result);
						if (result.code == 200) {
							var time = parseInt((result.data.end_time - result.data.begin_time) / (24 * 36000)) + 1;
							this.setState({
								saleStatus: result.data.is_pay,
								ref_id: result.data.ref_id,
								loading: false,
								price: result.data.price,
								time: time
							});
						}
					}.bind(this))
				}.bind(this));

			}
		}.bind(this));

		this.getStrategtylist(_id)
		this.getStrategtyCurve()
	},
	componentDidMount: function() {
		var _id = Url.getParam("_id");
		var access_token = Url.getParam("access_token");
		/*var info = {
			_id:_id,
			access_token:access_token
		}
		StrategyListData.getStrategyHasPay(info,function(result){
			if(result.code==200){
				console.log('success');
			}
		})*/
		this.getStrategtylist(_id)
		this.getStrategtyCurve()
	},
	render: function() {
		// var test = Config.TOOL.getFirstAndLastMonthDay(2017,2);
		// console.log(typeof Config.TOOL.getSplitString(test.lastdate,'-','int'));
		var temp = this.state.loading ? <div style={{'width':'100%','text-align':'center','margin-top':'20'}}><Loading /></div> : this.state.saleStatus ? <DatailsTab /> : <div> <NoSubscriptionState ref_id={this.state.ref_id} price ={this.state.price} time={this.state.time}/> <HistoryDeal /> </div>
			// var noSale = <div> <PostionUser postion="策略详情页" /> <UnitCard data={this.state.data}/> <Curve curveData={this.state.curveData} curveApi={this.getStrategtyCurve} /> <NoSubscriptionState ref_id={this.state.ref_id}/> <HistoryDeal /> </div>
			// var yesSale = <div> <PostionUser /> <UnitCard  data={this.state.data}/> <Curve curveData={this.state.curveData} curveApi={this.getStrategtyCurve} /> <DatailsTab /></div>
			// var infoPage = this.state.saleStatus ? yesSale : noSale
		return <div> <PostionUser postion="策略详情页" /> <UnitCard data={this.state.data}/> <Curve curveData={this.state.curveData} curveApi={this.getStrategtyCurve} /> {temp} </div>
	}
})
ReactDOM.render(<Main />, document.getElementById('main_wrap'))