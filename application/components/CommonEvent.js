!function() {
	function disabledPrevent(e) {
		if ($(e.target).is('[disabled]')) e.stopPropagation();
	}

	function checkSubmit(e) {
		e.preventDefault();
		var objControl = $(e.target);
		if (Forms.verify(objControl) != true) {
			e.stopPropagation();
			return true;
		}
		e.target.data = Forms.serialize(objControl);
	}
    // require('./Socket');
    // console.log("is fun",window.pushMessage);
	// #需要删除
	if (typeof(window.pushMessage) != 'function') {
		console.log("是否执行！!")
		require('./Socket');
		window.pushMessage = function(event, data) {
			window.receiveMessage(event, data);
		}
	}

	window.focusInEvent = function() {
		Config.FOCUSIN = true;
		Event.trigger('FocusChange')
	}

	window.focusOutEvent = function() {
		Config.FOCUSIN = false;
		Event.trigger('FocusChange');
	}

	window.receiveMessage = function(event, data) {
		console.log("receiveMessage",event);
		try {
			data = JSON.parse(data);
		} catch(e) {
			data = data;
		}
		Event.trigger(event, data);
  	}

	window.addEventListener('click', disabledPrevent, true);
	window.addEventListener('submit', checkSubmit, true);
	$('body').on('focus', 'input.error,select.error,textarea.error', function(e) { $(this).removeClass('error'); });
}();

var DialogBox = require('./dialog/DialogBox');
var AlertBox = require('./dialog/AlertBox');
var Preview = require('./dialog/Preview');

module.exports = React.createClass({
	render: function() {
		return <div className="common_box">
					<DialogBox />
					<AlertBox />
					<Preview />
					{this.props.children}
				</div>
	}	
});