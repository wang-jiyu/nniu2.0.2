module.exports = React.createClass({
    componentWillMount: function () {
        this.setState({
            content: ""
        })
    },
    timer: function () {
        this.delayCall = setTimeout(function () {
            this.setState({
                content: ""
            })
        }.bind(this), 2000);
    },

    showTips: function (tips) {
        this.setState({content: tips});
        this.delayCall && clearTimeout(this.delayCall);
        this.timer();
    },

    render: function () {
        var isShow = this.state.content != "";
        return (<div className={isShow ? 'shadow show' : 'shadow'} ref="shadow" style={this.props.style} >
            {this.state.content}
        </div >)
    }
});