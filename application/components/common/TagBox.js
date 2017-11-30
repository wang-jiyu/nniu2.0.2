module.exports = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {
        var className = this.props.className || '';
        return <div className="tag_box">
                    <a href="javascript:;" className={className}>{this.props.children}</a>
               </div>;
    }
});