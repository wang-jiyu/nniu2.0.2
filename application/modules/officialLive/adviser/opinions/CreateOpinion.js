var OpinionHandle = require('../../../../handle/live/Opinion');
var Editor = require('../../../../components/editor/Editor');
var MessagesHandle = require('../../../../handle/messages/Index');
module.exports = React.createClass({
	createOpinion: function(e) {
		Forms.disableButton(this.refs.button);
		OpinionHandle.createOpinion(e.target.data, function(result) {
			if (result.code == 200) {
				Event.trigger('AddOpinion', result.data);
				this.props.onClose();
			}
			Forms.activeButton(this.refs.button);
		}.bind(this));
	},
	submit: function() {
		this.refs.button.click();
		return false;
	},
	close: function() {
		this.props.onClose();
	},
	componentDidMount: function() {
		Utils.setPosition(this.refs.title, -1);
	},
	render: function() {
		return <div className="create_opinion">
					<h3>创建观点</h3>
			        <form onSubmit={this.createOpinion} ref="form">
			            <table width="100%" className="form_table">
			                <tbody>
			                    <tr>
			                        <td className="field">标题</td>
			                        <td>
			                            <input type="text" maxLength="60" name="title" ref="title" data-required="true" />
			                            <em></em>
			                        </td>
			                    </tr>
								<tr className="field_upload_tr">
			                        <td className="field">缩略图</td>
			                        <td className="filed_upload_files">
			                            <input type="file" name="imgfile" className="createViews-tr2file" placeholder="点击上传文件" accept="image/*"/>
										点击上传图片
			                        </td>
			                    </tr>
			                    <tr className="multiple_text">
			                        <td className="field">内容</td>
			                        <td>
			                        	<div className="editor">
											<Editor maxLength="200" placeholder='内容' name="content" />
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