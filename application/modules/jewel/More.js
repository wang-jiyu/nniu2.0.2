var List = require('./List');
var Right = require('./Right');

module.exports = React.createClass({

    render: function () {
        return (
            <div className="jewelmore-box clearfix">
                <div className="jewelmore-header">
                    <ul className="guide">
                        <li>
                            <a href="javascript:;" onClick={this.props.openModule.bind(null, 'index')}>返回百宝箱</a>
                        </li>
                        {
                        	Config.CACHE_DATA.USER.advisor_type != 2 ? <li>
                            <a href="javascript:;" onClick={function() { Interface.gotoLeftNavView(Config.MODULE_NAME.USERCENTER, '/user_center.html?type=userAsset');}}>我的资产</a>
                        </li> : null
                        }
                        <li>
                            <a href="javascript:;" onClick={function() { Interface.gotoLeftNavView(Config.MODULE_NAME.USERCENTER, '/user_center.html?type=follow');}}>我的关注</a>
                        </li>
                    </ul>
                </div>
                <div className="jewelmore-content">
                    <List type={this.props.type} />
                    <Right type={this.props.type} />
                </div>
            </div>
        )
    }
});

