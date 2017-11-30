module.exports = React.createClass({
    timer: null,
    auto: function() {
        this.pauseTimer();
        this.timer = setTimeout(function(){
            var index = this.state.pointer;
            index= (index == this.state.maxLength - 1) ? 0 : index + 1;
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

    resetTimer: function() {
        this.auto();
    },

    changePointer: function (index) {
        this.pauseTimer();
        this.setState({pointer: index});
    },

    componentDidMount: function () {
        if (this.state.maxLength > this.props.data.length)  this.setState({maxLength: this.props.data.length});
        this.auto();
    },

    componentWillUnmount: function () {
        this.refs.carousel.removeEventListener('webkitTransitionEnd', this.load);
        this.pauseTimer();
    },

    getInitialState: function () {
        return {
            pointer: 0,
            maxLength:  this.props.max  ? this.props.max : 5
        };
    },
    render: function () {
        var width = this.props.width ? this.props.width : 500;
        var height = this.props.height ? this.props.height : 300;
        var style = {
            width: width,
            height: height
        };
        return (
            <div className="carousel" style={style}
                onMouseEnter={this.pauseTimer}
                onMouseLeave={this.resetTimer}
                 ref="carousel"
                >
                <div className="carousel_inner"
                    style={{left: -this.state.pointer*width ,  width: width*this.props.data.length}}>
                    {
                        this.props.data.map(function(item, index) {
                            return index < 5 ? (
                                <div key={index} className="item">
                                    <a href="javascript:;" onClick={this.props.clickCarousel ? this.props.clickCarousel.bind(this, item) : null}><img src={item.image_url} /></a>
                                    <p className="carousel_caption">{item.title}</p>
                                </div>
                            ) : null;
                        }.bind(this))
                    }

                </div>
                <ol className="carousel_indicators">
                    {
                        this.props.data.map(function(item, index) {
                            if (index > this.state.maxLength - 1) return null;
                            return this.state.pointer == index ?
                                <li key={index}  className="active"></li> :
                                <li key={index} onClick={this.changePointer.bind(this, index)}></li>;
                        }.bind(this))
                    }
                </ol>
            </div>
        );
    }
});
