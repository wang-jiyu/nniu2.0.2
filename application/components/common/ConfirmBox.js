module.exports = React.createClass({
    getInitialState: function() {
        return {

        };
    },
    handleClick:function(val) {
        this.props.confirmBack(val);
    },
    render: function() {
        var content = this.props.content || '您确定执行该操作吗？';
        return <div className="confirm_box" style={{display:this.props.flag?"block":"none"}}>
                    <div className="confirm_dialog">
                        <p>{content}</p>
                        <button onClick={this.handleClick.bind(this,1)}>确定</button>
                        <button onClick={this.handleClick.bind(this,2)}>取消</button>
                    </div>
               </div>;
    }
});