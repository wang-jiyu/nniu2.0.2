module.exports = React.createClass({
    componentWillMount: function() {

    },
    componentDidMount: function() {

    },
    componentDidUpdate: function() {　　　　　

    },
    render: function() {
        return (
            <div className='videoBox'>
               <video id="my-video" className="video-js" controls preload="auto" width="1190" height="540"   poster="" data-setup="{}">
     				 <source src='rtmp://live.hkstv.hk.lxdns.com/live/hks' type='rtmp/flv' />
				</video>
            </div>
        )
    }
});