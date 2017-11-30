module.exports = React.createClass({
    componentWillMount: function() {

    },
    componentDidMount: function() {
        this.showChart({
                x: this.props.zsprofit.reverse(),
                y: this.props.profit.reverse()
            })
            // console.log(9999)

    },
    componentDidUpdate: function() {　　　　　
        this.showChart({
            x: this.props.zsprofit.reverse(),
            y: this.props.profit.reverse()
        })
    },

    showChart: function(dataSet) {
        // console.log(dataSet)
        var myChart = Echarts.init(document.getElementById('main'));

        var option = {
            grid: {
                left: "8%",
                right: "3%",
                bottom: "10%",
                top: "10%",
            },
            tooltip: {
                trigger: 'axis',
                // formatter: '{b0}: {c0}<br />{b1}: {c1}',
                formatter: function(params, ticket, callback) {
                    var name = params[0].name;
                    //              console.log(name);
                    var seriesName = params[0].seriesName;
                    //                console.log(seriesName);
                    var seriesName2 = params[1].seriesName;
                    //值
                    var value1 = params[0].value
                    var valueFliter = value1.toFixed(2) + '%';
                    //console.log(valueFliter);
                    var value2 = params[1].value;
                    //               console.log(value);
                    var valueFliter2 = value2.toFixed(2) + '%';
                    return '<span class="date">' + name + '</span>' +
                        '<span class="dot top flo"></span>' + '<span class="name flo">' + seriesName + '</span>' + '<span class="val rg">' + valueFliter + '</span>' + '<br>' + '<span class="dot bottom flo"></span>' + '<span class="name flo">' + seriesName2 + '</span>' + '<span class="val rg">' + valueFliter2 + '</span>';
                },
                axisPointer: {
                    type: "line",
                    lineStyle: {
                        color: "#B5B5B5",
                        width: 2,
                    }
                },
                config: true,
                backgroundColor: "#ffffff",
                borderColor: "#E0DEDE",
                borderWidth: 1,
                padding: [15, 10, 15, 10],
                textStyle: {
                    color: "#4a4a4a"
                }
            },
            toolbox: {
                show: false
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisPointer: {
                    type: "line"
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    showMinLabel: true,
                    textStyle: {
                        color: '#4a4a4a',
                        fontWeight: 600
                    }

                },
                // splitNumber: 32,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ["#e2e0e0"]
                    }
                },
                axisTick: {
                    show: false
                },

                data: dataSet.x.map(function(item) {
                    return item[0];
                })
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: 2
                    }
                },
                // nameGap: 50,
                // nameRotate: 45,
                axisLabel: {
                    formatter: function(value, index) {
                        return value.toFixed(2) + '%';
                    },
                    // margin: 16,
                    show: true,
                    textStyle: {
                        color: '#4a4a4a',
                        fontWeight: 600
                    }

                },
                splitLine: {
                    show: true
                }
            },
            series: [{
                name: '沪深300',
                id: "lushen",
                type: 'line',
                symbol: "circle",
                itemStyle: {
                    normal: {
                        color: "#2C77B3"
                    }
                },

                data: dataSet.x.map(function(item) {
                    return item[1]
                })
            }, {
                name: '策略收益率',
                id: "ce",
                type: 'line',
                itemStyle: {
                    normal: {
                        color: "#FB0D1B"
                    }
                },
                symbol: "circle",
                data: dataSet.y.map(function(item) {
                    return item[1]
                })
            }]
        };
        myChart.setOption(option);
    },

    render: function() {
        var echersStyle = {
            width: 1200,
            height: 296,
        }
        var data = this.props;
        // console.log(data)
        return (
            <div id="main" style={echersStyle}></div>
        )
    }
});