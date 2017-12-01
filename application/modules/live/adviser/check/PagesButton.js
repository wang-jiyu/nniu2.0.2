module.exports = React.createClass({
    getInitialState: function () {
        return {
            page:1,
            limit:10,
            page:1,
            totalPage:0
        }
    },
    //下一页
    setNext: function() {
        this.setState({
            page:this.state.page + 1
        })
    },
    //上一页
    setUp: function() {
        if(this.state.page > 1) {
            this.setState({
                page:this.state.page - 1
            })
        }
    },
    render: function() {
        return (

        )
    }
});