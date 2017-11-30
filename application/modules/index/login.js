var AutoSignin = require('../../components/AutoSignin');
module.exports = React.createClass({
    timer: function () {
        setTimeout(function () {
            this.setState({
                error: null
            })
        }.bind(this), 2000);
    },
    submit:function(){
        AutoSignin(function(result) {
            console.log(result);
            if(result.code===200){
                this.props.isLoginFun(true);
            }else{
                return this.setState({
                    error: Utils.getPromptInfo(result.code)
                }, function () {
                    clearTimeout(this.timer);
                    this.timer();
                }.bind(this));
            }
        }.bind(this));
    },
    onChangeName:function(e){
        sessionStorage.setItem("NAME", e.target.value);
    },
    onChangePassWord:function(e){
        sessionStorage.setItem("PASSWORD", e.target.value);
    },
    componentWillMount: function () {
        Load.loadCss(Url.getAssets('/css/login.css'));
    },
    getInitialState:function () {
        return {
            name:'',
            password:'',
            error:null
        }
    },
    render: function () {
        return (<div id="container">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <div className="panel panel-primary marginTop150">
                            <div className="panel-heading">
                                <h3 className="panel-title text-center">牛牛登录</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="input-group marginTop20">
                                            <span className="input-group-addon" id="basic-addon1">用户名</span>
                                            <input type="text" onChange={this.onChangeName} className="form-control" placeholder="请输入用户名"
                                                   aria-describedby="basic-addon1"/>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="input-group marginTop20">
                                            <span className="input-group-addon"
                                                  id="basic-addon2">密&nbsp;&nbsp;&nbsp;&nbsp;码</span>
                                            <input onChange={this.onChangePassWord} type="password" className="form-control" placeholder="请输入用户密码"
                                                   aria-describedby="basic-addon1"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-center marginTop20 col-md-offset-4">
                                        <button type="submit" onClick={this.submit} className="btn btn-primary btn-block">登录</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={this.state.error ? 'shadow show' : 'shadow'} ref="shadow">
                    {this.state.error}
                </div>
            </div>
        </div>)
    }
});