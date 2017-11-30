module.exports = React.createClass({
    timeId: null,
    countDown: function(sec) {
        if (sec == undefined || sec == 0) sec = 60;
        this.setState({timeCount: sec});
        this.timeId = setInterval(function() {
            if(this.state.timeCount <= 0) {
                clearInterval(this.timeId);
                return this.setState({timeCount: 0});
            }
            this.setState({timeCount: --this.state.timeCount});
        }.bind(this),1000);
    },
    reSendClick: function() {
        this.props.onClick(function(result) {
            if (result.code == 200) {
                this.countDown();
            }
        }.bind(this));
    },
    componentDidMount: function() {
        this.countDown();
    },
    componentWillUnmount: function() {
        clearInterval(this.timeId);
    },
    getInitialState: function() {
        return {timeCount: 60}
    },
    render: function() {
        var phone = this.props.phone.toString();
        return <div className="timing_box">
            <p className="phone">{phone.slice(0,3) + '***' + phone.slice(-4)}</p>
            <p className={this.state.timeCount > 0 ? null : 'hidden'}>请查收手机上收到的短信验证码，{this.state.timeCount}秒后方可重发短信</p>
            <p className={this.state.timeCount == 0 ? null : 'hidden'} style={{marginBottom: '28px'}}>请查收手机上收到的短信验证码，<a href="javascript:;" onClick={this.reSendClick} disabled={this.state.timeCount}>重发短信</a></p>
        </div>
    }
});