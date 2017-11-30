var OpinionHandle = require('../../../../handle/live/Opinion');
var Editor = require('../../../../components/editor/Editor');
var MessagesHandle = require('../../../../handle/messages/Index');
var Loading = require('../../../../components/common/Loading');
var Reload = require('../../../../components/common/Reload');
module.exports = React.createClass({
	formChange: function(e) {
		Forms.restrict(e.target, function(data) {
            this.setState(data);
        }.bind(this))
	},
	editorOpinion: function(e) {
		Forms.disableButton(this.refs.button);
		OpinionHandle.editorOpinion(this.props.data._id, e.target.data, function(result) {
			if (result.code == 200) {
				Event.trigger('EditorOpinion', result.data);
				this.props.onClose();
			}
			Forms.activeButton(this.refs.button);
		}.bind(this));
	},
	close: function() {
		this.props.onClose();
	},
	load: function() {
		this.setState({loading: true});
        OpinionHandle.getOpinion(this.props.data._id, function(result) {
            if (result.code == 200)
                return this.setState({content: result.data.content, loading: false, code: null});
            return this.setState({loading: true, code: result.code});
        }.bind(this));
    },
	componentDidMount: function() {
		this.load();
        Utils.setPosition(this.refs.title, -1);
    },
    getInitialState: function() {
    	return {title: this.props.data.title, loading: true}
    },
	render: function() {
		if (this.state.loading) return <Loading />;
		if (this.state.Reload) return <Reload onReload={this.load} code={this.state.code} />;

		return <div className="create_opinion">
					<h3>编辑观点</h3>
			        <form onSubmit={this.editorOpinion}>
			            <table width="100%" className="form_table">
			                <tbody>
			                    <tr>
			                        <td className="field">名称</td>
			                        <td>
			                            <input type="text" name="title" ref="title" data-required="true" value={this.state.title} onChange={this.formChange} />
			                            <em></em>
			                        </td>
			                    </tr>
			                    <tr className="multiple_text">
			                        <td className="field">说明</td>
			                        <td>
			                        	<div className="editor">
											<Editor name="content" placeholder='内容' value={this.state.content} onChange={this.formChange} />
										</div>
			                        </td>

			                    </tr>
			                </tbody>
			            </table>           
			            <table width="100%" className="operate_table">
			                <tbody>
			                    <tr>
			                        <td className="field"></td>
			                        <td>
			                            <input type="submit" ref="button" value="提交" />
			                            <a href="javascript:;" onClick={this.close}>取消</a>
			                        </td>
			                    </tr>
			                </tbody>
			            </table>
			        </form>
			    </div>
	}
})