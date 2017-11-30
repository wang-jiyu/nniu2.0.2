var ReactDOM = require('react-dom');
var AutoSignin = require('../../components/AutoSignin');
var CommonEvent = require('../../components/CommonEvent');
var Loading = require('../../components/common/Loading');
var Reload = require('../../components/common/Reload');
var Login = require('./login');
var LeftNav = require('./leftNav');


var Main = React.createClass({
    isLogin:function(paramBool){
        this.setState({
            isLogin:paramBool
        });
    },
    componentWillMount:function () {
        if(sessionStorage.getItem("login")==='true'){
         this.setState({
             isLogin:true
         });
        }else{
            this.setState({
                isLogin:false
            });
        }
    },
    getInitialState:function () {
      return {
          isLogin:false,
          isLoading:false
      }
    },
    render: function() {
        return (<div className="web_index">
            {this.state.isLogin?<LeftNav isLoginFun={this.isLogin} />:<Login isLoginFun={this.isLogin} />}
                </div>);
    }
});

ReactDOM.render(<Main />, document.getElementsByClassName('main_wrap')[0]);