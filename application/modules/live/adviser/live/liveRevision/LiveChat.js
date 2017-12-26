module.exports = React.createClass({
    render: function() {
        return  <div className="curr-chatbox">
                    <div className="curr-chat-record">
                        <ul>
                            <li className="curr-chat-left">
                                <div className="curr-chat-left-author">
                                    <img className="curr-chat-left-author-img" src="http://dev.0606.com.cn:8085/corps/images/xh_02.jpg" alt="" />
                                    <span className="curr-chat-left-author-name">伊泽瑞尔</span>
                                    <span className="curr-chat-left-author-ids">助理</span>
                                    <span className="curr-chat-left-author-reply">回复</span>
                                </div>
                                <div className="curr-chat-left-content">
                                    擒牛闪电战订3月送2月包月擒牛闪电战法：要就的是小收益、快止盈、高胜率，累计收益惊人！人有人性、股有股性；不同的股民会有不同的性格，不同的性格就会适合不同股性的股票，以下是擒牛闪电战的技巧......
                                </div>
                            </li>
                            <li className="curr-chat-right clearfix">
                                <div className="curr-chat-right-author clearfix">
                                    <img className="curr-chat-right-author-img" src="http://dev.0606.com.cn:8085/corps/images/xh_02.jpg" alt="" />
                                    <span className="curr-chat-right-author-name">伊泽瑞尔</span>
                                    <span className="curr-chat-right-author-ids">老师</span>
                                </div>
                                <div className="curr-chat-right-content">
                                    <p>今年以来，全国共有16个省份报告人感染H7N9病例，与去年同期相比有明显提升。国家卫生计生委表示，目前多部门正研究冬季预防。</p>
                                    <div className="curr-chat-right-content-Reply">
                                        <span className="curr-chat-right-content-Reply-name">@王大锤：</span>
                                        <span>老师求教 <i className="curr-chat-right-content-Reply-code">00871</i> 后期走势如何？谢谢</span>
                                    </div>
                                </div>
                            </li>
                            <li className="curr-chat-right clearfix">
                                <div className="curr-chat-right-author clearfix">
                                    <img className="curr-chat-right-author-img" src="http://dev.0606.com.cn:8085/corps/images/xh_02.jpg" alt="" />
                                    <span className="curr-chat-right-author-name">伊泽瑞尔</span>
                                    <span className="curr-chat-right-author-ids">老师</span>
                                </div>
                                <div className="curr-chat-right-contentImg">
                                    <img src="http://dev.0606.com.cn:8085/corps/images/xh_02.jpg" alt="" />
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="curr-chat-send">
                        <div className="curr-chat-send-top">
                                <span className="curr-chat-send-top-face">
                                     <img src="./assets/images/live/liveFace.png" alt="" />
                                </span>
                                 <span className="curr-chat-send-top-pic">
                                      <img src="./assets/images/live/livePic.png" alt="" />
                                </span>
                        </div>
                        <div className="curr-chat-textarea">
                            <textarea name="" id="" cols="30" rows="10"></textarea>
                        </div>
                        <div className="curr-chat-sendbtn clearfix">
                            <div className="curr-chat-send-button">发送</div>
                            <div className="curr-chat-setting">设置</div>
                        </div>
                    </div>
                </div>
    }
});