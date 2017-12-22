module.exports = React.createClass({

    timing: function() {
        if (this.state.second == 0) return Interface.setLogin(this.props.data.mobile, this.props.data.password);
        setTimeout(function() {
            if (this.isMounted()) this.setState({second: --this.state.second}, this.timing);
        }.bind(this), 1000);
    },

    componentDidMount: function() {
        this.timing();
    },

    componentWillUnmount: function() {
        clearTimeout(this.timing);
    },

    getInitialState: function() {
        return {second: 5, error: null};
    },

    render: function() {
        return (
            <div className="reset_box">
                <div className="reset_success">
                    <i></i>
                    <h3>密码重置成功</h3>
                    <p>{this.state.second}秒后，自动跳转到登录页面</p>
                </div>
            </div>
        )
    }
});