module.exports = React.createClass({
    selected: function(e) {
        this.props.onChange && this.props.onChange(this.props.status);
    },
    getInitialState: function() {
        return {};
    },
    render: function() {
        var props = $.extend(true, {}, this.props);
        var className = props.className;
        var children = props.children;
        var images = props.images;
        delete props.className;
        delete props.children;
        delete props.images;
        delete props.status;
        return <label className="pay_radio">
                    <input type="radio" {...props} onChange={this.selected} />
                    <div>
                        <img width="40" height="40" src={images} alt="" />
                        <span>{children}</span>
                    </div>
                </label>
    }
});