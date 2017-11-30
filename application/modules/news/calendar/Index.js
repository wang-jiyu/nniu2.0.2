var DateTimeInput = require(('amazeui-react')).DateTimeInput;
var CalendarHandle = require('../../../handle/calendar/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');
module.exports = React.createClass({
    cancelScroll: function (e) {
        e.preventDefault();
    },

    nonScroll: function (flag) {
        if (flag)
            return window.addEventListener('mousewheel', this.cancelScroll, true);
        return window.removeEventListener('mousewheel', this.cancelScroll, true);
    },

    loadDateData: function() {
        this.setState({loading: true});
        CalendarHandle.getDateCalendar(this.state.date, function(result) {
            if (result.code == 200)
                return this.setState({source: result.data == null ? [] : result.data, country: null, code: null, loading: false});
            return this.setState({code: result.code, loading: false});
        }.bind(this));
    },

    selectTime: function(result) {
        if (result) return  this.setState({date: result}, function () {
            this.loadDateData();
        }.bind(this));
        this.setState({date: Utils.formatDate(new Date(), 'YYYY-MM-DD'), source: []}, function () {
            this.loadDateData();
        }.bind(this));
    },

    selectCountry: function(e) {
        var country = e.target.value;
        if (country == this.state.country) {
            $(e.target).prop('checked', false);
            return this.setState({country: null})
        }
        CalendarHandle.getCountryCalendar(country, function(result) {
            if (result.code == 200)
                this.setState({data: result.data == null ? [] : result.data, country: country, color: this.getColorStyle(country)});
        }.bind(this));
    },

    getColorStyle: function(country) {
        switch (country) {
            case '中国': return 'china';
            case '美国': return 'america';
            case '加拿大': return 'canada';
            case '欧元区': return 'europe';
            case '瑞士': return 'switzerland';
            case '意大利': return 'italy';
            case '英国': return 'england';
            case '德国': return 'germany';
            case '法国': return 'france';
            case '日本': return 'japan';
            case '新西兰': return 'zealand';
            case '澳大利亚': return 'australia';
        }
        return null;
    },

    getCountryList: function(ym, ymd) {
        var list = [];
        var data = this.state.data;

        for (var i = 0; i < data.length; i++) {
            var day = data[i].base.when.split(' ')[0];
            var time = day.split('-');
            var month = time[0] + '-' + time[1];
            if (month != ym) {
                list.push(
                    <li className="hot" key={i}>
                        <i className="top">{time[1]}/<em>{time[0]}</em></i>
                        <i className="date">{parseInt(time[1])}月{parseInt(time[2])}日</i>
                        <div className="news_time_line_caption">
                            <strong className={this.getColorStyle(this.state.country)}>{this.state.country}</strong>
                            <p>指标：{data[i].base.event}</p>
                            <p>重要级别：{data[i].base.importance}</p>
                            <p>本月数据：{data[i].data_0}</p>
                            <p>1个月前数据：{data[i].data_1}</p>
                            <p>2个月前数据：{data[i].data_2}</p>
                            <p>3个月前数据：{data[i].data_3}</p>
                            <p>4个月前数据：{data[i].data_4}</p>
                            <p>5个月前数据：{data[i].data_5}</p>
                        </div>
                    </li>
                );
                ym = month;
                ymd = day;
            } else if(day != ymd) {
                list.push(
                    <li key={i}>
                        <i className="date">{parseInt(time[1])}月{parseInt(time[2])}日</i>
                        <div className="news_time_line_caption">
                            <strong className={this.getColorStyle(this.state.country)}>{this.state.country}</strong>
                            <p>指标：{data[i].base.event}</p>
                            <p>重要级别：{data[i].base.importance}</p>
                            <p>本月数据：{data[i].data_0}</p>
                            <p>1个月前数据：{data[i].data_1}</p>
                            <p>2个月前数据：{data[i].data_2}</p>
                            <p>3个月前数据：{data[i].data_3}</p>
                            <p>4个月前数据：{data[i].data_4}</p>
                            <p>5个月前数据：{data[i].data_5}</p>
                        </div>
                    </li>
                );
                ymd = day;
            } else {
                list.push(
                    <li key={i}>
                        <div className="news_time_line_caption">
                            <strong className={this.getColorStyle(this.state.country)}>{this.state.country}</strong>
                            <p>指标：{data[i].base.event}</p>
                            <p>重要级别：{data[i].base.importance}</p>
                            <p>本月数据：{data[i].data_0}</p>
                            <p>1个月前数据：{data[i].data_1}</p>
                            <p>2个月前数据：{data[i].data_2}</p>
                            <p>3个月前数据：{data[i].data_3}</p>
                            <p>4个月前数据：{data[i].data_4}</p>
                            <p>5个月前数据：{data[i].data_5}</p>
                        </div>
                    </li>)
            }
        }

        return list;
    },

    getList: function(time, ym, ymd, country) {
        if (this.state.loading)
            return  (<div  style={{position: 'relative', height: '400px'}}>
                        <Loading />
                    </div>);
        if (this.state.code)
            return ( <div  style={{position: 'relative', height: '400px'}}>
                        <Reload onReload={this.loadDateData} code={this.state.code} />
                    </div>);
        if (this.state.country == null)
            return (<div className="news_calendar_list">
                        <ul className="news_calendar_ul">
                        {
                            this.state.source.map(function(item, index) {
                                return index == 0 ? (
                                    <li className="hot" key={item.id}>
                                        <i className="top">{time[1]}/<em>{time[0]}</em></i>
                                        <i className="date">{parseInt(time[1])}月{parseInt(time[2])}日</i>
                                        <div className="news_time_line_caption"> <strong className={this.getColorStyle(item.country)}>{item.country}</strong>
                                            <p>指标：{item.event}</p>
                                            <p>重要级别：{item.importance}</p>
                                            <p>前值：{item.previous}</p>
                                            <p>预测值：{item.median}</p>
                                            <p>现值: {item.ifr_actual}</p>
                                        </div>
                                    </li>
                                ) : (
                                    <li key={item.id}>
                                        <div className="news_time_line_caption"> <strong className={this.getColorStyle(item.country)}>{item.country}</strong>
                                            <p>指标：{item.event}</p>
                                            <p>重要级别：{item.importance}</p>
                                            <p>前值：{item.previous}</p>
                                            <p>预测值：{item.median}</p>
                                            <p>现值: {item.ifr_actual}</p>
                                        </div>
                                    </li>
                                );
                            }.bind(this))
                        }
                    </ul>
            </div>);
        return (<div className="news_calendar_list">
                    <ul className="news_calendar_ul">
                         {this.getCountryList(ym, ymd)}
                     </ul>
                </div>);
    },

    componentDidMount: function() {
        this.loadDateData();
    },
    getInitialState: function() {
        return {loading: true, date: Utils.formatDate(new Date(), 'YYYY-MM-DD'), source: [] ,data: [], country: null, color: null, multipleSelect: false, code: null};
    },

    render: function() {

        var ym = null;
        var ymd = null;
        var country = [
            {country: '中国', color: 'china'},
            {country: '美国', color: 'america'},
            {country: '加拿大', color: 'canada'},
            {country: '欧元区', color: 'europe'},
            {country: '瑞士', color: 'switzerland'},
            {country: '意大利', color: 'italy'},
            {country: '英国', color: 'england'},
            {country: '德国', color: 'germany'},
            {country: '法国', color: 'france'},
            {country: '日本', color: 'japan'},
            {country: '新西兰', color: 'zealand'},
            {country: '澳大利亚', color: 'australia'}
        ];
        var time = this.state.date.split('-');
        return (
            <div className="news_calendar">
                <div className="news_calendar_category news_table">
                    <strong>类别：</strong>
                    <ul className="news_category_list">
                        {
                            country.map(function(item, i) {
                                return (
                                    <li key={item.color}>
                                        <label className="radio">
                                            <input type="radio" name="country" onClick={this.selectCountry} value={item.country} />
                                            <span className={'label label_' + item.color}>{item.country}</span>
                                        </label>
                                    </li>
                                )
                            }.bind(this))
                        }
                    </ul>
                </div>
                <div className="news_table">
                    <strong>时间：</strong>
                    <div className="news_calendar_pane">
                        <div className="news_date">
                            <DateTimeInput name="begin_time" format="YYYY-MM-DD" placeholder="开始日期" className="time_input input_calendars" readOnly={true} showTimePicker={false} onSelect={this.selectTime} dateTime={this.state.dateTime} 
								onChangeVisible={this.nonScroll}/>
                        </div>
                    </div>
                </div>


                <div >
                    {
                        this.getList(time, ym, ymd, country)
                    }
                </div>

            </div>
        );
    }
});