var LiveHandle = require('../../../../handle/live/Index');
var ReportItem = require('./ReportItem');
var BuyTips = require('./BuyTips');
var Loading = require('../../../../components/common/Loading');

//研报
module.exports = React.createClass({
    load: function() {
        LiveHandle.getReportsItem(this.props.id, function(result) {
            if (result.code == 200) {
                this.props.getItem && this.props.getItem(4, result.data);
                this.state.source = result.data;
            } else {
                this.state.error = result.code;
            }
            this.setState({loading: false});
        }.bind(this));
    },
    componentWillUnmount: function() {
        Event.off('PaySuccess', this.load);
    },
    componentDidMount: function() {
        Event.on('PaySuccess', this.load);
        this.load();
    },
    getInitialState: function() {
        return {source: null, loading: true, error: null}
    },
    render: function() {
        if (this.state.loading) return <Loading style={{marginTop: '100px'}} />;
        if (this.state.error) return <div className="error">{Utils.getPromptInfo(this.state.error)}</div>;
        if (this.state.source.is_pay || this.state.source.advisor._id == Config.CACHE_DATA.USER._id) return <ReportItem source={this.state.source} />;
        return <BuyTips source={this.state.source} type={Config.CHANNEL_REF.REPORT} />;
    }
});


