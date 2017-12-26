module.exports = React.createClass({
	getDefaultProps: function() {
		return {maxLength: 6};
	},
    pageNumber: function() {
		var start = this.props.nowPage - 2 ;

		var pagination = this.props.pagination || {total: 100, page_size: 20};
		this.totalPage = Math.ceil(pagination.total / pagination.page_size);
		if ((this.props.nowPage + this.props.maxLength - 2) > this.totalPage) start = this.totalPage - this.props.maxLength + 1;
        if (start < 1 || this.props.maxLength >= this.totalPage) start = 1;
		return this.loop([], start);
    },
    loop: function(arr, index) {
        if (arr.length > this.props.maxLength - 1 || index > this.totalPage) return arr;
        arr.push(index);
        index++;
        return this.loop(arr, index);
    },
    page: function(result) {
        this.props.onChange({page: result});
    },

    render: function() {

        var pagination = this.props.pagination || {total: 0, page_size: 20};
        var page = Math.ceil(pagination.total / pagination.page_size);
        if (page <= 1) return null;
        var pageNumber = this.pageNumber();
        return <ul className="page_box">
                    <li onClick={this.props.nowPage > 1 ? this.page.bind(this, this.props.nowPage - 1) : null}>&lt;</li>
                    {pageNumber.map(function(item, index) {
                        return <li className={this.props.nowPage == item ? 'selected' : ''} key={index} onClick={this.page.bind(this, item)}>
                                    <a href="javascript:;">{item}</a>
                                </li>
                    }.bind(this))}
                    <li onClick={this.props.nowPage < page ? this.page.bind(this, this.props.nowPage + 1) : null}>&gt;</li>
               </ul>
    }
});