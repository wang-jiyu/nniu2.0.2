var LiveHandle = require('../../../../handle/live/Index');
var PageBox = require('../../../../components/common/PageBox');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');

module.exports = React.createClass({
    load: function(param) {
    	this.setState({loading: true});
		Forms.disableButton(this.refs.button);
		param = $.extend({page: 1}, param);
        LiveHandle.historyList(Config.CACHE_DATA.ROOM._id, param, function(result) {
            if (result.code == 200) {
                this.setState({loading: false, code: null, source: result.data.rows, pagination: result.data.pagination, page: param.page, total: result.data.pagination.total});
                return Forms.activeButton(this.refs.button);
            }
            this.setState({loading: false, code: result.code, total: null});
            Forms.activeButton(this.refs.button);
        }.bind(this))
    },
	page: function(result) {
		this.load($.extend(this.stat.time, result));
	},
    todayLive: function() {
        this.props.onChange();
    },
    historyLive: function(datetime) {
		var date = Utils.toDate(datetime);
		var startStamp = Utils.iniDateTime(date) / 1000;
		var endStamp = date.setDate(date.getDate() + 1) / 1000;
		this.props.onChange({
			start: startStamp,
			end: endStamp
		});
    },
    search: function(e) {
		this.state.time = e.target.data;
		this.setState({startTime: e.target.data.year + '年' + e.target.data.month + '月'});
        this.load($.extend(this.state.time, {page: 1}));
    },
	getList: function() {
		if (this.state.loading)
			return <tr height="300">
						<td colSpan="4" style={{position: 'relative'}}><Loading /></td>
					</tr>;
		if (this.state.code)
			return <tr height="300">
						<td colSpan="4"  style={{position: 'relative'}}><Reload onReload={this.load.bind(this, {})} code={this.state.code} /></td>
					</tr>;
		if (this.state.source.length == 0) this.state.source.push({date: $.now() / 1000, interact: '-', visitor_count: '-'});

		return this.state.source.map(function(item, index) {
            var isToday = Utils.showDate(item.date) == '今天';
            return <tr height="60" className={isToday ? 'selected' : null} key={index}>
				<td>{isToday ? Utils.showDate(item.date) : Utils.formatDate(item.date, 'YYYY年MM月DD日')}</td>
				<td>{item.visitor_count}</td>
				<td>{item.interact}</td>
				<td>
                    {
                        isToday ?
							<span onClick={this.todayLive}>进入直播</span> :
							<a href="javascript:;" onClick={this.historyLive.bind(this, item.date)}>回看</a>
                    }
				</td>
			</tr>
        }.bind(this))
	
	},

	getHistoryInfo: function () {
		if (this.state.startTime)
			return <span>自{this.state.startTime}起，该播主累计开播 <span>{this.state.total || 0 }</span>期</span>;
        return <span>自{Utils.formatDate(Config.CACHE_DATA.ROOM.create_time, 'YYYY年MM月DD日')}起，该播主累计开播 <span>{this.state.pagination.total}</span>期</span>;
    },

    onSelectYear: function() {
        this.setState({selectYear: this.refs.year.options[this.refs.year.selectedIndex].value});
    },


	isDisabledOption: function(month) {
    	month = parseInt(month);
		var nowYear = new Date().getFullYear();
		var nowMonth = new Date().getMonth() + 1;
        if (this.state.selectYear == nowYear && month > nowMonth)  return true;
        return false;
    },

    componentWillMount: function() {
        var yearLimit = [];
        for (var i = 2015; i <= (new Date()).getFullYear(); i++) {
            yearLimit.push(i);
        }
		this.state.yearLimit = yearLimit;
    },
	componentDidMount: function() {
        this.load();
    },
    getInitialState: function() {
       return {source: [], loading: true, yearLimit: [], pagination: {}, time: {}, code: null, total: null, startTime: null, selectYear: Utils.formatDate(Config.CACHE_DATA.ROOM.create_time, 'YYYY')}
	},
    render: function() {
        return <div className="history_live_box">
                   	 <div className="history_live_header">
							<h3>全部直播</h3>
							<div className="time">
								<form onSubmit={this.search}>
									<span>按</span>
									<select className="gray" ref="year" onChange={this.onSelectYear} defaultValue={Utils.formatDate(new Date, 'YYYY')} name="year">
										{this.state.yearLimit.map(function(item, index) {
											return <option value={item} key={item}>{item + '年'}</option>
										}.bind(this))}
									</select>
									<select className="gray" defaultValue={Utils.formatDate(new Date, 'MM')} name="month">
										<option value="01" disabled={this.isDisabledOption('01')}>1月</option>
										<option value="02" disabled={this.isDisabledOption('02')}>2月</option>
										<option value="03" disabled={this.isDisabledOption('03')}>3月</option>
										<option value="04" disabled={this.isDisabledOption('04')}>4月</option>
										<option value="05" disabled={this.isDisabledOption('05')}>5月</option>
										<option value="06" disabled={this.isDisabledOption('06')}>6月</option>
										<option value="07" disabled={this.isDisabledOption('07')}>7月</option>
										<option value="08" disabled={this.isDisabledOption('08')}>8月</option>
										<option value="09" disabled={this.isDisabledOption('09')}>9月</option>
										<option value="10" disabled={this.isDisabledOption('10')}>10月</option>
										<option value="11" disabled={this.isDisabledOption('11')}>11月</option>
										<option value="12" disabled={this.isDisabledOption('12')}>12月</option>
									</select>
									<input type="submit" className="dark_blue" value="查询" ref="button" />
								</form>
							</div>
						 	{this.getHistoryInfo()}
                    </div>
					<div>
						<table cellSpacing="0" width="100%">
							<thead>
							<tr height="50">
								<td width="390">日期</td>
								<td width="196">参与人数</td>
								<td width="196">互动数</td>
								<td>查看直播</td>
							</tr>
							</thead>
							<tbody>
							{this.getList()}
							</tbody>
						</table>
						<div className="grid_page_box">
							<PageBox onChange={this.page} pagination={this.state.pagination} nowPage={this.state.page} />
						</div>
					</div>
                </div>
    }
})


