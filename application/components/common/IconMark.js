module.exports = React.createClass({
    render: function() {
        var className = 'error';
        if (this.props.status) className = 'right';
        return <i className={'icon_mark  ' + className}></i>
    }
});