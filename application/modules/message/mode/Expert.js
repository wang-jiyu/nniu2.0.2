var MessageHandle = require('../../../handle/messages/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');

var WeekAdvisor = React.createClass({
	getWeekAdvisor: function(next) {
		this.setState({loading: true});
		MessageHandle.getWeekAdvisor({}, function(result) {
			if (result.code == 200) return this.setState({source: result.data, loading: false, code: null});
			return this.setState({loading: false, code: result.code});
		}.bind(this));
	},
	getList: function() {
		if (this.state.loading)
			return 	<div className="recom_list_box" style={{position: 'relative', height: '300px'}}>
						<Loading />
					</div>;
		if (this.state.code) return <div className="recom_list_box" style={{position: 'relative', height: '300px'}}>
											<Reload onReload={this.getWeekAdvisor} code={this.state.code} />
										</div>
		return this.state.source.map(function(item, i) {
					var tag = item.tags.length > 0 ? item.tags.split(',') : [];
					return 	<li className="recom_item" key={item._id}>
						<img src="/assets/images/header.png" className="avatar" />
						<div className="item_detail">
							<a href="javascript:;" onClick={this.props.onSelect.bind(null, item)}>{item.name}</a>
							{item.tags.length > 0 ?
								<div>
									{tag.map(function(item1, i) {
										return <label key={i}>{item1}</label>
									}.bind(this))}
								</div>
								: null}
							<p title={item.intro}>{item.intro}</p>
						</div>
					</li>
				}.bind(this));
	},
	componentDidMount: function() {
		this.getWeekAdvisor();
	},
	getInitialState: function() {
		return {loading: true, code: null, source: []}
	},
	render: function() {
		return <div className="recommend_box">
					<h4>本周推荐投顾</h4>
					<div className="recom_list_box">
						<ul className="recom_list">
							{this.getList()}
						</ul>
					</div>
				</div>
	}
});


var AdvisorList = React.createClass({
	getAdvisor: function(next) {
		if (!this.state.loading) this.setState({loading: true});
		MessageHandle.getAdvisor(function(result) {
			if (result.code == 200) {
				var _data = result.data;
                _data.source = {};
				_data.map(function(item, i) {
                    if (_data.source[item.name_pinyin.substr(0, 1).toLowerCase()]) {
						_data.source[item.name_pinyin.substr(0, 1).toLowerCase()].push(item);
						return;
					}
					_data.source[item.name_pinyin.substr(0, 1).toLowerCase()] = [item];
				});
				var source = Object.keys(_data.source).sort();
				return this.setState({data: _data, source: source, code: null, loading: false});
			}

			return this.setState({loading: false, code: result.code});
		}.bind(this));
	},
	getList: function() {
        if (this.state.loading)
            return 	<div className="recom_list_box" style={{position: 'relative', height: '300px'}}>
				<Loading />
			</div>;
        if (this.state.code) return <div className="recom_list_box" style={{position: 'relative', height: '300px'}}>
			<Reload onReload={this.getAdvisor} code={this.state.code} />;
		</div>
		return (
			<ul className="letter_list">
                {
                    this.state.source.map(function(item, i) {
                        return <li key={item} name={item} ref={'letter' + item}>
							<a name={item} className="letter_tip" href="javascript:;">{item.toUpperCase()}</a>
							<div className="recom_item">
                                {this.state.data.source[item].map(function(item1, i) {
                                    return  <div className="item_detail margin_bd" key={item1._id}>
										<a href="javascript:;" onClick={this.props.onSelect.bind(null, item1)}>{item1.name}</a>
										<p title={item1.intro}>{item1.intro}</p>
									</div>
                                }.bind(this))}
							</div>
						</li>
                    }.bind(this))
                }
			</ul>
		)
	},
	componentDidMount: function() {
		this.getAdvisor();
	},
	getInitialState: function() {
		return {loading: true, code: null, source: []}
	},
	render: function() {
		var letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

		return <div className="catalog_box">
				<h4>投顾名录</h4>
				<div className="letter">
					{letter.map(function(item, i) {
						return <a href={'#' + item} key={i} className={this.state.data && this.state.data.source[item] ? null : 'no'}>{item.toUpperCase()}</a>
					}.bind(this))}
				</div>
            	{this.getList()}

			</div>;
	}
});

module.exports = React.createClass({
	openNew: function(item) {
		var uri = '/live.html?adviser=' + item._id;
		Interface.gotoLeftNavView(Config.MODULE_NAME.LIVE, uri);
	},
	
	render: function() {
		return <div className="expert_box">
					<WeekAdvisor onSelect={this.openNew} />
					<AdvisorList onSelect={this.openNew} />
			    </div>;
	}
});