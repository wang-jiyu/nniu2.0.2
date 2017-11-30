var LiveRoom = require('./LiveRoom');
var Ranking = require('./Ranking');
var ChosenLive = require('./ChosenLive');
var LiveFocus = require('./LiveFocus');
var LiveHandle = require('../../../handle/live/Index');
var Developments = require('./Developments');
module.exports = React.createClass({
    load: function () {
        LiveHandle.getClass(function(result) {
            if (result.code == 200) {
                this.setState({loading: false, source: result.data});
            }
        }.bind(this));
    },
    componentDidMount: function() {
        this.load();
    },
	getInitialState: function() {
		return {loading: true};
	},
	render: function() {
		return <div className="live_box">
                <div className="live_order_box">
                    <div>
                    {
						this.state.loading ? null :
						this.state.source.map(function(item, i) {
							return  <div className="order_list" key={item._id}>
										<div className="order_form">
											<label>{item.category_name}</label>
											<a href="javascript:;">{item.order == 1 ? '视频直播室' : '直播室'}</a>
											<i></i>
										</div>
										<div className="detail_box">
											<LiveRoom data={item} />
										</div>
									</div>
						})
					}
                    </div>
                    <Developments />
                    <div className="ranking_box">
                        <div className="ranking green">
                            <h5>综合排行榜</h5>
                            <Ranking type="1" />
                        </div>                        
                        <div className="ranking purpel">
                            <h5>观点人气排行榜</h5>
                            <Ranking type="2" />
                        </div>
                        <div className="ranking red">
                            <h5>问答最多排行榜</h5>
                            <Ranking type="3" />
                        </div>
                    </div>
                    <div className="live_classify">
                        <ChosenLive />
                        <LiveFocus />                       
                    </div>
                </div>

        </div>;
	}
});
