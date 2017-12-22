var NestBox = require('../../../../components/common/NestBox');
var LiveHandle = require('../../../../handle/live/Index');
var OpinionInfo = require('./OpinionInfo');
var CreateOpinion = require('./CreateOpinion');
var Opinions = require('./Opinions');
var Advert = require('../../../../components/common/Advert');


module.exports = React.createClass({
    close: function() {
        this.state.data.pop();
        this.setState({data: this.state.data});
    },
	moduleChange: function(result) {
        if (result == 'close') return this.close();
        this.state.data.push(result);
        this.setState({data: this.state.data});
    },
	loadProps: function(props, callback) {
		this.state.data.length = 1;
		if ($.isArray(props.param)) {
			props.param.shift();
			switch (props.param[0]) {
				case 'article':
					 this.state.data.push({module: <OpinionInfo id={props.param[1]} key={props.param[1]} />, title: <div className="opinions_live_header"><h3>{LiveHandle.getAppellation()}的观点</h3></div>});
				break;
			}
		}
		typeof(callback) == 'function' && callback()
	},
	componentWillReceiveProps: function(nextProps) {
		this.loadProps(nextProps, function() {
			this.forceUpdate();
		}.bind(this));
	},
	componentWillMount: function() {
		this.loadProps(this.props);
	},
    componentDidMount: function() {
        Event.on('FreshModule', this.moduleChange);
    },
    componentWillUnmount: function() {
        Event.off('FreshModule', this.moduleChange);
    },
	getInitialState: function() {
		return {data: [{module: <Opinions param={this.props.param} />, title: <div><h3>{LiveHandle.getAppellation()}的观点</h3><span>0篇</span></div>}]}
	},
	render: function() {
		return <div className="opinions_box">
					<div className="opinions_left">
	                    <NestBox source={this.state.data} />
                	</div>
                	<div className="ad_box">
                		<Advert position="5" />
                	</div>
				</div>;
	}
});
