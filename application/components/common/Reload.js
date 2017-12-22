module.exports = React.createClass({
    reLogin:function () {

        if(Utils.getPromptInfo(this.props.code)==='登录名或密码错误' || Utils.getPromptInfo(this.props.code)==='不存在的用户'){
            window.location.href='/index.html';
        }else{
            this.props.onReload();
        }
    },
    render: function() {
        return <div className="reload_box">
                    <div className="reload_header">
                        {Utils.getPromptInfo(this.props.code)}
                    </div>
                    <input type="submit" value="重新加载" onClick={this.reLogin} />
                </div>
    }
});