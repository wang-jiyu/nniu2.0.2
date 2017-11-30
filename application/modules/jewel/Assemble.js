var AdvertHandle = require('../../handle/advert/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');

module.exports = React.createClass({

    click: function(item) {
    	if (item.link_url) {
    		item.link_url = item.link_url + '&access_token=' + Config.ACCESS_TOKEN;
    	}
        Interface.popWin(item.title, item.link_url, {width: 1260, maxHeight: 642, top: 30, bottom: 30, align: 'center', valign: 0.4});
    },

    load: function (flag) {
        if (flag) this.setState({loading: true});
        AdvertHandle.getAdvert(10, function(result) {
            if (result.code == 200) {
                return this.setState({loading: false, code: null, source: result.data});
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this))
    },

    changePointer: function() {
        var max = Math.ceil(this.state.source.length / 3);
        var pointer = this.state.pointer >= max ? 1 : this.state.pointer + 1;
        this.setState({pointer: pointer})
    },

    getList: function () {
        if (this.state.loading) return <div className="error_tips"><Loading /></div>;
        if (this.state.code) return <div className="error_tips"><Reload onReload={this.load.bind(this, true)} code={this.state.code}/></div>;
        var start = 3 * (this.state.pointer - 1);
        var end = 3 * this.state.pointer;
        return (
            <ul className="discounte_list">
                {
                    this.state.source.slice(start, end).map(function(item, index) {
                        return (
                            <li key={item._id} onClick={this.click.bind(this, item)}>
                                <img src={item.image_url} />
                            </li>
                        )
                    }.bind(this))
                }

            </ul>
        );
    },

    componentDidMount: function () {
        this.load(false);
    },

    getInitialState: function () {
        return {source: [], loading: true, code: null, pointer: 1}
    },

    render: function () {
        return (
            <div className="discounte_box">
                <h1>牛人计划</h1>
                <p className="title">年中钜惠，四大牛人战队全新登场<a href="javascript:;" onClick={this.changePointer}>换一换</a></p>
                {this.getList()}
            </div>
        )
    }
});

