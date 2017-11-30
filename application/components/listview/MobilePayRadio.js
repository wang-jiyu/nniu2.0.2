module.exports = React.createClass({
    render: function() {
        return   (
            <label className="mobile_radio right">
                <input type="radio" name={this.props.name} defaultChecked={this.props.defaultChecked} onChange={this.props.onChange} value={this.props.value} />
                <i></i>
            </label>
        );
    }
});