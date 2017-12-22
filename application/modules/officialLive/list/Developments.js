var LiveHandle = require('../../../handle/live/Index');
var Loading = require('../../../components/common/Loading');
var Reload = require('../../../components/common/Reload');

module.exports = React.createClass({
    load: function () {
        this.setState({loading: true});
        LiveHandle.getDevelopments(function(result) {
            if (result.code == 200) {
                return this.setState({loading: false, source: result.data, code: null});
            }
            this.setState({loading: false, code: result.code});
        }.bind(this));
    },
    getTransform: function(number) {
        if (number > 99999) {
            return parseInt(number / 10000) + 'w+';
        }
        return number;
    },
    getList: function() {
        if (this.state.loading)
            return (
                <div className="moving" style={{position: 'relative', height: '180px'}}>
                    <Loading />
                </div>
            );
        if (this.state.code)
            return (
                    <div className="moving" style={{position: 'relative', height: '180px'}}>
                        <Reload onReload={this.load} code={this.state.code} />
                    </div>
                );
        return (
              <div className="moving">
                  <h2>
                      <label>牛牛动态</label>
                      <i>更新时间：{Utils.formatDate(this.state.source.update_time, 'YYYY-MM-DD HH:mm')}</i>
                  </h2>
                  <ul>
                      <li>
                          <label>发表观点</label>
                          <i>{this.getTransform(this.state.source.opinion_count)}</i>
                      </li>
                      <li>
                          <label>发布直播</label>
                          <i>{this.getTransform(this.state.source.weblive_count)}</i>
                      </li>
                      <li>
                          <label>百宝箱</label>
                          <i>{this.state.source.treasure_count}</i>
                      </li>
                      <li>
                          <label>回答问题</label>
                          <i>{this.getTransform(this.state.source.question_count)}</i>
                      </li>
                      <li>
                          <label>影响人数</label>
                          <i>{this.getTransform(this.state.source.visitor_count)}</i>
                      </li>
                  </ul>
              </div>
          )
    },
    componentDidMount: function() {
        this.load();
    },
    getInitialState: function() {
        return {loading: true, source: {}, code: null};
    },
    render: function() {

        return (
            <div>
                {this.getList()}
            </div>

        );
    }
});
