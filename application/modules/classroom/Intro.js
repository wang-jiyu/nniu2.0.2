var ClassRoomHandle = require('../../handle/classroom/Index');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');
var CommonEvent = require('../../components/CommonEvent');

module.exports = React.createClass({
	toPay: function() {
		var id = this.props.item._id;
        var uri = '/tool.html?tool=order&id=' + id + '&type=12';
        Interface.popWin('订单', uri, {width: 746, maxHeight: 790, top: 30, bottom: 30, align: 'center', valign: 0.4});
    },

    openCourse: function () {
        if (this.state.description.state == 1)
            return Event.trigger('OpenAlert', {
                title: '课程通知',
                message: '请耐心等候，课程未正式开始！',
                button: Config.MESSAGE_BUTTON.OK
            });
        this.props.openCourse && this.props.openCourse(this.props.item, 'list');
    },

    success:function () {
        ClassRoomHandle.getGoodnessCourseDescription(this.props.item._id, function(result) {
			if (result.data && result.data.is_pay) {
                try {
                    result.data.system_content = JSON.parse(result.data.system_content);
                } catch(e){
                    result.data.system_content  = []
                }
				this.setState({description: result.data});
			}
		}.bind(this))
    },

    load: function(flag) {
        if (flag) this.setState({loading: true});
        ClassRoomHandle.getGoodnessCourseDescription(this.props.item._id, function(result) {
            if (result.code == 200) {
            	try {
                    result.data.system_content = JSON.parse(result.data.system_content);
                } catch(e){
                    result.data.system_content  = []
            	}
                return this.setState({description: result.data, loading: false, code: null});
            }
            return this.setState({loading: false, code: result.code});
        }.bind(this));
    },
	
	getText: function() {
		switch (this.state.description.state) {
			case 3:
				return '已结束';
			case 4:
				return '停售';
			default: return '加入学习';
		}
    },

    isAdvisor: function() {
		return (Config.CACHE_DATA.USER.advisor_type == 2 && (this.props.item.advisor._id != Config.CACHE_DATA.USER._id));
    },

    update: function () {
        this.load(true);
    },

	getButton: function() {
		if (this.isAdvisor()) return null;
		if (this.props.item.is_pay || this.state.description.is_pay) return <input type="button" value="进入课程" onClick={this.openCourse} />;
		return <input type="button" 
					className={this.state.description.state > 2 ? 'disabled' : null} 
					value={this.getText()} 
					onClick={this.state.description.state > 2 ? null : this.toPay} />;
	},

    componentWillUnmount: function() {
        Event.off('PaySuccess', this.success);
    },

    componentDidMount: function() {
        this.load(false);
        Event.on('PaySuccess', this.success);
    },

    getInitialState: function() {
        return {description: {system_content: []}, code: null, loading: true}
    },

    render: function() {
        if (this.state.loading) return <Loading />;
        if (this.state.code) return <Reload onReload={this.load.bind(this, true)} code={this.state.code} />;
		return (
			<div className="classroom_intro_box">
				<div className="classroom_back classroom_wrapper">
					<a className="classroom_update" onClick={this.update} href="javascript:;">刷新</a> <a href="javascript:;" onClick={this.props.openCourse.bind(null, null, this.props.back ? 'moregood' : 'main')}>返回</a>
				</div>
				<div className="classroom_intro_focus classroom_wrapper">
					<div className="classroom_video">
						{this.state.description.cover_url ? <img src={this.state.description.cover_url} alt="" /> : null }
					</div>
					<div className="classroom_info">
						<h3>{this.state.description.title}</h3>
						<p>系统课+实战课</p>
						<em>¥{this.state.description.price}元 {this.state.description.system_content.length > 0 ? <span>共{this.state.description.system_content.length}节课</span> : null }</em>
						<p>已购买人数：<span> {this.state.description.buy_count}人</span></p>
						{this.getButton()}
					</div>
				</div>
				<div className="classroom_detail classroom_wrapper">
					<div className=" classroom_detail_intro">
						<h3>课程介绍</h3>
						<dl>
							<dt>主讲老师：</dt>
							<dd>{this.state.description.advisor ? this.state.description.advisor.name : ''}</dd>
						</dl>
						<dl>
							<dt>执业编号：</dt>
							<dd><span className="khaki">{this.state.description.advisor ? this.state.description.advisor.qcer : ''}</span></dd>
						</dl>
						<dl className="wrap">
							<dt>内容简介：</dt>
							<dd>{this.state.description.description}</dd>
						</dl>
						<dl>
							<dt>服务周期：</dt>
							<dd>{Math.ceil((this.state.description.end_time - this.state.description.begin_time) / 3600 / 24)}天</dd>
						</dl>
						<dl>
							<dt>适合人群：</dt>
							<dd>{this.state.description.apply_to}</dd>
						</dl>
						<dl>
							<dt>风险提示：</dt>
							<dd>{this.state.description.risk_tip}</dd>
						</dl>
					</div>
					<div className="classroom_detail_list">
						<h3>课程列表</h3>
						<dl>
							<dt>课程配置：</dt>
							<dd><span className="khaki">实战课+系统课</span></dd>
						</dl>
						<dl className="wrap">
							<dt>实战课程表： <span className="khaki">盘中直播课</span></dt>
							<dd>内容介绍：{this.state.description.action_content}</dd>
						</dl>
						<dl className="wrap">
							<dt>系统课程表 </dt>
							{
                                this.state.description.system_content.map(function(item, index) {
									return <dd key={item}>{item}</dd>
                                }.bind(this))
							}

						</dl>
					</div>
				</div>
				<CommonEvent />
			</div>
        );
	}
});