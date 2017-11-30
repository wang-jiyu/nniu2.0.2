module.exports = React.createClass({
    selected: function(result) {
        this.props.onChange(result);
        this.setState({pointer: result._id})
    },
    getInitialState: function() {
        var source = this.props.source || [{text: '专属投顾'}, {text: '量化策略'}, {text: '锦囊'}, {text: '内参'}, {text: '课堂'}, {text: '积分'}];
        var pointer = parseInt(this.props.pointer) || 0;
        return {source: source, pointer: pointer};
    },
    render: function() {
        return <ul className="nav_box">
                    {this.state.source.map(function(item, index) {
                        return <li className={this.state.pointer == item._id ? 'selected' : ''} onClick={this.selected.bind(this, item)} key={index}>
                                    <a href="javascript:;">{item.text}</a>
                               </li>
                    }.bind(this))}
                </ul>
    }
});