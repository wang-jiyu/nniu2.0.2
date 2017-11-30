var LiveHandle = require('../../../../handle/live/Index');
var AttachmentHandle = require('../../../../handle/Attachment');
var UploadBox = require('../../../../components/form/UploadBox');

module.exports = React.createClass({
    close: function() {
        Event.trigger('FreshJewelModule', 'close');
    },
    submit: function(e) {
        if (!this.state.file) return this.setState({error: true});
        var data = {file: this.state.file, ref_type: 4, ref_id: this.props.source._id, is_pay: this.props.source.is_pay};
        var target = e.target.data;

        Forms.disableButton(this.refs.submit);
        AttachmentHandle.uploadToReport(data, function(result) {
             if (result.code == 200) {
                 var param = $.extend(target, {affix_id: result.data._id});
                 LiveHandle.createReportAttachment(param, this.props.source._id, function(result) {
                            if (result.code == 200) {
                                this.props.onChange(result.data);
                                Event.trigger('FreshJewelModule', 'close');
                            } else {
                                Forms.activeButton(this.refs.submit);
                            }
                 }.bind(this));
             } else {
                 Forms.activeButton(this.refs.submit);
             }
        }.bind(this));

    },
    upload: function(e) {
        var files = $.extend({}, e.currentTarget.files, true);
        $(e.currentTarget).val('');
        if (files.length != 1) return false;

        this.setState({file: files[0], error: null});
    },
    componentDidMount: function() {

    },
    getInitialState: function() {
        return {file: null, error: null};
    },
    render: function() {
        return <div className="dialog_content upload_report dialog_chest">
                    <h3>{this.props.title}</h3>
                    <form onSubmit={this.submit}>
                        <table width="100%" className="form_table">
                            <tbody>
                            <tr>
                                <td className="field">标题</td>
                                <td>
                                    <input type="text" name="title" data-required="required" maxLength="60" />
                                </td>
                            </tr>
                            <tr>
                                <td className="field">描述</td>
                                <td>
                                    <textarea name="description" maxLength={200} placeholder="最多输入200个字符" data-required="required" ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td className="field">上传PDF文件</td>
                                <td>
                                    <UploadBox error={this.state.error} onChange={this.upload} file={this.state.file} accept=".pdf" title="仅限上传PDF格式" />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table width="100%" className="operate_table">
                            <tbody>
                            <tr>
                                <td className="field"></td>
                                <td>
                                    <input type="submit" value="提交" ref="submit" />
                                    <a href="javascript:;" onClick={this.close}>取消</a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
    }
});


