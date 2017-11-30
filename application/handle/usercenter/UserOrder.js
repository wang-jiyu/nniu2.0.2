module.exports = {
    //获取多条订单列表
    getOrderList: function (params, callback) {
        params = $.extend({limit: 8, page: 1, status: ''}, params);
        Forms.get({
            uri: '/api/order/list',
            params: params,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //获取产品订单信息
    getProduct: function(params, callback) {
        var url = 'order/product?ref_type=' + params.ref_type + '&ref_id=' + params.ref_id;
        if (params.order_id) url = 'orders/' + params.order_id + '/product';
        Forms.get({
            uri: '/api/' + url,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    getProductTwo:function(params, callback){
         var url = 'order2/product?ref_type=' + params.ref_type + '&ref_id=' + params.ref_id + '&num='+params.num+'&timeType='+params.timeType+'&isExclusive='+params.isExclusive+'&serviceType='+params.serviceType;
        if (params.order_id) url = 'orders2/' + params.order_id + '/product';
        Forms.get({
            uri: '/api/' + url,
            callback: function(result) {
                // var result=result.data;
                var result = {
                    code: result.code,
                    data: {
                       _id: result.data.product.product_id,
                        product_name: result.data.product.productName,
                        price: result.data.product.buyCycles[0].price/100||0,
                        discount_price: result.data.product.buyCycles[0].realPrice/100,
                        cycle: result.data.product.buyCycles[0].num,
                        timeType:result.data.product.buyCycles[0].timeType,
                        discounts:result.data.discount?result.data.discount:[],
                        paymethod:result.data.paymethod?result.data.paymethod:null,
                        riskLevel:result.data.product.riskLevel,
                        riskScore:result.data.product.riskScore?result.data.product.riskScore:0,
                        isAuth:result.data.product.isAuth?result.data.product.isAuth:0
                    }
                      // begin_time: result.product.productActive.specialStartTime,
                   //end_time: result.product.productActive.specialEndTime,   
                }

                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //创建订单
    createOrder: function(params, callback) {
        Forms.post({
            uri: '/api/order',
            params: params,
            callback: callback
        });
    },
    /*手机创建订单*/
	createMobileOrder: function(params, callback) {
		Forms.post({
			uri: '/api/order2/mobile',
			params: params,
			callback: callback
		});
	},
    //获取单条订单信息
    orderItem: function(orderId, callback) {
        Forms.get({
            uri: '/api/orders/' + orderId,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //取消订单
    closeOrder: function(orderId, callback) {
        Forms.put({
            uri: '/api/orders/' + orderId + '/cancel',
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //删除订单
    deleteOrder: function(orderId, callback) {
        Forms.delete({
            uri: '/api/orders/' + orderId,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        })
    },
    //获取支付链接
    orderPayurl: function(orderId, callback) {
        Forms.get({
            uri: '/api/orders/' + orderId + '/payurl',
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //获取移动端支付链接
    mobileOrderPayurl: function(orderId, callback) {
        Forms.get({
            uri: '/api/orders/' + orderId + '/payurl/mobile',
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    },
    //订单线下支付登记
    payoffOrder: function(orderId, params, callback) {
        Forms.post({
            uri: '/api/orders/' + orderId + '/payoff',
            params: params,
            callback: function(result) {
                typeof(callback) == 'function' && callback(result);
            }
        });
    }
};