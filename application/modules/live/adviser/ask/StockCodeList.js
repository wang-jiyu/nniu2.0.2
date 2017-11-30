var StockCode = require('stock-code');
module.exports = React.createClass({
    selectStockCode: function(num) {
        this.setState({data: [], search: '', stockCode: num, selectedIndex: 0});
    },

    resetStockCode: function(){
        this.setState({data: [], search: '', selectedIndex: 0});
    },

    getStockCodeList: function(e) {
        if (this.refs.stockCode.value) {
            this.setState({
                data: StockCode.getStock(this.refs.stockCode.value),
                search: this.refs.stockCode.value,
                stockCode: e.target.value
            });
        } else {
            this.setState({data: [], search: '', stockCode: '', selectedIndex: 0});
        }
    },

    replaceItem: function(data) {
        var search = this.state.search.replace(/(\*|\(|\)|\.|\+)/, '\\$1');
        var reg = new RegExp(search, 'gi');
        return data.replace(reg, function(item) {
            return '<span className="highlight_span">' + item + '</span>';
        })
    },

    keydown: function(e) {
        if ( this.state.data.length > 0 && e.keyCode == 13) {
            this.state.data[this.state.selectedIndex][0] ?
                this.selectStockCode(this.state.data[this.state.selectedIndex][0]) : null;
            e.preventDefault();
            return;
        };
        if (e.keyCode == 38) {
            e.preventDefault();
            if ( this.state.selectedIndex == 0 ) return;
            this.setState({selectedIndex: --this.state.selectedIndex});
        }
        if (e.keyCode == 40) {
            e.preventDefault();
            if (this.state.selectedIndex == this.state.data.length - 1) return;
            this.setState({selectedIndex:  ++this.state.selectedIndex});
        }
        $(this.refs.stockUl).scrollTop(this.state.selectedIndex * 26);
    },

    componentDidMount: function() {
        this.refs.stockCode.focus();
        window.addEventListener('keydown', this.keydown);
    },

    componentWillUnmount: function() {
        window.removeEventListener('keydown', this.keydown);
    },

    getInitialState: function() {
        return {data: [], search: '', stockCode: '', selectedIndex: 0}
    },

    render: function() {
        return (
            <div className="stock_code_input"  onMouseLeave={this.resetStockCode}>
                <input type="text" name="stockCode"
                       autoComplete="off"
                       onChange={this.getStockCodeList}
                       onBlur={this.checkReg}
                       ref="stockCode" width={this.props.width ? this.props.width : 'auto'}
                       maxLength="20" data-required="required"
                       value={this.state.stockCode}
                       placeholder="请输入股票代码或名称" />
                        {
                            this.state.data.length !=  0 ?
                                (
                                    <ul ref="stockUl" className="stock_code_tips"  >{
                                        this.state.data.map(function (item, index) {
                                            return (
                                                <li key={index}
                                                    className={this.state.selectedIndex == index ? 'selected_li' : ''}
                                                    onClick={this.selectStockCode.bind(this, item[0])}
                                                >
                                                        <label dangerouslySetInnerHTML={{__html: this.replaceItem(item[0])}}></label>
                                                        <label dangerouslySetInnerHTML={{__html: this.replaceItem(item[1])}}></label>
                                                        <label dangerouslySetInnerHTML={{__html: this.replaceItem(item[2])}}></label>
                                                </li>
                                            );
                                        }.bind(this))
                                    }</ul>
                                ) : null
                        }
            </div>
        );
    }
});