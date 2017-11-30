var AskHandle = require('../../../../handle/live/Ask');
var SubmitSuccess = require('../../../../components/common/SubmitSuccess');
var StockCodeList = require('./StockCodeList');
var StockCode = require('stock-code');
module.exports = React.createClass({
    submit: function(e) {
        var list = StockCode.getStock(e.target.data.stockCode);
        this.setState({tips: null});
        var flag =  null;
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j< list[i].length; j++) {
                if (e.target.data.stockCode.toUpperCase() == list[i][j].toUpperCase()) {
                    flag = list[i][0];
                    break;
                }
            }
        }
        if (!flag) return this.setState({tips: '股票代码/名称有误'});
        Forms.disableButton(this.refs.submit);
        var params = {
            stock_code: flag,
            content: e.target.data.question
        };
        AskHandle.setAskQuestion(Config.CACHE_DATA.ROOM.advisor._id, params, function(result) {
            if (result.code == 200  && this.isMounted()) {
                this.setState({success: true});
                Event.trigger('AskSuccess', {askSuccess: 1});
                return;
            }
            this.setState({error: result.code});
            Forms.activeButton(this.refs.submit);
        }.bind(this));
    },

    getInitialState: function() {
        return {success: false, error: null, tips: null}
    },
    render: function() {
        if (this.state.success) return <SubmitSuccess text="提问成功" style={{marginTop: 30}} />;
        return (
            <div className="ask_dialog_box">
                <form onSubmit={this.submit}>
                    <StockCodeList />
                    <textarea placeholder="请描述您的问题" maxLength="200" name="question" data-required="required"></textarea>
                    {typeof(this.state.error) == 'number' &&  <p className="prompt">{Utils.getPromptInfo(this.state.error)}</p>}
                    {this.state.tips == null ? null : <p className="prompt">{this.state.tips}</p>}
                    <input type="submit" value="提交" ref="submit" />
                </form>
            </div>
        );
    }
});
