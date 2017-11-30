var CommonEvent = require('../../../../components/CommonEvent');
var CheckMobile = require('./CheckMobile');
var CheckCode = require('./CheckCode');
var ResetPassword = require('./ResetPassword');
var ResetSuccess = require('./ResetSuccess');

Utils.setTitle('找回密码');

module.exports = React.createClass({

    nextStep: function (data) {
    	data = $.extend(this.state.data, data);
        this.setState({step: ++this.state.step, data: data});
    },

	getModule: function() {
		switch (this.state.step) {
			case 1:
				return <CheckCode onNext={this.nextStep} data={this.state.data} />;
			case 2:
				return <ResetPassword onNext={this.nextStep} data={this.state.data} />;
			case 3:
				return <ResetSuccess data={this.state.data} />;
			default:
				return <CheckMobile onNext={this.nextStep} />
		}
    },

	getInitialState: function() {
    	var data = {mobile: '', captcha_code: '', token: '', password: null};
		return {step: 0, data: data}
    },

	render: function() {
		return (
			<div>
				{this.getModule()}
				<CommonEvent />
			</div>
		)
	}
});