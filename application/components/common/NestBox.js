module.exports = React.createClass({
    gotoModule: function(index, flag) {
        if (flag && this.props.onClose) this.props.onClose();
        this.props.source.splice(index, this.props.source.length - index);
        this.forceUpdate();
        if (typeof(this.props.onChange) == 'function') this.props.onChange();
    },

    render: function() {
        return <div className="nest_box">
                    {this.props.source.map(function(item, index) {
                        if (index < this.props.source.length - 1) {
                            return  <div className="nest_box_prev" style={{zIndex: index, top: 42 * index}} key={index}>
                                        {item.module}
                                        <div onClick={this.gotoModule.bind(this, index + 1)}>{this.props.source[index + 1].title}</div>
                                    </div>;
                        }

                        return  <div className="nest_box_now" style={{zIndex: index, marginTop: 42 * index}} key={index}>
                                    {item.module}
                                    {
                                        index != 0 ?
                                            <i onClick={this.gotoModule.bind(this, index, true)} style={{zIndex: index}}></i> :
                                            null
                                    }
                                </div>
                    }.bind(this))}
                </div>;
    }
});