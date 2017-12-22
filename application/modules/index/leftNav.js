module.exports = React.createClass({
    setIframeHeight:function (iframe) {
    if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        console.log(iframe.contentWindow.outerHeight);
        if (iframeWin.document.body) {
            iframe.height = iframe.contentWindow.outerHeight;
            this.refs.leftNavLeft.style.height=iframe.contentWindow.outerHeight+'px';
            this.refs.leftNavLeft.height = iframe.contentWindow.outerHeight;
        }
    }
},
    buttonIsHide:function () {
        this.setState({
            isHide: !this.state.isHide
        });
    },
    loginOut: function () {
        sessionStorage.clear();
        this.props.isLoginFun(false);
    },
    componentWillMount: function () {
        Load.loadCss(Url.getAssets('/css/leftNav.css'));
    },
    componentDidMount:function () {
        this.setIframeHeight(document.getElementById('myIframe'));
    },
    componentDidUpdate:function () {
        this.setIframeHeight(document.getElementById('myIframe'));
    },
    getInitialState: function () {
        return {
            isHide: true
        }
    },
    onscroll:function () {
      console.log(1111111111);
    },
    render: function () {
        return (<div id="container">
            <div className="top-box">
                <div className="row">
                    <div className="col-md-1 text-center">
                        海纳智投
                    </div>
                    <div className="col-md-11 text-right" style={{paddingRight: '40px'}}>
                        <a onClick={this.loginOut} href="javascript:void(0)">登出</a>
                    </div>
                </div>
            </div>
            <div className="main">
                <div className="leftNavLeft" ref="leftNavLeft">
                    <div className="row">
                        <div className="col-md-12">
                            <ul>
                                <li>
                                    <a href="/jewel.html" target="main">百宝箱</a>
                                </li>
                                <li>
                                    <a href="/live.html" target="main">直播</a>
                                </li>
                                <li>
                                    <a href="/classroom.html" target="main">课堂</a>
                                </li>
                                <li>
                                    <a href="/message.html" target="main">消息</a>
                                </li>
                                <li>
                                    <a href="/user_center.html" target="main">个人中心</a>
                                </li>
                                <li>
                                    <a href="/admin.html" target="main">管理</a>
                                </li>
                            </ul>
                            <span ref="popupButton" onClick={this.buttonIsHide}></span>
                        </div>
                    </div>
                </div>
                <div className="contentMain"  ref="contentMain">
                    <iframe onScroll={this.onscroll} src="/user_center.html" id="myIframe" name="main" frameborder="0" scrolling="yes" className="contentIframe"></iframe>
                </div>
            </div>
        </div>)
    }
});