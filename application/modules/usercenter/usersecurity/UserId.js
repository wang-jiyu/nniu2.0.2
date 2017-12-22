var SubmitSuccess = require('../../../components/common/SubmitSuccess');
var UserCenterHandle = require('../../../handle/usercenter/UserCenter');

module.exports = React.createClass({
    submit: function(e) {
        Forms.disableButton(this.refs.submit);
        var params = {name: e.target.data.name, cardno: e.target.data.cardno};
        UserCenterHandle.authId(params, function(result) {
            if (result.code == 200) {
                Interface.getProfile(function() {
                    this.props.onChange(Config.CACHE_DATA.USER);
                    this.setState({success: true});
                }.bind(this), true);
            } else {
                this.setState({error: result.code}, function() {
                    Forms.activeButton(this.refs.submit);
                }.bind(this));
            }
        }.bind(this))
    },
    componentDidMount: function() {
        //Utils.setPosition(this.refs.title, -1);
        this.refs.name.focus();
    },

    getInitialState: function() {
        return {success: false, error: null};
    },
    render: function() {
        if(this.state.success) return <SubmitSuccess text="实名认证成功" style={{marginTop: '50px'}} />;
        return (<div className="user_id_box">
						<p>应监管部门要求和对您合法权益的保障，请在购买产品前进行实名认证。</p>
						<p>如有问题请致电客服热线：400-156-6699</p>
						<form onSubmit={this.submit}>
							<input name="name" data-required="required" type="text" placeholder="请输入姓名" ref="name" />
							<input name="cardno" data-required="required" type="text" data-type="idcard" placeholder="请输入身份证号码" />
							{typeof(this.state.error) == 'number' &&  <p className="prompt">{Utils.getPromptInfo(this.state.error)}</p>}
							<input type="submit" value="下一步" ref="submit" />
						</form>
					</div>);
    }
});