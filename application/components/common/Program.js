module.exports = React.createClass({
    focus: function() {
		this.state.source.push({hour: '09', minute: '00', text: ''});
		this.setState({source: this.state.source});
    },
    delete: function(index) {
        this.state.source.splice(index, 1);
        this.setState({source: this.state.source});
    },
	componentWillMount: function() {
	    var hour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23'];
        var minute = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
                      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                      '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                      '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
                      '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
                      '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];
		this.state.hour = hour;
		this.state.minute = minute;
	},
    getInitialState: function() {
		var source = [{hour: '09', minute: '00', text: ''}];
		if (this.props.source && this.props.source.length > 0) source = $.extend(true, [], this.props.source);

        return {hour: [], minute: [], source: source};
    },
    render: function() {
        return <ul className="program_box">
					{this.state.source.map(function(items, index) {
						return <li key={index}>
									<select className="gray" defaultValue={items.hour} name={this.props.name ? this.props.name + '_hour' : null}>
										{this.state.hour.map(function(item) {
											return <option value={item} key={item}>{item}</option>
										})}
									</select>
									<span>:</span>
									<select className="gray" defaultValue={items.minute} name={this.props.name ? this.props.name + '_minute' : null}>
										{this.state.minute.map(function(item) {
											return <option value={item} key={item}>{item}</option>
										})}
									</select>
									<input type="text" onFocus={index == this.state.source.length - 1 ? this.focus : null}
											defaultValue={items.text} name={this.props.name ? this.props.name + '_value' : null} />
									{index ? <a href="javascript:;" onClick={this.delete.bind(this, index)}>删除</a> : null}
								</li>
					}.bind(this))}
               </ul>;
    }
});