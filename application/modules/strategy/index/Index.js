require('../../../components/CommonEvent');
var AutoSignin = require('../../../components/AutoSignin');
var ReactDOM = require('react-dom');
var IndexHead = require('../components/IndexHead');
var ProDcuctList = require('../components/ProductList');
var IndexAD = require('../components/IndexAD');
var IndexProblem = require('../components/IndexProblem');
var StrategyListData = require('../../../handle/strategy/Index');
var Loading = require('../../../components/common/Loading');
var tabNameArray = [{
	id: 1,
	param: 'profit_year',
	name: '年化收益率'
}, {
	id: 6,
	param: 'success',
	name: '成功率'
}, {
	id: 7,
	param: 'backset',
	name: '最大回撤'
}, {
	id: 5,
	param: 'position',
	name: '股票数'
}, {
	id: 4,
	param: 'profit_yesterday',
	name: '昨日收益率'
}, {
	id: 3,
	param: 'profit_week',
	name: '周收益率'
}, {
	id: 2,
	param: 'profit_month',
	name: '月收益率'
}, {
	id: 0,
	param: 'profit_total',
	name: '总收益率'
}]
var Main = React.createClass({
	getStrategtylist: function(sort, size, objFocus, fun) {
		this.setState({
			loading: true
		});
		var sort = sort || sort != undefined || sprt != null ? sort : 1
			// console.log(sort)
		var data = {
			sort: sort
		}
		if (size) {
			data.size = size;
		}
		objFocus = objFocus || {}
		StrategyListData.getStrategylist(data, function(result) {
			result = JSON.parse(result);
			if (result.code == 200) {
				if (data.size == 6) {
					this.setState({
						loading: false
					});
					if (objFocus) {
						this.setState({
							focusPostion: objFocus
						})
					}
				}
				this.setState({
					data: result.data
				});
				if (fun) {
					fun(result.data);
				}
			}
		}.bind(this));
	},
	componentDidMount: function() {
		// this.getStrategtylist();
		AutoSignin(function(result) {
			if (result.code == 200) {
				return Interface.getProfile(function() {
					this.setState({
						access_token: Config.ACCESS_TOKEN
					});
				}.bind(this))
			}
		}.bind(this));
	},
	componentWillMount: function() {},
	getInitialState: function() {
		return {
			access_token: '',
			data: [],
			loading: true,
			focusPostion: {}
		}
	},
	render: function() {
		return (
			<div className="quantization-main w">
				<IndexHead />
				<div className="quantization-content w">
					<ProDcuctList focusPostion={this.state.focusPostion} tabName={tabNameArray} listApi={this.getStrategtylist}  access_token={this.state.access_token} loading={this.state.loading} />
					<div  className="problem">
						<IndexProblem />
						<div className="mtop20">
							<IndexAD listApi={this.getStrategtylist} />
						</div>
					</div>
				</div>
			</div>
		)
	}
})
ReactDOM.render(<Main />, document.getElementById('main_wrap'))