var NestBox = require('../../../../components/common/NestBox');
var ChestList = require('./ChestList');
var Report = require('./Report');
var Tactics = require('./Tactics');
var LiveHandle = require('../../../../handle/live/Index');
module.exports = React.createClass({
    close: function() {
        this.state.data.pop();
        this.setState({data: this.state.data, show: false});
    },

    onClose: function () {
        this.state.show = false;
    },

    getItem: function(type, item) {
        this.setState({type: type, item: item})
    },

    submit: function(type, item) {
        Event.trigger('OpenAlert', {
            title: '立即续订',
            message: '您确定要续订本产品吗？',
            button: Config.MESSAGE_BUTTON.OKCANCEL,
            event: function() {
                var uri = '/tool.html?tool=order&id=' + this.state.item._id + '&type=' + this.state.type;
                Interface.popWin('订单', uri, {width: 746, maxHeight: 790, top: 30, bottom: 30, align: 'center', valign: 0.4});
            }.bind(this)
        });
    },

    moduleChange: function(result, type) {
        if (result == 'close') return this.close();
        if (type == 'rightModule') {
            var _length = this.state.data.length - 1;
            this.state.data[_length] = $.extend(this.state.data[_length], result);
        } else {
            this.state.data.push(result);
        }
        this.setState({data: this.state.data, show: true});
    },
	getRightModule: function() {

        var now = new Date();
        now.setHours(23, 59, 59, 999);
        now = now.valueOf();
        var end = Utils.formatDate(this.state.item.my_service_endtime);
        end = new Date(end);
        end.setHours(23, 59, 59, 999);
        end = end.valueOf();
        var index = Math.ceil((end - now) / 3600 / 24 / 1000);
        var text = '';
        if (index < 0) {
            text = '(已用完)';
        } else if (index < 15) {
        	index = index + 1;
            text = '(还剩'+ index +'天)';
        }
        if (this.state.show && this.state.item.is_pay == 1) {
            if (this.state.item.state_v2 == 3) {
                return (
                    <div className="detail_item">
                        <h5>{type}详情</h5>
                        <div>
                            <h6>{type}：{this.state.item.title}</h6>
                            <p>{this.state.item.description}</p>
                        </div>
                        <div>
                            <h6>适用人群</h6>
                            <p>{this.state.item.apply_to}</p>
                        </div>
                        <div>
                            <h6>风险提示</h6>
                            <p>{this.state.item.risk_tip}</p>
                        </div>
                        {Config.CACHE_DATA.USER.advisor_type == 2 ? null : <div>
                            <h6>服务期限</h6>
                            <p>服务到期：{Utils.formatDate(this.state.item.my_service_endtime, 'YYYY-MM-DD') + '  '} {text}</p>
                        </div>}
                        {Config.CACHE_DATA.USER.advisor_type == 2 ? null : <div>
                            <input type="button" value="已停售" className="has"  />
                        </div>}
                    </div>
                );
            }

            if (this.state.item.state_v2 == 4) {
                return (
                    <div className="detail_item">
                        <h5>{type}详情</h5>
                        <div>
                            <h6>{type}：{this.state.item.title}</h6>
                            <p>{this.state.item.description}</p>
                        </div>
                        <div>
                            <h6>适用人群</h6>
                            <p>{this.state.item.apply_to}</p>
                        </div>
                        <div>
                            <h6>风险提示</h6>
                            <p>{this.state.item.risk_tip}</p>
                        </div>
                        {Config.CACHE_DATA.USER.advisor_type == 2 ? null : <div>
                            <h6>服务期限</h6>
                            <p>服务到期：{Utils.formatDate(this.state.item.my_service_endtime, 'YYYY-MM-DD') + '  '} {text}</p>
                        </div>}
                        {Config.CACHE_DATA.USER.advisor_type == 2 ? null : <div>
                            <input type="button" value="已结束"  className="has"  />
                        </div>}
                    </div>
                );
            }
            var type = '';
            if (this.state.type == 4) type = "内参";
            if (this.state.type == 1) type = "锦囊";
            var show = null;

            return (
                <div className="detail_item">
                    <h5>{type}详情</h5>
                    <div>
                        <h6>{type}：{this.state.item.title}</h6>
                        <p>{this.state.item.description}</p>
                    </div>
                    <div>
                        <h6>适用人群</h6>
                        <p>{this.state.item.apply_to}</p>
                    </div>
                    <div>
                        <h6>风险提示</h6>
                        <p>{this.state.item.risk_tip}</p>
                    </div>
                    {Config.CACHE_DATA.USER.advisor_type == 2 ? null : <div>
                        <h6>服务期限</h6>
                        <p>服务到期：{Utils.formatDate(this.state.item.my_service_endtime, 'YYYY-MM-DD') + '  '} {text}</p>
                    </div> }
                    {Config.CACHE_DATA.USER.advisor_type == 2 ? null : <div>
                        <input type="button" value="立即续订" onClick={this.submit} />
                    </div>}
                </div>
            );
        }

        if (this.state.data[this.state.data.length - 1].rightModule)
            return this.state.data[this.state.data.length - 1].rightModule;

        return (
            <div className="detail_item">
                <h5>常见问题</h5>
                <div>
                    <h6>什么是百宝箱？</h6>
                    <p>百宝箱是提供给股友有偿阅读的锦囊、策略或内参。百宝箱的内容包括操作战法、策略分析、 技术指标、自选股研究等，这些有价值内容可以帮助股友分析股市、防范风险、理性投资。</p>
                </div>
                <div>
                    <h6>如何订阅百宝箱？</h6>
                    <p>登录您的海纳智投网账号，仔细查看百宝箱宣传页面信息，包括：宝箱类型，服务时间、优惠信息和订阅价格等，确认无误后点击立即订阅，输入您的海纳智投网登录密码，支付金币完成购买。</p>
                </div>
                <div>
                    <h6>如何查看百宝箱？</h6>
                    <p>百宝箱订阅成功后，请于网站右上角我的订单中查看订单信息，点击订单中百宝箱名称进入百宝箱，完整查看宝箱内页信息。</p>
                </div>
            </div>
        )
    },

	loadProps: function(props, callback) {
		this.state.data.length = 1;
        if ($.isArray(props.param)) {
			props.param.shift();
			switch (props.param[0]) {
				case 'tactics':
					if (Url.getParam('tactics') != 'list') {
					 	this.state.data.push({module: <Tactics id={props.param[1]} getItem={this.getItem} param={this.props.param} />, title: <div className="chest_header">{LiveHandle.getAppellation() + '的百宝箱'}</div>});
					 }
					 this.state.show = true;
				 break;
				case 'report':
					if (Url.getParam('report') != 'list') {
						this.state.data.push({module: <Report id={props.param[1]} getItem={this.getItem} param={this.props.param} />, title: <div className="chest_header">{LiveHandle.getAppellation() + '的百宝箱'}</div>});
					}
                    this.state.show = true;
				break;
                default:
                    this.state.show = false;
			}
		} else {
            this.state.show = false;
        }
		typeof(callback) == 'function' && callback()
	},
	componentWillReceiveProps: function(nextProps) {
		this.loadProps(nextProps, function() {
			this.forceUpdate();
		}.bind(this));
	},
	componentWillMount: function() {
		this.loadProps(this.props);
	},
    componentDidMount: function() {
        Event.on('FreshJewelModule', this.moduleChange);
		LiveHandle.getCategory(function(result) {
			if (result.code == 200) {
				Config.CACHE_DATA.JEWEL_CATEGORY = result.data;
			}
		}.bind(this));
    },
    componentWillUnmount: function() {
        Event.off('FreshJewelModule', this.moduleChange);
		delete Config.CACHE_DATA.JEWEL_CATEGORY;
    },
    getInitialState: function() {
		return {data: [{module: <ChestList getItem={this.getItem} param={this.props.param} />}], loading: true, show: false, item: {advisor: {}}, type: null};
	},
	render: function() {
		return <div className="treasure_chest_content clearfix">
                    <div className="treasure_chest_left">
                       <NestBox onClose={this.onClose} source={this.state.data} onChange={ function() { this.forceUpdate(); }.bind(this)} />
                    </div>
                   {this.getRightModule()}
                </div>;
	}
});


