module.exports = React.createClass({
    upload: function(e) {
        this.props.onChange(e);
    },
    getInitialState: function() {
        return {};
    },
    render: function() {
        var className = 'hide';
        var title = '未选择任何文件';
        if (this.props.error) className = 'hide error';
        if (this.props.title) title = '未选择任何文件' + '(' + this.props.title + ')';
        return <div className="upload_file_box">
                    <input type="file" className={className} ref="file" onChange={this.upload} accept={this.props.accept || '*'} />
                    <div className="file">
                        <label onClick={function() { $(this.refs.file).click(); }.bind(this)}>选择文件</label>
                        <i>{this.props.file ? this.props.file.name : title}</i>
                    </div>
                </div>
    }
});



