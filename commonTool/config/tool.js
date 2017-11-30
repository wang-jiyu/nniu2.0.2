module.exports = {
	/*
	 *@timestamp返回时间戳
	 *@param type 字符串  format 秒
	 *@return @时间戳 数值或字符串 当前时间
	 */
	timestamp: function(type, format) {
		var timestamps = Date.parse(new Date());
		if (format) {
			if (format == 'second') {
				timestamps = parseInt(timestamps / 1000);
			}
		}
		if (type) {
			if (type == 'string') {
				timestamps = timestamps.toString();
			}
		}
		return timestamps;
	},
	/*时间格式化默认格式*/
	formatteSet : 'YYYY MM DD H M S',
	/*时间格式化，value单位为毫秒*/
	formatter:function (value,set){
		var date = new Date(value);
		var y = date.getFullYear();
		var m = this.checkTimeItem(date.getMonth()+1);
		var d = this.checkTimeItem(date.getDate());
		var h = this.checkTimeItem(date.getHours());
		var min = this.checkTimeItem(date.getMinutes());
		var s = this.checkTimeItem(date.getSeconds());
		var time = '';
		var set=set || this.formatteSet
		set = set.split(' ');
		$.each(set,function(index,content){
			switch(content){
				case 'YYYY':
					time+=y;
				break;

				case 'MM':
					if(!time) time+=m;
					else time+='-'+m;
				break;

				case 'DD':
					if(!time) time+=d;
					else time+='-'+d;
				break;

				case 'H':
					if(!time) time+=h;
					else time+=' '+h;
				break;

				case 'M':
					if(!time) time+=min;
					else time+=':'+min;
				break;

				case 'S':
					if(!time) time+=s;
					else time+=':'+s;
				break;
			}
		});
		return time;
	},
	/*格式化月日时分秒，不足两位数补零*/
	checkTimeItem:function (value){
		if(value < 10)
			return '0'+value;
		else
			return value;
	},
	/*
	*获取某月的第一天与最后一天对象
	*param 年份，月份 typeof int
	*return obj
	*/
	getFirstAndLastMonthDay:function (year, month){ 
	   var time = {}
       time.firstdate = year + '-' + month + '-01';  
       var  day = new Date(year,month,0);   
       time.lastdate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期    
       return time;  
    },
    /*分割拼接字符串
     *param string需要分割的字符，split分割符号，type返回INT 
     *return 重新拼接的字符
     */
    getSplitString:function(string,split,type){
    	var stringArr = string.split(split);
    	var newString = '';
    	for(var i = 0;i < stringArr.length;i++){
			newString += stringArr[i];
    	}
    	newString = type=='int'?parseInt(newString):newString;
    	return newString;
    }

};