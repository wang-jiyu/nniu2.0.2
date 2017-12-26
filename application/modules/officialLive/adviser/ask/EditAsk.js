var AskHandle = require('../../../../handle/live/Ask');
var SubmitSuccess = require('../../../../components/common/SubmitSuccess');

module.exports = React.createClass({
    submit: function(e) {
        Forms.disableButton(this.refs.submit);
        var params = {content: e.target.data.content};
        if (this.props.index == 0) {
            AskHandle.answerQuestion(this.props.item._id, params, function(result) {
                if (result.code == 200  && this.isMounted()) {
                    this.setState({success: true});
                    this.props.onSuccess(this.props.item._id, params.content, new Date().getTime()/1000, true);
                    return;
                }
                this.setState({error: result.code});
                Forms.activeButton(this.refs.submit);
            }.bind(this));
        } else if ( this.props.index == 1) {
            AskHandle.editAnswer(this.props.item._id, params, function(result) {
                if (result.code == 200  && this.isMounted()) {
                    this.setState({success: true});
                    this.props.onSuccess(this.props.item._id, params.content, new Date().getTime()/1000, false);
                    return;
                }
                this.setState({error: result.code});
                Forms.activeButton(this.refs.submit);
            }.bind(this));
        }
    },

    componentDidMount: function() {
        this.refs.textarea.focus();
    },

    getInitialState: function() {
      return {success: false, error: null}
    },

    render: function() {
        if (this.state.success) return <SubmitSuccess text={this.props.index == 0 ? '回答成功' : '编辑成功'} style={{marginTop: 30}} />;
        return (
            <div className="edit_dialog_box">
                <form onSubmit={this.submit}>
                    <textarea  name="content" ref="textarea" maxLength="200" data-required="required" defaultValue={this.props.item.answer ? this.props.item.answer : null}></textarea>
                    {typeof(this.state.error) == 'number' &&  <p className="prompt">{Utils.getPromptInfo(this.state.error)}</p>}
                    <input type="submit" value="提交" ref="submit" />
                </form>
            </div>
        );
    }
});
