var AdvertHandle = require('../../handle/advert/Index');
module.exports = React.createClass({

    click: function(item) {
    	if (item.link_type != 2) return Interface.popWin(item.title, item.link_url, {width: 1260, maxHeight: 642, top: 30, bottom: 30, align: 'center', valign: 0.4});
        var data = Utils.clickUrl(item);
        Interface.gotoLeftNavView(data.type, data.url);
    },

    load: function (flag) {
        if (flag) this.state.loading = true;
        var type = this.props.type == 1 ? 11 : 12;
        AdvertHandle.getAdvert(type, function(result) {
            if (result.code == 200) {
                return this.setState({loading: false, code: null, source: result.data});
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this))
    },
    
    getList: function () {
        if (this.state.source.length == 0) return <div className="no_advert">
            暂无广告
        </div>;
        return (
            <ul>
                {
                    this.state.source.map(function(item, index) {
                        return <li key={item._id} onClick={this.click.bind(this, item)}><img src={item.image_url} /> </li>
                    }.bind(this))
                }
            </ul>
        )
    },

    componentDidMount: function() {
        this.load(false);
    },

    getInitialState: function() {
        return {loading: true, code: null, source: []}
    },

    render: function () {

        return (
            <div className="jewelmore-right">
                {this.getList()}
            </div>
        )
    }
});

