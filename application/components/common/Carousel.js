module.exports = React.createClass({
    timer: null,
    auto: function() {
        this.pauseTimer();
        this.timer = setTimeout(function(){
            var index = this.state.pointer;
            index = (index == this.state.maxLength - 1) ? 0 : index + 1;
            this.setState({pointer: index});
            this.refs.carousel.addEventListener('webkitTransitionEnd', function() {
                this.refs.carousel.removeEventListener('webkitTransitionEnd', this.load);
                this.auto();
            }.bind(this));
        }.bind(this), 5000);
    },

    pauseTimer: function() {
        clearTimeout(this.timer);
    },

    changePointer: function (index) {
        this.pauseTimer();
        this.setState({pointer: index});
    },

    getDefaultProps: function () {
        return {data: []};
    },

    componentDidMount: function () {
        if (this.state.maxLength > this.props.data.length)  this.state.maxLength = this.props.data.length;
        this.auto();
    },

    componentWillUnmount: function () {
        this.refs.carousel.removeEventListener('webkitTransitionEnd', this.load);
        this.pauseTimer();
    },

    getInitialState: function () {
        return {
            pointer: 0,
            maxLength: this.props.max ? this.props.max : 5
        };
    },
    render: function () {
        var width = this.props.width ? this.props.width : 500;
        var height = this.props.height ? this.props.height : 300;
        var style = {
            width: width,
            height: height
        };
        var src = this.props.src ? this.props.src : 'image_url';
        return (
            <div className="carousel" style={style}
                onMouseEnter={this.pauseTimer}
                onMouseLeave={this.auto}
                ref="carousel"
                >
                <div className="carousel_inner"
                    style={{left: -this.state.pointer * 100 + '%' ,  width: 100 * this.props.data.length + '%'}}>
                    {
                        this.props.data.map(function(item, index) {
                            return <div key={index} className="item" style={{width: 1 / this.props.data.length * 100 + '%'}}>
                                    {item[src] ?<a href="javascript:;" onClick={function() { this.props.clickCarousel(item); }.bind(this)}><img src={item[src]} /></a> : null}
                                    {item.title ? <p className="carousel_caption">{item.title}</p> : null}
                                    </div>;
                        }.bind(this))
                    }

                </div>
                {this.props.data.length > 1 ? <ol className="carousel_indicators">
                    {
                        this.props.data.map(function(item, index) {
                            if (index > this.state.maxLength - 1) return null;
                            return <li key={index} className={this.state.pointer == index ? 'active' : ''} onClick={this.state.pointer == index ? null : this.changePointer.bind(this, index)}></li>
                        }.bind(this))
                    }
                </ol> : null}
            </div>
        );
    }
});
