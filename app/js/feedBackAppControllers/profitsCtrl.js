var profitsCtrl=function($scope,$http){
    function GetRequest() {
       var url = document.location.search; //获取url中"?"符后的字串
       var theRequest = new Object();
       if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
             theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
          }
       }
       return theRequest;
    }
    var initPage=function(){
        var Request = GetRequest();
        var url='/getFeedBack/'+Request['seminar']+'/'+Request['period'];
        var currentCategories=new Array();
        var previousCategories=new Array();

        for(var i=-3;i<=Request['period'];i++){
            if(i!=Request['period']){
                currentCategories.push(i);
                previousCategories.push(i); 
            }else{
                currentCategories.push(i);
            }
        }

        $http({
            method:'GET',
            url:url
        }).then(function(data){
            var currentOperatingProfits=new Array({
                name:'Supplier-1',
                data:new Array(),
                color:'#3257A7'
            },{
                name:'Supplier-2',
                data:new Array(),
                color:'#B11E22'
            },{
                name:'Supplier-3',
                data:new Array(),
                color:'#F6B920'
            },{
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var currentNetProfitMargins=new Array({
                name:'Supplier-1',
                data:new Array(),
                color:'#3257A7'
            },{
                name:'Supplier-2',
                data:new Array(),
                color:'#B11E22'
            },{
                name:'Supplier-3',
                data:new Array(),
                color:'#F6B920'
            },{
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var previousOperatingProfits=new Array({
                name:'Supplier-1',
                data:new Array(),
                color:'#3257A7'
            },{
                name:'Supplier-2',
                data:new Array(),
                color:'#B11E22'
            },{
                name:'Supplier-3',
                data:new Array(),
                color:'#F6B920'
            },{
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            var previousNetProfitMargins=new Array({
                name:'Supplier-1',
                data:new Array(),
                color:'#3257A7'
            },{
                name:'Supplier-2',
                data:new Array(),
                color:'#B11E22'
            },{
                name:'Supplier-3',
                data:new Array(),
                color:'#F6B920'
            },{
                name:'Retailer-1',
                data:new Array(),
                color:'#8B288B'
            },{
                name:'Retailer-2',
                data:new Array(),
                color:'#F05422'
            });
            

            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_OperatingProfit.length;i++){
                    if(data.data.f_OperatingProfit[i].period==currentCategories[j]){
                        switch(data.data.f_OperatingProfit[i].actorID){
                            case 1:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                currentOperatingProfits[0].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                currentOperatingProfits[1].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                currentOperatingProfits[2].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                            case 4:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                currentOperatingProfits[3].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                            case 5:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                currentOperatingProfits[4].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                        }
                    }
                }
            }
            for(var j=0;j<currentCategories.length;j++){
                for(var i=0;i<data.data.f_NetProfitMargin.length;i++){
                    if(data.data.f_NetProfitMargin[i].period==currentCategories[j]){
                        switch(data.data.f_NetProfitMargin[i].actorID){
                            case 1:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                currentNetProfitMargins[0].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                currentNetProfitMargins[1].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                currentNetProfitMargins[2].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                            case 4:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                currentNetProfitMargins[3].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                            case 5:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                currentNetProfitMargins[4].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                        }
                    }
                }
            }
            for(var j=0;j<previousCategories.length;j++){
                for(var i=0;i<data.data.f_OperatingProfit.length;i++){
                    if(data.data.f_OperatingProfit[i].period==previousCategories[j]){
                        switch(data.data.f_OperatingProfit[i].actorID){
                            case 1:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                previousOperatingProfits[0].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                previousOperatingProfits[1].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                previousOperatingProfits[2].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                            case 4:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                previousOperatingProfits[3].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                            case 5:
                            if(data.data.f_OperatingProfit[i].categoryID==3){
                                previousOperatingProfits[4].data.push(data.data.f_OperatingProfit[i].value);
                            }
                            break;
                        }
                    }
                }
            }
            for(var j=0;j<previousCategories.length;j++){
                for(var i=0;i<data.data.f_NetProfitMargin.length;i++){
                    if(data.data.f_NetProfitMargin[i].period==previousCategories[j]){
                        switch(data.data.f_NetProfitMargin[i].actorID){
                            case 1:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                previousNetProfitMargins[0].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                            case 2:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                previousNetProfitMargins[1].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                            case 3:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                previousNetProfitMargins[2].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                            case 4:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                previousNetProfitMargins[3].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                            case 5:
                            if(data.data.f_NetProfitMargin[i].categoryID==3){
                                previousNetProfitMargins[4].data.push(data.data.f_NetProfitMargin[i].value);
                            }
                            break;
                        }
                    }
                }
            }

            $scope.previousOperatingProfits = {
                options: {
                    title:{
                        text:'Operating Profits',
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: '$mln'
                        }
                    },
                    xAxis: {
                        categories: previousCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: previousOperatingProfits,
                loading: false
            }
            $scope.previousNetProfitMargins = {
                options: {
                    title:{
                        text:'Net Profit Margins',
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: '%'
                        }
                    },
                    xAxis: {
                        categories: previousCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: previousNetProfitMargins,
                loading: false
            }
            $scope.currentOperatingProfits = {
                options: {
                    title:{
                        text:'Operating Profits',
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: '$mln'
                        }
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: currentOperatingProfits,
                loading: false
            }
            $scope.currentNetProfitMargins = {
                options: {
                    title:{
                        text:'Net Profit Margins',
                    },
                    chart: {
                        type: 'line',
                        backgroundColor: 'transparent',
                    },
                    yAxis: {
                        title: {
                            text: '%'
                        }
                    },
                    xAxis: {
                        categories: currentCategories,
                        title: {
                            text: 'Period'
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%</p>';
                            return s;
                        },
                        shared: false,
                        useHTML: true
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: currentNetProfitMargins,
                loading: false
            }


        });
    }
    initPage();
}

