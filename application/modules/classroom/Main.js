var Free = require('./Free');
var Goodness = require('./Goodness');

module.exports = React.createClass({
    openCourse: function(item, type, index) {
        this.props.openCourse && this.props.openCourse(item, type, index);
    },
    
    update: function () {
      this.setState({key: Date.now()})
    },

    getInitialState: function () {
        return {key: '1'}
    },

    render: function() {
        return (
            <div className="classroom_index_box">
                <div className="classroom_back classroom_wrapper">
                    <a className="classroom_update" onClick={this.update} href="javascript:;">刷新</a>
                </div>
                <Free key={'free' + this.state.key} openCourse={this.openCourse} />
                <Goodness key={'Goodness' + this.state.key}  openCourse={this.openCourse} />
            </div>
        );
    }
});