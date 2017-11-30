var codes = require('./stock');
module.exports = {
    getStock: function(val) {
        var arr = [];
        for (var i = 0; i < codes.length; i++) {
            for (var j = 0; j< codes[i].length; j++) {
                if (codes[i][j].toString().toLocaleUpperCase().indexOf(val.toLocaleUpperCase()) != -1) {
                    arr.push(codes[i]);
                    break;
                }
            }
            if ( arr.length > 9) break;
        }
        return arr;
    },
    getStockItem: function (code) {
        for (var i = 0; i < codes.length; i++) {
            if (codes[i][0] == code) {
                return codes[i];
            }
        }
        return null;
    }
};